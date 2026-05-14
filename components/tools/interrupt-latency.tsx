'use client';

import { useMemo, useState } from 'react';
import { Cpu, Layers, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

type Core = 'M0' | 'M0+' | 'M3' | 'M4' | 'M7' | 'M33' | 'M55' | 'M85';
type StackLoc = 'tcm' | 'sram-nc' | 'sram-c';
type VectorLoc = 'tcm' | 'flash-zero-wait' | 'flash-wait';

const coreInfo: Record<Core, { name: string; baseStack: number; baseEntry: number; tailChain: number; lateArr: number; hasCache: boolean; hasTcm: boolean }> = {
  // baseStack = "ideal-memory" cycles to push the 8 hardware-stacked words
  // baseEntry = total ideal entry latency (incl. vector fetch + pipeline) on zero-wait memory
  // tailChain = tail-chain latency
  // lateArr   = late-arriving exception cost
  M0:    { name: 'Cortex-M0',  baseStack: 8,  baseEntry: 16, tailChain: 6,  lateArr: 8,  hasCache: false, hasTcm: false },
  'M0+': { name: 'Cortex-M0+', baseStack: 8,  baseEntry: 15, tailChain: 6,  lateArr: 8,  hasCache: false, hasTcm: false },
  M3:    { name: 'Cortex-M3',  baseStack: 8,  baseEntry: 12, tailChain: 6,  lateArr: 7,  hasCache: false, hasTcm: false },
  M4:    { name: 'Cortex-M4',  baseStack: 8,  baseEntry: 12, tailChain: 6,  lateArr: 7,  hasCache: false, hasTcm: false },
  M7:    { name: 'Cortex-M7',  baseStack: 8,  baseEntry: 12, tailChain: 6,  lateArr: 7,  hasCache: true,  hasTcm: true  },
  M33:   { name: 'Cortex-M33', baseStack: 8,  baseEntry: 12, tailChain: 6,  lateArr: 7,  hasCache: false, hasTcm: false },
  M55:   { name: 'Cortex-M55', baseStack: 8,  baseEntry: 12, tailChain: 6,  lateArr: 7,  hasCache: true,  hasTcm: true  },
  M85:   { name: 'Cortex-M85', baseStack: 8,  baseEntry: 11, tailChain: 6,  lateArr: 6,  hasCache: true,  hasTcm: true  },
};

const stackLocPenalty: Record<StackLoc, number> = {
  'tcm':     0,
  'sram-nc': 1, // ~1 cycle per word for typical AHB
  'sram-c':  0, // assume cache-hit best case
};

const vectorLocPenalty: Record<VectorLoc, number> = {
  'tcm':             0,
  'flash-zero-wait': 0,
  'flash-wait':      3, // typical flash wait-states
};

function fmt(c: number, clockMHz: number) {
  const us = c / clockMHz;
  if (us < 1) return `${(us * 1000).toFixed(1)} ns`;
  if (us < 1000) return `${us.toFixed(2)} µs`;
  return `${(us / 1000).toFixed(2)} ms`;
}

export function InterruptLatency() {
  const [core, setCore] = useState<Core>('M4');
  const [clockMHz, setClockMHz] = useState(168);
  const [stackLoc, setStackLoc] = useState<StackLoc>('sram-c');
  const [vectorLoc, setVectorLoc] = useState<VectorLoc>('flash-zero-wait');
  const [fpuActive, setFpuActive] = useState(false);
  const [lazy, setLazy] = useState(true);
  const [memoryWait, setMemoryWait] = useState(0);

  const info = coreInfo[core];

  // Build itemised cycle budget
  const items = useMemo(() => {
    const list: { label: string; detail: string; cycles: number }[] = [];

    // Pipeline recognise + start
    list.push({ label: 'Detect & start', detail: 'NVIC recognises pending exception', cycles: 2 });

    // Stack 8 words
    list.push({
      label: 'Stack R0–R3, R12, LR, PC, xPSR',
      detail: `8 word push to ${stackLoc === 'tcm' ? 'DTCM' : stackLoc === 'sram-nc' ? 'non-cacheable SRAM' : 'cacheable SRAM'}`,
      cycles: info.baseStack + stackLocPenalty[stackLoc] * 8,
    });

    // FPU lazy stacking
    if (fpuActive && info.hasTcm) {
      list.push({
        label: lazy ? 'FPU lazy frame reserved' : 'FPU eager stack S0–S15 + FPSCR',
        detail: lazy ? '17-word slot reserved on stack; deferred until handler touches FPU' : '17 additional words pushed unconditionally',
        cycles: lazy ? 0 : 17 + stackLocPenalty[stackLoc] * 17,
      });
    } else if (fpuActive) {
      list.push({
        label: lazy ? 'FPU lazy frame reserved' : 'FPU eager stack S0–S15 + FPSCR',
        detail: lazy ? 'space reserved, not pushed' : '17 word push',
        cycles: lazy ? 0 : 17,
      });
    }

    // Vector fetch
    list.push({
      label: 'Vector fetch',
      detail: `read handler address from vector table (${vectorLoc === 'tcm' ? 'ITCM' : vectorLoc === 'flash-zero-wait' ? 'flash, 0WS' : 'flash, wait-states'})`,
      cycles: 2 + vectorLocPenalty[vectorLoc],
    });

    // Pipeline refill
    list.push({
      label: 'Pipeline refill at handler',
      detail: 'fetch first handler instruction',
      cycles: 2 + memoryWait,
    });

    return list;
  }, [info, stackLoc, vectorLoc, fpuActive, lazy, memoryWait]);

  const totalCycles = items.reduce((s, i) => s + i.cycles, 0);
  const tailCycles = info.tailChain + (fpuActive && !lazy ? 17 : 0);
  const lateCycles = info.lateArr;

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      {/* CONFIG */}
      <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold tracking-tight">Core & memory</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <div className="mb-1 text-xs font-medium">Core</div>
              <select value={core} onChange={(e) => setCore(e.target.value as Core)} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {Object.entries(coreInfo).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-xs font-medium">Clock</span>
                <span className="font-mono text-xs text-muted-foreground">{clockMHz} MHz</span>
              </div>
              <input type="range" min={8} max={600} step={8} value={clockMHz} onChange={(e) => setClockMHz(Number(e.target.value))} className="w-full accent-primary" />
            </label>

            <label className="block">
              <div className="mb-1 text-xs font-medium">Stack region</div>
              <select value={stackLoc} onChange={(e) => setStackLoc(e.target.value as StackLoc)} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {info.hasTcm && <option value="tcm">DTCM (single-cycle)</option>}
                <option value="sram-c">SRAM cacheable (warm cache)</option>
                <option value="sram-nc">SRAM non-cacheable</option>
              </select>
            </label>

            <label className="block">
              <div className="mb-1 text-xs font-medium">Vector table</div>
              <select value={vectorLoc} onChange={(e) => setVectorLoc(e.target.value as VectorLoc)} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {info.hasTcm && <option value="tcm">ITCM (single-cycle)</option>}
                <option value="flash-zero-wait">Flash · 0 wait-states</option>
                <option value="flash-wait">Flash · with wait-states</option>
              </select>
            </label>

            <label className="block">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-xs font-medium">Memory wait-states (at handler)</span>
                <span className="font-mono text-xs text-muted-foreground">{memoryWait} cyc</span>
              </div>
              <input type="range" min={0} max={5} step={1} value={memoryWait} onChange={(e) => setMemoryWait(Number(e.target.value))} className="w-full accent-primary" />
            </label>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold tracking-tight">FPU</h2>
          <div className="mt-4 space-y-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={fpuActive} onChange={(e) => setFpuActive(e.target.checked)} className="rounded border-border accent-primary" />
              <span>FPU active in interrupted code</span>
            </label>
            <label className={cn('flex items-center gap-2', !fpuActive && 'opacity-50 pointer-events-none')}>
              <input type="checkbox" checked={lazy} onChange={(e) => setLazy(e.target.checked)} className="rounded border-border accent-primary" disabled={!fpuActive} />
              <span>Lazy stacking enabled (FPCCR.LSPEN)</span>
            </label>
            <div className="text-xs text-muted-foreground">
              {fpuActive
                ? lazy
                  ? 'Space reserved for S0–S15 + FPSCR but not pushed until the handler issues an FPU instruction.'
                  : 'FPU registers pushed unconditionally — adds 17 cycles to every entry.'
                : 'No FPU push on entry.'}
            </div>
          </div>
        </div>
      </div>

      {/* RESULT */}
      <div className="min-w-0 space-y-4">
        {/* Headline number */}
        <div className="rounded-lg border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <div className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Worst-case entry latency</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="tabular text-4xl font-semibold tracking-tight">{totalCycles}</span>
                <span className="text-muted-foreground">cycles</span>
                <span className="ml-3 tabular text-base text-muted-foreground">≈ {fmt(totalCycles, clockMHz)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-right">
              <div>
                <div className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">Tail-chain</div>
                <div className="tabular text-lg font-semibold">{tailCycles} cyc</div>
                <div className="text-xs text-muted-foreground">{fmt(tailCycles, clockMHz)}</div>
              </div>
              <div>
                <div className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">Late-arrive</div>
                <div className="tabular text-lg font-semibold">{lateCycles} cyc</div>
                <div className="text-xs text-muted-foreground">{fmt(lateCycles, clockMHz)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Itemised breakdown */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="border-b bg-muted/40 px-4 py-2.5 flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-tight">Cycle breakdown</h2>
          </div>
          <ol>
            {items.map((it, i) => (
              <li key={i} className="grid grid-cols-[2rem_minmax(0,1fr)_5rem] items-center gap-3 border-t px-4 py-3 first:border-t-0">
                <span className="tabular text-right text-xs font-mono text-muted-foreground">{i + 1}.</span>
                <div>
                  <div className="text-sm font-medium">{it.label}</div>
                  <div className="text-xs text-muted-foreground">{it.detail}</div>
                </div>
                <span className="tabular text-right font-mono text-sm">{it.cycles} cyc</span>
              </li>
            ))}
            <li className="grid grid-cols-[2rem_minmax(0,1fr)_5rem] items-center gap-3 border-t bg-muted/20 px-4 py-3">
              <span></span>
              <div className="text-sm font-semibold">Total</div>
              <span className="tabular text-right font-mono text-sm font-semibold">{totalCycles} cyc</span>
            </li>
          </ol>
        </div>

        {/* Context */}
        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold tracking-tight">What this means</span>
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            <li><span className="font-medium text-foreground">Entry:</span> cycles between the IRQ asserting and the first instruction of the handler running.</li>
            <li><span className="font-medium text-foreground">Tail-chain:</span> if another exception is pending when this one finishes, the CPU skips unstack/restack and jumps straight to the next handler.</li>
            <li><span className="font-medium text-foreground">Late-arrive:</span> if a higher-priority exception arrives mid-stacking, the CPU switches to that handler without re-stacking.</li>
            <li>FPU lazy stacking (FPCCR.LSPEN=1) is on by default in CMSIS. Disable it only when you need predictable timing on FPU-using handlers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
