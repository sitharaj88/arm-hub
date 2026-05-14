'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Heading = { id: string; text: string; depth: number };

function extractHeadings(): Heading[] {
  const out: Heading[] = [];
  const els = document.querySelectorAll<HTMLHeadingElement>('article h2[id], article h3[id]');
  els.forEach((el) => {
    out.push({
      id: el.id,
      text: el.textContent?.replace(/#$/, '').trim() ?? '',
      depth: el.tagName === 'H2' ? 2 : 3,
    });
  });
  return out;
}

export function DocToc() {
  const [items, setItems] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    setItems(extractHeadings());
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -75% 0px', threshold: 0.1 },
    );
    items.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden xl:block">
      <nav className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto thin-scrollbar pl-4 py-6 text-sm" aria-label="On this page">
        <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">On this page</div>
        {items.length === 0 ? (
          <div className="text-xs text-muted-foreground/60">Loading…</div>
        ) : (
        <ul className="space-y-1 border-l">
          {items.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={cn(
                  'block -ml-px border-l-2 py-1 transition-colors',
                  h.depth === 3 ? 'pl-6 text-[0.85em]' : 'pl-3',
                  active === h.id
                    ? 'border-foreground text-foreground font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
        )}
      </nav>
    </aside>
  );
}
