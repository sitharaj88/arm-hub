'use client';

import { useMemo, useState } from 'react';
import { Layers, Info } from 'lucide-react';
import { parseHex, formatHex } from '@/lib/fault-bits';
import { cn } from '@/lib/utils';

type WordSpec = {
  offset: number;     // bytes from initial SP
  name: string;
  meaning: string;
  decoder?: (v: number) => { label: string; value: string }[];
};

const baseFrame: WordSpec[] = [
  { offset: 0,  name: 'R0',   meaning: 'General-purpose register R0 at exception entry (first arg / caller-saved).' },
  { offset: 4,  name: 'R1',   meaning: 'General-purpose register R1 (second arg / caller-saved).' },
  { offset: 8,  name: 'R2',   meaning: 'General-purpose register R2 (third arg / caller-saved).' },
  { offset: 12, name: 'R3',   meaning: 'General-purpose register R3 (fourth arg / caller-saved).' },
  { offset: 16, name: 'R12',  meaning: 'Intra-procedure scratch (IP). Caller-saved.' },
  {
    offset: 20, name: 'LR',
    meaning: 'Link register at exception entry — the return address the interrupted code expected to return to.',
    decoder: (v) => [{ label: 'Address', value: formatHex(v) }],
  },
  {
    offset: 24, name: 'PC',
    meaning: 'Return address — the address of the next instruction to execute on return. Often the faulting instruction itself for precise faults.',
    decoder: (v) => [
      { label: 'Address', value: formatHex(v) },
      { label: 'Thumb bit', value: (v & 1) ? '1 — return as Thumb (normal)' : '0 — INVSTATE will fire on return!' },
    ],
  },
  {
    offset: 28, name: 'xPSR',
    meaning: 'Program Status Register — IPSR (exception #), APSR (flags), EPSR (Thumb / IT state).',
    decoder: (v) => {
      const ipsr = v & 0x1FF;
      const t = (v >> 24) & 1;
      const n = (v >> 31) & 1;
      const z = (v >> 30) & 1;
      const c = (v >> 29) & 1;
      const vBit = (v >> 28) & 1;
      const q = (v >> 27) & 1;
      const excName =
        ipsr === 0 ? 'thread mode' :
        ipsr === 1 ? 'reset' :
        ipsr === 2 ? 'NMI' :
        ipsr === 3 ? 'HardFault' :
        ipsr === 4 ? 'MemManage' :
        ipsr === 5 ? 'BusFault' :
        ipsr === 6 ? 'UsageFault' :
        ipsr === 7 ? 'SecureFault (v8-M)' :
        ipsr === 11 ? 'SVCall' :
        ipsr === 12 ? 'DebugMonitor' :
        ipsr === 14 ? 'PendSV' :
        ipsr === 15 ? 'SysTick' :
        ipsr >= 16 ? `IRQ${ipsr - 16}` : 'reserved';
      return [
        { label: 'IPSR (exception #)', value: `${ipsr} · ${excName}` },
        { label: 'T bit', value: t ? '1 (Thumb — normal)' : '0 — invalid for Cortex-M' },
        { label: 'NZCV', value: `N=${n} Z=${z} C=${c} V=${vBit}` },
        { label: 'Q (saturation)', value: q ? '1 — sticky' : '0' },
      ];
    },
  },
];

// FPU lazy frame additions (S0–S15 + FPSCR + reserved) — append when withFpu = true
const fpuFrame: WordSpec[] = Array.from({ length: 16 }, (_, i) => ({
  offset: 32 + i * 4,
  name: `S${i}`,
  meaning: `Single-precision FPU register S${i} (lazily stacked on exception entry with FPU active).`,
  decoder: (v) => {
    const f = new Float32Array(new Uint32Array([v >>> 0]).buffer)[0];
    return [
      { label: 'As u32', value: formatHex(v) },
      { label: 'As float', value: Number.isFinite(f) ? f.toString() : String(f) },
    ];
  },
}));
fpuFrame.push({
  offset: 96, name: 'FPSCR',
  meaning: 'Floating-point status/control register.',
  decoder: (v) => {
    const n = (v >> 31) & 1, z = (v >> 30) & 1, c = (v >> 29) & 1, vBit = (v >> 28) & 1;
    return [
      { label: 'NZCV', value: `N=${n} Z=${z} C=${c} V=${vBit}` },
      { label: 'Exception flags', value: ['IOC','DZC','OFC','UFC','IXC','IDC'].filter((_, i) => v & (1 << i)).join(' ') || 'none' },
    ];
  },
});
fpuFrame.push({
  offset: 100, name: '(reserved)',
  meaning: 'Reserved word for 8-byte alignment of the FPU frame. Hardware-stacked but not used.',
});

const sampleDumps: { label: string; words: string[] }[] = [
  {
    label: 'Bus fault, precise — wrote to 0xDEADBEEF',
    words: ['0xDEADBEEF', '0x00000000', '0x20000200', '0x12345678', '0x00000000', '0x080012CD', '0x080012E4', '0x21000200'],
  },
  {
    label: 'INVSTATE — return PC missing Thumb bit',
    words: ['0x00000001', '0x00000002', '0x00000003', '0x00000004', '0x0000000C', '0x080012CD', '0x08001200', '0x01000000'],
  },
];

export function StackFrameVisualizer() {
  const [withFpu, setWithFpu] = useState(false);
  const [sp, setSp] = useState('0x20007FE0');
  const [words, setWords] = useState<string[]>(Array(8).fill(''));

  const wordSpecs = useMemo(() => (withFpu ? [...baseFrame, ...fpuFrame] : baseFrame), [withFpu]);

  function updateWord(i: number, v: string) {
    setWords((prev) => {
      const next = [...prev];
      while (next.length <= i) next.push('');
      next[i] = v;
      return next;
    });
  }
  function loadSample(words: string[]) {
    setWithFpu(false);
    setWords([...words]);
  }

  const baseSp = parseHex(sp) ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      {/* INPUT */}
      <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold tracking-tight">Stacked words</h2>
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={withFpu}
                onChange={(e) => setWithFpu(e.target.checked)}
                className="rounded border-border accent-primary"
              />
              FPU frame
            </label>
          </div>

          <label className="block mb-3">
            <span className="mb-1 block text-xs font-medium">SP at entry</span>
            <input
              value={sp}
              onChange={(e) => setSp(e.target.value)}
              spellCheck={false}
              className="w-full rounded-md border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0x20007FE0"
            />
          </label>

          <div className="space-y-1.5">
            {wordSpecs.map((spec, i) => (
              <div key={spec.offset} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground text-right">
                  +{spec.offset.toString().padStart(2, '0')}
                </span>
                <input
                  value={words[i] ?? ''}
                  onChange={(e) => updateWord(i, e.target.value)}
                  placeholder="0x00000000"
                  spellCheck={false}
                  className={cn(
                    'rounded-md border bg-background px-2 py-1 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring',
                    words[i] && parseHex(words[i]) === null && 'border-destructive text-destructive',
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <div className="mb-3 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Try a sample</div>
          <ul className="space-y-1.5 text-sm">
            {sampleDumps.map((s) => (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => loadSample(s.words)}
                  className="block w-full rounded-md border bg-background/40 px-3 py-1.5 text-left transition-colors hover:bg-muted/40 hover:border-primary/30"
                >
                  {s.label}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setWords(Array(wordSpecs.length).fill(''))}
                className="mt-1 w-full rounded-md border bg-background/40 px-3 py-1.5 text-center text-xs text-muted-foreground hover:bg-muted/40"
              >
                Clear
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* RESULT */}
      <div className="min-w-0 space-y-3">
        {wordSpecs.map((spec, i) => {
          const raw = words[i] ?? '';
          const parsed = parseHex(raw);
          const isPC = spec.name === 'PC';
          const pcWarn = isPC && parsed !== null && (parsed & 1) === 0;
          return (
            <div key={spec.offset} className={cn('rounded-lg border bg-card p-4', pcWarn && 'border-destructive/50 bg-destructive/4')}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border bg-muted/40 font-mono text-[0.65rem] text-muted-foreground">
                    +{spec.offset.toString().padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="font-semibold tracking-tight">{spec.name}</h3>
                      <span className="font-mono text-[0.65rem] text-muted-foreground">
                        SP + {spec.offset}  →  {formatHex(baseSp + spec.offset)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{spec.meaning}</div>
                  </div>
                </div>
                <div className="font-mono text-sm">
                  {parsed !== null ? (
                    <span className={cn(pcWarn && 'text-destructive font-medium')}>{formatHex(parsed)}</span>
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </div>
              </div>
              {parsed !== null && spec.decoder && (
                <dl className="mt-3 grid gap-1 rounded-md border bg-background/40 p-3 text-sm sm:grid-cols-2">
                  {spec.decoder(parsed).map((kv) => (
                    <div key={kv.label} className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{kv.label}</dt>
                      <dd className="font-mono text-xs text-foreground truncate">{kv.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {pcWarn && (
                <div className="mt-3 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>PC's low bit is 0 — branching here will trigger an INVSTATE UsageFault. Cortex-M expects Thumb-mode (LSB=1).</span>
                </div>
              )}
            </div>
          );
        })}

        <div className="rounded-lg border bg-card p-4 sm:p-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground">
            <Layers className="h-4 w-4" />
            <span className="font-semibold tracking-tight">About this frame</span>
          </div>
          <p className="mt-2 leading-relaxed">
            On exception entry, the Cortex-M hardware automatically stacks 8 words onto the current stack:
            R0–R3, R12, LR, PC, xPSR. If the FPU is active and FPCCR.ASPEN=1, it also stacks S0–S15 + FPSCR
            ({withFpu ? 'shown' : 'toggle "FPU frame" to add'}). The handler runs with a fresh AAPCS frame
            on top of this, and EXC_RETURN encodes which stack to unstack from on return.
          </p>
        </div>
      </div>
    </div>
  );
}
