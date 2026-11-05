import { PublicStoreViewSkeleton } from '../../../features/seller/components/PublicStoreView';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

/** Matches the public storefront: banner, policies and the product grid. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return (
    <PublicStoreViewSkeleton label={copy.common.loadingLabel} gridLabel={copy.catalog.loading} />
  );
}
