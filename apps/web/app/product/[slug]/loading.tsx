import { Skeleton } from '@sd/ui';
import { ProductGridSkeleton } from '../../../features/catalog/components/ProductGrid';
import { pageLayout } from '../../../features/shell/pageLayout';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

/**
 * Matches the product page: breadcrumb, media panel, summary and variants, the about and
 * vendor row, the reviews and questions panels, and the related grid.
 */
export default async function ProductLoading() {
  const copy = getDictionary(await getLocale());

  return (
    <div
      className={pageLayout.standard}
      role="status"
      aria-busy="true"
      aria-label={copy.common.loadingLabel}
    >
      <Skeleton className="h-4 w-2/3 max-w-lg" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <Skeleton className="aspect-square rounded-sm sm:aspect-[4/5]" />
        <div className="space-y-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-11 w-64" />
          <div className="grid gap-2 pt-4 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-20 rounded-sm" />
            ))}
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl" />
          <Skeleton className="mt-2 h-4 w-5/6 max-w-lg" />
        </div>
        <Skeleton className="h-44 rounded-sm" />
      </div>

      <div className="mt-12 space-y-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-24 rounded-sm" />
        <Skeleton className="h-24 rounded-sm" />
      </div>

      <div className="mt-12 space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-20 rounded-sm" />
      </div>

      <div className="mt-14">
        <Skeleton className="h-7 w-56" />
        <div className="mt-6">
          <ProductGridSkeleton label={copy.catalog.loading} />
        </div>
      </div>
    </div>
  );
}
