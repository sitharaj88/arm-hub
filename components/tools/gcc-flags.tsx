'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowUpRight, Terminal as TerminalIcon } from 'lucide-react';
import { categoryColours, categoryLabels, parseGccCommand, type FlagCategory } from '@/lib/gcc-flags';
import { cn } from '@/lib/utils';

const exampleCommands = [
  {
    label: 'STM32F411 (M4F) hard-float',
    cmd: 'arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -mfpu=fpv4-sp-d16 -mfloat-abi=hard -Os -g -ffunction-sections -fdata-sections -Wall -Wextra -Werror -Wl,--gc-sections -Wl,-Map=firmware.map -T linker.ld --specs=nano.specs --specs=nosys.specs -DSTM32F411xE -Iinclude src/main.c -o build/firmware.elf',
  },
  {
    label: 'STM32H7 (M7) production build',
    cmd: 'arm-none-eabi-gcc -mcpu=cortex-m7 -mthumb -mfpu=fpv5-d16 -mfloat-abi=hard -O2 -flto -g -ffunction-sections -fdata-sections -Wall -Wextra -Wl,--gc-sections -Wl,-Map=out.map -nostartfiles --specs=nano.specs -T STM32H743.ld src/main.c -o out.elf',
  },
  {
    label: 'Cortex-M33 TrustZone',
    cmd: 'arm-none-eabi-gcc -mcpu=cortex-m33 -mthumb -mfpu=fpv5-sp-d16 -mfloat-abi=hard -mcmse -mbranch-protection=standard -O2 -g -ffunction-sections -fdata-sections -Wall -Wl,--gc-sections -DCORE_CM33 src/secure.c -o secure.o',
  },
  {
    label: 'C++ embedded build',
    cmd: 'arm-none-eabi-g++ -mcpu=cortex-m4 -mthumb -std=c++17 -fno-exceptions -fno-rtti -fno-threadsafe-statics -fno-use-cxa-atexit -Os -ffunction-sections -fdata-sections -Wl,--gc-sections src/app.cpp -o app.o',
  },
];

export function GccFlagExplainer() {
  const [cmd, setCmd] = useState('');

  const parsed = useMemo(() => parseGccCommand(cmd), [cmd]);
  const matched = parsed.filter((p) => p.kind === 'matched');
  const unknown = parsed.filter((p) => p.kind === 'unknown');

  // Group by category for the summary
  const grouped = useMemo(() => {
    const m = new Map<FlagCategory, number>();
    matched.forEach((p) => {
      if (p.kind === 'matched') {
        m.set(p.spec.category, (m.get(p.spec.category) ?? 0) + 1);
      }
    });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [matched]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,1fr)]">
      {/* INPUT */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <label className="block">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <TerminalIcon className="h-4 w-4" />
              <span>Paste a GCC command</span>
            </div>
            <textarea
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              placeholder="arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -O2 …"
              rows={10}
              spellCheck={false}
              className="w-full rounded-md border bg-background p-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <div className="mt-5 rounded-lg border bg-card p-4 sm:p-5">
          <div className="mb-3 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Try an example</div>
          <ul className="space-y-1.5 text-sm">
            {exampleCommands.map((ex) => (
              <li key={ex.label}>
                <button
                  type="button"
                  onClick={() => setCmd(ex.cmd)}
                  className="block w-full rounded-md border bg-background/40 px-3 py-1.5 text-left transition-colors hover:bg-muted/40 hover:border-primary/30"
                >
                  {ex.label}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setCmd('')}
                className="mt-1 w-full rounded-md border bg-background/40 px-3 py-1.5 text-center text-xs text-muted-foreground hover:bg-muted/40"
              >
                Clear
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* OUTPUT */}
      <div className="min-w-0 space-y-4">
        {parsed.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <TerminalIcon className="mx-auto h-6 w-6 text-muted-foreground" />
            <h3 className="mt-3 text-base font-semibold">Paste a build command</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Most flags from <code className="font-mono">arm-none-eabi-gcc</code> are recognised — CPU target, FPU
              type, optimisation level, linker scripts, C++ ABI options, warnings, and more. Unknown flags are
              flagged so you can dig deeper.
            </p>
          </div>
        )}

        {parsed.length > 0 && (
          <>
            {/* Summary */}
            <div className="rounded-lg border bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-sm font-semibold tracking-tight">
                  <span className="tabular">{matched.length}</span> recognised, {' '}
                  <span className="tabular">{unknown.length}</span> unknown
                </h2>
              </div>
              {grouped.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {grouped.map(([cat, count]) => (
                    <span key={cat} className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider', categoryColours[cat])}>
                      {categoryLabels[cat]} <span className="tabular text-[0.6rem] opacity-80">×{count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Each flag */}
            <ul className="space-y-2.5">
              {parsed.map((p, i) => {
                if (p.kind === 'matched') {
                  const tone = categoryColours[p.spec.category];
                  return (
                    <li key={`${i}-${p.raw}`} className={cn('rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30', tone)}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <code className="font-mono text-sm font-semibold">{p.raw}</code>
                          <div className="mt-1 text-sm text-foreground/90">{p.spec.label}</div>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.spec.effect}</p>
                          {p.spec.docHref && (
                            <Link href={p.spec.docHref} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-glow">
                              Read more <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                        <span className={cn('shrink-0 rounded border bg-background px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider', tone)}>
                          {categoryLabels[p.spec.category]}
                        </span>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={`${i}-${p.raw}`} className="rounded-lg border border-dashed bg-card/50 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <code className="font-mono text-sm">{p.raw}</code>
                      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">unknown</span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Not in the catalogue — likely a path, source filename, vendor-specific macro, or a flag we
                      haven&apos;t catalogued yet.
                    </p>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
