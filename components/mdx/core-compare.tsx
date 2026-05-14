'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Core = {
  name: string;
  arch: string;
  pipeline?: string;
  dmips?: string;
  fpu?: string;
  dsp?: boolean;
  mpu?: boolean;
  trustzone?: boolean;
  helium?: boolean;
  cache?: string;
  intro?: string;
  notes?: string;
};

const defaultCores: Core[] = [
  { name: 'Cortex-M0',  arch: 'ARMv6-M',  pipeline: '3-stage', dmips: '0.84/MHz', fpu: '—', dsp: false, mpu: false, trustzone: false, helium: false, notes: 'Subset of Thumb-2.' },
  { name: 'Cortex-M0+', arch: 'ARMv6-M',  pipeline: '2-stage', dmips: '0.95/MHz', fpu: '—', dsp: false, mpu: true,  trustzone: false, helium: false, notes: 'Single-cycle I/O port.' },
  { name: 'Cortex-M3',  arch: 'ARMv7-M',  pipeline: '3-stage', dmips: '1.25/MHz', fpu: '—', dsp: false, mpu: true,  trustzone: false, helium: false, notes: 'The classic mid-range core.' },
  { name: 'Cortex-M4',  arch: 'ARMv7E-M', pipeline: '3-stage', dmips: '1.25/MHz', fpu: 'SP', dsp: true, mpu: true, trustzone: false, helium: false, notes: 'Most popular general-purpose MCU core.' },
  { name: 'Cortex-M7',  arch: 'ARMv7E-M', pipeline: '6-stage', dmips: '2.14/MHz', fpu: 'SP/DP', dsp: true, mpu: true, trustzone: false, helium: false, cache: 'I+D', notes: 'Used in i.MX RT, STM32H7.' },
  { name: 'Cortex-M23', arch: 'ARMv8-M Baseline', pipeline: '2-stage', dmips: '0.99/MHz', fpu: '—', dsp: false, mpu: true, trustzone: true, helium: false, notes: 'Secure & non-secure worlds.' },
  { name: 'Cortex-M33', arch: 'ARMv8-M Mainline', pipeline: '3-stage', dmips: '1.50/MHz', fpu: 'SP', dsp: true, mpu: true, trustzone: true, helium: false, notes: 'Used in nRF53, STM32L5/U5.' },
  { name: 'Cortex-M55', arch: 'ARMv8.1-M', pipeline: '4-stage', dmips: '1.6/MHz', fpu: 'SP/DP', dsp: true, mpu: true, trustzone: true, helium: true, notes: '4–5× DSP/ML uplift vs. M4.' },
  { name: 'Cortex-M85', arch: 'ARMv8.1-M', pipeline: '7-stage', dmips: '3.0/MHz', fpu: 'SP/DP', dsp: true, mpu: true, trustzone: true, helium: true, cache: 'I+D', notes: 'i.MX RT700, Renesas RA8.' },
];

type SortKey = 'name' | 'arch' | 'dmips';

export function CoreCompare({ cores = defaultCores }: { cores?: Core[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [dir, setDir] = useState<1 | -1>(1);

  const sorted = useMemo(() => {
    const out = [...cores];
    out.sort((a, b) => {
      if (sortKey === 'dmips') return ((parseFloat(a.dmips ?? '0') - parseFloat(b.dmips ?? '0')) || 0) * dir;
      const av = (a as any)[sortKey] as string;
      const bv = (b as any)[sortKey] as string;
      return av.localeCompare(bv) * dir;
    });
    return out;
  }, [cores, sortKey, dir]);

  function setSort(k: SortKey) {
    if (sortKey === k) setDir((d) => (d === 1 ? -1 : 1));
    else { setSortKey(k); setDir(1); }
  }

  function SortBtn({ k, children }: { k: SortKey; children: React.ReactNode }) {
    const active = sortKey === k;
    const Icon = active ? (dir === 1 ? ArrowUp : ArrowDown) : ArrowUpDown;
    return (
      <button
        onClick={() => setSort(k)}
        className={cn(
          'inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider',
          active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {children}
        <Icon className="h-3 w-3" />
      </button>
    );
  }

  const Bool = ({ on, accent }: { on: boolean; accent?: boolean }) =>
    on ? <Check className={cn('h-4 w-4', accent ? 'text-info' : 'text-success')} /> : <Minus className="h-4 w-4 text-muted-foreground/40" />;

  return (
    <div className="not-prose my-8 min-w-0 overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b bg-muted/30 px-4 py-3">
        <div className="font-mono text-sm text-foreground">Cortex-M lineup</div>
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">sort:</span>
          <SortBtn k="name">name</SortBtn>
          <SortBtn k="dmips">dmips</SortBtn>
          <SortBtn k="arch">arch</SortBtn>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-sm">
          <thead className="text-left font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            <tr className="border-b bg-muted/20">
              <th className="px-4 py-2.5">Core</th>
              <th className="px-2 py-2.5">Arch</th>
              <th className="px-2 py-2.5">Pipe</th>
              <th className="px-2 py-2.5">DMIPS</th>
              <th className="px-2 py-2.5">FPU</th>
              <th className="px-2 py-2.5">DSP</th>
              <th className="px-2 py-2.5">MPU</th>
              <th className="px-2 py-2.5">TZ</th>
              <th className="px-2 py-2.5">MVE</th>
              <th className="px-4 py-2.5">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.name} className="border-t hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-mono text-foreground">{c.name}</td>
                <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground">{c.arch}</td>
                <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground">{c.pipeline ?? '—'}</td>
                <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground">{c.dmips ?? '—'}</td>
                <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground">{c.fpu ?? '—'}</td>
                <td className="px-2 py-2.5"><Bool on={!!c.dsp} /></td>
                <td className="px-2 py-2.5"><Bool on={!!c.mpu} /></td>
                <td className="px-2 py-2.5"><Bool on={!!c.trustzone} /></td>
                <td className="px-2 py-2.5"><Bool on={!!c.helium} accent /></td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{c.notes ?? c.intro ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
