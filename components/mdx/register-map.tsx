'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

type Field = {
  bits: string;
  name: string;
  access?: 'RW' | 'R' | 'W' | 'RO' | 'WO' | 'W1C' | 'RES';
  reset?: number | string;
  description: string;
};

type Props = {
  name: string;
  address?: string;
  width?: 32 | 16 | 8;
  fields: Field[];
  reset?: string;
  caption?: string;
};

function parseRange(s: string): [number, number] {
  if (s.includes(':')) {
    const [hi, lo] = s.split(':').map((n) => parseInt(n.trim(), 10));
    return [hi, lo];
  }
  const v = parseInt(s.trim(), 10);
  return [v, v];
}

const palette = [
  'bg-foreground/[.06] dark:bg-foreground/[.10] text-foreground',
  'bg-info/10 dark:bg-info/15 text-info',
  'bg-success/10 dark:bg-success/15 text-success',
  'bg-warning/10 dark:bg-warning/15 text-warning',
  'bg-destructive/10 dark:bg-destructive/15 text-destructive',
  'bg-foreground/[.06] dark:bg-foreground/[.10] text-foreground',
  'bg-info/10 dark:bg-info/15 text-info',
  'bg-success/10 dark:bg-success/15 text-success',
];

export function RegisterMap({ name, address, width = 32, fields, reset, caption }: Props) {
  const uid = useId();
  const [hi, setHi] = useState<number | null>(null);
  const bits = Array.from({ length: width }, (_, i) => width - 1 - i);

  const bitField = new Array<number>(width).fill(-1);
  fields.forEach((f, idx) => {
    const [h, l] = parseRange(f.bits);
    for (let b = l; b <= h; b++) if (b >= 0 && b < width) bitField[b] = idx;
  });

  const colorFor = (i: number) => (i < 0 ? 'bg-muted/40 text-muted-foreground' : palette[i % palette.length]);

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b bg-muted/30 px-4 py-3">
        <div className="font-mono text-sm">
          <span>{name}</span>
          {address && <span className="text-muted-foreground"> · {address}</span>}
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          {width}-bit{reset ? ` · reset ${reset}` : ''}
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <div className="min-w-[640px]">
          <div className="mb-1.5 grid font-mono text-[0.65rem] text-muted-foreground" style={{ gridTemplateColumns: `repeat(${width}, minmax(0,1fr))` }}>
            {bits.map((b) => (
              <div key={b} className="text-center">{b % 4 === 0 ? b : ''}</div>
            ))}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${width}, minmax(0,1fr))` }}>
            {bits.map((b) => {
              const fi = bitField[b];
              const f = fi >= 0 ? fields[fi] : null;
              const active = hi !== null && hi === fi;
              const dim = hi !== null && hi !== fi;
              return (
                <button
                  key={b}
                  type="button"
                  onMouseEnter={() => setHi(fi)}
                  onFocus={() => setHi(fi)}
                  onMouseLeave={() => setHi(null)}
                  onBlur={() => setHi(null)}
                  className={cn(
                    'group relative -ml-px h-9 border-l border-y first:ml-0 last:border-r font-mono text-[0.7rem] flex items-center justify-center transition-all focus:outline-none focus:z-10 focus:ring-2 focus:ring-ring',
                    colorFor(fi),
                    active && 'ring-2 ring-ring',
                    dim && 'opacity-40',
                  )}
                  aria-label={f ? `${f.name} (bit ${b})` : `Reserved bit ${b}`}
                >
                  <span className="truncate px-0.5">{f?.name?.[0] ?? '·'}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-1 grid font-mono text-[0.6rem] text-muted-foreground" style={{ gridTemplateColumns: `repeat(${width}, minmax(0,1fr))` }}>
            {bits.map((b) => (
              <div key={b} className="text-center">{b % 8 === 0 ? `b${b}` : ''}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border-t">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/30">
            <tr className="text-left font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 w-20">Bits</th>
              <th className="px-2 py-2 w-32">Name</th>
              <th className="px-2 py-2 w-14">Acc</th>
              <th className="px-2 py-2 w-14">Reset</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => {
              const active = hi !== null && hi === i;
              const dim = hi !== null && hi !== i;
              return (
                <tr
                  key={i}
                  onMouseEnter={() => setHi(i)}
                  onMouseLeave={() => setHi(null)}
                  className={cn('border-t transition-all', active && 'bg-muted/40', dim && 'opacity-50')}
                >
                  <td className="px-4 py-2 font-mono text-xs">
                    <span className={cn('inline-block rounded border px-1.5 py-0.5', colorFor(i))}>{f.bits}</span>
                  </td>
                  <td className="px-2 py-2 font-mono text-xs text-foreground">{f.name}</td>
                  <td className="px-2 py-2 font-mono text-xs text-muted-foreground">{f.access ?? '—'}</td>
                  <td className="px-2 py-2 font-mono text-xs text-muted-foreground">{f.reset ?? '—'}</td>
                  <td className="px-4 py-2 text-muted-foreground">{f.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className="border-t bg-muted/20 px-4 py-2 font-mono text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
