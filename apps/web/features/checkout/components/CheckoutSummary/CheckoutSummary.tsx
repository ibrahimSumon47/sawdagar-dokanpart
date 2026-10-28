import type { CheckoutTotals } from '@sd/domain';
import { Price } from '@sd/ui';
import type { Locale } from '../../../../i18n';
import type { Dictionary } from '../../../../i18n';
import { formatTemplate } from '../../../shop/formatTemplate';

export interface CheckoutSummaryProps {
  totals: CheckoutTotals;
  count: number;
  couponCode?: string;
  locale: Locale;
  copy: Dictionary['checkout'];
}

/** Server-priced totals shown beside the checkout form. */
export function CheckoutSummary({ totals, count, couponCode, locale, copy }: CheckoutSummaryProps) {
  const countLabel =
    count === 1 ? copy.itemOne : formatTemplate(copy.items, { count: String(count) });

  return (
    <div className="rounded-sm border border-line bg-surface p-5">
      <h2 className="font-serif text-xl text-ink">{copy.summaryTitle}</h2>
      <p className="mt-1 text-sm text-ink-muted">{countLabel}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-muted">{copy.subtotal}</dt>
          <dd>
            <Price amountMinor={totals.subtotalMinor} locale={locale} size="sm" />
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-muted">{copy.shipping}</dt>
          <dd>
            {totals.shippingMinor === 0 ? (
              <span className="text-success">{copy.free}</span>
            ) : (
              <Price amountMinor={totals.shippingMinor} locale={locale} size="sm" />
            )}
          </dd>
        </div>
        {totals.couponSavingsMinor > 0 ? (
          <div className="flex justify-between gap-3">
            <dt className="text-success">
              {copy.coupon}
              {couponCode ? ` ${couponCode}` : ''}
            </dt>
            <dd className="text-success">
              − <Price amountMinor={totals.couponSavingsMinor} locale={locale} size="sm" />
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-3 text-xs text-ink-muted">
          <dt>{copy.vatIncluded}</dt>
          <dd>
            <Price amountMinor={totals.vatMinor} locale={locale} size="sm" />
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-line pt-3">
          <dt className="font-semibold text-ink">{copy.total}</dt>
          <dd>
            <Price amountMinor={totals.totalMinor} locale={locale} size="md" />
          </dd>
        </div>
      </dl>

      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-muted">
        {copy.sandboxNote}
      </p>
    </div>
  );
}
