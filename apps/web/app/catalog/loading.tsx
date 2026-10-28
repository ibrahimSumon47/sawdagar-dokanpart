import { Skeleton } from '@sd/ui';
import { ProductGridSkeleton } from '../../features/catalog/components/ProductGrid';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

/** Matches the catalog page: heading, search, category chips, filters and grid. */
export default async function CatalogLoading() {
  const copy = getDictionary(await getLocale());

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="max-w-3xl space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-4/5 max-w-lg" />
      </div>
      <Skeleton className="mt-8 h-11 w-full rounded-sm" />
      <div className="mt-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-24 shrink-0 rounded-sm" />
        ))}
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Skeleton className="hidden h-96 rounded-sm lg:block" />
        <div>
          <Skeleton className="h-4 w-28" />
          <div className="mt-5">
            <ProductGridSkeleton label={copy.catalog.loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
