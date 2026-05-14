'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sections } from '@/lib/nav';
import { cn } from '@/lib/utils';

export function DocSidebar() {
  const path = usePathname();
  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto thin-scrollbar pr-4 py-6 text-sm" aria-label="Section">
        {sections.map((s) => (
          <div key={s.key} className="mb-5">
            <div className="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">{s.title}</div>
            <ul className="space-y-0.5 border-l pl-3">
              {s.links.map((l) => {
                const active = path === l.href || path?.startsWith(l.href + '/');
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        'flex items-center justify-between rounded-md px-2 py-1.5 transition-colors',
                        active
                          ? 'bg-accent text-foreground font-medium'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                      )}
                    >
                      <span className="truncate">{l.title}</span>
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
          </div>
        ))}
      </nav>
    </aside>
  );
}
