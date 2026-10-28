'use client';

import { buttonStyles, cn } from '@sd/ui';
import { ArrowLeftRight } from 'lucide-react';
import { useShop } from '../ShopProvider';

export interface CompareButtonProps {
  productId: string;
  className?: string;
}

/** Adds or removes one product from the four-product comparison cookie. */
export function CompareButton({ productId, className }: CompareButtonProps) {
  const { copy, compareIds, toggleCompare } = useShop();
  const included = compareIds.includes(productId);

  return (
    <button
      type="button"
      onClick={() => void toggleCompare(productId)}
      aria-pressed={included}
      className={cn(buttonStyles({ variant: 'secondary' }), className)}
    >
      <ArrowLeftRight aria-hidden="true" className="size-4" />
      {included ? copy.compareRemove : copy.compare}
    </button>
  );
}
