import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium tracking-tight transition-colors',
  {
    variants: {
      variant: {
        default:   'border-primary/20 bg-primary/10 text-primary',
        secondary: 'border-accent/20 bg-accent/10 text-accent',
        highlight: 'border-highlight/20 bg-highlight/10 text-highlight',
        outline:   'border-border bg-card text-foreground',
        muted:     'border-transparent bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'outline' },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
