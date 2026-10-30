import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends ComponentProps<'span'> {
  tone?: BadgeTone;
}

const toneClass: Record<BadgeTone, string> = {
  neutral: 'border-line bg-surface text-ink-muted',
  accent: 'border-transparent bg-accent text-accent-contrast',
  success: 'border-success/30 bg-success/10 text-success-strong',
  warning: 'border-warning/30 bg-warning/10 text-warning-strong',
  danger: 'border-danger/30 bg-danger/10 text-danger-strong',
};

/** Renders a compact status label such as a sale flag or order state. */
export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold tracking-wide',
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}
