import { AlertCircle, AlertTriangle, BookOpen, Info, Lightbulb, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

type CalloutType = 'note' | 'tip' | 'warn' | 'danger' | 'spec';

const styles: Record<CalloutType, { wrap: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  note:   { wrap: 'border-border bg-muted/40',                                    icon: Info,         label: 'note' },
  tip:    { wrap: 'border-success/30 bg-success/5 dark:bg-success/10',             icon: Lightbulb,    label: 'tip' },
  warn:   { wrap: 'border-warning/40 bg-warning/5 dark:bg-warning/10',             icon: AlertTriangle, label: 'warning' },
  danger: { wrap: 'border-destructive/40 bg-destructive/5 dark:bg-destructive/10', icon: ShieldAlert,  label: 'danger' },
  spec:   { wrap: 'border-info/30 bg-info/5 dark:bg-info/10',                      icon: BookOpen,     label: 'spec' },
};

export function Callout({ type = 'note', title, children }: { type?: CalloutType; title?: string; children: React.ReactNode }) {
  const s = styles[type];
  const Icon = s.icon;
  return (
    <aside className={cn('not-prose my-6 rounded-lg border px-4 py-3.5', s.wrap)}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">{title ?? s.label}</div>
          <div className="text-sm leading-relaxed text-foreground">{children}</div>
        </div>
      </div>
    </aside>
  );
}
