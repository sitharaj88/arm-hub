import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const paths = [
  {
    title: 'Beginner — zero to blink',
    description: 'You have a Cortex-M dev board and a USB cable. Get a toolchain working, understand the boot flow, write firmware that runs.',
    badge: 'start here',
    steps: [
      { title: 'ARM ISA family', href: '/docs/architecture/isa-family' },
      { title: 'Cortex-M lineup', href: '/docs/cortex-m/lineup' },
      { title: 'Toolchains', href: '/docs/tools/toolchains' },
      { title: 'Build systems', href: '/docs/tools/build' },
      { title: 'GDB & on-chip debug', href: '/docs/tools/gdb' },
      { title: 'GPIO', href: '/docs/peripherals/gpio' },
      { title: 'UART', href: '/docs/peripherals/uart' },
      { title: 'Startup & vector table', href: '/docs/programming/startup' },
    ],
  },
  {
    title: 'Intermediate — peripherals and patterns',
    description: 'You can blink an LED. Now ship something that talks to sensors, runs in real time, and survives a power cycle.',
    steps: [
      { title: 'Exception model', href: '/docs/architecture/exception-model' },
      { title: 'NVIC deep dive', href: '/docs/cortex-m/nvic' },
      { title: 'SysTick & timing', href: '/docs/cortex-m/systick' },
      { title: 'Memory model & barriers', href: '/docs/architecture/memory-model' },
      { title: 'SPI', href: '/docs/peripherals/spi' },
      { title: 'I²C', href: '/docs/peripherals/i2c' },
      { title: 'DMA', href: '/docs/peripherals/dma' },
      { title: 'Linker scripts', href: '/docs/programming/linker-scripts' },
      { title: 'Embedded C patterns', href: '/docs/programming/embedded-c' },
      { title: 'RTOS landscape', href: '/docs/rtos/landscape' },
      { title: 'FreeRTOS', href: '/docs/rtos/freertos' },
    ],
  },
  {
    title: 'Advanced — performance, safety, modern',
    description: 'Ship fast, secure, low-power, certifiable products.',
    steps: [
      { title: 'Cortex-M7 — caches & TCMs', href: '/docs/cortex-m/m7' },
      { title: 'Cortex-M33 / M23 — TrustZone', href: '/docs/cortex-m/m33-m23' },
      { title: 'Cortex-M55 / M85 — Helium', href: '/docs/cortex-m/m55-m85' },
      { title: 'TrustZone', href: '/docs/architecture/trustzone' },
      { title: 'CMSIS', href: '/docs/programming/cmsis' },
      { title: 'C++ on Cortex-M', href: '/docs/programming/cpp' },
      { title: 'Rust on Cortex-M', href: '/docs/programming/rust' },
      { title: 'Zephyr', href: '/docs/rtos/zephyr' },
      { title: 'ThreadX', href: '/docs/rtos/threadx' },
    ],
  },
  {
    title: 'Stepping up to Cortex-A & R',
    description: 'When the M-profile constraints stop fitting. Boot chains, MMUs, lockstep, ASIL.',
    steps: [
      { title: 'Cortex-A overview', href: '/docs/cortex-a/overview' },
      { title: 'Boot flow & EL levels', href: '/docs/cortex-a/boot-and-exception-levels' },
      { title: 'MMU & paging', href: '/docs/cortex-a/mmu' },
      { title: 'Caches & coherency', href: '/docs/cortex-a/caches' },
      { title: 'Cortex-R overview', href: '/docs/cortex-r/overview' },
      { title: 'Lockstep & ASIL', href: '/docs/cortex-r/lockstep' },
    ],
  },
];

export const metadata = {
  title: 'Learn — paths through armhub',
  description: 'Structured learning paths: from never-blinked-an-LED to shipping safety-certified Cortex-R firmware.',
};

export default function LearnPage() {
  return (
    <>
      <section className="border-b">
        <div className="container py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Learn</div>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
              Paths through armhub.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              armhub is a reference, not a tutorial — but a reference is useless if you don&apos;t know what to read in what order.
              Four curated paths, each pointing you at the pages that matter for that stage.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 sm:py-16 space-y-12">
        {paths.map((p) => (
          <div key={p.title} className="grid gap-5 sm:gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-balance leading-tight">{p.title}</h2>
              {p.badge && <Badge variant="secondary" className="mt-2">{p.badge}</Badge>}
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </div>
            <ol className="grid grid-cols-1 gap-2">
              {p.steps.map((s, i) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="group flex min-h-11 items-center gap-3 sm:gap-4 rounded-md border bg-card px-3 sm:px-4 py-2.5 sm:py-3 transition-colors hover:bg-muted/40 hover:border-foreground/20"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border bg-background font-mono text-xs text-muted-foreground group-hover:text-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-sm text-foreground">{s.title}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </>
  );
}
