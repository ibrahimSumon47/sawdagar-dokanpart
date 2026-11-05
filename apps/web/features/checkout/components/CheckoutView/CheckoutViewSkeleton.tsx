import { Skeleton, SkeletonText } from '@sd/ui';

export interface CheckoutViewSkeletonProps {
  /** Localised spoken label for the busy form. */
  label: string;
}

/**
 * Stands in for the checkout form. It keeps the same two-column grid as {@link CheckoutView}:
 * address, payment and review panels on the left, the order summary card on the right.
 */
export function CheckoutViewSkeleton({ label }: CheckoutViewSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"
    >
      <div className="space-y-6">
        <section className="rounded-sm border border-line bg-surface p-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-4 w-64 max-w-full" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-16 rounded-sm" />
            ))}
          </div>
        </section>
        <section className="rounded-sm border border-line bg-surface p-5">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-72 max-w-full" />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Skeleton className="h-16 rounded-sm" />
            <Skeleton className="h-16 rounded-sm" />
          </div>
        </section>
      </div>
      <aside className="h-fit rounded-sm border border-line bg-surface p-5">
        <Skeleton className="h-6 w-36" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="size-14 shrink-0 rounded-sm" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="mt-2 h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
        <SkeletonText className="mt-5" lines={3} />
        <Skeleton className="mt-5 h-11 w-full rounded-sm" />
      </aside>
    </div>
  );
}
