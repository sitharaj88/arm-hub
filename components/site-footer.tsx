import Link from 'next/link';
import { Coffee, Github, Globe, Linkedin } from 'lucide-react';
import { sections } from '@/lib/nav';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 sm:mt-24 border-t bg-muted/20">
      <div className="container py-10 sm:py-14">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.4fr_3fr]">
          <div>
            <div className="text-base font-semibold tracking-tight">
              armhub<span className="text-muted-foreground">.dev</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              An open reference for ARM developers — architecture, peripherals, RTOSes, vendor families, and real-world system designs.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="https://github.com/sitharaj88/armhub"
                target="_blank"
                rel="noopener"
                className="rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                GitHub
              </a>
              <Link
                href="/contributing"
                className="rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                Contribute
              </Link>
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/rss.xml`}
                className="rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                RSS
              </a>
            </div>

            {/* Author attribution */}
            <div className="mt-6 border-t pt-5">
              <div className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Built by</div>
              <a
                href="https://sitharaj.in"
                target="_blank"
                rel="noopener"
                className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
              >
                Sitharaj Seenivasan
              </a>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <a
                  href="https://sitharaj.in"
                  target="_blank"
                  rel="noopener"
                  aria-label="Personal website"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <Globe className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://github.com/sitharaj88"
                  target="_blank"
                  rel="noopener"
                  aria-label="GitHub"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/10 hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/sitharaj08"
                  target="_blank"
                  rel="noopener"
                  aria-label="LinkedIn"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://www.buymeacoffee.com/sitharaj88"
                  target="_blank"
                  rel="noopener"
                  aria-label="Buy me a coffee"
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-highlight/40 hover:bg-highlight/10 hover:text-highlight"
                >
                  <Coffee className="h-3.5 w-3.5" />
                  <span>Buy me a coffee</span>
                </a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {sections.slice(0, 8).map((s) => (
              <div key={s.key}>
                <div className="font-mono text-[0.65rem] sm:text-xs uppercase tracking-wider text-muted-foreground">
                  {s.title}
                </div>
                <ul className="mt-2 sm:mt-3 space-y-1.5 text-sm">
                  {s.links.slice(0, 4).map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-muted-foreground hover:text-foreground">
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 sm:mt-12 flex flex-col items-start justify-between gap-3 border-t pt-5 sm:pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>
            © {year} armhub.dev · Built by{' '}
            <a
              href="https://sitharaj.in"
              target="_blank"
              rel="noopener"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Sitharaj Seenivasan
            </a>
            {' '}· Content under CC BY 4.0 · Code under MIT.
          </div>
          <div className="font-mono">ARM, Cortex, and TrustZone are trademarks of Arm Limited. armhub.dev is an independent reference site.</div>
        </div>
      </div>
    </footer>
  );
}
