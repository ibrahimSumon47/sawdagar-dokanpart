import { ButtonLink, ErrorState } from '@sd/ui';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getViewer } from '../../../../features/auth/session';
import { MockPayPanel } from '../../../../features/checkout/components/MockPayPanel';
import { verifyMockPayToken } from '../../../../features/checkout/mockPayToken';
import { getPaymentById, getPaymentForViewer } from '../../../../features/checkout/queries';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.checkout.mockPayTitle };
}

interface MockPayPageProps {
  params: Promise<{ paymentId: string }>;
  searchParams: Promise<{ token?: string }>;
}

/**
 * Sandbox gateway page. The signed token is the credential, so a guest can pay
 * without a session. A signed-in buyer must also own the order.
 */
export default async function MockPayPage({ params, searchParams }: MockPayPageProps) {
  const [{ paymentId }, query] = await Promise.all([params, searchParams]);
  const token = query.token ?? '';
  const locale = await getLocale();
  const copy = getDictionary(locale);

  if (!verifyMockPayToken(paymentId, token)) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState
          title={copy.checkout.paymentInvalidToken}
          description={copy.checkout.paymentPendingBody}
          action={<ButtonLink href="/checkout">{copy.checkout.title}</ButtonLink>}
        />
      </div>
    );
  }

  const viewer = await getViewer();
  const payment = viewer
    ? await getPaymentForViewer(paymentId, viewer.id)
    : await getPaymentById(paymentId);
  if (!payment) notFound();

  if (payment.status === 'paid') {
    redirect(
      viewer
        ? `/orders/${payment.order.number}?payment=paid`
        : `/order/confirmed?code=${payment.order.orderCode ?? ''}`,
    );
  }

  return (
    <MockPayPanel
      paymentId={paymentId}
      token={token}
      orderNumber={payment.order.number}
      amountMinor={payment.amountMinor}
      locale={locale}
      copy={copy.checkout}
    />
  );
}
