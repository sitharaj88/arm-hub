'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ArrowRight, FileText, Loader2, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

// When the site is served from a non-root basePath (e.g. /arm-hub on
// GitHub Pages), the search-index.json fetch URL needs the prefix.
// `<Link>` and `router.push()` from next/navigation auto-prepend basePath,
// so the search-result hrefs stay as plain "/docs/..." paths.

type SearchEntry = {
  href: string;
  title: string;
  description: string;
  section: string;
  excerpt: string;
  badge?: string;
};

/** Tokenize a string into normalised lowercase tokens. */
function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s.-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** Compute a relevance score. Higher is better. */
function score(entry: SearchEntry, queryTokens: string[], rawQuery: string): number {
  if (queryTokens.length === 0) return 0;
  const title = entry.title.toLowerCase();
  const desc = entry.description.toLowerCase();
  const excerpt = entry.excerpt.toLowerCase();
  const section = entry.section.toLowerCase();
  const q = rawQuery.trim().toLowerCase();

  let s = 0;
  if (title === q) s += 100;
  if (title.startsWith(q)) s += 40;
  if (title.includes(q)) s += 20;

  for (const t of queryTokens) {
    if (title.includes(t)) s += 8;
    if (desc.includes(t)) s += 3;
    if (excerpt.includes(t)) s += 1;
    if (section.includes(t)) s += 2;
  }
  return s;
}

function highlight(text: string, queryTokens: string[]): React.ReactNode {
  if (queryTokens.length === 0) return text;
  const set = new Set(queryTokens.map((t) => t.toLowerCase()));
  // Split keeping the delimiters and any "word-like" run
  const parts = text.split(/(\w+)/);
  return parts.map((p, i) => {
    if (set.has(p.toLowerCase())) {
      return <mark key={i} className="bg-primary/15 text-primary px-0.5 rounded-sm">{p}</mark>;
    }
    return <span key={i}>{p}</span>;
  });
}

const sectionLabels: Record<string, string> = {
  architecture: 'Architecture',
  'cortex-m': 'Cortex-M',
  'cortex-a': 'Cortex-A',
  'cortex-r': 'Cortex-R',
  peripherals: 'Peripherals',
  programming: 'Programming',
  rtos: 'RTOS',
  tools: 'Tools',
  vendors: 'Vendors',
  systems: 'Systems',
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && /Mac|iP(hone|ad)/.test(navigator.platform));
  }, []);

  /** Global hotkey: ⌘K / Ctrl+K opens; Esc closes. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '/' && !open) {
        const tag = (document.activeElement?.tagName ?? '').toUpperCase();
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          setOpen(true);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /** Listen for header/CTA dispatched events. */
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('armhub:open-search', onOpen);
    return () => window.removeEventListener('armhub:open-search', onOpen);
  }, []);

  /** Lazy-load the search index the first time the dialog opens. */
  useEffect(() => {
    if (!open || index !== null) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/search-index.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data: SearchEntry[]) => setIndex(data))
      .catch(() => setIndex([]))
      .finally(() => setLoading(false));
  }, [open, index]);

  /** Focus input when opening; lock scroll. */
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      setQuery('');
      setActive(0);
    }
  }, [open]);

  const queryTokens = useMemo(() => tokenize(query), [query]);
  const results = useMemo(() => {
    if (!index) return [];
    if (queryTokens.length === 0) {
      return index.slice(0, 8);
    }
    return index
      .map((e) => ({ e, s: score(e, queryTokens, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 24)
      .map((r) => r.e);
  }, [index, queryTokens, query]);

  /** Keyboard navigation within results. */
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = results[active];
      if (r) {
        router.push(r.href);
        setOpen(false);
      }
    }
  }, [results, active, router]);

  // Reset highlighted item when results change
  useEffect(() => { setActive(0); }, [results.length]);

  // Keep active item in view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLAnchorElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/15 backdrop-blur-sm p-4 pt-[8vh] sm:pt-[12vh] animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border bg-card shadow-2xl">
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search docs, systems, registers…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto thin-scrollbar">
          {loading && index === null && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> loading index…
            </div>
          )}

          {!loading && results.length === 0 && index !== null && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              {query.trim() ? `No results for "${query}"` : 'Type to search'}
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2">
              {!query.trim() && (
                <div className="px-3 pt-2 pb-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  Suggested
                </div>
              )}
              {results.map((r, i) => (
                <Link
                  key={r.href}
                  href={r.href}
                  data-idx={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'group flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors',
                    active === i ? 'bg-primary/10 ring-1 ring-primary/20' : 'hover:bg-muted/40',
                  )}
                >
                  <FileText className={cn('mt-0.5 h-4 w-4 shrink-0', active === i ? 'text-primary' : 'text-muted-foreground')} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {highlight(r.title, queryTokens)}
                      </div>
                      <div className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                        {sectionLabels[r.section] ?? r.section}
                      </div>
                    </div>
                    <div className="mt-0.5 text-xs leading-snug text-muted-foreground line-clamp-2">
                      {highlight(r.description, queryTokens)}
                    </div>
                  </div>
                  <ArrowRight className={cn('h-3.5 w-3.5 shrink-0 self-center text-muted-foreground transition-transform', active === i && 'text-primary translate-x-0.5')} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t bg-muted/30 px-4 py-2 text-[0.7rem] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><kbd className="rounded border bg-card px-1 py-0.5">↑↓</kbd> navigate</span>
            <span className="inline-flex items-center gap-1"><kbd className="rounded border bg-card px-1 py-0.5">↵</kbd> open</span>
            <span className="inline-flex items-center gap-1"><kbd className="rounded border bg-card px-1 py-0.5">esc</kbd> close</span>
          </div>
          <div className="inline-flex items-center gap-1">
            {isMac ? <><Command className="h-3 w-3" /><span>K</span></> : <span>Ctrl + K</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
