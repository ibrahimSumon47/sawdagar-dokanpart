import { cn } from '@sd/ui';
import type { ReactNode } from 'react';

export interface SellerStatProps {
  label: string;
  value: ReactNode;
  /** Optional supporting line under the number. */
  hint?: string;
  className?: string;
}

/** One labelled number on the dashboard, analytics or store status panel. */
export function SellerStat({ label, value, hint, className }: SellerStatProps) {
  return (
    <div className={cn('rounded-sm border border-line bg-surface p-4', className)}>
      <p className="text-xs uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-2 font-serif text-2xl text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}
