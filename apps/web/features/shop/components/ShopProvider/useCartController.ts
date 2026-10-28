'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Locale } from '../../../../i18n';
import { addCartItem, removeCartItem, updateCartItem } from '../../actions';
import { summariseCart } from '../../cartTotals';
import { formatTemplate } from '../../formatTemplate';
import type { CartLine, ShopCopy, ShopError } from '../../types';
import { useServerState } from '../../useServerState';
import type { AddItemResult, ShowShopToast } from './context';

interface UseCartControllerOptions {
  initialItems: CartLine[];
  locale: Locale;
  copy: ShopCopy;
  showToast: ShowShopToast;
  openCart: () => void;
}

/** Owns cart rows for the client shell, including optimistic row updates. */
export function useCartController({
  initialItems,
  locale,
  copy,
  showToast,
  openCart,
}: UseCartControllerOptions) {
  const [items, setItems] = useServerState<CartLine[]>(initialItems);
  const [pendingVariants, setPendingVariants] = useState<readonly string[]>([]);
  const [lineErrors, setLineErrors] = useState<Record<string, string>>({});
  const summary = useMemo(() => summariseCart(items), [items]);
  const number = useMemo(
    () => new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB'),
    [locale],
  );

  const markPending = useCallback((variantId: string, pending: boolean) => {
    setPendingVariants((current) =>
      pending
        ? current.includes(variantId)
          ? current
          : [...current, variantId]
        : current.filter((id) => id !== variantId),
    );
  }, []);

  const messageFor = useCallback(
    (error: ShopError): string => {
      switch (error.code) {
        case 'stock-limit':
          return formatTemplate(copy.stockLimit, { count: number.format(error.available ?? 0) });
        case 'out-of-stock':
          return copy.outOfStock;
        case 'limit-reached':
          return copy.wishlistLimit;
        case 'unavailable':
          return copy.unavailable;
        default:
          return copy.saveFailed;
      }
    },
    [copy, number],
  );

  const undoAdd = useCallback(
    async (variantId: string, previousQuantity: number) => {
      try {
        const result =
          previousQuantity === 0
            ? await removeCartItem(variantId)
            : await updateCartItem(variantId, previousQuantity);
        if (result.ok) {
          setItems(result.items);
          return;
        }
        showToast({ message: copy.saveFailed });
      } catch {
        showToast({ message: copy.saveFailed });
      }
    },
    [copy.saveFailed, setItems, showToast],
  );

  const addItem = useCallback(
    async (variantId: string, quantity: number): Promise<AddItemResult> => {
      if (pendingVariants.includes(variantId)) return { ok: false };
      const previousQuantity = items.find((item) => item.variantId === variantId)?.quantity ?? 0;

      markPending(variantId, true);
      try {
        const result = await addCartItem(variantId, quantity);
        if (!result.ok) return { ok: false, message: messageFor(result) };

        setItems(result.items);
        showToast({
          message: copy.addedToast,
          action: { label: copy.viewCart, onClick: openCart },
          undoLabel: copy.undo,
          onUndo: () => void undoAdd(variantId, previousQuantity),
        });
        return { ok: true };
      } catch {
        return { ok: false, message: copy.saveFailed };
      } finally {
        markPending(variantId, false);
      }
    },
    [
      copy.addedToast,
      copy.saveFailed,
      copy.undo,
      copy.viewCart,
      items,
      markPending,
      messageFor,
      openCart,
      pendingVariants,
      setItems,
      showToast,
      undoAdd,
    ],
  );

  const setQuantity = useCallback(
    async (variantId: string, quantity: number) => {
      if (pendingVariants.includes(variantId)) return;

      const previousItems = items;
      setItems((current) =>
        current.map((item) => (item.variantId === variantId ? { ...item, quantity } : item)),
      );
      setLineErrors((current) => {
        const next = { ...current };
        delete next[variantId];
        return next;
      });
      markPending(variantId, true);

      try {
        const result = await updateCartItem(variantId, quantity);
        if (result.ok) {
          setItems(result.items);
          return;
        }
        setItems(previousItems);
        setLineErrors((current) => ({ ...current, [variantId]: messageFor(result) }));
      } catch {
        setItems(previousItems);
        setLineErrors((current) => ({ ...current, [variantId]: copy.saveFailed }));
      } finally {
        markPending(variantId, false);
      }
    },
    [copy.saveFailed, items, markPending, messageFor, pendingVariants, setItems],
  );

  const removeItem = useCallback(
    async (variantId: string) => {
      if (pendingVariants.includes(variantId)) return;

      const previousItems = items;
      setItems((current) => current.filter((item) => item.variantId !== variantId));
      markPending(variantId, true);

      try {
        const result = await removeCartItem(variantId);
        if (result.ok) {
          setItems(result.items);
          return;
        }
        setItems(previousItems);
        showToast({ message: messageFor(result) });
      } catch {
        setItems(previousItems);
        showToast({ message: copy.removeFailed });
      } finally {
        markPending(variantId, false);
      }
    },
    [copy.removeFailed, items, markPending, messageFor, pendingVariants, setItems, showToast],
  );

  return { summary, addItem, setQuantity, removeItem, pendingVariants, lineErrors };
}
