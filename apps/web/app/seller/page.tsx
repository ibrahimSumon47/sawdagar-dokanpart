import type { Metadata } from 'next';
import { requireSellerPage } from '../../features/seller/session';
import { SellerDashboard } from '../../features/seller/components/SellerDashboard';
import { SellerEmpty } from '../../features/seller/components/SellerEmpty';
import { getSellerDashboard, getSellerStore } from '../../features/seller/queries';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.title, description: copy.seller.description };
}

/** Seller home with store status, totals and recent sub-orders. */
export default async function SellerPage() {
  const { access } = await requireSellerPage('/seller');
  const locale = await getLocale();
  const copy = getDictionary(locale);

  if (!access) return <SellerEmpty copy={copy.seller} />;

  const [store, dashboard] = await Promise.all([
    getSellerStore(access.organizationId),
    getSellerDashboard(access.organizationId),
  ]);
  if (!store) return <SellerEmpty copy={copy.seller} />;

  return (
    <SellerDashboard
      store={store}
      dashboard={dashboard}
      copy={copy.seller}
      checkoutCopy={copy.checkout}
      locale={locale}
    />
  );
}
