import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('group inline-flex items-center gap-2.5', className)} aria-label="armhub home">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-primary/25 bg-gradient-to-br from-primary/10 via-accent/5 to-highlight/10 transition-all group-hover:border-primary/45 group-hover:from-primary/20 group-hover:to-accent/15">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[1.1rem] w-[1.1rem]"
          aria-hidden
        >
          <defs>
            <linearGradient id="armhub-logo-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="hsl(var(--primary))" />
              <stop offset="55%"  stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--highlight))" />
            </linearGradient>
          </defs>
          {/* Hub ring */}
          <circle cx="12" cy="12" r="6.5" stroke="url(#armhub-logo-grad)" strokeWidth="2" fill="none" />
          {/* Centre dot */}
          <circle cx="12" cy="12" r="1.2" className="fill-foreground" />
        </svg>
        {/* Orientation marker (chip-style) */}
        <span className="absolute right-1 top-1 h-1 w-1 rounded-full bg-accent" />
      </span>
      <span className="text-[1.05rem] font-semibold tracking-tight text-foreground">
        armhub<span className="text-muted-foreground/70">.dev</span>
      </span>
    </Link>
  );
}
