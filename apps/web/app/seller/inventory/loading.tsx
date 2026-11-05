import { SellerTableSkeleton } from '../../../features/seller/components/SellerTableSkeleton';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

/** Matches a Seller Center list page: section frame, filters row and rows. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return (
    <SellerTableSkeleton label={copy.common.loadingLabel} tableLabel={copy.common.loadingTable} />
  );
}
