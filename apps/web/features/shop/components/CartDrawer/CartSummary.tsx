'use client';

import { formatTaka } from '@sd/domain';
import { ButtonLink, Price } from '@sd/ui';
import { FREE_DELIVERY_THRESHOLD_MINOR } from '../../cartTotals';
import { formatTemplate } from '../../formatTemplate';
import { CouponForm } from '../CouponForm';
import { useShop } from '../ShopProvider';

/** Free-delivery progress, coupon entry, estimated totals and the checkout link. */
export function CartSummary() {
  const { copy, locale, summary, signedIn, closeCart } = useShop();
  const progress = Math.min(
    100,
    Math.round((summary.subtotalMinor / FREE_DELIVERY_THRESHOLD_MINOR) * 100),
  );

  return (
    <div className="border-t border-line bg-surface p-4 sm:p-5">
      <div className="rounded-sm border border-line bg-background p-3">
        <p className="text-sm font-medium text-ink">
          {summary.freeDeliveryRemainingMinor > 0
            ? formatTemplate(copy.freeDeliveryProgress, {
                amount: formatTaka(summary.freeDeliveryRemainingMinor, locale),
              })
            : copy.freeDeliveryUnlocked}
        </p>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label={copy.freeDeliveryProgress.replace('{amount}', '')}
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4">
        <CouponForm />
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-muted">{copy.subtotal}</dt>
          <dd>
            <Price amountMinor={summary.subtotalMinor} locale={locale} size="sm" />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-muted">{copy.delivery}</dt>
          <dd className="text-sm font-medium text-ink">
            {summary.deliveryMinor === 0 ? (
              copy.freeDelivery
            ) : (
              <Price amountMinor={summary.deliveryMinor} locale={locale} size="sm" />
            )}
          </dd>
        </div>
        {summary.discountMinor > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-success">{copy.couponDiscount}</dt>
            <dd className="text-success">
              − <Price amountMinor={summary.discountMinor} locale={locale} size="sm" />
            </dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3 border-t border-line pt-2">
          <dt className="font-semibold text-ink">{copy.total}</dt>
          <dd>
            <Price amountMinor={summary.totalMinor} locale={locale} size="md" />
          </dd>
        </div>
      </dl>

      <ButtonLink
        href={signedIn ? '/checkout' : '/sign-in?next=%2Fcheckout'}
        onClick={closeCart}
        className="mt-4 w-full"
      >
        {copy.checkout}
      </ButtonLink>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted">{copy.checkoutNote}</p>
    </div>
  );
}
