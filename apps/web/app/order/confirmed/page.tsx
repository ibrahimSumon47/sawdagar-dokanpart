import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isOrderCode } from '@sd/domain';
import { AccountPromptModal } from '../../../features/checkout/components/AccountPromptModal';
import { GuestOrderHeader } from '../../../features/checkout/components/GuestOrderHeader';
import { OrderConfirmation } from '../../../features/checkout/components/OrderConfirmation';
import { getGuestOrderByCode } from '../../../features/checkout/queries';
import { getViewer } from '../../../features/auth/session';
import { pageLayout } from '../../../features/shell/pageLayout';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

interface GuestConfirmationPageProps {
  searchParams: Promise<{ code?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.checkout.guestOrderTitle, robots: { index: false } };
}

/**
 * Confirmation page for a guest order. The order code in the URL is the only
 * key, and the lookup only matches guest orders, so signed-in orders never appear here.
 */
export default async function GuestConfirmationPage({ searchParams }: GuestConfirmationPageProps) {
  const { code } = await searchParams;
  if (!code || !isOrderCode(code)) notFound();

  const order = await getGuestOrderByCode(code);
  if (!order || !order.orderCode) notFound();

  const locale = await getLocale();
  const copy = getDictionary(locale);
  const viewer = await getViewer();
  const trackHref = `/order/confirmed?code=${encodeURIComponent(order.orderCode)}`;

  return (
    <>
      <div className={`${pageLayout.wide} pb-0`}>
        <GuestOrderHeader
          code={order.orderCode}
          placedAt={order.placedAt}
          copy={copy.checkout}
          locale={locale}
          trackHref={trackHref}
        />
      </div>
      <OrderConfirmation order={order} copy={copy.checkout} locale={locale} placed />
      {viewer ? null : <AccountPromptModal copy={copy.checkout} email={order.guestEmail} />}
    </>
  );
}
