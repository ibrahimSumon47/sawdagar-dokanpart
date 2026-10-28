import { ProductCardSkeleton } from '@sd/ui';

export interface ProductGridSkeletonProps {
  count?: number;
  /** Localised loading description announced to assistive technology. */
  label: string;
}

/** Matches the responsive columns of {@link ProductGrid}. */
export function ProductGridSkeleton({ count = 12, label }: ProductGridSkeletonProps) {
  return (
    <div role="status" aria-busy="true" aria-label={label}>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
