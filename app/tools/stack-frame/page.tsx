import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StackFrameVisualizer } from '@/components/tools/stack-frame';

export const metadata = {
  title: 'Stack-frame visualizer — armhub tools',
  description: 'Paste the 8 (or 25) words a Cortex-M exception pushes onto the stack. See what each word is and decode xPSR, PC, LR live.',
};

export default function StackFramePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg pointer-events-none opacity-70" aria-hidden />
        <div className="relative container py-12 sm:py-16">
          <Link href="/tools" className="inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> All tools
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
            Stack-frame <span className="gradient-text">visualizer.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Drop in the 8 words Cortex-M pushes on exception entry (R0, R1, R2, R3, R12, LR, PC, xPSR). Each is
            labelled with its meaning, xPSR is decoded into IPSR / NZCV / Thumb bit, and a missing Thumb bit on PC
            is flagged loudly.
          </p>
        </div>
      </section>

      <section className="container py-10 sm:py-14">
        <StackFrameVisualizer />
      </section>
    </>
  );
}
