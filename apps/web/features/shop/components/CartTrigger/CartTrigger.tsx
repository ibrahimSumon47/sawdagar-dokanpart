'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CART_DRAWER_ID } from '../CartDrawer';
import { useShop } from '../ShopProvider';
import { CART_FLY_EVENT, flyToCart } from './flyToCart';

/** Header cart control; opens the drawer and bumps when the count grows. */
export function CartTrigger() {
  const { copy, locale, summary, cartOpen, openCart } = useShop();
  const [bump, setBump] = useState(false);
  const previous = useRef(summary.count);
  const number = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB');
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onFly = (event: Event) => {
      const source = (event as CustomEvent<{ source: HTMLElement | null }>).detail?.source ?? null;
      flyToCart(source, iconRef.current);
    };
    window.addEventListener(CART_FLY_EVENT, onFly);
    return () => window.removeEventListener(CART_FLY_EVENT, onFly);
  }, []);

  useEffect(() => {
    if (summary.count > previous.current) {
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 320);
      previous.current = summary.count;
      return () => window.clearTimeout(timer);
    }
    previous.current = summary.count;
  }, [summary.count]);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`${copy.openCart} (${number.format(summary.count)})`}
      aria-haspopup="dialog"
      aria-expanded={cartOpen}
      aria-controls={CART_DRAWER_ID}
      className="relative grid size-11 place-items-center rounded-sm text-ink transition-colors hover:bg-surface hover:text-accent"
    >
      <span ref={iconRef} className={bump ? 'cart-bump inline-flex' : 'inline-flex'}>
        <ShoppingBag aria-hidden="true" className="size-5" />
      </span>
      {summary.count > 0 ? (
        <span className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-5 tabular-nums text-accent-contrast">
          {number.format(summary.count)}
        </span>
      ) : null}
    </button>
  );
}
