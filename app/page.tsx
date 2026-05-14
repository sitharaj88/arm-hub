import Link from 'next/link';
import { ArrowRight, BookOpen, Cpu, Layers, Map, Network, Shield, Sparkles, Wrench, Zap } from 'lucide-react';
import { codeToHtml } from 'shiki';
import { sections } from '@/lib/nav';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CoreCompare } from '@/components/mdx/core-compare';

const systemHighlights = [
  { title: 'Wi-Fi router (Wi-Fi 6)',     desc: 'Quad Cortex-A53 + dedicated MAC/PHY + NPU offload. Linux/OpenWrt.',       href: '/docs/systems/wifi-router',              accent: 'primary' },
  { title: 'Smartwatch / tracker',       desc: 'Dual Cortex-M33 SoC. 5–15 day battery, BLE GATT services.',                href: '/docs/systems/smartwatch',               accent: 'accent' },
  { title: 'Drone flight controller',    desc: 'Cortex-M7 @ 480 MHz. 8 kHz attitude loop, PX4/ArduPilot.',                 href: '/docs/systems/drone-flight-controller',   accent: 'highlight' },
  { title: 'EV charger',                 desc: 'Cortex-M7 + Wi-Fi MCU. J1772 control pilot, RCD, OCPP cloud.',             href: '/docs/systems/ev-charger',                accent: 'primary' },
  { title: 'Smart thermostat',           desc: 'Cortex-M33 + Thread/Matter radio. Power-stealing, LVGL UI.',               href: '/docs/systems/smart-thermostat',          accent: 'accent' },
  { title: 'Automotive ECU',             desc: 'Cortex-R52 lockstep. CAN-FD, ISO 26262, AUTOSAR Classic.',                 href: '/docs/systems/automotive-ecu',            accent: 'highlight', badge: 'ASIL' },
] as const;

type Accent = 'primary' | 'accent' | 'highlight';

const features = [
  { icon: Layers,  title: 'Architecture, end to end', desc: 'ARMv6-M through ARMv9-A. Exception model, memory ordering, TrustZone.', href: '/docs/architecture/isa-family', accent: 'primary'   as Accent },
  { icon: Cpu,     title: 'Every Cortex-M, compared',  desc: 'M0 to M85 — sortable table, deep-dives on NVIC, SysTick, MPU.',         href: '/docs/cortex-m/lineup',         accent: 'accent'    as Accent },
  { icon: Network, title: 'Peripherals that ship',     desc: 'GPIO, UART, SPI, I²C, CAN, DMA, USB. Patterns and traps that bite at 3am.', href: '/docs/peripherals/gpio',    accent: 'highlight' as Accent },
  { icon: Shield,  title: 'Cortex-R safety',           desc: 'Lockstep, ISO 26262, ASIL coverage. Hard real-time, no compromises.',   href: '/docs/cortex-r/overview',       accent: 'primary'   as Accent },
  { icon: Wrench,  title: 'Toolchains, demystified',   desc: 'GCC vs LLVM, GDB + probes, CMake, Rust, C++.',                          href: '/docs/tools/toolchains',        accent: 'accent'    as Accent },
  { icon: Map,     title: 'System designs',            desc: 'Real products — Wi-Fi router, smartwatch, EV charger, drone, ECU.',    href: '/docs/systems/overview',        accent: 'highlight' as Accent },
];

const accentClasses: Record<Accent, { iconBg: string; iconBorder: string; iconColor: string; hover: string }> = {
  primary:   { iconBg: 'bg-primary/10',   iconBorder: 'border-primary/20',   iconColor: 'text-primary',   hover: 'card-tint-primary' },
  accent:    { iconBg: 'bg-accent/10',    iconBorder: 'border-accent/20',    iconColor: 'text-accent',    hover: 'card-tint-accent' },
  highlight: { iconBg: 'bg-highlight/10', iconBorder: 'border-highlight/20', iconColor: 'text-highlight', hover: 'card-tint-primary' },
};

const heroCodeSample = `// Set up a USART2 RX interrupt on Cortex-M4
NVIC_SetPriorityGrouping(0);
NVIC_SetPriority(USART2_IRQn, 5);
NVIC_EnableIRQ(USART2_IRQn);
__DSB(); __ISB();   // ensure the enable is observed

void USART2_IRQHandler(void) {
    if (USART2->ISR & USART_ISR_RXNE) {
        char c = USART2->RDR;   // reading RDR clears RXNE
        ring_push(c);
    }
}
`;

export default async function HomePage() {
  const heroCodeHtml = await codeToHtml(heroCodeSample.trimEnd(), {
    lang: 'c',
    themes: { light: 'github-light', dark: 'github-dark-dimmed' },
    defaultColor: false,
  });

  return (
    <>
      {/* ────── HERO ────── */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg-animated pointer-events-none" aria-hidden />
        <div className="absolute inset-0 grid-overlay pointer-events-none" aria-hidden />
        <div className="absolute inset-0 dot-grid pointer-events-none opacity-60" aria-hidden />
        <div className="relative container py-20 sm:py-28 md:py-36">
          <div className="mx-auto max-w-4xl text-center">
            <Link
              href="/tools"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 backdrop-blur px-3 py-1 text-xs text-muted-foreground shadow-sm hover:border-primary/40 hover:text-foreground transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-primary">new</span>
              <span>Interactive tools — HardFault decoder, MCU wizard, GCC explainer</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-balance leading-[1.05]">
              The modern reference{' '}
              <br className="hidden sm:inline" />
              for <span className="gradient-text">ARM development.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground text-balance leading-relaxed">
              Architecture, peripherals, RTOSes, toolchains, vendor families, and real-world system designs —
              from microcontrollers to flight controllers, end to end.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/docs/architecture/isa-family" className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}>
                Start reading
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/docs/systems/overview" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
                See system designs
              </Link>
            </div>

            <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
              {[
                { v: '191', l: 'reference pages',    color: 'text-primary' },
                { v: '10',  l: 'deep sections',      color: 'text-accent' },
                { v: '7',   l: 'interactive tools',  color: 'text-highlight' },
              ].map((s) => (
                <div key={s.l} className="relative rounded-lg border bg-card/70 backdrop-blur p-4 sm:p-5 card-lift">
                  <div className={cn('tabular text-2xl sm:text-3xl font-semibold tracking-tight', s.color)}>{s.v}</div>
                  <div className="mt-1.5 text-[0.65rem] sm:text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ────── FEATURES ────── */}
      <section className="border-b">
        <div className="container py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 sm:mb-12 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-primary">
                <Sparkles className="h-3 w-3" /> What you get
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-balance leading-tight">
                A reference written by people who{' '}
                <span className="gradient-text">ship firmware.</span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                Six pillars, dozens of deep-dives, hundreds of working code samples — and not a single
                paragraph of marketing.
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => {
                const a = accentClasses[f.accent];
                return (
                  <Link
                    key={f.title}
                    href={f.href}
                    className={cn(
                      'group relative overflow-hidden rounded-lg border bg-card p-5 card-lift',
                      a.hover,
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg border', a.iconBg, a.iconBorder, a.iconColor)}>
                        <f.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold leading-tight tracking-tight">{f.title}</h3>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ────── LIVE PREVIEW ────── */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 pointer-events-none opacity-60 mesh-bg" aria-hidden />
        <div className="relative container py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-accent">
                <Zap className="h-3 w-3" /> Live preview
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-balance leading-tight">
                Interactive widgets, <span className="gradient-text">not screenshots.</span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                Every register, memory map, and core comparison on armhub is built as a real component —
                hover, focus, sort, scroll.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <div className="min-w-0">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-semibold tracking-tight">Cortex-M lineup</h3>
                  <Link href="/docs/cortex-m/lineup" className="text-xs text-primary hover:text-primary-glow font-medium">
                    Read full page →
                  </Link>
                </div>
                <CoreCompare />
              </div>

              <div className="flex min-w-0 flex-col">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-semibold tracking-tight">Code, highlighted</h3>
                  <Link href="/docs/cortex-m/nvic" className="text-xs text-primary hover:text-primary-glow font-medium">
                    NVIC deep dive →
                  </Link>
                </div>

                {/* Code snippet card */}
                <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                  <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                      <span className="h-2.5 w-2.5 rounded-full bg-highlight/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                    </div>
                    <div className="font-mono text-[0.7rem] text-muted-foreground">usart2_rx.c</div>
                    <div className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">c</div>
                  </div>
                  <div
                    className="[&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-0 [&_pre]:!bg-transparent text-sm"
                    dangerouslySetInnerHTML={{ __html: heroCodeHtml }}
                  />
                </div>

                {/* Inline mini memory map — single line per region */}
                <div className="mt-4 overflow-hidden rounded-lg border bg-card shadow-sm">
                  <div className="border-b bg-muted/40 px-4 py-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                    Cortex-M memory map
                  </div>
                  <ul className="divide-y text-sm">
                    {[
                      { addr: '0xE000_0000', name: 'Private Peripheral Bus', kind: 'system',   color: 'bg-destructive/70' },
                      { addr: '0x4000_0000', name: 'Peripheral',             kind: 'periph',   color: 'bg-highlight/80' },
                      { addr: '0x2000_0000', name: 'SRAM',                   kind: 'sram',     color: 'bg-success/70'    },
                      { addr: '0x0000_0000', name: 'Code',                   kind: 'code',     color: 'bg-primary/80'    },
                    ].map((r) => (
                      <li key={r.addr} className="flex items-center gap-3 px-3 py-1.5 hover:bg-muted/40 transition-colors">
                        <span className={cn('h-2 w-2 rounded-full', r.color)} />
                        <span className="font-mono text-xs text-foreground tabular">{r.addr}</span>
                        <span className="flex-1 text-xs text-foreground truncate">{r.name}</span>
                        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">{r.kind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────── SYSTEMS ────── */}
      <section className="border-b">
        <div className="container py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-highlight/20 bg-highlight/5 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-highlight">
                  <Map className="h-3 w-3" /> System designs
                </div>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-balance leading-tight">
                  How real devices are <span className="gradient-text">actually built.</span>
                </h2>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Block diagrams, software stacks, and design tradeoffs for embedded products you&apos;ve probably touched today.
                </p>
              </div>
              <Link
                href="/docs/systems/overview"
                className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-glow"
              >
                See all →
              </Link>
            </div>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {systemHighlights.map((s) => {
                const a = accentClasses[s.accent];
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    className={cn(
                      'group relative overflow-hidden rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5',
                      a.hover,
                    )}
                  >
                    <div className={cn('absolute right-0 top-0 h-20 w-20 rounded-full blur-2xl opacity-0 transition-opacity group-hover:opacity-100', a.iconBg)} />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-tight tracking-tight">{s.title}</h3>
                        {'badge' in s && s.badge && (
                          <span className={cn(
                            'shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider',
                            a.iconBg, a.iconBorder, a.iconColor,
                          )}>
                            {s.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                      <div className={cn('mt-3 inline-flex items-center gap-1 text-xs font-medium transition-colors', a.iconColor)}>
                        Read more <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ────── BROWSE BY SECTION ────── */}
      <section className="border-b">
        <div className="container py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 max-w-2xl">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Browse</div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-balance leading-tight">
                Every section, every page.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((s, i) => {
                const accent: Accent = (['primary', 'accent', 'highlight'] as Accent[])[i % 3];
                const a = accentClasses[accent];
                return (
                  <div key={s.key} className={cn('rounded-lg border bg-card p-5 transition-all', a.hover)}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold tracking-tight">{s.title}</h3>
                      <span className={cn('tabular font-mono text-[0.65rem] uppercase tracking-wider rounded px-1.5 py-0.5', a.iconBg, a.iconColor)}>
                        {s.links.length} pages
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.intro}</p>
                    <ul className="mt-4 space-y-1 text-sm">
                      {s.links.slice(0, 5).map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            className="flex items-center justify-between rounded-md px-2 py-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                          >
                            <span>{l.title}</span>
                            {l.badge && (
                              <span className="font-mono text-[0.6rem] uppercase tracking-wider text-primary/70">{l.badge}</span>
                            )}
                          </Link>
                        </li>
                      ))}
                      {s.links.length > 5 && (
                        <li className="px-2 py-1 font-mono text-xs text-muted-foreground/60">
                          +{s.links.length - 5} more
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ────── CONTRIBUTE ────── */}
      <section>
        <div className="container py-16 sm:py-24">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border p-8 sm:p-12 text-center ring-gradient">
            <div className="absolute inset-0 mesh-bg pointer-events-none opacity-70" aria-hidden />
            <div className="relative">
              <div className="mx-auto inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/20">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
                Open. <span className="gradient-text">Make it better.</span>
              </h2>
              <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
                Found a mistake? Have a peripheral pattern that should be canonical here? Open a PR.
                armhub.dev is for working engineers, written by working engineers.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://github.com/sitharaj88/armhub"
                  target="_blank"
                  rel="noopener"
                  className={cn(buttonVariants({ variant: 'default' }))}
                >
                  Star on GitHub
                </a>
                <Link href="/contributing" className={cn(buttonVariants({ variant: 'outline' }))}>
                  Contribution guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
