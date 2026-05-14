import { cn } from '@/lib/utils';

type Region = {
  start: string;
  end: string;
  name: string;
  detail?: string;
  kind?: 'code' | 'sram' | 'periph' | 'external' | 'system' | 'reserved';
};

const kindBg: Record<NonNullable<Region['kind']>, string> = {
  code:     'bg-info/[.06]',
  sram:     'bg-success/[.06]',
  periph:   'bg-warning/[.06]',
  external: 'bg-foreground/[.04]',
  system:   'bg-destructive/[.04]',
  reserved: 'bg-muted/40',
};

const kindLabel: Record<NonNullable<Region['kind']>, string> = {
  code:     'text-info',
  sram:     'text-success',
  periph:   'text-warning',
  external: 'text-foreground',
  system:   'text-destructive',
  reserved: 'text-muted-foreground',
};

export function MemoryMap({ title = 'Address space', regions }: { title?: string; regions: Region[] }) {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="border-b bg-muted/30 px-4 py-3 font-mono text-sm text-foreground">{title}</div>
      <div>
        {regions.map((r, i) => (
          <div
            key={i}
            className={cn(
              'grid grid-cols-1 sm:grid-cols-[11rem_minmax(0,1fr)] items-stretch border-t first:border-t-0',
              r.kind && kindBg[r.kind],
            )}
          >
            <div className="flex items-baseline gap-3 border-b sm:border-b-0 sm:border-r bg-background/60 px-4 py-2 sm:py-3 font-mono text-xs">
              <div className="text-foreground">{r.start}</div>
              <div className="text-muted-foreground">– {r.end}</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">{r.name}</div>
                {r.detail && <div className="text-xs text-muted-foreground">{r.detail}</div>}
              </div>
              {r.kind && (
                <span className={cn(
                  'shrink-0 rounded-md border bg-background px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider',
                  kindLabel[r.kind],
                )}>
                  {r.kind}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
