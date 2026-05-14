import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GccFlagExplainer } from '@/components/tools/gcc-flags';

export const metadata = {
  title: 'GCC flag explainer — armhub tools',
  description: 'Paste an arm-none-eabi-gcc command, get every flag decoded with what it does and when you need it.',
};

export default function GccFlagsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg pointer-events-none opacity-70" aria-hidden />
        <div className="relative container py-12 sm:py-16">
          <Link href="/tools" className="inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> All tools
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
            GCC flag <span className="gradient-text">explainer.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Paste a full <code className="rounded border bg-muted/40 px-1.5 py-0.5 font-mono text-[0.85em]">arm-none-eabi-gcc</code>
            {' '}command. Every recognised flag is decoded with what it does, when you need it, and links to the
            relevant deep-dive when applicable. Unknown flags are surfaced so nothing gets silently ignored.
          </p>
        </div>
      </section>

      <section className="container py-10 sm:py-14">
        <GccFlagExplainer />
      </section>
    </>
  );
}
