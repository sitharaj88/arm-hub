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
  const padT = title ? 30 : 8;
  const padB = 26;
  const H = padT + rowH + padB;

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
          {fields.map((f, i) => {
            const xStart = 16 + dispBits.slice(0, i).reduce((a, b) => a + b, 0) * computedBitW;
            const w = dispBits[i] * computedBitW;
            const tone = f.tone ?? 'primary';
            const showName = w > 28;
            return (
              <g key={i} transform={`translate(${xStart}, ${padT})`}>
                <rect
                  width={w}
                  height={rowH}
                  className={cn(toneFills[tone])}
                  strokeWidth="1.5"
                />
                {showName && (
                  <text
                    x={w / 2}
                    y={rowH / 2 + 4}
                    textAnchor="middle"
                    className={cn('font-mono text-[11px] font-semibold', toneText[tone])}
                  >
                    {f.name}
                  </text>
                )}
                <text
                  x={w / 2}
                  y={rowH + 16}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono text-[10px]"
                >
                  {f.flexible && f.bits > 24 ? `${f.bits} bits` : `${f.bits}`}
                </text>
                {!showName && (
                  <title>{f.name}: {f.bits} bits</title>
                )}
              </g>
            );
          })}
          {/* Top tick label for total */}
          <text
            x={totalW / 2}
            y={padT - 8}
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
