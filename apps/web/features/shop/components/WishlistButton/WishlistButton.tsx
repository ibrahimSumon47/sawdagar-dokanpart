'use client';

import { cn } from '@sd/ui';
import { Heart } from 'lucide-react';
import { useShop } from '../ShopProvider';

export interface WishlistButtonProps {
  productId: string;
  /** Shows the word next to the heart; cards use the icon-only form. */
  showLabel?: boolean;
  className?: string;
}

/** Saves a product to the buyer's wishlist, prompting guests to sign in. */
export function WishlistButton({ productId, showLabel = false, className }: WishlistButtonProps) {
  const { copy, wishlistIds, toggleWishlist } = useShop();
  const saved = wishlistIds.includes(productId);

  return (
    <button
      type="button"
      onClick={() => void toggleWishlist(productId)}
      aria-pressed={saved}
      aria-label={saved ? copy.removeFromWishlist : copy.saveToWishlist}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-line bg-surface text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        showLabel ? 'px-3' : 'size-11',
        className,
      )}
    >
      <Heart aria-hidden="true" className={saved ? 'size-4 fill-accent text-accent' : 'size-4'} />
      {showLabel ? <span>{saved ? copy.savedForLater : copy.wishlist}</span> : null}
    </button>
  );
}
