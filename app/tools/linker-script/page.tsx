import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LinkerScript } from '@/components/tools/linker-script';

export const metadata = {
  title: 'Linker script builder — armhub tools',
  description: 'Generate a working GCC linker.ld for any Cortex-M target. Configure FLASH / SRAM / ITCM / DTCM regions, stack and heap sizes, vector-table placement, and C++ ctor support.',
};

export default function LinkerScriptPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg pointer-events-none opacity-70" aria-hidden />
        <div className="relative container py-12 sm:py-16">
          <Link href="/tools" className="inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> All tools
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
            Linker script <span className="gradient-text">builder.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Pick a preset or define memory regions, pick where the stack and vector table live, and get a complete
            <code className="mx-1 font-mono text-foreground">linker.ld</code> you can drop into a GCC build —
            with <code className="font-mono text-foreground">.isr_vector</code>, <code className="font-mono text-foreground">.data</code> in flash → RAM, and proper C++ ctor arrays.
          </p>
        </div>
      </section>
      <section className="container py-10 sm:py-14">
        <LinkerScript />
      </section>
    </>
  );
}
