'use client';

import { Button } from '@sd/ui';
import { useId, useState } from 'react';
import { useShop } from '../ShopProvider';

/** Coupon entry and the applied-code badge inside the cart summary. */
export function CouponForm() {
  const { copy, coupon, couponPending, couponError, applyCoupon, removeCoupon } = useShop();
  const [code, setCode] = useState('');
  const inputId = useId();
  const errorId = useId();

  if (coupon) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-sm border border-accent/40 bg-accent/5 px-3 py-2">
        <p className="text-sm text-ink">
          <span className="text-ink-muted">{copy.coupon}:</span>{' '}
          <strong className="font-semibold tracking-wide">{coupon.code}</strong>
        </p>
        <button
          type="button"
          onClick={() => void removeCoupon()}
          className="inline-flex min-h-9 items-center rounded-sm px-2 text-xs font-medium text-ink-muted underline underline-offset-4 transition-colors hover:text-danger"
        >
          {copy.couponRemove}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void applyCoupon(code).then((applied) => {
          if (applied) setCode('');
        });
      }}
    >
      <label htmlFor={inputId} className="text-xs font-medium text-ink-muted">
        {copy.couponLabel}
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id={inputId}
          name="coupon"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder={copy.couponPlaceholder}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={24}
          aria-invalid={couponError ? true : undefined}
          aria-describedby={couponError ? errorId : undefined}
          className="min-h-9 w-full min-w-0 rounded-sm border border-line bg-background px-3 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <Button type="submit" size="sm" disabled={couponPending || code.trim().length < 3}>
          {couponPending ? copy.couponApplying : copy.couponApply}
        </Button>
      </div>
      {couponError ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
          {couponError}
        </p>
      ) : null}
    </form>
  );
}
