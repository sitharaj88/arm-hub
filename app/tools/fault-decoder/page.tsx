import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FaultDecoder } from '@/components/tools/fault-decoder';

export const metadata = {
  title: 'HardFault decoder — armhub tools',
  description: 'Paste your CFSR / HFSR hex values, get a human-readable Cortex-M fault analysis with likely causes.',
};

export default function FaultDecoderPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg pointer-events-none opacity-70" aria-hidden />
        <div className="relative container py-12 sm:py-16">
          <Link href="/tools" className="inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> All tools
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
            HardFault <span className="gradient-text">decoder.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Paste the contents of <code className="rounded border bg-muted/40 px-1.5 py-0.5 font-mono text-[0.85em]">SCB-&gt;CFSR</code>
            {' '}and{' '}
            <code className="rounded border bg-muted/40 px-1.5 py-0.5 font-mono text-[0.85em]">SCB-&gt;HFSR</code>.
            Every bit set is decoded with what it means and the usual cause — so you can stop staring at ARMv7-M ARM §B3.2.15.
          </p>
        </div>
      </section>

      <section className="container py-10 sm:py-14">
        <FaultDecoder />
      </section>
    </>
  );
}
