import { cn } from '@/lib/utils';

/**
 * StateDiagram — render a finite state machine as nodes + labeled transitions.
 *
 *   <StateDiagram
 *     title="NVIC exception lifecycle"
 *     states={[
 *       { id: 'inactive', label: 'Inactive',  x: 60,  y: 60, tone: 'muted' },
 *       { id: 'pending',  label: 'Pending',   x: 280, y: 60, tone: 'warning' },
 *       { id: 'active',   label: 'Active',    x: 500, y: 60, tone: 'primary' },
 *       { id: 'apending', label: 'Active+Pending', x: 280, y: 200, tone: 'destructive' },
 *     ]}
 *     transitions={[
 *       { from: 'inactive', to: 'pending', label: 'IRQ asserted' },
 *       { from: 'pending',  to: 'active',  label: 'core dispatches' },
 *       { from: 'active',   to: 'inactive', label: 'return' },
 *       { from: 'active',   to: 'apending', label: 'IRQ re-asserts' },
 *     ]}
 *     caption="..."
 *   />
 */

type Tone = 'primary' | 'accent' | 'highlight' | 'success' | 'warning' | 'destructive' | 'muted';

type State = {
  id: string;
  label: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  tone?: Tone;
  initial?: boolean;
  final?: boolean;
};

type Transition = {
  from: string;
  to: string;
  label?: string;
  /** curve offset, positive = arc above straight line, negative = below */
  curve?: number;
};

// Text uses foreground for contrast; tone is conveyed by box fill + stroke.
const toneClasses: Record<Tone, { fill: string; stroke: string; text: string }> = {
  primary:     { fill: 'fill-primary/20',     stroke: 'stroke-primary',     text: 'fill-foreground' },
  accent:      { fill: 'fill-accent/20',      stroke: 'stroke-accent',      text: 'fill-foreground' },
  highlight:   { fill: 'fill-highlight/25',   stroke: 'stroke-highlight',   text: 'fill-foreground' },
  success:     { fill: 'fill-success/20',     stroke: 'stroke-success',     text: 'fill-foreground' },
  warning:     { fill: 'fill-warning/25',     stroke: 'stroke-warning',     text: 'fill-foreground' },
  destructive: { fill: 'fill-destructive/20', stroke: 'stroke-destructive', text: 'fill-foreground' },
  muted:       { fill: 'fill-muted',          stroke: 'stroke-muted-foreground/60', text: 'fill-foreground' },
};

export function StateDiagram({
  title,
  states,
  transitions,
  width = 720,
  height = 360,
  caption,
}: {
  title?: string;
  states: State[];
  transitions: Transition[];
  width?: number;
  height?: number;
  caption?: string;
}) {
  const lookup = Object.fromEntries(states.map((s) => [s.id, s]));

  // edge curves -> path
  function edgePath(t: Transition) {
    const a = lookup[t.from];
    const b = lookup[t.to];
    if (!a || !b) return { d: '', mx: 0, my: 0 };
    const aw = a.w ?? 130; const ah = a.h ?? 56;
    const bw = b.w ?? 130; const bh = b.h ?? 56;
    const ax = a.x + aw / 2;
    const ay = a.y + ah / 2;
    const bx = b.x + bw / 2;
    const by = b.y + bh / 2;
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len; const uy = dy / len;
    // Clip to box edges (simple approximation)
    const ax2 = ax + ux * Math.min(aw, ah) / 2;
    const ay2 = ay + uy * Math.min(aw, ah) / 2;
    const bx2 = bx - ux * Math.min(bw, bh) / 2;
    const by2 = by - uy * Math.min(bw, bh) / 2;
    // Self-loop
    if (a.id === b.id) {
      const cx = a.x + aw + 16;
      const cy = a.y + ah / 2;
      return { d: `M${a.x + aw},${a.y + ah / 2} C${cx + 40},${cy - 40} ${cx + 40},${cy + 40} ${a.x + aw},${a.y + ah / 2 + 6}`, mx: cx + 20, my: cy };
    }
    // Curve
    const curve = t.curve ?? 0;
    if (curve === 0) {
      return { d: `M${ax2},${ay2} L${bx2},${by2}`, mx: (ax2 + bx2) / 2, my: (ay2 + by2) / 2 };
    }
    // Perpendicular offset for control
    const px = -uy * curve;
    const py = ux * curve;
    const cx = (ax2 + bx2) / 2 + px;
    const cy = (ay2 + by2) / 2 + py;
    return { d: `M${ax2},${ay2} Q${cx},${cy} ${bx2},${by2}`, mx: cx, my: cy };
  }

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border bg-card">
      <div className="border-b bg-muted/30 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {title ?? 'State diagram'}
      </div>
      <div className="overflow-x-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${height}`}
          className="block w-full min-w-[640px]"
          role="img"
          aria-label={title ?? 'State diagram'}
        >
          <defs>
            <marker id="state-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" className="fill-muted-foreground" />
            </marker>
          </defs>

          {/* Transitions first (under) */}
          {transitions.map((t, i) => {
            const { d, mx, my } = edgePath(t);
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" className="text-muted-foreground" markerEnd="url(#state-arrow)" />
                {t.label && (
                  <g transform={`translate(${mx}, ${my - 4})`}>
                    <rect
                      x={-(t.label.length * 3.4 + 10)}
                      y={-9}
                      width={t.label.length * 3.4 * 2 + 20}
                      height={18}
                      rx={3}
                      className="fill-background stroke-border"
                      strokeWidth="1"
                    />
                    <text
                      x={0}
                      y={3}
                      textAnchor="middle"
                      className="fill-foreground font-mono text-[10px]"
                    >
                      {t.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* States */}
          {states.map((s) => {
            const w = s.w ?? 130;
            const h = s.h ?? 56;
            const tone = toneClasses[s.tone ?? 'primary'];
            return (
              <g key={s.id} transform={`translate(${s.x}, ${s.y})`}>
                <rect
                  width={w}
                  height={h}
                  rx={s.final ? h / 2 : 10}
                  className={cn(tone.fill, tone.stroke)}
                  strokeWidth="1.8"
                />
                {s.initial && (
                  <circle cx={-14} cy={h / 2} r={5} className={cn(tone.fill, tone.stroke)} strokeWidth="1.4" />
                )}
                <text
                  x={w / 2}
                  y={h / 2 + 5}
                  textAnchor="middle"
                  className={cn('font-mono text-[12px] font-medium', tone.text)}
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {caption && (
        <figcaption className="border-t bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
