import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireViewer } from '../../../features/auth/session';
import { OrderConfirmation } from '../../../features/checkout/components/OrderConfirmation';
import { createMockPayToken } from '../../../features/checkout/mockPayToken';
import { getOrderForViewer } from '../../../features/checkout/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export const dynamic = 'force-dynamic';

interface OrderPageProps {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ placed?: string; payment?: string }>;
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { number } = await params;
  const copy = getDictionary(await getLocale());
  return { title: `${copy.checkout.orderTitle} ${number}` };
}

function paymentHref(order: Awaited<ReturnType<typeof getOrderForViewer>>): string | undefined {
  if (!order || order.paymentStatus === 'paid' || order.status === 'cancelled') return undefined;
  if (order.paymentMethod !== 'mockpay') return undefined;

  const pending = order.payments.find(
    (payment) => payment.status === 'pending' || payment.status === 'failed',
  );
  if (!pending) return undefined;

  try {
    return `/checkout/pay/${pending.id}?token=${encodeURIComponent(createMockPayToken(pending.id))}`;
  } catch {
    return undefined;
  }
}

function paymentNotice(value: string | undefined): 'paid' | 'failed' | 'cancelled' | undefined {
  if (value === 'paid' || value === 'failed' || value === 'cancelled') return value;
  return undefined;
}

/** Receipt page for one order owned by the signed-in buyer. */
export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const [{ number }, query] = await Promise.all([params, searchParams]);
  const viewer = await requireViewer(`/orders/${number}`);
  const order = await getOrderForViewer(number, viewer.id);
  if (!order) notFound();

  const locale = await getLocale();
  const copy = getDictionary(locale);

  return (
    <OrderConfirmation
      order={order}
      copy={copy.checkout}
      locale={locale}
      placed={query.placed === '1'}
      paymentNotice={paymentNotice(query.payment)}
      paymentHref={paymentHref(order)}
    />
  );
}
