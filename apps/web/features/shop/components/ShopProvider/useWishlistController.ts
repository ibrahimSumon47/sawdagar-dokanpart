'use client';

import { useCallback } from 'react';
import { toggleWishlist } from '../../actions';
import type { ShopCopy } from '../../types';
import { useServerState } from '../../useServerState';
import type { ShowShopToast } from './context';

interface UseWishlistControllerOptions {
  initialIds: string[];
  signedIn: boolean;
  copy: ShopCopy;
  showToast: ShowShopToast;
}

function signInHref(): string {
  const next = window.location.pathname + window.location.search;
  return `/sign-in?next=${encodeURIComponent(next)}`;
}

/** Keeps the saved-product list in step with the server wishlist. */
export function useWishlistController({
  initialIds,
  signedIn,
  copy,
  showToast,
}: UseWishlistControllerOptions) {
  const [ids, setIds] = useServerState<string[]>(initialIds);

  const promptSignIn = useCallback(() => {
    showToast({
      message: copy.wishlistSignIn,
      action: { label: copy.wishlistSignInAction, href: signInHref() },
    });
  }, [copy.wishlistSignIn, copy.wishlistSignInAction, showToast]);

  const toggle = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!signedIn) {
        promptSignIn();
        return false;
      }

      const previous = ids;
      const saved = ids.includes(productId);
      setIds(saved ? ids.filter((id) => id !== productId) : [productId, ...ids]);

      try {
        const result = await toggleWishlist(productId);
        if (!result.ok) {
          setIds(previous);
          if (result.code === 'unauthenticated') promptSignIn();
          else if (result.code === 'limit-reached') showToast({ message: copy.wishlistLimit });
          else showToast({ message: copy.wishlistFailed });
          return false;
        }

        setIds(result.ids);
        showToast({ message: saved ? copy.wishlistRemoved : copy.wishlistSaved });
        return !saved;
      } catch {
        setIds(previous);
        showToast({ message: copy.wishlistFailed });
        return false;
      }
    },
    [
      copy.wishlistFailed,
      copy.wishlistLimit,
      copy.wishlistRemoved,
      copy.wishlistSaved,
      ids,
      promptSignIn,
      setIds,
      showToast,
      signedIn,
    ],
  );

  return { ids, toggle };
}
