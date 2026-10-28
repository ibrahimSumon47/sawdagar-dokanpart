import type { Metadata } from 'next';
import { SellerEmpty } from '../../../features/seller/components/SellerEmpty';
import { SellerOrderTable } from '../../../features/seller/components/SellerOrderTable';
import { SellerSection } from '../../../features/seller/components/SellerSection';
import { getSellerOrders } from '../../../features/seller/queries';
import { requireSellerPage } from '../../../features/seller/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.ordersTitle };
}

/** All sub-orders for the signed-in store. */
export default async function SellerOrdersPage() {
  const { access } = await requireSellerPage('/seller/orders');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const orders = await getSellerOrders(access.organizationId);

  return (
    <SellerSection
      active="orders"
      title={copy.seller.ordersTitle}
      description={copy.seller.ordersDescription}
      copy={copy.seller}
    >
      {orders.length === 0 ? (
        <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          {copy.seller.noOrders}
        </p>
      ) : (
        <SellerOrderTable
          orders={orders}
          copy={copy.seller}
          checkoutCopy={copy.checkout}
          locale={locale}
        />
      )}
    </SellerSection>
  );
}
