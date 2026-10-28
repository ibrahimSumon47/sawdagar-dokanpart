import { Badge, ButtonLink } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { orderStatusLabel, paymentStatusLabel, statusTone } from '../../labels';
import type { OrderRecord } from '../../queries';
import { OrderItems } from '../OrderItems';
import { OrderTotals } from '../OrderTotals';

export interface OrderConfirmationProps {
  order: OrderRecord;
  copy: Dictionary['checkout'];
  locale: Locale;
  placed?: boolean;
  paymentNotice?: 'paid' | 'failed' | 'cancelled';
  paymentHref?: string;
}

/** The receipt page: status, seller groups, address, payment and invoice. */
export function OrderConfirmation({
  order,
  copy,
  locale,
  placed,
  paymentNotice,
  paymentHref,
}: OrderConfirmationProps) {
  const provider = order.paymentMethod === 'cod' ? copy.codTitle : copy.mockPayTitle;
  const notice =
    paymentNotice === 'paid'
      ? copy.paymentPaidStatus
      : paymentNotice === 'failed'
        ? copy.paymentFailed
        : paymentNotice === 'cancelled'
          ? copy.paymentCancelled
          : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-accent">{copy.orderTitle}</p>
          <h1 className="mt-1 font-serif text-title leading-tight text-ink">{order.number}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {copy.placedOn} {formatDate(order.placedAt, locale)}
          </p>
        </div>
        <Badge tone={statusTone(order.status)}>{orderStatusLabel(copy, order.status)}</Badge>
      </header>

      {placed ? (
        <div className="mt-6 rounded-sm border border-success/40 bg-success/5 p-4">
          <p className="font-semibold text-success">{copy.orderPlaced}</p>
          <p className="mt-1 text-sm text-ink-muted">{copy.orderPlacedBody}</p>
        </div>
      ) : null}
      {notice ? (
        <p
          role="status"
          className="mt-6 rounded-sm border border-line bg-surface p-4 text-sm text-ink"
        >
          {notice}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <OrderItems order={order} copy={copy} locale={locale} />
          {order.notes ? (
            <section className="rounded-sm border border-line bg-surface p-4">
              <h2 className="text-sm font-semibold text-ink">{copy.notesTitle}</h2>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-muted">{order.notes}</p>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          {order.paymentMethod === 'mockpay' &&
          order.paymentStatus !== 'paid' &&
          order.status !== 'cancelled' ? (
            <section className="rounded-sm border border-accent/40 bg-accent/5 p-4">
              <h2 className="text-sm font-semibold text-ink">{copy.paymentPending}</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {copy.paymentPendingBody}
              </p>
              {paymentHref ? (
                <ButtonLink href={paymentHref} className="mt-3 w-full">
                  {copy.payNow}
                </ButtonLink>
              ) : null}
            </section>
          ) : null}

          <section className="rounded-sm border border-line bg-surface p-5">
            <h2 className="font-serif text-xl text-ink">{copy.summaryTitle}</h2>
            <OrderTotals order={order} copy={copy} locale={locale} className="mt-4" />
          </section>

          <section className="rounded-sm border border-line bg-surface p-5 text-sm">
            <h2 className="font-serif text-lg text-ink">{copy.shippingAddress}</h2>
            <address className="mt-2 not-italic leading-relaxed text-ink-muted">
              <span className="block font-medium text-ink">{order.shippingName}</span>
              <span className="block">{order.shippingPhone}</span>
              <span className="block">
                {order.shippingLine}, {order.shippingUpazila}
                {order.shippingArea ? `, ${order.shippingArea}` : ''}
              </span>
              <span className="block">
                {order.shippingDistrict}, {order.shippingDivision}
              </span>
            </address>
          </section>

          <section className="rounded-sm border border-line bg-surface p-5 text-sm">
            <h2 className="font-serif text-lg text-ink">{copy.payment}</h2>
            <p className="mt-2 text-ink-muted">{provider}</p>
            <Badge tone={statusTone(order.paymentStatus)}>
              {paymentStatusLabel(copy, order.paymentStatus)}
            </Badge>
          </section>

          <div className="flex flex-col gap-2">
            <ButtonLink href={`/orders/${order.number}/invoice`} variant="secondary">
              {copy.invoice}
            </ButtonLink>
            <Link
              href="/account/mail"
              className="text-center text-sm font-medium text-accent underline underline-offset-4"
            >
              {copy.mailLink}
            </Link>
          </div>

          <p className="text-xs leading-relaxed text-ink-muted">{copy.demoNotice}</p>
        </aside>
      </div>
    </div>
  );
}
