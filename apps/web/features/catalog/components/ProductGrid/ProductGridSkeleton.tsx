import { ProductCardSkeleton } from '@sd/ui';
import { productGridClass } from './productGridLayout';

export interface ProductGridSkeletonProps {
  count?: number;
  /** Localised loading description announced to assistive technology. */
  label: string;
}

/** Matches the responsive columns of {@link ProductGrid}. */
export function ProductGridSkeleton({ count = 12, label }: ProductGridSkeletonProps) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className="@container min-w-0">
      <div className={productGridClass}>
        {Array.from({ length: count }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
