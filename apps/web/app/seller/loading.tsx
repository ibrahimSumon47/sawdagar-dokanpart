import { SellerDashboardSkeleton } from '../../features/seller/components/SellerDashboard';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

/** Matches the seller home: store status, number tiles and recent sub-orders. */
export default async function SellerLoading() {
  const copy = getDictionary(await getLocale());

  return (
    <SellerDashboardSkeleton
      label={copy.common.loadingLabel}
      tableLabel={copy.common.loadingTable}
    />
  );
}
