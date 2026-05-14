import { cn } from '@/lib/utils';

type Block = {
  label: string;
  detail?: string;
  kind?: 'core' | 'memory' | 'radio' | 'periph' | 'power' | 'storage' | 'security' | 'io' | 'accel';
  span?: number;
  href?: string;
};

const kindStyles: Record<NonNullable<Block['kind']>, string> = {
  core:     'border-foreground/30 bg-foreground/[.04] text-foreground',
  memory:   'border-info/30 bg-info/[.06] text-info',
  radio:    'border-warning/30 bg-warning/[.06] text-warning',
  periph:   'border-success/30 bg-success/[.06] text-success',
  power:    'border-warning/40 bg-warning/[.08] text-warning',
  storage:  'border-info/30 bg-info/[.06] text-info',
  security: 'border-destructive/30 bg-destructive/[.06] text-destructive',
  io:       'border-border bg-muted/40 text-foreground',
  accel:    'border-info/30 bg-info/[.06] text-info',
};

export function SystemBlock({ title, blocks, caption }: { title?: string; blocks: (Block | null)[][]; caption?: string }) {
  const cols = Math.max(...blocks.map((r) => r.reduce((acc, b) => acc + (b?.span ?? 1), 0)));
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border bg-card">
      {title && (
        <div className="border-b bg-muted/30 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
      )}
      <div className="overflow-x-auto p-3 sm:p-5 thin-scrollbar">
        <div
          className="grid gap-1.5 sm:gap-2"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(6.5rem, 1fr))`,
            minWidth: `min(100%, ${cols * 6.5}rem)`,
          }}
        >
          {blocks.flatMap((row, ri) =>
            row.map((b, ci) => {
              if (!b) return <div key={`${ri}-${ci}`} />;
              const cls = kindStyles[b.kind ?? 'io'];
              const inner = (
                <>
                  <div className="font-mono text-[0.7rem] sm:text-[0.78rem] font-medium leading-tight">{b.label}</div>
                  {b.detail && <div className="mt-1 font-mono text-[0.6rem] sm:text-[0.65rem] text-muted-foreground leading-tight">{b.detail}</div>}
                </>
              );
              return (
                <div
                  key={`${ri}-${ci}`}
                  className={cn('rounded-md border px-2 py-1.5 sm:px-3 sm:py-2', cls)}
                  style={b.span ? { gridColumn: `span ${b.span}` } : undefined}
                >
                  {b.href ? <a href={b.href} className="block !no-underline">{inner}</a> : inner}
                </div>
              );
            }),
          )}
        </div>
      </div>
      {caption && <figcaption className="border-t bg-muted/20 px-4 py-2 font-mono text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
