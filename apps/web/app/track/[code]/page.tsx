import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasTrackAccess } from '../../../features/tracking/guestAccess';
import { OrderTracking } from '../../../features/tracking/components/OrderTracking';
import { getGuestOrderByCode } from '../../../features/checkout/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export const dynamic = 'force-dynamic';

interface TrackCodePageProps {
  params: Promise<{ code: string }>;
}

export const metadata: Metadata = {
  title: 'Order tracking',
  robots: { index: false, follow: false },
};

/**
 * Guest timeline. The order code in the URL is not enough on its own: the
 * visitor must hold the signed cookie that the tracking lookup sets after a
 * correct phone or email. Without it the page reports not found.
 */
export default async function TrackCodePage({ params }: TrackCodePageProps) {
  const { code } = await params;
  const orderCode = decodeURIComponent(code);

  if (!(await hasTrackAccess(orderCode))) notFound();

  const order = await getGuestOrderByCode(orderCode);
  if (!order) notFound();

  const locale = await getLocale();
  return <OrderTracking order={order} copy={getDictionary(locale).checkout} locale={locale} />;
}
