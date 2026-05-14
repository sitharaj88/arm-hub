'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { sections, topNavSections } from '@/lib/nav';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (key: string) => path?.startsWith(`/docs/${key}`);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-1 text-sm" aria-label="Primary">
          {topNavSections.map((s) => (
            <Link
              key={s.key}
              href={s.links[0]?.href ?? `/docs/${s.key}`}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-[0.85rem] font-medium transition-colors',
                isActive(s.key) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s.title}
            </Link>
          ))}
          <Link
            href="/tools"
            className={cn(
              'rounded-md px-2.5 py-1.5 text-[0.85rem] font-medium transition-colors inline-flex items-center gap-1.5',
              path?.startsWith('/tools') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Tools
            <span className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider text-primary border border-primary/20">new</span>
          </Link>
          <Link
            href="/learn"
            className={cn(
              'rounded-md px-2.5 py-1.5 text-[0.85rem] font-medium transition-colors',
              path === '/learn' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Learn
          </Link>
          <Link
            href="/cheatsheets"
            className={cn(
              'rounded-md px-2.5 py-1.5 text-[0.85rem] font-medium transition-colors',
              path === '/cheatsheets' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Cheatsheets
          </Link>
          <Link
            href="/glossary"
            className={cn(
              'rounded-md px-2.5 py-1.5 text-[0.85rem] font-medium transition-colors',
              path === '/glossary' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Glossary
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {/* Search trigger — pill on lg+, icon below */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('armhub:open-search'))}
            className="hidden lg:inline-flex items-center gap-2 rounded-md border bg-card/80 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground w-56"
            aria-label="Open search"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('armhub:open-search'))}
            aria-label="Open search"
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
          <a
            href="https://github.com/sitharaj88/armhub"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="md:hidden h-9 w-9"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t md:hidden bg-background">
          <nav className="container grid grid-cols-2 gap-1 py-3 text-sm" aria-label="Mobile">
            {sections.map((s) => (
              <Link
                key={s.key}
                href={s.links[0]?.href ?? `/docs/${s.key}`}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {s.title}
              </Link>
            ))}
            <Link
              href="/tools"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Tools <span className="ml-2 rounded bg-primary/10 px-1 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider text-primary">new</span>
            </Link>
            <Link
              href="/learn"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Learn
            </Link>
            <Link
              href="/cheatsheets"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Cheatsheets
            </Link>
            <Link
              href="/glossary"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Glossary
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
