// A stylized terminal block — always rendered with the dark palette
// regardless of the page theme. Adds a `dark` class on the wrapper so
// inner utilities (text-foreground, bg-card etc) resolve to the dark
// theme variables locally.

export function Terminal({ title = 'armhub ~ shell', children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="dark overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70"></span>
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70"></span>
        <span className="h-2.5 w-2.5 rounded-full bg-success/70"></span>
        <div className="ml-3 font-mono text-xs text-muted-foreground">{title}</div>
      </div>
      <div className="overflow-x-auto px-5 py-4 font-mono text-[0.78rem] sm:text-[0.86rem] leading-relaxed text-foreground" style={{ overflowWrap: 'anywhere' }}>
        {children}
      </div>
    </div>
  );
}
