import { ButtonLink } from '@sd/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SellerEmpty } from '../../../../features/seller/components/SellerEmpty';
import { SellerFulfillmentPanel } from '../../../../features/seller/components/SellerFulfillmentPanel';
import { SellerNotice } from '../../../../features/seller/components/SellerNotice';
import { SellerOrderSummary } from '../../../../features/seller/components/SellerOrderSummary';
import { SellerSection } from '../../../../features/seller/components/SellerSection';
import { sellerNotice } from '../../../../features/seller/notice';
import { getSellerOrder } from '../../../../features/seller/queries';
import { requireSellerPage } from '../../../../features/seller/session';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.orderTitle };
}

interface SellerOrderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}

/** One sub-order with delivery details and the next fulfillment step. */
export default async function SellerOrderPage({ params, searchParams }: SellerOrderPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { access } = await requireSellerPage(`/seller/orders/${id}`);
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const order = await getSellerOrder(access.organizationId, id);
  if (!order) notFound();

  const notice = sellerNotice(copy.seller, query);

  return (
    <SellerSection
      active="orders"
      title={`${copy.seller.orderTitle} ${order.number}`}
      description={copy.seller.orderDescription}
      copy={copy.seller}
    >
      <div className="space-y-5">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <ButtonLink href="/seller/orders" variant="secondary" size="sm">
          {copy.seller.back}
        </ButtonLink>
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <SellerOrderSummary order={order} copy={copy.seller} locale={locale} />
          <SellerFulfillmentPanel
            order={order}
            copy={copy.seller}
            checkoutCopy={copy.checkout}
            locale={locale}
          />
        </div>
      </div>
    </SellerSection>
  );
}
