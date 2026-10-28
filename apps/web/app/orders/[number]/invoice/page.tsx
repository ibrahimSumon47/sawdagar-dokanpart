import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireViewer } from '../../../../features/auth/session';
import { InvoiceView } from '../../../../features/checkout/components/InvoiceView';
import { getOrderForViewer } from '../../../../features/checkout/queries';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export const dynamic = 'force-dynamic';

interface InvoicePageProps {
  params: Promise<{ number: string }>;
}

export async function generateMetadata({ params }: InvoicePageProps): Promise<Metadata> {
  const { number } = await params;
  const copy = getDictionary(await getLocale());
  return { title: `${copy.checkout.invoiceTitle} ${number}` };
}

/** Printable invoice for an order owned by the signed-in buyer. */
export default async function InvoicePage({ params }: InvoicePageProps) {
  const { number } = await params;
  const viewer = await requireViewer(`/orders/${number}/invoice`);
  const order = await getOrderForViewer(number, viewer.id);
  if (!order) notFound();

  const locale = await getLocale();

  return <InvoiceView order={order} copy={getDictionary(locale)} locale={locale} />;
}
