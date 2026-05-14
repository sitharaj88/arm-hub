export function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 sm:p-4">
      <div className="font-mono text-xl sm:text-2xl text-foreground leading-none tracking-tight">{value}</div>
      <div className="mt-2 text-[0.65rem] sm:text-xs uppercase tracking-wider text-muted-foreground leading-tight">{label}</div>
      {sub && <div className="mt-1 text-[0.65rem] sm:text-xs text-muted-foreground/80 leading-snug">{sub}</div>}
    </div>
  );
}
