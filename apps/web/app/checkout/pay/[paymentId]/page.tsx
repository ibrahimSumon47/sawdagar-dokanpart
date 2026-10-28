import { ButtonLink, ErrorState } from '@sd/ui';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { requireViewer } from '../../../../features/auth/session';
import { MockPayPanel } from '../../../../features/checkout/components/MockPayPanel';
import { verifyMockPayToken } from '../../../../features/checkout/mockPayToken';
import { getPaymentForViewer } from '../../../../features/checkout/queries';
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

/** Sandbox gateway page. The signed token is checked before any action shows. */
export default async function MockPayPage({ params, searchParams }: MockPayPageProps) {
  const [{ paymentId }, query] = await Promise.all([params, searchParams]);
  const viewer = await requireViewer(`/checkout/pay/${paymentId}`);
  const payment = await getPaymentForViewer(paymentId, viewer.id);
  if (!payment) notFound();

  if (payment.status === 'paid') {
    redirect(`/orders/${payment.order.number}?payment=paid`);
  }

  const locale = await getLocale();
  const copy = getDictionary(locale);
  const token = query.token ?? '';

  if (!verifyMockPayToken(paymentId, token)) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState
          title={copy.checkout.paymentInvalidToken}
          description={copy.checkout.paymentPendingBody}
          action={
            <ButtonLink href={`/orders/${payment.order.number}`}>
              {copy.checkout.orderTitle}
            </ButtonLink>
          }
        />
      </div>
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
