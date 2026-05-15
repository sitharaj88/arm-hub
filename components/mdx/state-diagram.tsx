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

/** Exact intersection of a line from box centre toward target (tx, ty) with the
 *  rectangle's edge — same math the BlockDiagram now uses, so arrows really do
 *  land on the box border instead of somewhere inside it. */
function edgePoint(n: State, tx: number, ty: number): { x: number; y: number } {
  const w = n.w ?? 130;
  const h = n.h ?? 56;
  const cx = n.x + w / 2;
  const cy = n.y + h / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const halfW = w / 2;
  const halfH = h / 2;
  const sx = dx === 0 ? Infinity : halfW / Math.abs(dx);
  const sy = dy === 0 ? Infinity : halfH / Math.abs(dy);
  const s = Math.min(sx, sy);
  return { x: cx + dx * s, y: cy + dy * s };
}

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

  // Detect anti-parallel pairs (A→B and B→A) and auto-curve them so they don't
  // overlap. The first edge curves +28 and the reverse −28 — caller-supplied
  // `curve` values still win.
  const autoCurve = new Map<number, number>();
  transitions.forEach((t, i) => {
    if (t.curve !== undefined) return;
    const j = transitions.findIndex(
      (u, k) => k !== i && u.from === t.to && u.to === t.from && u.curve === undefined,
    );
    if (j >= 0 && !autoCurve.has(j) && !autoCurve.has(i)) {
      autoCurve.set(i, 28);
      autoCurve.set(j, -28);
    }
  });

  function edgePath(t: Transition, idx: number) {
    const a = lookup[t.from];
    const b = lookup[t.to];
    if (!a || !b) return { d: '', mx: 0, my: 0 };

    // ── Self-loop ───────────────────────────────────────────────────────────
    if (a.id === b.id) {
      const aw = a.w ?? 130;
      const ah = a.h ?? 56;
      // Loop above the box: out the top-right, arc up and around, back into the top-left.
      const startX = a.x + aw * 0.7;
      const startY = a.y;
      const endX   = a.x + aw * 0.3;
      const endY   = a.y + 1; // 1 px inside so the arrow head doesn't clip
      const ctrl1X = a.x + aw * 0.7;
      const ctrl1Y = a.y - 50;
      const ctrl2X = a.x + aw * 0.3;
      const ctrl2Y = a.y - 50;
      const mx = a.x + aw / 2;
      const my = a.y - 44;
      return { d: `M${startX},${startY} C${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${endX},${endY}`, mx, my };
    }

    // ── Box-edge intersection on both ends ─────────────────────────────────
    const aw = a.w ?? 130;
    const ah = a.h ?? 56;
    const bw = b.w ?? 130;
    const bh = b.h ?? 56;
    const ax = a.x + aw / 2;
    const ay = a.y + ah / 2;
    const bx = b.x + bw / 2;
    const by = b.y + bh / 2;

    const curve = t.curve ?? autoCurve.get(idx) ?? 0;

    // Source endpoint aims toward the *visual midpoint* of the curve so we leave
    // the box in the right direction even when the path bends.
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    // Perpendicular for curve offset
    const px = -uy * curve;
    const py = ux * curve;
    const midX = (ax + bx) / 2 + px;
    const midY = (ay + by) / 2 + py;

    const start = edgePoint(a, midX, midY);
    const end   = edgePoint(b, midX, midY);

    if (curve === 0) {
      return { d: `M${start.x},${start.y} L${end.x},${end.y}`, mx: (start.x + end.x) / 2, my: (start.y + end.y) / 2 };
    }
    // Quadratic curve through the offset midpoint
    return {
      d: `M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`,
      mx: midX,
      my: midY,
    };
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
            const { d, mx, my } = edgePath(t, i);
            const lines = t.label ? t.label.split(/\\n|\n/) : [];
            const maxLen = lines.length > 0 ? Math.max(...lines.map(l => l.length)) : 0;
            // Pill width: ~6.6 px/char + generous padding.
            const CHAR_W = 6.8;
            const pillW = maxLen > 0 ? maxLen * CHAR_W + 20 : 0;
            const pillH = lines.length > 0 ? lines.length * 12 + 10 : 0;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" className="text-muted-foreground" markerEnd="url(#state-arrow)" />
                {t.label && (
                  <g transform={`translate(${mx}, ${my})`}>
                    <rect
                      x={-pillW / 2}
                      y={-pillH / 2}
                      width={pillW}
                      height={pillH}
                      rx={6}
                      className="fill-background stroke-border"
                      strokeWidth="1"
                    />
                    <text
                      x={0}
                      y={4}
                      textAnchor="middle"
                      className="fill-foreground font-mono text-[10px]"
                    >
                      {lines.map((line, idx, arr) => (
                        <tspan key={idx} x={0} dy={idx === 0 ? -(arr.length - 1) * 6 : 12}>
                          {line}
                        </tspan>
                      ))}
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
                  {s.label.split('\n').map((line, idx, arr) => (
                    <tspan key={idx} x={w / 2} dy={idx === 0 ? -(arr.length - 1) * 8 : 16}>
                      {line}
                    </tspan>
                  ))}
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
