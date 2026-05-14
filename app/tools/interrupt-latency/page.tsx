import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { InterruptLatency } from '@/components/tools/interrupt-latency';

export const metadata = {
  title: 'Interrupt latency calculator — armhub tools',
  description: 'Estimate Cortex-M exception entry latency cycle-by-cycle: stacking, vector fetch, pipeline refill, FPU lazy vs eager, memory wait states, tail-chain and late-arrival.',
};

export default function InterruptLatencyPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg pointer-events-none opacity-70" aria-hidden />
        <div className="relative container py-12 sm:py-16">
          <Link href="/tools" className="inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> All tools
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
            Interrupt latency <span className="gradient-text">calculator.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Pick a core, clock, and where your stack / vector table live. Get a cycle-by-cycle breakdown of
            exception entry — stacking 8 words, FPU frame, vector fetch, pipeline refill — plus tail-chain and
            late-arrival numbers for back-to-back IRQs.
          </p>
        </div>
      </section>
      <section className="container py-10 sm:py-14">
        <InterruptLatency />
      </section>
    </>
  );
}
