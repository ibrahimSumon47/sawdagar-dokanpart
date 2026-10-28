'use client';

import { Price, QuantityStepper } from '@sd/ui';
import { Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ProductMedia } from '../../../catalog/components/ProductMedia';
import { useShop } from '../ShopProvider';
import type { CartLine } from '../../types';

export interface CartLineItemProps {
  line: CartLine;
}

/** One cart row: thumbnail, title, quantity, line price, save and remove. */
export function CartLineItem({ line }: CartLineItemProps) {
  const {
    copy,
    locale,
    setQuantity,
    removeItem,
    pendingVariants,
    lineErrors,
    wishlistIds,
    closeCart,
    toggleWishlist,
  } = useShop();
  const pending = pendingVariants.includes(line.variantId);
  const saved = wishlistIds.includes(line.productId);
  const error = lineErrors[line.variantId];

  /** Saving a new item moves it out of the cart; unsaving leaves the row alone. */
  const saveForLater = async () => {
    if (saved) {
      await toggleWishlist(line.productId);
      return;
    }

    const nowSaved = await toggleWishlist(line.productId);
    if (nowSaved) await removeItem(line.variantId);
  };

  return (
    <li className="flex gap-3 border-b border-line py-4 last:border-b-0">
      <Link
        href={`/product/${line.productSlug}`}
        onClick={closeCart}
        aria-label={line.title[locale]}
        className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <ProductMedia tone={line.tone} className="size-16 rounded-sm sm:size-20" />
      </Link>

      <div className="min-w-0 flex-1" aria-busy={pending}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/product/${line.productSlug}`}
              onClick={closeCart}
              className="line-clamp-2 text-sm font-medium text-ink hover:text-accent"
            >
              {line.title[locale]}
            </Link>
            <p className="mt-0.5 text-xs text-ink-muted">{line.variantName[locale]}</p>
          </div>
          <button
            type="button"
            onClick={() => void removeItem(line.variantId)}
            disabled={pending}
            aria-label={`${copy.remove}: ${line.title[locale]}`}
            className="grid size-9 shrink-0 place-items-center rounded-sm text-ink-muted transition-colors hover:text-danger disabled:opacity-50"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper
            value={line.quantity}
            max={Math.max(1, line.stock)}
            onChange={(quantity) => void setQuantity(line.variantId, quantity)}
            label={copy.quantity}
            labels={{ decrease: copy.decreaseQuantity, increase: copy.increaseQuantity }}
            className={pending ? 'opacity-60' : undefined}
          />
          <Price
            amountMinor={line.priceMinor * line.quantity}
            compareAtMinor={
              line.compareAtMinor === undefined ? undefined : line.compareAtMinor * line.quantity
            }
            locale={locale}
            size="sm"
          />
        </div>

        <button
          type="button"
          onClick={() => void saveForLater()}
          className="mt-1 inline-flex min-h-9 items-center gap-1.5 rounded-sm text-xs font-medium text-ink-muted transition-colors hover:text-accent"
        >
          <Heart
            aria-hidden="true"
            className={saved ? 'size-3.5 fill-accent text-accent' : 'size-3.5'}
          />
          {saved ? copy.savedForLater : copy.saveForLater}
        </button>

        {error ? (
          <p role="alert" className="mt-1 text-xs text-danger">
            {error}
          </p>
        ) : null}
      </div>
    </li>
  );
}
