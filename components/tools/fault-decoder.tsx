'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Cpu, MemoryStick, Server, ShieldAlert } from 'lucide-react';
import { cfsrBits, hfsrBits, parseHex, setBits, formatHex, type FaultBit } from '@/lib/fault-bits';
import { cn } from '@/lib/utils';

const exampleSet = [
  { label: 'Bus fault — precise', cfsr: '0x00008200', hfsr: '0x40000000', bfar: '0x40000400', mmfar: '' },
  { label: 'MemManage — stack overflow', cfsr: '0x00000010', hfsr: '0x40000000', bfar: '', mmfar: '' },
  { label: 'Usage — undefined instruction', cfsr: '0x00010000', hfsr: '0x40000000', bfar: '', mmfar: '' },
  { label: 'Usage — divide by zero', cfsr: '0x02000000', hfsr: '0x40000000', bfar: '', mmfar: '' },
];

const severityStyles: Record<FaultBit['severity'], { icon: typeof Cpu; color: string; ring: string; bg: string }> = {
  usage:  { icon: AlertTriangle, color: 'text-highlight',   ring: 'border-highlight/30',   bg: 'bg-highlight/10' },
  bus:    { icon: Server,        color: 'text-destructive', ring: 'border-destructive/30', bg: 'bg-destructive/10' },
  mem:    { icon: MemoryStick,   color: 'text-accent',      ring: 'border-accent/30',      bg: 'bg-accent/10' },
  system: { icon: ShieldAlert,   color: 'text-primary',     ring: 'border-primary/30',     bg: 'bg-primary/10' },
};

function HexField({ label, addr, value, onChange, placeholder }: { label: string; addr: string; value: string; onChange: (v: string) => void; placeholder: string; }) {
  const parsed = parseHex(value);
  const ok = value.trim() === '' || parsed !== null;
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="font-mono text-[0.65rem] text-muted-foreground">{addr}</span>
      </div>
      <input
        type="text"
        spellCheck={false}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-md border bg-card px-3 py-2 font-mono text-sm tracking-tight transition-colors',
          ok ? 'border-border focus:border-primary' : 'border-destructive/60 text-destructive',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        )}
      />
      {!ok && <div className="mt-1 text-[0.65rem] text-destructive">Invalid hex</div>}
    </label>
  );
}

export function FaultDecoder() {
  const [cfsr, setCfsr] = useState('');
  const [hfsr, setHfsr] = useState('');
  const [mmfar, setMmfar] = useState('');
  const [bfar, setBfar] = useState('');

  const cfsrVal = parseHex(cfsr) ?? 0;
  const hfsrVal = parseHex(hfsr) ?? 0;

  const setCfsrBits = useMemo(() => (cfsrVal ? setBits(cfsrVal, cfsrBits) : []), [cfsrVal]);
  const setHfsrBits = useMemo(() => (hfsrVal ? setBits(hfsrVal, hfsrBits) : []), [hfsrVal]);
  const allSet = useMemo(() => [...setCfsrBits, ...setHfsrBits], [setCfsrBits, setHfsrBits]);

  const hasAnyInput = cfsr.trim() !== '' || hfsr.trim() !== '';
  const escalated = setHfsrBits.find((b) => b.name === 'FORCED');

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      {/* INPUT PANE */}
      <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold tracking-tight">Fault registers</h2>
            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">v7-M / v8-M</span>
          </div>
          <div className="space-y-3">
            <HexField label="CFSR" addr="0xE000_ED28" value={cfsr} onChange={setCfsr} placeholder="e.g. 0x00008200" />
            <HexField label="HFSR" addr="0xE000_ED2C" value={hfsr} onChange={setHfsr} placeholder="e.g. 0x40000000" />
            <HexField label="MMFAR" addr="0xE000_ED34" value={mmfar} onChange={setMmfar} placeholder="optional" />
            <HexField label="BFAR" addr="0xE000_ED38" value={bfar} onChange={setBfar} placeholder="optional" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <div className="mb-3 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Try an example</div>
          <ul className="space-y-1.5 text-sm">
            {exampleSet.map((ex) => (
              <li key={ex.label}>
                <button
                  type="button"
                  onClick={() => {
                    setCfsr(ex.cfsr);
                    setHfsr(ex.hfsr);
                    setBfar(ex.bfar);
                    setMmfar(ex.mmfar);
                  }}
                  className="flex w-full items-center justify-between rounded-md border bg-background/40 px-3 py-1.5 text-left transition-colors hover:bg-muted/40 hover:border-primary/30"
                >
                  <span>{ex.label}</span>
                  <span className="font-mono text-[0.65rem] text-muted-foreground">CFSR {ex.cfsr}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => { setCfsr(''); setHfsr(''); setMmfar(''); setBfar(''); }}
                className="mt-1 w-full rounded-md border bg-background/40 px-3 py-1.5 text-center text-xs text-muted-foreground hover:bg-muted/40"
              >
                Clear
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* RESULT PANE */}
      <div className="min-w-0">
        {!hasAnyInput && (
          <div className="rounded-lg border bg-card p-8 sm:p-12 text-center">
            <AlertTriangle className="mx-auto h-6 w-6 text-muted-foreground" />
            <h3 className="mt-3 text-base font-semibold">Paste your CFSR / HFSR values</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              From a debugger:{' '}
              <code className="rounded border bg-muted/40 px-1.5 py-0.5 font-mono text-[0.8em]">x/wx 0xE000ED28</code>
              {' '}reads CFSR;{' '}
              <code className="rounded border bg-muted/40 px-1.5 py-0.5 font-mono text-[0.8em]">0xE000ED2C</code>
              {' '}reads HFSR. Or read them inside your HardFault handler.
            </p>
          </div>
        )}

        {hasAnyInput && allSet.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <h3 className="text-base font-semibold">No fault bits set</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              CFSR={cfsr || '0'}, HFSR={hfsr || '0'}. If you're sure a fault fired, double-check you read the
              right addresses and didn't clear the registers (they're W1C).
            </p>
          </div>
        )}

        {allSet.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="rounded-lg border bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-sm font-semibold tracking-tight">Decoded result</h2>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                  {cfsrVal !== 0 && <span>CFSR={formatHex(cfsrVal)}</span>}
                  {hfsrVal !== 0 && <span>HFSR={formatHex(hfsrVal)}</span>}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">{allSet.length}</span>{' '}
                fault bit{allSet.length === 1 ? '' : 's'} set.{' '}
                {escalated && (
                  <span>
                    HFSR.FORCED is set, meaning a configurable fault escalated to HardFault. The actual cause is
                    in the CFSR bits below.
                  </span>
                )}
              </p>
            </div>

            {/* Bit cards */}
            {allSet.map((b) => {
              const s = severityStyles[b.severity];
              const Icon = s.icon;
              const addr = b.companion === 'MMFAR' ? mmfar : b.companion === 'BFAR' ? bfar : null;
              return (
                <div key={`${b.reg}.${b.name}`} className={cn('rounded-lg border p-4 sm:p-5', s.ring, s.bg)}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-md border bg-background', s.color, s.ring)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h3 className={cn('font-semibold tracking-tight', s.color)}>{b.name}</h3>
                          <span className="font-mono text-xs text-muted-foreground">{b.sub} · bit {b.bit}</span>
                        </div>
                        <div className="text-sm text-foreground">{b.full}</div>
                      </div>
                    </div>
                    <span className={cn('shrink-0 rounded border bg-background px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider', s.color, s.ring)}>
                      {b.severity}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div>
                      <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">What it means</dt>
                      <dd className="mt-0.5 leading-relaxed">{b.meaning}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Likely cause</dt>
                      <dd className="mt-0.5 leading-relaxed text-muted-foreground">{b.cause}</dd>
                    </div>
                    {b.companion && addr && parseHex(addr) !== null && (
                      <div>
                        <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Faulting address ({b.companion})</dt>
                        <dd className="mt-0.5 font-mono text-foreground">{formatHex(parseHex(addr)!)}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
