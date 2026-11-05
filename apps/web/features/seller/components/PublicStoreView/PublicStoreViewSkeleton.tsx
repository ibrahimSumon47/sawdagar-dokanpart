import { Skeleton } from '@sd/ui';
import { ProductGridSkeleton } from '../../../catalog/components/ProductGrid';
import { pageLayout } from '../../../shell/pageLayout';

export interface PublicStoreViewSkeletonProps {
  /** Localised spoken label for the busy storefront. */
  label: string;
  /** Localised spoken label for the product grid. */
  gridLabel: string;
}

/**
 * Stands in for a public vendor storefront: banner with the store name and rating, the
 * description and policies row, then the product grid.
 */
export function PublicStoreViewSkeleton({ label, gridLabel }: PublicStoreViewSkeletonProps) {
  return (
    <div className={pageLayout.wide} role="status" aria-busy="true" aria-label={label}>
      <Skeleton className="h-40 rounded-sm" />
      <Skeleton className="mt-6 h-9 w-64 max-w-full" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 w-4/5 max-w-xl" />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-20 rounded-sm" />
        ))}
      </div>
      <div className="mt-10">
        <Skeleton className="h-7 w-48" />
        <div className="mt-4">
          <ProductGridSkeleton label={gridLabel} />
        </div>
      </div>
    </div>
  );
}
