import Link from 'next/link';

type Spec = {
  label: string;
  value: string;
  link?: string;
};

export function SpecSheet({ title = 'At a glance', specs }: { title?: string; specs: Spec[] }) {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="border-b bg-muted/30 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <dl className="divide-y">
        {specs.map((s, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[11rem_minmax(0,1fr)] md:grid-cols-[13rem_minmax(0,1fr)] gap-y-1 sm:gap-y-0 gap-x-3 px-4 py-3 sm:py-2.5">
            <dt className="font-mono text-[0.65rem] sm:text-xs uppercase tracking-wider text-muted-foreground sm:pt-0.5">{s.label}</dt>
            <dd className="text-sm text-foreground break-words">
              {s.link ? (
                <Link href={s.link} className="text-foreground underline decoration-muted-foreground/50 underline-offset-2 hover:decoration-foreground">{s.value}</Link>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: s.value }} />
              )}
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
