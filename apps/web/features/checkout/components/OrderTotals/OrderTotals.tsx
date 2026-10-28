import { Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import type { OrderRecord } from '../../queries';

export interface OrderTotalsProps {
  order: OrderRecord;
  copy: Dictionary['checkout'];
  locale: Locale;
  className?: string;
}

/** Subtotal, shipping, coupon, included VAT and total for a placed order. */
export function OrderTotals({ order, copy, locale, className }: OrderTotalsProps) {
  return (
    <dl className={`space-y-2 text-sm ${className ?? ''}`}>
      <div className="flex justify-between gap-3">
        <dt className="text-ink-muted">{copy.subtotal}</dt>
        <dd>
          <Price amountMinor={order.subtotalMinor} locale={locale} size="sm" />
        </dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-ink-muted">{copy.shipping}</dt>
        <dd>
          {order.shippingMinor === 0 ? (
            <span className="text-success">{copy.free}</span>
          ) : (
            <Price amountMinor={order.shippingMinor} locale={locale} size="sm" />
          )}
        </dd>
      </div>
      {order.discountMinor > 0 ? (
        <div className="flex justify-between gap-3">
          <dt className="text-success">
            {copy.coupon}
            {order.couponCode ? ` ${order.couponCode}` : ''}
          </dt>
          <dd className="text-success">
            − <Price amountMinor={order.discountMinor} locale={locale} size="sm" />
          </dd>
        </div>
      ) : null}
      <div className="flex justify-between gap-3 text-xs text-ink-muted">
        <dt>{copy.vatLine}</dt>
        <dd>
          <Price amountMinor={order.vatMinor} locale={locale} size="sm" />
        </dd>
      </div>
      <div className="flex justify-between gap-3 border-t border-line pt-3">
        <dt className="font-semibold text-ink">{copy.total}</dt>
        <dd>
          <Price amountMinor={order.totalMinor} locale={locale} size="md" />
        </dd>
      </div>
    </dl>
  );
}
