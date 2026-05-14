'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Cortex-M priority split — given:
 *   N = __NVIC_PRIO_BITS (3..8, the implemented bits — vendor-fixed)
 *   G = PRIGROUP (0..7, in SCB->AIRCR.PRIGROUP)
 *
 * The 8-bit priority byte is laid out as:
 *   [ N implemented bits | (8-N) unimplemented (read-as-zero) ]
 * Inside the N implemented bits:
 *   [ preempt bits | subpriority bits ]
 *
 * preempt_bits = max(0, 7 - G) clamped to N
 * sub_bits     = N - preempt_bits
 */

type Irq = {
  id: string;
  name: string;
  /** Priority byte (0–255). Lower = higher priority. */
  priority: number;
};

function preemptBitsOf(N: number, G: number): number {
  return Math.min(N, Math.max(0, 7 - G));
}

function split(N: number, G: number, priorityByte: number) {
  const impl = (priorityByte >> (8 - N)) & ((1 << N) - 1);
  const preBits = preemptBitsOf(N, G);
  const subBits = N - preBits;
  const preempt = subBits === 0 ? impl : impl >> subBits;
  const sub = subBits === 0 ? 0 : impl & ((1 << subBits) - 1);
  const preemptLevels = 1 << preBits;
  const subLevels = subBits === 0 ? 1 : 1 << subBits;
  return { impl, preBits, subBits, preempt, sub, preemptLevels, subLevels };
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const defaultIrqs: Irq[] = [
  { id: uid(), name: 'TIM1_IRQ',    priority: 0x10 },
  { id: uid(), name: 'USART2_IRQ',  priority: 0x40 },
  { id: uid(), name: 'EXTI0_IRQ',   priority: 0x40 },
  { id: uid(), name: 'SysTick',     priority: 0xF0 },
  { id: uid(), name: 'PendSV',      priority: 0xF0 },
];

const groupSeverity: Record<'high' | 'mid' | 'low' | 'idle', string> = {
  high: 'text-destructive border-destructive/30 bg-destructive/10',
  mid:  'text-warning border-warning/30 bg-warning/10',
  low:  'text-accent border-accent/30 bg-accent/10',
  idle: 'text-muted-foreground border-border bg-muted/30',
};

function severityForPreempt(p: number): keyof typeof groupSeverity {
  if (p === 0) return 'high';
  if (p <= 1) return 'mid';
  if (p <= 4) return 'low';
  return 'idle';
}

export function NvicSimulator() {
  const [bits, setBits] = useState(4); // typical STM32F4
  const [prigroup, setPrigroup] = useState(3); // all preempt
  const [irqs, setIrqs] = useState<Irq[]>(defaultIrqs);

  const { preBits, subBits, preemptLevels, subLevels } = useMemo(() => split(bits, prigroup, 0), [bits, prigroup]);

  // Compute split per IRQ + sort
  const decoded = useMemo(() => {
    return irqs
      .map((i) => ({ irq: i, ...split(bits, prigroup, i.priority) }))
      .sort((a, b) => (a.preempt - b.preempt) || (a.sub - b.sub));
  }, [irqs, bits, prigroup]);

  // Group by preempt level → execution chain when all fire at once
  const byPreempt = useMemo(() => {
    const m = new Map<number, typeof decoded>();
    decoded.forEach((d) => {
      if (!m.has(d.preempt)) m.set(d.preempt, []);
      m.get(d.preempt)!.push(d);
    });
    return Array.from(m.entries()).sort((a, b) => a[0] - b[0]);
  }, [decoded]);

  function addIrq() {
    setIrqs((prev) => [...prev, { id: uid(), name: `IRQ${prev.length + 1}`, priority: 0x80 }]);
  }
  function delIrq(id: string) {
    setIrqs((prev) => prev.filter((i) => i.id !== id));
  }
  function updateIrq(id: string, patch: Partial<Irq>) {
    setIrqs((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
      {/* CONFIG + IRQ LIST */}
      <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold tracking-tight">NVIC configuration</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-xs font-medium">__NVIC_PRIO_BITS</span>
                <span className="font-mono text-xs text-muted-foreground">{bits} bits → {1 << bits} levels</span>
              </div>
              <input
                type="range" min={2} max={8} step={1}
                value={bits}
                onChange={(e) => setBits(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-[0.6rem] font-mono text-muted-foreground">
                <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
              </div>
              <div className="mt-2 text-[0.7rem] text-muted-foreground">
                Vendor-fixed. Common: STM32F0/L0 = 2, nRF52 = 3, STM32F1/F4 = 4.
              </div>
            </label>

            <label className="block">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-xs font-medium">PRIGROUP</span>
                <span className="font-mono text-xs text-muted-foreground">{prigroup}</span>
              </div>
              <input
                type="range" min={0} max={7} step={1}
                value={prigroup}
                onChange={(e) => setPrigroup(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-2 text-[0.7rem] text-muted-foreground">
                {preBits} preempt bit{preBits === 1 ? '' : 's'} ({preemptLevels} preempt levels) · {subBits} sub bit{subBits === 1 ? '' : 's'} ({subLevels} sub levels)
              </div>
            </label>
          </div>

          {/* Priority byte visualisation */}
          <div className="mt-5">
            <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Priority byte layout</div>
            <div className="grid grid-cols-8 gap-0.5">
              {Array.from({ length: 8 }).map((_, i) => {
                const bit = 7 - i;
                const isImpl = bit >= 8 - bits;
                const isPreempt = isImpl && bit >= 8 - bits + subBits;
                const isSub = isImpl && !isPreempt;
                return (
                  <div
                    key={bit}
                    className={cn(
                      'rounded-sm border py-2 text-center font-mono text-[0.6rem]',
                      !isImpl && 'border-dashed border-muted-foreground/30 bg-muted/20 text-muted-foreground/50',
                      isPreempt && 'border-primary/40 bg-primary/15 text-primary',
                      isSub && 'border-accent/40 bg-accent/15 text-accent',
                    )}
                    title={`bit ${bit}`}
                  >
                    {bit}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[0.6rem] font-mono uppercase tracking-wider text-muted-foreground">
              <span className="text-primary">preempt</span>
              <span className="text-accent">sub</span>
              <span>unused</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold tracking-tight">IRQ sources</h2>
            <button
              type="button"
              onClick={addIrq}
              className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>
          <div className="space-y-1.5">
            {irqs.map((i) => (
              <div key={i.id} className="grid grid-cols-[1fr_4.5rem_2rem] items-center gap-1.5">
                <input
                  value={i.name}
                  onChange={(e) => updateIrq(i.id, { name: e.target.value })}
                  className="rounded-md border bg-background px-2 py-1 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  value={'0x' + i.priority.toString(16).padStart(2, '0').toUpperCase()}
                  onChange={(e) => {
                    const v = parseInt(e.target.value.replace(/^0x/i, ''), 16);
                    if (!Number.isNaN(v)) updateIrq(i.id, { priority: Math.min(255, Math.max(0, v)) });
                  }}
                  className="rounded-md border bg-background px-2 py-1 text-center font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => delIrq(i.id)}
                  className="rounded-md border bg-background px-1.5 py-1 text-muted-foreground hover:text-destructive hover:border-destructive/40"
                  aria-label={`Remove ${i.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {irqs.length === 0 && (
              <div className="rounded-md border border-dashed py-3 text-center text-xs text-muted-foreground">No IRQs configured.</div>
            )}
          </div>
        </div>
      </div>

      {/* RESULT */}
      <div className="min-w-0 space-y-4">
        {/* Sorted decoded list */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="border-b bg-muted/40 px-4 py-2.5 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold tracking-tight">Priority decode</h2>
            <span className="font-mono text-xs text-muted-foreground">sorted: highest priority first</span>
          </div>
          <div className="overflow-x-auto thin-scrollbar">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b bg-muted/20">
                  <th className="px-4 py-2">IRQ</th>
                  <th className="px-2 py-2">Priority byte</th>
                  <th className="px-2 py-2">Implemented</th>
                  <th className="px-2 py-2">Preempt</th>
                  <th className="px-2 py-2">Sub</th>
                  <th className="px-2 py-2">Severity</th>
                </tr>
              </thead>
              <tbody>
                {decoded.map((d) => {
                  const sev = severityForPreempt(d.preempt);
                  return (
                    <tr key={d.irq.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2 font-mono">{d.irq.name}</td>
                      <td className="px-2 py-2 font-mono text-xs">0x{d.irq.priority.toString(16).padStart(2, '0').toUpperCase()}</td>
                      <td className="px-2 py-2 font-mono text-xs">{d.impl} <span className="text-muted-foreground">/ {(1 << bits) - 1}</span></td>
                      <td className="px-2 py-2 font-mono text-xs">{d.preempt}</td>
                      <td className="px-2 py-2 font-mono text-xs">{d.sub}</td>
                      <td className="px-2 py-2"><span className={cn('inline-block rounded border px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider', groupSeverity[sev])}>{sev}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Execution chain when all fire at once */}
        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-tight">If all IRQs pend simultaneously</h2>
            <span className="font-mono text-xs text-muted-foreground">execution order ↓</span>
          </div>
          <ol className="mt-4 space-y-2">
            {byPreempt.map(([pre, list]) => (
              <li key={pre} className="rounded-md border bg-background/50 p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="font-mono text-xs">
                    <span className="text-primary">preempt {pre}</span>
                    {list.length > 1 && <span className="text-muted-foreground"> · {list.length} co-pending</span>}
                  </div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                    {list.length === 1 ? 'runs to completion' : 'serialised by sub-priority'}
                  </span>
                </div>
                <ul className="mt-2 grid gap-1.5 text-sm">
                  {list.map((d, i) => (
                    <li key={d.irq.id} className="flex items-baseline gap-2">
                      <span className="tabular w-6 text-right text-muted-foreground">{i + 1}.</span>
                      <span className="font-mono">{d.irq.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">(sub {d.sub})</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          {byPreempt.some(([, l]) => l.length > 1) && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 p-3 text-xs">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
              <div className="text-muted-foreground leading-relaxed">
                IRQs at the same <span className="font-semibold text-foreground">preempt level</span> can't preempt each other —
                whichever fires first runs to completion. Sub-priority only breaks the tie when they pend simultaneously.
              </div>
            </div>
          )}
        </div>

        {/* Preemption matrix */}
        {decoded.length >= 2 && (
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="border-b bg-muted/40 px-4 py-2.5">
              <h2 className="text-sm font-semibold tracking-tight">Preemption matrix</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Read as: "if <span className="font-mono text-foreground">row</span> is currently running, can{' '}
                <span className="font-mono text-foreground">column</span> preempt it?"
              </p>
            </div>
            <div className="overflow-x-auto thin-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-2"></th>
                    {decoded.map((d) => (
                      <th key={d.irq.id} className="px-2 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">{d.irq.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {decoded.map((row) => (
                    <tr key={row.irq.id} className="border-t">
                      <th className="px-2 py-2 text-left font-mono text-xs text-muted-foreground whitespace-nowrap">{row.irq.name}</th>
                      {decoded.map((col) => {
                        if (row.irq.id === col.irq.id) return <td key={col.irq.id} className="px-2 py-2 text-center text-muted-foreground/40">—</td>;
                        const canPreempt = col.preempt < row.preempt; // lower number = higher priority
                        return (
                          <td key={col.irq.id} className="px-2 py-2 text-center">
                            <span className={cn(
                              'inline-flex h-5 w-7 items-center justify-center rounded border font-mono text-[0.6rem] uppercase',
                              canPreempt ? 'border-primary/40 bg-primary/10 text-primary' : 'border-muted bg-muted/40 text-muted-foreground'
                            )}>
                              {canPreempt ? 'yes' : 'no'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
