'use client';

import { Button } from '@sd/ui';
import { Check, Loader2, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useShop } from '../ShopProvider';

type AddState = 'idle' | 'adding' | 'added';

export interface AddToCartButtonProps {
  variantId: string;
  quantity: number;
  disabled?: boolean;
  className?: string;
}

/** Adds the selected variant, morphing through spinner and check states. */
export function AddToCartButton({
  variantId,
  quantity,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const { copy, addItem } = useShop();
  const [state, setState] = useState<AddState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state !== 'added') return;
    const timer = window.setTimeout(() => setState('idle'), 1200);
    return () => window.clearTimeout(timer);
  }, [state]);

  const handleClick = async () => {
    setError(null);
    setState('adding');
    const result = await addItem(variantId, quantity);
    if (!result.ok) {
      setState('idle');
      setError(result.message ?? copy.saveFailed);
      return;
    }
    setState('added');
  };

  const label = disabled
    ? copy.outOfStock
    : state === 'adding'
      ? copy.adding
      : state === 'added'
        ? copy.added
        : copy.addToCart;

  return (
    <div className={className}>
      <Button
        type="button"
        onClick={() => void handleClick()}
        disabled={disabled || state === 'adding'}
        aria-busy={state === 'adding'}
        className="w-full active:scale-[0.97] sm:w-auto"
      >
        {state === 'adding' ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : state === 'added' ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <ShoppingBag aria-hidden="true" className="size-4" />
        )}
        {label}
      </Button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
