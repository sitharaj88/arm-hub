import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { glossary, type GlossaryEntry } from '@/lib/glossary';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Glossary — armhub',
  description: 'Quick definitions for every ARM / embedded term used across the site. Hyperlinked to the relevant deep-dive page.',
};

const groupNames: Record<NonNullable<GlossaryEntry['group']>, string> = {
  core: 'Core / CPU',
  memory: 'Memory & buses',
  peripheral: 'Peripherals',
  protocol: 'Protocols',
  rtos: 'RTOSes',
  safety: 'Safety',
  security: 'Security',
  tools: 'Tools',
  concept: 'Concepts',
};

const groupAccents: Record<NonNullable<GlossaryEntry['group']>, string> = {
  core: 'text-primary border-primary/30 bg-primary/10',
  memory: 'text-accent border-accent/30 bg-accent/10',
  peripheral: 'text-success border-success/30 bg-success/10',
  protocol: 'text-highlight border-highlight/30 bg-highlight/10',
  rtos: 'text-info border-info/30 bg-info/10',
  safety: 'text-destructive border-destructive/30 bg-destructive/10',
  security: 'text-destructive border-destructive/30 bg-destructive/10',
  tools: 'text-muted-foreground border-border bg-muted/40',
  concept: 'text-muted-foreground border-border bg-muted/40',
};

function firstLetter(term: string): string {
  // For "I²C" → "I", "ARMv6-M" → "A", "Cortex-M" → "C"
  const ch = term.replace(/[^A-Za-z]/, '').charAt(0).toUpperCase();
  return ch || '#';
}

export default function GlossaryPage() {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  const groups = new Map<string, GlossaryEntry[]>();
  for (const entry of sorted) {
    const letter = firstLetter(entry.term);
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(entry);
  }
  const letters = Array.from(groups.keys()).sort();

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg pointer-events-none opacity-60" aria-hidden />
        <div className="relative container py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Glossary</div>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
              Every term, one page.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Acronyms, register names, ARM-isms — short definitions with links to the full deep-dives. Skim or
              jump straight to the letter you need.
            </p>
          </div>

          {/* Alphabet jump-bar */}
          <nav className="mt-8 flex flex-wrap gap-1 font-mono text-xs" aria-label="Jump to letter">
            {letters.map((l) => (
              <a
                key={l}
                href={`#l-${l}`}
                className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border bg-card px-1 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                {l}
              </a>
            ))}
            <span className="ml-auto inline-flex items-center text-muted-foreground/70">
              <span className="tabular">{glossary.length}</span>&nbsp;terms
            </span>
          </nav>
        </div>
      </section>

      <section className="container py-10 sm:py-14">
        <div className="space-y-12">
          {letters.map((l) => (
            <section key={l} id={`l-${l}`} aria-labelledby={`h-${l}`} className="scroll-mt-20">
              <div className="mb-4 flex items-baseline gap-3 border-b pb-2">
                <h2 id={`h-${l}`} className="text-2xl font-semibold tracking-tight tabular">{l}</h2>
                <span className="font-mono text-xs text-muted-foreground">{groups.get(l)!.length} terms</span>
              </div>
              <dl className="grid gap-4 md:grid-cols-2">
                {groups.get(l)!.map((entry) => (
                  <div key={entry.term} className="group rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30 hover:border-foreground/20">
                    <div className="flex items-baseline justify-between gap-2">
                      <dt className="text-sm font-semibold text-foreground">
                        {entry.link ? (
                          <Link href={entry.link} className="hover:text-primary transition-colors">
                            {entry.term}
                          </Link>
                        ) : (
                          entry.term
                        )}
                      </dt>
                      {entry.group && (
                        <span className={cn('shrink-0 rounded border px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider', groupAccents[entry.group])}>
                          {groupNames[entry.group]}
                        </span>
                      )}
                    </div>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{entry.def}</dd>
                    {entry.link && (
                      <Link href={entry.link} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Read more <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
