import { Skeleton } from '@sd/ui';
import { pageLayout } from '../../../shell/pageLayout';

export interface ProductBelowFoldSkeletonProps {
  /** Localised spoken label, e.g. "Loading the storefront". */
  label: string;
}

/**
 * Stands in for the reviews, questions and related products while their data loads.
 * It is streamed in the first HTML, so the product page shows a loading region under
 * the buy box instead of an empty gap.
 */
export function ProductBelowFoldSkeleton({ label }: ProductBelowFoldSkeletonProps) {
  return (
    <section
      className={`${pageLayout.section} space-y-4`}
      role="status"
      aria-busy="true"
      aria-label={label}
      data-skeleton="product-below-fold"
    >
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-4 w-3/4 max-w-lg" />
    </section>
  );
}
