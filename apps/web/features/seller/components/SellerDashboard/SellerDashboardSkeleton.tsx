import { Skeleton, SkeletonStat, SkeletonTable } from '@sd/ui';
import { SellerSectionSkeleton } from '../SellerSection';

export interface SellerDashboardSkeletonProps {
  /** Localised spoken label for the busy dashboard. */
  label: string;
  /** Localised spoken label for the recent orders table. */
  tableLabel: string;
}

/**
 * Stands in for the seller home: store status card, four number tiles and the newest
 * sub-orders table, inside the shared Seller Center frame.
 */
export function SellerDashboardSkeleton({ label, tableLabel }: SellerDashboardSkeletonProps) {
  return (
    <SellerSectionSkeleton label={label}>
      <section className="rounded-sm border border-line bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="mt-2 h-3.5 w-32" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-sm" />
          </div>
        </div>
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonStat key={index} />
        ))}
      </div>

      <section className="mt-8">
        <Skeleton className="h-6 w-40" />
        <div className="mt-3">
          <SkeletonTable label={tableLabel} rows={4} columns={4} />
        </div>
      </section>
    </SellerSectionSkeleton>
  );
}
