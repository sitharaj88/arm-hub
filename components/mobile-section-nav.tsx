'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { NavSection } from '@/lib/nav';
import { cn } from '@/lib/utils';

export function MobileSectionNav({ section }: { section: NavSection }) {
  const path = usePathname();
  if (section.links.length <= 1) return null;
  return (
    <details className="group mb-6 lg:hidden rounded-md border bg-card open:bg-card transition-colors">
      <summary className="flex cursor-pointer min-h-11 items-center justify-between gap-2 px-3 py-3 text-sm">
        <span className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
          {section.title} <span className="text-muted-foreground/50">·</span>{' '}
          <span className="text-foreground">{section.links.length} pages</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <ul className="border-t px-2 py-2 text-sm">
        {section.links.map((l) => {
          const active = path === l.href || path?.startsWith(l.href + '/');
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  'flex min-h-11 items-center justify-between rounded-md px-2 py-2 transition-colors',
                  active ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )}
              >
                <span>{l.title}</span>
                {l.badge && (
                  <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-muted-foreground">
                    {l.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
