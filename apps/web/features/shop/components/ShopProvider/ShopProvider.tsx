'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CouponRule } from '@sd/domain';
import type { Locale } from '../../../../i18n';
import type { CartLine, ShopCopy } from '../../types';
import { CartDrawer } from '../CartDrawer';
import { ShopToast } from '../ShopToast';
import { ShopContext, type ShopToastState, type ShowShopToast } from './context';
import { useCartController } from './useCartController';
import { useCompareController } from './useCompareController';
import { useCouponController } from './useCouponController';
import { useWishlistController } from './useWishlistController';

export interface ShopProviderProps {
  children: ReactNode;
  initialItems: CartLine[];
  initialCoupon: CouponRule | null;
  initialWishlistIds: string[];
  initialCompareIds: string[];
  signedIn: boolean;
  locale: Locale;
  copy: ShopCopy;
}

/** One client boundary for the cart, wishlist, comparison, drawer and toast. */
export function ShopProvider({
  children,
  initialItems,
  initialCoupon,
  initialWishlistIds,
  initialCompareIds,
  signedIn,
  locale,
  copy,
}: ShopProviderProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<ShopToastState | null>(null);
  const toastSequence = useRef(0);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const showToast = useCallback<ShowShopToast>((next) => {
    toastSequence.current += 1;
    setToast({ ...next, id: toastSequence.current });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const coupon = useCouponController({ initialCoupon, locale, copy, showToast });
  const cart = useCartController({
    initialItems,
    coupon: coupon.coupon,
    locale,
    copy,
    showToast,
    openCart,
  });
  const wishlist = useWishlistController({
    initialIds: initialWishlistIds,
    signedIn,
    copy,
    showToast,
  });
  const compare = useCompareController({ initialIds: initialCompareIds, copy, showToast });

  const value = useMemo(
    () => ({
      cartOpen,
      openCart,
      closeCart,
      summary: cart.summary,
      addItem: cart.addItem,
      setQuantity: cart.setQuantity,
      removeItem: cart.removeItem,
      pendingVariants: cart.pendingVariants,
      lineErrors: cart.lineErrors,
      coupon: coupon.coupon,
      couponPending: coupon.pending,
      couponError: coupon.error,
      applyCoupon: coupon.apply,
      removeCoupon: coupon.remove,
      signedIn,
      wishlistIds: wishlist.ids,
      toggleWishlist: wishlist.toggle,
      compareIds: compare.ids,
      toggleCompare: compare.toggle,
      clearCompare: compare.clear,
      toast,
      dismissToast,
      locale,
      copy,
    }),
    [
      cart.addItem,
      cart.lineErrors,
      cart.pendingVariants,
      cart.removeItem,
      cart.setQuantity,
      cart.summary,
      cartOpen,
      closeCart,
      compare.clear,
      compare.ids,
      compare.toggle,
      copy,
      coupon.apply,
      coupon.coupon,
      coupon.error,
      coupon.pending,
      coupon.remove,
      dismissToast,
      locale,
      openCart,
      signedIn,
      toast,
      wishlist.ids,
      wishlist.toggle,
    ],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
      <CartDrawer />
      <ShopToast />
    </ShopContext.Provider>
  );
}
