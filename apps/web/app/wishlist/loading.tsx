import { Skeleton } from '@sd/ui';
import { ProductGridSkeleton } from '../../features/catalog/components/ProductGrid';
import { pageLayout } from '../../features/shell/pageLayout';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

/** Matches the wishlist page: heading, description and the saved product grid. */
export default async function WishlistLoading() {
  const copy = getDictionary(await getLocale());

  return (
    <div
      className={pageLayout.standard}
      role="status"
      aria-busy="true"
      aria-label={copy.common.loadingLabel}
    >
      <div className="max-w-2xl">
        <Skeleton className="h-9 w-56 max-w-full" />
        <Skeleton className="mt-3 h-4 w-full max-w-md" />
      </div>
      <div className="mt-8">
        <ProductGridSkeleton label={copy.catalog.loading} />
      </div>
    </div>
  );
}
