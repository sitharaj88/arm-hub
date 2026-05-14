import { cn } from '@/lib/utils';

/**
 * TimingDiagram — render signal waveforms for protocol/bus timing.
 *
 *   <TimingDiagram
 *     title="SPI mode 0 — CPOL=0, CPHA=0"
 *     signals={[
 *       { name: 'SCK',  wave: '010101010', tone: 'primary' },
 *       { name: 'MOSI', wave: 'D=10110010', tone: 'accent' },
 *       { name: 'MISO', wave: 'd=01001101', tone: 'highlight' },
 *       { name: 'CS',   wave: '1=00000001', tone: 'muted' },
 *     ]}
 *     markers={[{ x: 1, label: 'sample' }, { x: 8, label: 'sample' }]}
 *     caption="..."
 *   />
 *
 * Each signal's `wave` is a string where each character is one cycle:
 *   '0' = low, '1' = high, 'x' = unknown/transition, 'z' = high-z
 *   'D' = data-byte start (the next chars 0/1 are data bits)
 *   'd' = data-byte start (different shading)
 *   '=' = stays at current level (preceded by initial value)
 */

type Tone = 'primary' | 'accent' | 'highlight' | 'success' | 'warning' | 'destructive' | 'muted';

type Signal = {
  name: string;
  wave: string;
  tone?: Tone;
};

type Marker = {
  x: number; // cycle index
  label: string;
};

const toneColor: Record<Tone, string> = {
  primary:     'stroke-primary',
  accent:      'stroke-accent',
  highlight:   'stroke-highlight',
  success:     'stroke-success',
  warning:     'stroke-warning',
  destructive: 'stroke-destructive',
  muted:       'stroke-muted-foreground',
};

const toneFill: Record<Tone, string> = {
  primary:     'fill-primary/15',
  accent:      'fill-accent/15',
  highlight:   'fill-highlight/15',
  success:     'fill-success/15',
  warning:     'fill-warning/15',
  destructive: 'fill-destructive/15',
  muted:       'fill-muted/40',
};

function buildPath(wave: string, cycleW: number, h: number): { d: string; segments: { x: number; w: number; tone: 'd' | 'D' | null }[] } {
  let level: 'low' | 'high' = 'low';
  let cx = 0;
  const d: string[] = [];
  const segments: { x: number; w: number; tone: 'd' | 'D' | null }[] = [];
  // initial draw level: low -> bottom (y=h), high -> top (y=0)
  d.push(`M0,${h}`);

  let i = 0;
  while (i < wave.length) {
    const c = wave[i];
    if (c === 'D' || c === 'd') {
      // Data block: collect the following bits until end or whitespace/non-bit
      let j = i + 1;
      const start = cx;
      while (j < wave.length && (wave[j] === '0' || wave[j] === '1')) j++;
      const dataChars = wave.slice(i + 1, j);
      const w = dataChars.length * cycleW;
      segments.push({ x: start, w, tone: c });
      // Just draw a flat midline through the data segment
      d.push(`M${start},${h / 2} L${start + w},${h / 2}`);
      cx = start + w;
      i = j;
    } else if (c === '=' && i > 0) {
      // Stay at current level for one cycle
      const targetY = level === 'high' ? 0 : h;
      d.push(`L${cx + cycleW},${targetY}`);
      cx += cycleW;
      i++;
    } else if (c === '0' || c === '1') {
      const newLevel: 'low' | 'high' = c === '1' ? 'high' : 'low';
      if (newLevel !== level) {
        // Vertical transition at cx
        const fromY = level === 'high' ? 0 : h;
        const toY = newLevel === 'high' ? 0 : h;
        d.push(`L${cx},${fromY}`); // ensure at current
        d.push(`L${cx},${toY}`);
        level = newLevel;
      }
      const targetY = level === 'high' ? 0 : h;
      d.push(`L${cx + cycleW},${targetY}`);
      cx += cycleW;
      i++;
    } else {
      // Unknown char: advance one cycle
      cx += cycleW;
      i++;
    }
  }
  return { d: d.join(' '), segments };
}

export function TimingDiagram({
  title,
  signals,
  markers,
  caption,
}: {
  title?: string;
  signals: Signal[];
  markers?: Marker[];
  caption?: string;
}) {
  const cycleW = 38;
  const rowH = 38;
  const rowGap = 12;
  const padL = 80;
  const padR = 16;
  const padT = title ? 26 : 12;
  const padB = markers && markers.length ? 30 : 12;
  const cycles = Math.max(...signals.map((s) => s.wave.replace(/[=Dd]/g, '').length));
  const W = padL + cycles * cycleW + padR;
  const H = padT + signals.length * (rowH + rowGap) + padB;

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="border-b bg-muted/30 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {title ?? 'Timing diagram'}
      </div>
      <div className="overflow-x-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full min-w-[640px]"
          role="img"
          aria-label={title ?? 'Timing diagram'}
        >
          {/* Grid lines (vertical) */}
          <g className="text-border" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" opacity="0.4">
            {Array.from({ length: cycles + 1 }).map((_, i) => (
              <line key={i} x1={padL + i * cycleW} y1={padT} x2={padL + i * cycleW} y2={H - padB} />
            ))}
          </g>

          {/* Signals */}
          {signals.map((s, i) => {
            const y = padT + i * (rowH + rowGap);
            const tone: Tone = s.tone ?? 'primary';
            const { d, segments } = buildPath(s.wave, cycleW, rowH);
            return (
              <g key={s.name} transform={`translate(${padL}, ${y})`}>
                {/* Data bus shaded segments */}
                {segments.map((seg, j) => (
                  <rect
                    key={j}
                    x={seg.x}
                    y={2}
                    width={seg.w}
                    height={rowH - 4}
                    rx={3}
                    className={cn(toneFill[tone])}
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeOpacity="0.8"
                  />
                ))}
                {/* Waveform path */}
                <path
                  d={d}
                  fill="none"
                  strokeWidth="2"
                  strokeLinejoin="miter"
                  strokeLinecap="square"
                  className={cn(toneColor[tone])}
                />
                {/* Signal label */}
                <text
                  x={-12}
                  y={rowH / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-foreground font-mono text-[12px]"
                >
                  {s.name}
                </text>
                {/* Baseline guides */}
                <line x1={0} y1={rowH} x2={cycles * cycleW} y2={rowH} className="stroke-border" strokeWidth="0.5" />
              </g>
            );
          })}

          {/* Markers */}
          {markers && markers.length > 0 && (
            <g transform={`translate(${padL}, ${H - padB + 6})`}>
              {markers.map((m, i) => (
                <g key={i}>
                  <line
                    x1={m.x * cycleW}
                    y1={-((signals.length - 1) * (rowH + rowGap) + rowH + 10)}
                    x2={m.x * cycleW}
                    y2={0}
                    className="stroke-warning"
                    strokeWidth="1.4"
                    strokeDasharray="4 2"
                    opacity="0.7"
                  />
                  <text
                    x={m.x * cycleW}
                    y={14}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono text-[10px] uppercase tracking-wider"
                  >
                    {m.label}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>
      </div>
      {caption && (
        <figcaption className="border-t bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
