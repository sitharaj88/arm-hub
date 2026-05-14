import { cn } from '@/lib/utils';

/**
 * Block diagram — SVG-rendered architecture diagram with labeled boxes
 * and connecting wires/arrows. Theme-aware via CSS variables on currentColor.
 *
 *   <BlockDiagram width={720} height={420} title="..." caption="...">
 *     nodes={[
 *       { id: 'cpu',  x: 40, y: 30, w: 220, h: 60, kind: 'core', label: '4× Cortex-A53', detail: '@ 2.0 GHz' },
 *       ...
 *     ]}
 *     edges={[
 *       { from: 'cpu', to: 'l2', label: 'AXI' },
 *       ...
 *     ]}
 *   </BlockDiagram>
 *
 * Coordinates are SVG units; the viewBox scales to fit the container,
 * with a horizontal scroll fallback on narrow screens.
 */

type Kind =
  | 'core'      // CPU / MCU
  | 'memory'    // RAM / cache
  | 'radio'     // wireless / RF
  | 'periph'    // generic peripheral
  | 'power'     // power / regulator
  | 'storage'   // flash / SD
  | 'security' // crypto / HSM / safety
  | 'io'        // generic I/O block
  | 'accel'     // accelerator / DSP / NPU
  | 'sensor'    // sensors (IMU / temp / etc)
  | 'external'  // off-chip device
  | 'cloud';    // cloud service / external server

type Node = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: Kind;
  label: string;
  detail?: string;
};

type Edge = {
  from: string;
  to: string;
  label?: string;
  /** @deprecated Routing is always orthogonal now; this prop is ignored. */
  route?: 'straight' | 'step';
  /** Arrow style */
  arrow?: 'forward' | 'backward' | 'both' | 'none';
  /** Wire style */
  style?: 'solid' | 'dashed';
  /** Color hint */
  tone?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'destructive' | 'muted';
};

type Props = {
  title?: string;
  caption?: string;
  width?: number;
  height: number;
  /** Minimum pixel width before horizontal scroll kicks in. */
  minWidth?: number;
  nodes: Node[];
  edges?: Edge[];
};

// Tone classes — applied via the className prop on SVG elements.
// Opacity values must be in the standard Tailwind scale (5, 10, 15, 20, 25…)
// otherwise the utility is not emitted and the browser falls back to default
// SVG fill (black) — which looks acceptable in dark mode but is obviously
// wrong in light mode.
const kindStyles: Record<Kind, { fill: string; stroke: string; text: string }> = {
  core:     { fill: 'fill-primary/15',     stroke: 'stroke-primary/55',    text: 'fill-primary' },
  memory:   { fill: 'fill-accent/15',      stroke: 'stroke-accent/55',     text: 'fill-accent' },
  radio:    { fill: 'fill-highlight/15',   stroke: 'stroke-highlight/55',  text: 'fill-highlight' },
  periph:   { fill: 'fill-success/15',     stroke: 'stroke-success/45',    text: 'fill-success' },
  power:    { fill: 'fill-warning/15',     stroke: 'stroke-warning/55',    text: 'fill-warning' },
  storage:  { fill: 'fill-info/15',        stroke: 'stroke-info/50',       text: 'fill-info' },
  security: { fill: 'fill-destructive/15', stroke: 'stroke-destructive/50', text: 'fill-destructive' },
  io:       { fill: 'fill-muted/60',       stroke: 'stroke-border',        text: 'fill-foreground' },
  accel:    { fill: 'fill-primary/15',     stroke: 'stroke-primary/55',    text: 'fill-primary' },
  sensor:   { fill: 'fill-accent/15',      stroke: 'stroke-accent/55',     text: 'fill-accent' },
  external: { fill: 'fill-card',           stroke: 'stroke-foreground/40', text: 'fill-foreground' },
  cloud:    { fill: 'fill-muted/40',       stroke: 'stroke-muted-foreground/50', text: 'fill-foreground' },
};

const edgeTones: Record<NonNullable<Edge['tone']>, string> = {
  default:     'stroke-foreground/40',
  primary:     'stroke-primary',
  accent:      'stroke-accent',
  success:     'stroke-success',
  warning:     'stroke-warning',
  destructive: 'stroke-destructive',
  muted:       'stroke-muted-foreground/45',
};

const edgeMarkerFills: Record<NonNullable<Edge['tone']>, string> = {
  default:     'fill-foreground/40',
  primary:     'fill-primary',
  accent:      'fill-accent',
  success:     'fill-success',
  warning:     'fill-warning',
  destructive: 'fill-destructive',
  muted:       'fill-muted-foreground/45',
};

function rectCenter(n: Node): { x: number; y: number } {
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
}

type Side = 'top' | 'bottom' | 'left' | 'right';

/** Pick which side of `from` faces `to`. */
function pickSide(from: Node, to: Node): Side {
  const a = rectCenter(from);
  const b = rectCenter(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  // Prefer vertical exit if the boxes overlap horizontally
  const overlapX = !(to.x + to.w < from.x || to.x > from.x + from.w);
  const overlapY = !(to.y + to.h < from.y || to.y > from.y + from.h);
  if (overlapX && !overlapY) return dy > 0 ? 'bottom' : 'top';
  if (overlapY && !overlapX) return dx > 0 ? 'right' : 'left';
  if (Math.abs(dy) >= Math.abs(dx)) return dy > 0 ? 'bottom' : 'top';
  return dx > 0 ? 'right' : 'left';
}

/** Opposite side helper. */
function opposite(s: Side): Side {
  return s === 'top' ? 'bottom' : s === 'bottom' ? 'top' : s === 'left' ? 'right' : 'left';
}

/**
 * Compute the attachment point on a given side of a node at fractional position t∈[0,1].
 * t=0 is the start of that side (clockwise from top-left), t=1 is the end.
 */
function attachPoint(n: Node, side: Side, t: number): { x: number; y: number } {
  const clamp = Math.max(0.1, Math.min(0.9, t));
  switch (side) {
    case 'top':    return { x: n.x + n.w * clamp, y: n.y };
    case 'bottom': return { x: n.x + n.w * clamp, y: n.y + n.h };
    case 'left':   return { x: n.x,                y: n.y + n.h * clamp };
    case 'right':  return { x: n.x + n.w,          y: n.y + n.h * clamp };
  }
}

/**
 * Plan all edges in advance: for each (node, side) bucket distribute attachment points
 * evenly across the side based on insertion order. Returns a function that yields the
 * exact attachment point for any edge index.
 */
type EdgePlan = {
  fromPt: { x: number; y: number };
  fromSide: Side;
  toPt:   { x: number; y: number };
  toSide: Side;
};

function planEdges(nodes: Node[], edges: Edge[], byId: Record<string, Node>): EdgePlan[] {
  // Determine each edge's source side and target side.
  const sides: Array<{ fs: Side; ts: Side; from: Node; to: Node } | null> = edges.map((e) => {
    const from = byId[e.from]; const to = byId[e.to];
    if (!from || !to) return null;
    const fs = pickSide(from, to);
    // For the target side, recompute relative to the chosen exit side of source.
    const ts = pickSide(to, from);
    return { fs, ts, from, to };
  });
  // Bucket edges per (nodeId, side) for distribution along that side.
  const buckets = new Map<string, Array<{ idx: number; partnerCenter: number }>>();
  const key = (id: string, s: Side) => `${id}|${s}`;
  sides.forEach((info, idx) => {
    if (!info) return;
    const fk = key(info.from.id, info.fs);
    const tk = key(info.to.id, info.ts);
    // Use the partner box's center along the side's "axis" to sort attachment order
    const fromAxis = (info.fs === 'top' || info.fs === 'bottom') ? rectCenter(info.to).x : rectCenter(info.to).y;
    const toAxis   = (info.ts === 'top' || info.ts === 'bottom') ? rectCenter(info.from).x : rectCenter(info.from).y;
    if (!buckets.has(fk)) buckets.set(fk, []);
    if (!buckets.has(tk)) buckets.set(tk, []);
    buckets.get(fk)!.push({ idx, partnerCenter: fromAxis });
    buckets.get(tk)!.push({ idx, partnerCenter: toAxis });
  });
  // Sort each bucket and compute fractional positions
  const fromT = new Map<number, number>();
  const toT = new Map<number, number>();
  buckets.forEach((entries, k) => {
    entries.sort((a, b) => a.partnerCenter - b.partnerCenter);
    const n = entries.length;
    entries.forEach((ent, i) => {
      const t = n === 1 ? 0.5 : (i + 1) / (n + 1); // evenly distributed (0,1) excluding endpoints
      // Distinguish from vs to: the key tells us which side; we need to know whether this
      // bucket entry corresponds to the edge's source or target.
      const info = sides[ent.idx]!;
      const isFrom = k === key(info.from.id, info.fs);
      if (isFrom) fromT.set(ent.idx, t);
      else        toT.set(ent.idx, t);
    });
  });
  return sides.map((info, idx) => {
    if (!info) return { fromPt: { x: 0, y: 0 }, fromSide: 'top' as Side, toPt: { x: 0, y: 0 }, toSide: 'top' as Side };
    const fromPt = attachPoint(info.from, info.fs, fromT.get(idx) ?? 0.5);
    const toPt   = attachPoint(info.to,   info.ts, toT.get(idx)   ?? 0.5);
    return { fromPt, fromSide: info.fs, toPt, toSide: info.ts };
  });
}

/**
 * Build an orthogonal SVG path from `fromPt` (exiting `fromSide`) to `toPt`
 * (entering `toSide`). Always perpendicular to the box surface for a short
 * stub, then a single bend to the destination.
 */
function orthogonalPath(plan: EdgePlan): { d: string; segments: Array<{ x1: number; y1: number; x2: number; y2: number }> } {
  const { fromPt, fromSide, toPt, toSide } = plan;
  const stub = 14; // perpendicular stub before the bend
  // Compute the "off-box" anchor for each end: a point just outside the source/target box
  const aOff = offset(fromPt, fromSide, stub);
  const bOff = offset(toPt, toSide, stub);
  const points: Array<{ x: number; y: number }> = [];
  points.push(fromPt);
  points.push(aOff);
  // Decide bend points based on side directions.
  const fromHoriz = fromSide === 'left' || fromSide === 'right';
  const toHoriz = toSide === 'left' || toSide === 'right';
  if (fromHoriz && toHoriz) {
    // Both ends exit horizontally — use a Z-bend through a midline x
    const midX = (aOff.x + bOff.x) / 2;
    points.push({ x: midX, y: aOff.y });
    points.push({ x: midX, y: bOff.y });
  } else if (!fromHoriz && !toHoriz) {
    // Both ends exit vertically — Z-bend through midline y
    const midY = (aOff.y + bOff.y) / 2;
    points.push({ x: aOff.x, y: midY });
    points.push({ x: bOff.x, y: midY });
  } else {
    // L-bend: one horizontal segment and one vertical
    if (fromHoriz) {
      points.push({ x: bOff.x, y: aOff.y });
    } else {
      points.push({ x: aOff.x, y: bOff.y });
    }
  }
  points.push(bOff);
  points.push(toPt);
  // Reduce: drop sequential duplicates
  const cleaned: typeof points = [];
  for (const p of points) {
    if (cleaned.length === 0) { cleaned.push(p); continue; }
    const last = cleaned[cleaned.length - 1];
    if (last.x === p.x && last.y === p.y) continue;
    cleaned.push(p);
  }
  const d = cleaned.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const segments: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let i = 0; i < cleaned.length - 1; i++) {
    segments.push({ x1: cleaned[i].x, y1: cleaned[i].y, x2: cleaned[i + 1].x, y2: cleaned[i + 1].y });
  }
  return { d, segments };
}

function offset(p: { x: number; y: number }, side: Side, d: number): { x: number; y: number } {
  switch (side) {
    case 'top':    return { x: p.x, y: p.y - d };
    case 'bottom': return { x: p.x, y: p.y + d };
    case 'left':   return { x: p.x - d, y: p.y };
    case 'right':  return { x: p.x + d, y: p.y };
  }
}

/** Pick the longest segment and return its midpoint — ideal label position. */
function labelAnchor(segments: Array<{ x1: number; y1: number; x2: number; y2: number }>): { x: number; y: number; horiz: boolean } {
  let best = segments[0];
  let bestLen = 0;
  for (const s of segments) {
    const len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
    if (len > bestLen) { bestLen = len; best = s; }
  }
  const horiz = Math.abs(best.x2 - best.x1) > Math.abs(best.y2 - best.y1);
  return { x: (best.x1 + best.x2) / 2, y: (best.y1 + best.y2) / 2, horiz };
}

export function BlockDiagram({
  title,
  caption,
  width = 720,
  height,
  minWidth = 640,
  nodes,
  edges = [],
}: Props) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const W = width;
  const H = height;
  const plans = planEdges(nodes, edges, byId);

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border bg-card">
      {title && (
        <div className="flex flex-col gap-2 border-b bg-muted/40 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.65rem] font-mono uppercase tracking-wider text-muted-foreground/70">
            <Legend kind="core"   label="core" />
            <Legend kind="memory" label="memory" />
            <Legend kind="radio"  label="radio" />
            <Legend kind="periph" label="periph" />
          </div>
        </div>
      )}
      <div className="overflow-x-auto thin-scrollbar">
        <div style={{ minWidth: `${Math.min(minWidth, W)}px` }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {(['default', 'primary', 'accent', 'success', 'warning', 'destructive', 'muted'] as const).map((t) => (
                <marker
                  key={t}
                  id={`bd-arrow-${t}`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" className={cn(edgeMarkerFills[t], edgeTones[t])} />
                </marker>
              ))}
            </defs>

            {/* Edges first so they sit under nodes */}
            <g strokeWidth={1.4} fill="none" strokeLinejoin="round" strokeLinecap="round">
              {edges.map((e, i) => {
                const from = byId[e.from];
                const to = byId[e.to];
                if (!from || !to) return null;
                const plan = plans[i];
                const { d, segments } = orthogonalPath(plan);
                const tone = edgeTones[e.tone ?? 'default'];
                const markerEnd = e.arrow === 'none' || e.arrow === 'backward' ? undefined : `url(#bd-arrow-${e.tone ?? 'default'})`;
                const markerStart = e.arrow === 'backward' || e.arrow === 'both' ? `url(#bd-arrow-${e.tone ?? 'default'})` : undefined;
                const stroke = cn(tone);
                return (
                  <g key={`${e.from}-${e.to}-${i}`}>
                    <path
                      d={d}
                      className={stroke}
                      strokeDasharray={e.style === 'dashed' ? '4 3' : undefined}
                      markerEnd={markerEnd}
                      markerStart={markerStart}
                    />
                    {e.label && (() => {
                      const anchor = labelAnchor(segments);
                      // Estimate label width: ~5.5 px per character for the 9.5 px font
                      const lw = Math.max(28, e.label.length * 5.5 + 10);
                      return (
                        <g transform={`translate(${anchor.x}, ${anchor.y})`}>
                          <rect x={-lw / 2} y="-8" width={lw} height="16" rx="3" className="fill-card stroke-border" strokeWidth={0.5} />
                          <text x="0" y="3" textAnchor="middle" className="font-mono fill-muted-foreground" style={{ fontSize: 9.5 }}>
                            {e.label}
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                );
              })}
            </g>

            {/* Nodes */}
            {nodes.map((n) => {
              const k = n.kind ?? 'io';
              const s = kindStyles[k];
              return (
                <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                  <rect
                    width={n.w}
                    height={n.h}
                    rx={8}
                    ry={8}
                    className={cn(s.fill, s.stroke)}
                    strokeWidth={1.2}
                  />
                  <text
                    x={n.w / 2}
                    y={n.detail ? n.h / 2 - 2 : n.h / 2 + 4}
                    textAnchor="middle"
                    className={cn(s.text, 'font-medium')}
                    style={{ fontSize: 12 }}
                  >
                    {n.label}
                  </text>
                  {n.detail && (
                    <text
                      x={n.w / 2}
                      y={n.h / 2 + 12}
                      textAnchor="middle"
                      className="fill-muted-foreground font-mono"
                      style={{ fontSize: 9.5 }}
                    >
                      {n.detail}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      {caption && (
        <figcaption className="border-t bg-muted/20 px-4 py-2 font-mono text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}

function Legend({ kind, label }: { kind: Kind; label: string }) {
  const s = kindStyles[kind];
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn('inline-block h-2.5 w-2.5 rounded-sm border', s.fill.replace('fill-', 'bg-'), s.stroke.replace('stroke-', 'border-'))} />
      <span>{label}</span>
    </span>
  );
}
