'use client';

import { useEffect, useState } from 'react';
import type { ShopState } from '../../queries';
import { loadShopState } from '../../actions';

/** Empty state shown until the visitor's cart and lists have loaded in the browser. */
const EMPTY_SHOP_STATE: ShopState = {
  signedIn: false,
  cartItems: [],
  cartCoupon: null,
  wishlistIds: [],
  compareIds: [],
};

/**
 * Loads the visitor's cart, coupon, wishlist and compare list after first paint.
 * The root layout no longer waits for these reads, so the page shell is sent
 * without a database round trip. Until the load finishes, the empty state is
 * shown, and the controllers update as soon as the real values arrive.
 */
export function useShopBootstrap(): ShopState & { ready: boolean } {
  const [state, setState] = useState<ShopState>(EMPTY_SHOP_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadShopState()
      .then((next) => {
        if (active) setState(next);
      })
      .catch(() => {
        // The shell stays usable with an empty cart if the load fails; the
        // controllers still write through their own server actions.
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return { ...state, ready };
}
