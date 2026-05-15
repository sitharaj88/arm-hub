import { cn } from '@/lib/utils';

/**
 * ProtocolFrame — render a protocol/packet frame as labeled, proportional fields.
 *
 *   <ProtocolFrame
 *     title="Classic CAN data frame"
 *     fields={[
 *       { name: 'SOF',    bits: 1,  tone: 'muted' },
 *       { name: 'ID',     bits: 11, tone: 'primary' },
 *       { name: 'RTR',    bits: 1,  tone: 'muted' },
 *       { name: 'IDE',    bits: 1,  tone: 'muted' },
 *       { name: 'r0',     bits: 1,  tone: 'muted' },
 *       { name: 'DLC',    bits: 4,  tone: 'accent' },
 *       { name: 'DATA',   bits: 64, tone: 'highlight', flexible: true },
 *       { name: 'CRC',    bits: 15, tone: 'accent' },
 *       { name: 'CRC-DEL', bits: 1, tone: 'muted' },
 *       { name: 'ACK',    bits: 1,  tone: 'success' },
 *       { name: 'ACK-DEL', bits: 1, tone: 'muted' },
 *       { name: 'EOF',    bits: 7,  tone: 'muted' },
 *     ]}
 *     caption="..."
 *   />
 */

type Tone = 'primary' | 'accent' | 'highlight' | 'success' | 'warning' | 'destructive' | 'muted';

type Field = {
  name: string;
  bits: number;
  tone?: Tone;
  /** if true, this field shrinks/grows visually but is rendered as ~`bits` */
  flexible?: boolean;
};

const toneFills: Record<Tone, string> = {
  primary:     'fill-primary/20 stroke-primary',
  accent:      'fill-accent/20 stroke-accent',
  highlight:   'fill-highlight/25 stroke-highlight',
  success:     'fill-success/20 stroke-success',
  warning:     'fill-warning/25 stroke-warning',
  destructive: 'fill-destructive/20 stroke-destructive',
  muted:       'fill-muted stroke-muted-foreground/50',
};

// Text uses foreground for maximum contrast in both light and dark mode.
// The field's tone is conveyed by the box fill + stroke, not by tinting the text.
const toneText: Record<Tone, string> = {
  primary:     'fill-foreground',
  accent:      'fill-foreground',
  highlight:   'fill-foreground',
  success:     'fill-foreground',
  warning:     'fill-foreground',
  destructive: 'fill-foreground',
  muted:       'fill-muted-foreground',
};

export function ProtocolFrame({
  title,
  fields,
  caption,
  /** Override per-bit width in SVG units. */
  bitW,
}: {
  title?: string;
  fields: Field[];
  caption?: string;
  bitW?: number;
}) {
  // Compute display widths: clamp large flexible fields to a max so the diagram stays readable.
  const totalRawBits = fields.reduce((a, f) => a + f.bits, 0);
  const dispBits = fields.map((f) => Math.min(f.bits, f.flexible ? 24 : f.bits));
  const totalDisp = dispBits.reduce((a, b) => a + b, 0);
  const targetWidth = 720;
  const computedBitW = bitW ?? Math.max(6, (targetWidth - 32) / totalDisp);
  const totalW = totalDisp * computedBitW + 32;
  const rowH = 56;
  // padT: 14 px above the rects for the total-bits header so it doesn't kiss the boxes.
  const padT = title ? 38 : 12;
  const padB = 28;
  const H = padT + rowH + padB;

  // Approximate text width per character at our chosen 11 px monospace font.
  // ~6.6 px/char is a safe over-estimate that prevents tight-fitting labels.
  const FONT_PX = 11;
  const CHAR_W = 6.6;
  const measure = (s: string) => s.length * CHAR_W;

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border bg-card">
      <div className="border-b bg-muted/30 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {title ?? 'Protocol frame'}
      </div>
      <div className="overflow-x-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${totalW} ${H}`}
          className="block w-full min-w-[600px]"
          role="img"
          aria-label={title ?? 'Protocol frame'}
        >
          {/* Per-field clip paths so a long label never spills into a neighbour. */}
          <defs>
            {fields.map((_, i) => {
              const xStart = 16 + dispBits.slice(0, i).reduce((a, b) => a + b, 0) * computedBitW;
              const w = dispBits[i] * computedBitW;
              return (
                <clipPath key={i} id={`pf-clip-${i}`}>
                  <rect x={xStart} y={padT} width={w} height={rowH} />
                </clipPath>
              );
            })}
          </defs>

          {fields.map((f, i) => {
            const xStart = 16 + dispBits.slice(0, i).reduce((a, b) => a + b, 0) * computedBitW;
            const w = dispBits[i] * computedBitW;
            const tone = f.tone ?? 'primary';
            // Show the full name only when the rect is genuinely wide enough.
            // 6 px padding on each side keeps the text from kissing the border.
            const labelW = measure(f.name);
            const showFullName = w >= labelW + 12;
            // For medium-narrow rects, fall back to a short label (just the bit count).
            // Below 20 px we hide everything and rely on the <title> tooltip.
            const showShortLabel = !showFullName && w >= 20;
            return (
              <g key={i} transform={`translate(${xStart}, ${padT})`}>
                <rect
                  width={w}
                  height={rowH}
                  className={cn(toneFills[tone])}
                  strokeWidth="1.5"
                />
                {showFullName && (
                  <text
                    x={w / 2}
                    y={rowH / 2 + 4}
                    textAnchor="middle"
                    clipPath={`url(#pf-clip-${i})`}
                    className={cn('font-mono font-semibold', toneText[tone])}
                    style={{ fontSize: `${FONT_PX}px` }}
                  >
                    {f.name}
                  </text>
                )}
                {showShortLabel && (
                  <text
                    x={w / 2}
                    y={rowH / 2 + 4}
                    textAnchor="middle"
                    className={cn('font-mono font-semibold', toneText[tone])}
                    style={{ fontSize: `${FONT_PX}px` }}
                  >
                    {f.bits}
                  </text>
                )}
                <text
                  x={w / 2}
                  y={rowH + 18}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono text-[10px]"
                >
                  {f.flexible && f.bits > 24 ? `${f.bits} bits` : `${f.bits}`}
                </text>
                {(!showFullName || w < labelW + 12) && (
                  <title>{f.name}: {f.bits} bits</title>
                )}
              </g>
            );
          })}
          {/* Top header label — sits 14 px above the rects so they don't touch. */}
          <text
            x={totalW / 2}
            y={padT - 14}
            textAnchor="middle"
            className="fill-muted-foreground font-mono text-[10px] uppercase tracking-wider"
          >
            {totalRawBits} bits total
          </text>
        </svg>
      </div>
      {caption && (
        <figcaption className="border-t bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
