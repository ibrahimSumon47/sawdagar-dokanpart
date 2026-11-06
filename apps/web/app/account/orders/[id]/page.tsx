import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireViewer } from '../../../../features/auth/session';
import { getOrderForViewer } from '../../../../features/checkout/queries';
import { OrderTracking } from '../../../../features/tracking/components/OrderTracking';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export const dynamic = 'force-dynamic';

interface AccountOrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Order tracking',
  robots: { index: false, follow: false },
};

/** Signed-in tracking view. The order is loaded only when it belongs to the viewer. */
export default async function AccountOrderTrackingPage({ params }: AccountOrderTrackingPageProps) {
  const { id } = await params;
  const viewer = await requireViewer(`/account/orders/${id}`);
  const order = await getOrderForViewer(decodeURIComponent(id), viewer.id);
  if (!order) notFound();

  const locale = await getLocale();
  return (
    <OrderTracking
      order={order}
      copy={getDictionary(locale).checkout}
      locale={locale}
      live={{ number: order.number }}
    />
  );
}
