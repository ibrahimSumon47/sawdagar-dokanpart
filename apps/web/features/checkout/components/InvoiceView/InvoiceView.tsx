import { Badge, ButtonLink, Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { placeName } from '../../../../i18n/places';
import { formatDate } from '../../../../lib/formatDate';
import { paymentStatusLabel, statusTone } from '../../labels';
import type { OrderRecord } from '../../queries';
import { PrintButton } from '../PrintButton';

export interface InvoiceViewProps {
  order: OrderRecord;
  copy: Dictionary;
  locale: Locale;
}

/** A printable record of one order, with seller groups and payment state. */
export function InvoiceView({ order, copy, locale }: InvoiceViewProps) {
  const items = order.subOrders.flatMap((subOrder) =>
    subOrder.items.map((item) => ({ ...item, vendorName: subOrder.vendorName })),
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 print:hidden">
        <ButtonLink href={`/orders/${order.number}`} variant="ghost">
          {copy.checkout.orderTitle}
        </ButtonLink>
        <PrintButton label={copy.checkout.printInvoice} />
      </div>

      <article className="rounded-sm border border-line bg-surface p-6 sm:p-10 print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-6">
          <div>
            <p className="font-serif text-2xl text-ink">{copy.common.brand}</p>
            <p className="mt-1 text-xs text-ink-muted">{copy.checkout.placedOn}</p>
          </div>
          <div className="text-right">
            <h1 className="font-serif text-3xl text-ink">{copy.checkout.invoiceTitle}</h1>
            <p className="mt-1 text-sm text-ink-muted">{order.number}</p>
            <p className="text-sm text-ink-muted">
              {copy.checkout.placedOn} {formatDate(order.placedAt, locale)}
            </p>
          </div>
        </header>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {copy.checkout.billTo}
            </h2>
            <address className="mt-2 text-sm not-italic leading-relaxed text-ink">
              <span className="block font-medium">{order.shippingName}</span>
              <span className="block">{order.shippingPhone}</span>
              <span className="block">
                {order.shippingLine}, {order.shippingUpazila}
              </span>
              <span className="block">
                {placeName(order.shippingDistrict, locale)},{' '}
                {placeName(order.shippingDivision, locale)}
              </span>
            </address>
          </section>
          <section className="sm:text-right">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {copy.checkout.payment}
            </h2>
            <p className="mt-2 text-sm text-ink">
              {order.paymentMethod === 'cod' ? copy.checkout.codTitle : copy.checkout.mockPayTitle}
            </p>
            <Badge tone={statusTone(order.paymentStatus)}>
              {paymentStatusLabel(copy.checkout, order.paymentStatus)}
            </Badge>
          </section>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                <th scope="col" className="py-2 pr-3 font-medium">
                  {copy.checkout.itemColumn}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  {copy.checkout.quantity}
                </th>
                <th scope="col" className="py-2 pl-3 text-right font-medium">
                  {copy.checkout.amountColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-b-0">
                  <td className="py-3 pr-3">
                    <span className="block font-medium text-ink">
                      {locale === 'bn' ? item.titleBn : item.titleEn}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {item.vendorName} · {item.sku}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-ink-muted">{item.quantity}</td>
                  <td className="py-3 pl-3 text-right">
                    <Price amountMinor={item.lineTotalMinor} locale={locale} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex justify-between gap-3 text-ink-muted">
            <span>{copy.checkout.subtotal}</span>
            <span>
              <Price amountMinor={order.subtotalMinor} locale={locale} size="sm" />
            </span>
          </div>
          {order.discountMinor > 0 ? (
            <div className="flex justify-between gap-3 text-success">
              <span>{copy.checkout.coupon}</span>
              <span>
                − <Price amountMinor={order.discountMinor} locale={locale} size="sm" />
              </span>
            </div>
          ) : null}
          <div className="flex justify-between gap-3 text-ink-muted">
            <span>{copy.checkout.shipping}</span>
            <span>
              {order.shippingMinor === 0 ? (
                copy.checkout.free
              ) : (
                <Price amountMinor={order.shippingMinor} locale={locale} size="sm" />
              )}
            </span>
          </div>
          <div className="flex justify-between gap-3 border-t border-line pt-2">
            <span className="font-semibold text-ink">{copy.checkout.total}</span>
            <Price amountMinor={order.totalMinor} locale={locale} size="md" />
          </div>
        </div>

        <footer className="mt-8 border-t border-line pt-4 text-xs leading-relaxed text-ink-muted">
          {copy.checkout.vatIncluded}
        </footer>
      </article>
    </div>
  );
}
