'use client';

import { formatTaka, type CouponRule } from '@sd/domain';
import { useCallback, useState } from 'react';
import type { Locale } from '../../../../i18n';
import { applyCartCoupon, clearCartCoupon } from '../../actions';
import { formatTemplate } from '../../formatTemplate';
import type { CouponApplyError, ShopCopy } from '../../types';
import { useServerState } from '../../useServerState';
import type { ShowShopToast } from './context';

interface UseCouponControllerOptions {
  initialCoupon: CouponRule | null;
  locale: Locale;
  copy: ShopCopy;
  showToast: ShowShopToast;
}

function messageFor(
  code: CouponApplyError,
  minSubtotalMinor: number | undefined,
  locale: Locale,
  copy: ShopCopy,
): string {
  switch (code) {
    case 'invalid':
      return copy.couponInvalid;
    case 'expired':
      return copy.couponExpired;
    case 'not-eligible':
      return copy.couponNotEligible;
    case 'min-subtotal':
      return formatTemplate(copy.couponMinSubtotal, {
        amount: formatTaka(minSubtotalMinor ?? 0, locale),
      });
    case 'empty':
      return copy.couponEmpty;
    default:
      return copy.couponFailed;
  }
}

/** Applies and removes the one cart coupon, keeping the server copy in step. */
export function useCouponController({
  initialCoupon,
  locale,
  copy,
  showToast,
}: UseCouponControllerOptions) {
  const [coupon, setCoupon] = useServerState<CouponRule | null>(initialCoupon);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = useCallback(
    async (code: string): Promise<boolean> => {
      if (pending) return false;

      setPending(true);
      setError(null);
      try {
        const result = await applyCartCoupon(code);
        if (!result.ok) {
          setError(messageFor(result.code, result.minSubtotalMinor, locale, copy));
          return false;
        }

        setCoupon(result.coupon);
        showToast({ message: copy.couponApplied });
        return true;
      } catch {
        setError(copy.couponFailed);
        return false;
      } finally {
        setPending(false);
      }
    },
    [copy, locale, pending, setCoupon, showToast],
  );

  const remove = useCallback(async () => {
    const previous = coupon;
    setCoupon(null);
    setError(null);
    try {
      const result = await clearCartCoupon();
      if (!result.ok) {
        setCoupon(previous);
        showToast({ message: copy.couponFailed });
        return;
      }
      showToast({ message: copy.couponRemoved });
    } catch {
      setCoupon(previous);
      showToast({ message: copy.couponFailed });
    }
  }, [copy.couponFailed, copy.couponRemoved, coupon, setCoupon, showToast]);

  return { coupon, pending, error, apply, remove };
}
