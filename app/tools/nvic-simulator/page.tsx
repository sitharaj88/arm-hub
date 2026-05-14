import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NvicSimulator } from '@/components/tools/nvic-simulator';

export const metadata = {
  title: 'NVIC priority simulator — armhub tools',
  description: 'Configure PRIGROUP and __NVIC_PRIO_BITS, add IRQ sources, see exactly how Cortex-M splits each priority into preempt + sub-priority and which IRQ preempts which.',
};

export default function NvicSimulatorPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg pointer-events-none opacity-70" aria-hidden />
        <div className="relative container py-12 sm:py-16">
          <Link href="/tools" className="inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> All tools
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
            NVIC priority <span className="gradient-text">simulator.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Pick your implemented priority bits + PRIGROUP, add IRQs, see exactly how the byte gets split into
            preempt + sub-priority. The execution chain shows what would happen if everything fired at once; the
            matrix shows every pairwise preempt relationship.
          </p>
        </div>
      </section>
      <section className="container py-10 sm:py-14">
        <NvicSimulator />
      </section>
    </>
  );
}
