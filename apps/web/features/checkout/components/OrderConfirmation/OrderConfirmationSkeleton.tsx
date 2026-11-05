import { Skeleton } from '@sd/ui';
import { pageLayout } from '../../../shell/pageLayout';

export interface OrderConfirmationSkeletonProps {
  /** Localised spoken label for the busy receipt. */
  label: string;
}

/**
 * Stands in for an order receipt: header with number, date and status badge, the item list on
 * the left and the payment summary column on the right.
 */
export function OrderConfirmationSkeleton({ label }: OrderConfirmationSkeletonProps) {
  return (
    <div className={pageLayout.wide} role="status" aria-busy="true" aria-label={label}>
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-2 h-9 w-48" />
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </header>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Skeleton className="h-20 rounded-sm" />
          <Skeleton className="h-20 rounded-sm" />
          <Skeleton className="h-20 rounded-sm" />
        </div>
        <aside className="space-y-4">
          <Skeleton className="h-44 rounded-sm" />
          <Skeleton className="h-28 rounded-sm" />
        </aside>
      </div>
    </div>
  );
}
