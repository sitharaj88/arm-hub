import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  href?: string;
  title: string;
  description?: string;
  badge?: string;
  icon?: string;
  className?: string;
};

// The MDX Card — used as `<Card title=".." description=".." href=".." />`
export function LinkCard({ href, title, description, badge, icon, className }: Props) {
  const inner = (
    <>
      <div className="flex items-start gap-3">
        {icon && (
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border bg-muted/40 text-foreground"
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight leading-tight text-foreground">{title}</h3>
            {badge && (
              <span className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                {badge}
              </span>
            )}
          </div>
          {description && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        {href && (
          <ArrowRight className="h-4 w-4 shrink-0 translate-x-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden />
        )}
      </div>
    </>
  );

  const baseClass = cn(
    'group not-prose relative block overflow-hidden rounded-lg border bg-card p-5 transition-colors',
    href ? 'hover:bg-muted/30 hover:border-foreground/20' : '',
    className,
  );

  if (!href) return <div className={baseClass}>{inner}</div>;
  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener" className={baseClass}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={baseClass}>
      {inner}
    </Link>
  );
}
