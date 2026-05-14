import Link from 'next/link';
import { ArrowRight, AlertTriangle, FileCode, Layers, Search, Terminal, Timer, Workflow, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Interactive tools — armhub',
  description: 'Calculators, decoders, and wizards built for working firmware engineers — paste real hex values, get real answers.',
};

const tools = [
  {
    title: 'HardFault decoder',
    desc: 'Paste CFSR / HFSR / UFSR / BFSR hex values. Get the exact bits set, what each fault means, and what likely caused it.',
    href: '/tools/fault-decoder',
    icon: AlertTriangle,
    accent: 'destructive' as const,
    inputs: ['CFSR', 'HFSR', 'MMFAR', 'BFAR'],
    use: 'Triage Cortex-M HardFault crashes',
  },
  {
    title: 'Stack-frame visualizer',
    desc: 'Paste the 8 (or 25 with FPU) words an exception pushes onto the stack. See which is R0–R3, R12, LR, PC, xPSR, and decode each field.',
    href: '/tools/stack-frame',
    icon: Layers,
    accent: 'primary' as const,
    inputs: ['SP+0 … SP+28'],
    use: 'Read exception dumps and dead-stack memory',
  },
  {
    title: 'Find my MCU',
    desc: 'Filter by core, RAM, flash, radio, vendor and certifications. Surfaces the realistic STM32 / nRF / RP / NXP / SiLabs picks for your product.',
    href: '/tools/find-mcu',
    icon: Search,
    accent: 'accent' as const,
    inputs: ['core', 'memory', 'wireless', 'power'],
    use: 'Pick the right chip for a new design',
  },
  {
    title: 'GCC flag explainer',
    desc: "Paste an arm-none-eabi-gcc command. Every flag gets decoded with what it does, when you need it, and where in the docs to read more.",
    href: '/tools/gcc-flags',
    icon: Terminal,
    accent: 'highlight' as const,
    inputs: ['arm-none-eabi-gcc …'],
    use: "Demystify someone else's build command",
  },
  {
    title: 'NVIC priority simulator',
    desc: 'Configure __NVIC_PRIO_BITS + PRIGROUP, add IRQs, see exactly how the priority byte splits into preempt + sub-priority and which IRQ preempts which.',
    href: '/tools/nvic-simulator',
    icon: Workflow,
    accent: 'primary' as const,
    inputs: ['PRIGROUP', '__NVIC_PRIO_BITS', 'IRQ list'],
    use: 'Plan an interrupt priority scheme',
  },
  {
    title: 'Interrupt latency calculator',
    desc: 'Pick a core, clock, and where stack / vector table live. Get a cycle-by-cycle breakdown of exception entry, plus tail-chain and late-arrival numbers.',
    href: '/tools/interrupt-latency',
    icon: Timer,
    accent: 'accent' as const,
    inputs: ['core', 'clock MHz', 'memory regions', 'FPU'],
    use: 'Size real-time IRQ budgets',
  },
  {
    title: 'Linker script builder',
    desc: 'Configure FLASH / SRAM / ITCM / DTCM regions, stack and heap, vector-table placement. Generates a complete linker.ld with .isr_vector, .data load → run, and C++ ctor arrays.',
    href: '/tools/linker-script',
    icon: FileCode,
    accent: 'highlight' as const,
    inputs: ['regions', 'stack', 'heap', 'vector table'],
    use: 'Drop-in linker script for a new board',
  },
];

const tonePalette: Record<typeof tools[number]['accent'], { icon: string; ring: string }> = {
  primary:     { icon: 'text-primary bg-primary/10 border-primary/30',         ring: 'card-tint-primary' },
  accent:      { icon: 'text-accent bg-accent/10 border-accent/30',            ring: 'card-tint-accent' },
  highlight:   { icon: 'text-highlight bg-highlight/10 border-highlight/30',   ring: 'card-tint-primary' },
  destructive: { icon: 'text-destructive bg-destructive/10 border-destructive/30', ring: 'card-tint-primary' },
};

export default function ToolsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg pointer-events-none" aria-hidden />
        <div className="relative container py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-primary">
              <Wrench className="h-3 w-3" /> Interactive tools
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
              Paste real values. <span className="gradient-text">Get real answers.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Calculators and decoders for the questions you actually have at 3am — "why did my code HardFault?",
              "what does this build flag do?", "which Cortex-M for this product?". Built for working firmware
              engineers, not marketing.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-10 sm:py-14">
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((t) => {
            const tone = tonePalette[t.accent];
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn('group relative overflow-hidden rounded-lg border bg-card p-6 card-lift', tone.ring)}
              >
                <div className="flex items-start gap-4">
                  <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-lg border', tone.icon)}>
                    <t.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-base font-semibold tracking-tight">{t.title}</h2>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.65rem] font-mono uppercase tracking-wider text-muted-foreground">
                      <span className={cn('rounded border px-1.5 py-0.5', tone.icon)}>{t.use}</span>
                      {t.inputs.map((i) => (
                        <span key={i} className="rounded border bg-muted/40 px-1.5 py-0.5">{i}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 rounded-lg border bg-card p-5">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">More tools coming</div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            SVD register browser · DMA stream planner · CMSIS-Pack diff · Power-budget estimator.
            Reach out via <a href="https://github.com/sitharaj88/armhub" className="text-primary hover:text-primary-glow" target="_blank" rel="noopener">GitHub</a> if there&apos;s a calculator you wish existed.
          </p>
        </div>
      </section>
    </>
  );
}
