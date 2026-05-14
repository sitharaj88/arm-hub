import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <section className="container py-16 sm:py-24">
      <div className="mx-auto max-w-xl">
        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">/ 0x0404</div>
        <h1 className="mt-2 text-[2.25rem] sm:text-5xl font-semibold tracking-tight">HardFault.</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          That address isn&apos;t mapped. The page you&apos;re looking for either doesn&apos;t exist, has been moved, or was
          unmapped in a recent refactor.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/" className={cn(buttonVariants({ variant: 'default' }))}>Back to home</Link>
          <Link href="/docs/architecture/isa-family" className={cn(buttonVariants({ variant: 'outline' }))}>
            Start reading
          </Link>
        </div>
      </div>
    </section>
  );
}
