import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { NavSection } from '@/lib/nav';

export function DocPager({ section, currentHref }: { section: NavSection; currentHref: string }) {
  const idx = section.links.findIndex((l) => l.href === currentHref);
  if (idx < 0) return null;
  const current = section.links[idx];

  // If the current page belongs to a sub-group (e.g. a tutorial sequence), constrain
  // prev/next to that group so the pager doesn't bleed into unrelated sibling links.
  const inSameGroup = (other: typeof current) =>
    current.group ? other.group === current.group : !other.group;

  const prevCand = idx > 0 ? section.links[idx - 1] : null;
  const nextCand = idx < section.links.length - 1 ? section.links[idx + 1] : null;
  const prev = prevCand && inSameGroup(prevCand) ? prevCand : null;
  const next = nextCand && inSameGroup(nextCand) ? nextCand : null;
  if (!prev && !next) return null;

  return (
    <nav className="mt-14 grid gap-3 sm:grid-cols-2" aria-label="Pagination">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40 hover:border-foreground/20"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            <ArrowLeft className="h-3 w-3" /> previous
          </span>
          <span className="mt-1 text-sm font-semibold tracking-tight text-foreground group-hover:underline">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40 hover:border-foreground/20 sm:text-right"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            next <ArrowRight className="h-3 w-3" />
          </span>
          <span className="mt-1 text-sm font-semibold tracking-tight text-foreground group-hover:underline">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
