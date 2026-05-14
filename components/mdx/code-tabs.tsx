'use client';

import { Children, useState } from 'react';
import { cn } from '@/lib/utils';

// Usage in MDX:
// <CodeTabs labels={['C', 'Rust', 'asm']}>
//   ```c ... ```
//   ```rust ... ```
//   ```asm ... ```
// </CodeTabs>

export function CodeTabs({ labels, children }: { labels: string[]; children: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const panels = Children.toArray(children);

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border bg-card">
      <div role="tablist" className="flex items-stretch border-b bg-muted/30">
        {labels.map((label, i) => (
          <button
            key={i}
            role="tab"
            type="button"
            onClick={() => setActive(i)}
            aria-selected={i === active}
            className={cn(
              'relative -mb-px px-3.5 py-2 font-mono text-xs transition-colors',
              i === active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            <span
              className={cn(
                'absolute inset-x-2 -bottom-px h-px transition-colors',
                i === active ? 'bg-foreground' : 'bg-transparent',
              )}
            />
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1">
        {panels.map((p, i) => (
          <div
            key={i}
            className={cn('min-w-0 [&_pre]:!my-0 [&_pre]:!rounded-none [&_pre]:!border-0', i === active ? '' : 'hidden')}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
