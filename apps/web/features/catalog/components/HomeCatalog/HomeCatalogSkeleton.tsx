import { Skeleton } from '@sd/ui';
import { pageLayout } from '../../../shell/pageLayout';
import { CategoryTilesSkeleton } from '../CategoryTiles/CategoryTilesSkeleton';
import { ProductGridSkeleton } from '../ProductGrid';

export interface HomeCatalogSkeletonProps {
  /** Localised spoken label for the department grid. */
  categoriesLabel: string;
  /** Localised spoken label for the featured product grid. */
  productsLabel: string;
}

/**
 * Stands in for the home page departments and featured products. The section padding comes
 * from the same layout constants the real sections use, and the grid comes from the shared
 * product grid skeleton.
 */
export function HomeCatalogSkeleton({ categoriesLabel, productsLabel }: HomeCatalogSkeletonProps) {
  return (
    <>
      <section className={pageLayout.section} aria-busy="true">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 h-8 w-64" />
        <div className="mt-6">
          <CategoryTilesSkeleton label={categoriesLabel} />
        </div>
      </section>

      <section className={pageLayout.sectionTight} aria-busy="true">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Skeleton className="h-8 w-56" />
            <Skeleton className="mt-3 h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-9 w-28 rounded-sm" />
        </div>
        <div className="mt-6">
          <ProductGridSkeleton label={productsLabel} count={4} />
        </div>
      </section>
    </>
  );
}
