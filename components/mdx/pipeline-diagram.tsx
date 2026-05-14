import { cn } from '@/lib/utils';

/**
 * PipelineDiagram — visualize CPU pipeline stages and per-cycle instruction flow.
 *
 *   <PipelineDiagram
 *     title="Cortex-M7 6-stage pipeline"
 *     stages={['F1', 'F2', 'D1', 'D2', 'EX', 'WB']}
 *     instructions={[
 *       { name: 'LDR r0,[r1]',  stages: ['F1','F2','D1','D2','EX','WB'] },
 *       { name: 'ADD r2,r0,#1', stages: ['',  'F1','F2','D1','D2','EX','WB'], stall: 1 },
 *     ]}
 *     caption="..."
 *   />
 */

type Stage =
  | 'F' | 'F1' | 'F2'   // fetch
  | 'D' | 'D1' | 'D2'   // decode
  | 'I'                  // issue
  | 'EX' | 'E1' | 'E2'   // execute
  | 'MEM' | 'MA'         // memory access
  | 'WB'                 // write-back
  | '';                  // bubble

type Instr = {
  name: string;
  stages: Stage[];
  stall?: number;
  tone?: 'primary' | 'accent' | 'highlight' | 'destructive';
};

const stageColors: Record<string, string> = {
  F: 'fill-primary/15 stroke-primary/40',
  F1: 'fill-primary/15 stroke-primary/40',
  F2: 'fill-primary/10 stroke-primary/30',
  D: 'fill-accent/15 stroke-accent/40',
  D1: 'fill-accent/15 stroke-accent/40',
  D2: 'fill-accent/10 stroke-accent/30',
  I: 'fill-highlight/15 stroke-highlight/40',
  EX: 'fill-highlight/15 stroke-highlight/40',
  E1: 'fill-highlight/15 stroke-highlight/40',
  E2: 'fill-highlight/10 stroke-highlight/30',
  MEM: 'fill-success/15 stroke-success/40',
  MA: 'fill-success/15 stroke-success/40',
  WB: 'fill-muted stroke-muted-foreground/30',
  '': 'fill-destructive/10 stroke-destructive/30',
};

export function PipelineDiagram({
  title,
  stages,
  instructions,
  caption,
}: {
  title?: string;
  stages: Stage[];
  instructions: Instr[];
  caption?: string;
}) {
  const cellW = 64;
  const cellH = 40;
  const labelW = 140;
  const padT = title ? 36 : 16;
  const padB = 14;
  const padX = 14;

  const cycles = Math.max(...instructions.map((i) => i.stages.length));
  const W = padX + labelW + cycles * cellW + padX;
  const H = padT + cellH + instructions.length * cellH + padB;

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border bg-card">
      <div className="border-b bg-muted/30 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {title ?? 'Pipeline diagram'}
      </div>
      <div className="overflow-x-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full min-w-[620px]"
          role="img"
          aria-label={title ?? 'Pipeline diagram'}
        >
          {/* Cycle header */}
          <g transform={`translate(${padX + labelW}, ${padT})`}>
            {Array.from({ length: cycles }).map((_, i) => (
              <g key={i} transform={`translate(${i * cellW}, ${-cellH + 4})`}>
                <text
                  x={cellW / 2}
                  y={cellH - 14}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono text-[10px] uppercase tracking-wider"
                >
                  cycle {i + 1}
                </text>
              </g>
            ))}
          </g>
          {/* Stage row label */}
          <text
            x={padX}
            y={padT + cellH / 2}
            dominantBaseline="middle"
            className="fill-muted-foreground font-mono text-[10px] uppercase tracking-wider"
          >
            stage legend
          </text>
          {/* Pipeline stage legend at the top */}
          <g transform={`translate(${padX + labelW + 0}, ${padT - cellH - 28})`}>
            {stages.map((s, i) => (
              <g key={i} transform={`translate(${i * (cellW + 4)}, 0)`}>
                <rect
                  width={cellW}
                  height={20}
                  rx={3}
                  className={cn(stageColors[s] ?? stageColors.F)}
                  strokeWidth="1"
                />
                <text
                  x={cellW / 2}
                  y={14}
                  textAnchor="middle"
                  className="fill-foreground font-mono text-[10px] font-medium"
                >
                  {s}
                </text>
              </g>
            ))}
          </g>

          {/* Instruction rows */}
          {instructions.map((inst, row) => (
            <g key={row} transform={`translate(${padX}, ${padT + row * cellH})`}>
              <text
                x={0}
                y={cellH / 2}
                dominantBaseline="middle"
                className="fill-foreground font-mono text-[11px]"
              >
                {inst.name}
              </text>
              <g transform={`translate(${labelW}, 0)`}>
                {inst.stages.map((s, c) => {
                  if (s === '') {
                    return (
                      <g key={c} transform={`translate(${c * cellW}, 4)`}>
                        <rect
                          width={cellW - 4}
                          height={cellH - 8}
                          rx={3}
                          className="fill-destructive/10 stroke-destructive/30"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                        <text
                          x={(cellW - 4) / 2}
                          y={(cellH - 8) / 2 + 4}
                          textAnchor="middle"
                          className="fill-destructive/80 font-mono text-[9px] uppercase tracking-wider"
                        >
                          stall
                        </text>
                      </g>
                    );
                  }
                  return (
                    <g key={c} transform={`translate(${c * cellW}, 4)`}>
                      <rect
                        width={cellW - 4}
                        height={cellH - 8}
                        rx={3}
                        className={cn(stageColors[s] ?? 'fill-muted')}
                        strokeWidth="1.2"
                      />
                      <text
                        x={(cellW - 4) / 2}
                        y={(cellH - 8) / 2 + 4}
                        textAnchor="middle"
                        className="fill-foreground font-mono text-[11px] font-medium"
                      >
                        {s}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          ))}
        </svg>
      </div>
      {caption && (
        <figcaption className="border-t bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
