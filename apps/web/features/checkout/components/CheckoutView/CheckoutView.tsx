'use client';

import { calculateCheckoutTotals, type CouponRule } from '@sd/domain';
import { ButtonLink, EmptyState } from '@sd/ui';
import { ShoppingBag } from 'lucide-react';
import { useActionState, useMemo, useState } from 'react';
import { initialCheckoutState } from '../../state';
import type { Dictionary, Locale } from '../../../../i18n';
import { placeName } from '../../../../i18n/places';
import { placeOrder } from '../../actions';
import type { PaymentMethod } from '../../inputs';
import type { AddressRecord } from '../../queries';
import type { CartLine } from '../../../shop/types';
import { formatTemplate } from '../../../shop/formatTemplate';
import { SubmitButton } from '../../../auth/components/SubmitButton';
import { AddressFields, type AddressDraft } from '../AddressFields';
import { CheckoutSummary } from '../CheckoutSummary';
import { PaymentOptions } from '../PaymentOptions';

export interface CheckoutViewProps {
  items: CartLine[];
  coupon: CouponRule | null;
  addresses: AddressRecord[];
  copy: Dictionary['checkout'];
  locale: Locale;
}

function blankDraft(address?: AddressRecord): AddressDraft {
  return {
    recipientName: address?.recipientName ?? '',
    phone: address?.phone ?? '',
    division: address?.division ?? 'Dhaka',
    district: address?.district ?? 'Dhaka',
    upazila: address?.upazila ?? '',
    area: address?.area ?? '',
    addressLine: address?.addressLine ?? '',
  };
}

/** Checkout form, saved-address picker and server-priced summary. */
export function CheckoutView({ items, coupon, addresses, copy, locale }: CheckoutViewProps) {
  const [state, formAction] = useActionState(placeOrder, initialCheckoutState);
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? '');
  const [draft, setDraft] = useState<AddressDraft>(() => blankDraft(addresses[0]));
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const now = useMemo(() => new Date(), []);
  const savedAddress = addresses.find((address) => address.id === addressId);
  const activeDistrict = savedAddress?.district ?? draft.district;
  const totals = useMemo(
    () =>
      calculateCheckoutTotals(
        items.map((item) => ({
          vendorId: item.vendorId,
          vendorSlug: item.vendor.slug,
          unitPriceMinor: item.priceMinor,
          quantity: item.quantity,
        })),
        coupon,
        activeDistrict,
        now,
      ),
    [activeDistrict, coupon, items, now],
  );

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag aria-hidden="true" className="size-8" />}
        title={copy.emptyTitle}
        description={copy.emptyBody}
        action={<ButtonLink href="/catalog">{copy.emptyAction}</ButtonLink>}
      />
    );
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <section className="rounded-sm border border-line bg-surface p-5">
          <h2 className="font-serif text-xl text-ink">{copy.addressTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">{copy.addressDescription}</p>

          {addresses.length > 0 ? (
            <fieldset className="mt-4 space-y-2">
              <legend className="text-sm font-medium text-ink">{copy.savedAddress}</legend>
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className="flex cursor-pointer gap-3 rounded-sm border border-line bg-background p-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                >
                  <input
                    type="radio"
                    name="addressId"
                    value={address.id}
                    checked={addressId === address.id}
                    onChange={() => setAddressId(address.id)}
                    className="mt-0.5 size-4 accent-[var(--color-accent)]"
                  />
                  <span>
                    <span className="block font-medium text-ink">
                      {address.recipientName} · {address.phone}
                    </span>
                    <span className="mt-0.5 block text-ink-muted">
                      {address.addressLine}, {address.upazila},{' '}
                      {placeName(address.district, locale)}
                    </span>
                  </span>
                </label>
              ))}
              <label className="flex cursor-pointer gap-3 rounded-sm border border-dashed border-line p-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                <input
                  type="radio"
                  name="addressId"
                  value=""
                  checked={addressId === ''}
                  onChange={() => setAddressId('')}
                  className="mt-0.5 size-4 accent-[var(--color-accent)]"
                />
                <span className="font-medium text-ink">{copy.newAddress}</span>
              </label>
            </fieldset>
          ) : (
            <input type="hidden" name="addressId" value="" />
          )}

          {addressId === '' ? (
            <div className="mt-4">
              <AddressFields value={draft} onChange={setDraft} copy={copy} locale={locale} />
            </div>
          ) : null}
        </section>

        <section className="rounded-sm border border-line bg-surface p-5">
          <h2 className="font-serif text-xl text-ink">{copy.paymentTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">{copy.paymentDescription}</p>
          <PaymentOptions value={payment} onChange={setPayment} copy={copy} />
        </section>

        <section className="rounded-sm border border-line bg-surface p-5">
          <label htmlFor="checkout-notes" className="text-sm font-medium text-ink">
            {copy.notes}
          </label>
          <textarea
            id="checkout-notes"
            name="notes"
            rows={3}
            maxLength={300}
            aria-describedby="checkout-notes-hint"
            className="mt-1 w-full rounded-sm border border-line bg-background px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          <p id="checkout-notes-hint" className="mt-1 text-xs text-ink-muted">
            {copy.notesHint}
          </p>
        </section>

        {state.status !== 'idle' ? (
          <p
            role="alert"
            aria-live="polite"
            className="rounded-sm border border-danger/40 bg-danger/5 p-3 text-sm text-danger"
          >
            {state.status === 'invalid' && copy.errorInvalid}
            {state.status === 'empty' && copy.errorEmpty}
            {state.status === 'stock' &&
              formatTemplate(copy.errorStock, { title: state.productTitle ?? '' })}
            {state.status === 'failed' && copy.errorFailed}
            {state.status === 'config' && copy.errorConfig}
          </p>
        ) : null}

        <SubmitButton
          label={payment === 'mockpay' ? copy.continueToMockPay : copy.placeOrder}
          pendingLabel={copy.placingOrder}
          className="w-full"
        />
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <CheckoutSummary
          totals={totals}
          count={items.reduce((sum, item) => sum + item.quantity, 0)}
          couponCode={coupon?.code}
          locale={locale}
          copy={copy}
        />
      </aside>
    </form>
  );
}
