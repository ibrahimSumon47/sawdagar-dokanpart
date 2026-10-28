'use client';

import { useCallback } from 'react';
import { clearCompare, toggleCompare } from '../../actions';
import { COMPARE_LIMIT } from '../../cookieState';
import type { ShopCopy } from '../../types';
import { useServerState } from '../../useServerState';
import type { ShowShopToast } from './context';

interface UseCompareControllerOptions {
  initialIds: string[];
  copy: ShopCopy;
  showToast: ShowShopToast;
}

/** Keeps the comparison cookie list in step with the header and page. */
export function useCompareController({ initialIds, copy, showToast }: UseCompareControllerOptions) {
  const [ids, setIds] = useServerState<string[]>(initialIds);

  const toggle = useCallback(
    async (productId: string) => {
      const included = ids.includes(productId);
      if (!included && ids.length >= COMPARE_LIMIT) {
        showToast({ message: copy.compareLimit });
        return;
      }

      const previous = ids;
      setIds(included ? ids.filter((id) => id !== productId) : [...ids, productId]);

      try {
        const result = await toggleCompare(productId);
        if (!result.ok) {
          setIds(previous);
          showToast({
            message: result.code === 'limit-reached' ? copy.compareLimit : copy.compareFailed,
          });
          return;
        }

        setIds(result.ids);
        if (!included) {
          showToast({
            message: copy.compareAdded,
            action: { label: copy.compareView, href: '/compare' },
          });
        }
      } catch {
        setIds(previous);
        showToast({ message: copy.compareFailed });
      }
    },
    [
      copy.compareAdded,
      copy.compareFailed,
      copy.compareLimit,
      copy.compareView,
      ids,
      setIds,
      showToast,
    ],
  );

  const clear = useCallback(async () => {
    const previous = ids;
    setIds([]);
    try {
      const result = await clearCompare();
      if (!result.ok) setIds(previous);
    } catch {
      setIds(previous);
      showToast({ message: copy.compareFailed });
    }
  }, [copy.compareFailed, ids, setIds, showToast]);

  return { ids, toggle, clear };
}
