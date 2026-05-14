import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FindMcu } from '@/components/tools/find-mcu';

export const metadata = {
  title: 'Find my MCU — armhub tools',
  description: 'Filter Cortex-M microcontrollers by core, RAM, flash, radio, vendor, and certifications. Surfaces realistic STM32 / nRF / RP / NXP picks.',
};

export default function FindMcuPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg pointer-events-none opacity-70" aria-hidden />
        <div className="relative container py-12 sm:py-16">
          <Link href="/tools" className="inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> All tools
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
            Find <span className="gradient-text">my MCU.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Filter the catalogue by what your product actually needs — core class, memory budget, radio, vendor.
            Curated to surface the realistic picks, not every SKU. Click through to the deep dive.
          </p>
        </div>
      </section>

      <section className="container py-10 sm:py-14">
        <FindMcu />
      </section>
    </>
  );
}
