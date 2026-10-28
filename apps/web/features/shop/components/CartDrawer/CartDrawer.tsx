'use client';

import { ButtonLink, EmptyState } from '@sd/ui';
import { ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { formatTemplate } from '../../formatTemplate';
import { useShop } from '../ShopProvider';
import { CartGroup } from './CartGroup';
import { CartSummary } from './CartSummary';

export const CART_DRAWER_ID = 'shop-cart-drawer';

/** Native modal drawer on desktop and bottom sheet on phones. */
export function CartDrawer() {
  const { copy, locale, summary, cartOpen, closeCart } = useShop();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const number = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (cartOpen && !dialog.open) dialog.showModal();
    if (!cartOpen && dialog.open) dialog.close();
  }, [cartOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => closeCart();
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, [closeCart]);

  const countLabel =
    summary.count === 1
      ? copy.cartItemOne
      : formatTemplate(copy.cartItemMany, { count: number.format(summary.count) });

  return (
    <dialog
      ref={dialogRef}
      id={CART_DRAWER_ID}
      aria-labelledby="shop-cart-title"
      onCancel={closeCart}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeCart();
      }}
      className="shop-drawer fixed inset-x-0 bottom-0 m-0 max-h-[90svh] w-full max-w-none border border-line bg-surface p-0 text-ink shadow-float sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:max-w-[420px]"
    >
      <div className="flex max-h-[90svh] flex-col sm:h-svh sm:max-h-none">
        <header className="flex items-start justify-between gap-4 border-b border-line px-4 py-4 sm:px-5">
          <div>
            <h2 id="shop-cart-title" className="font-serif text-2xl text-ink">
              {copy.cartTitle}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">{countLabel}</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label={copy.closeCart}
            className="grid size-11 place-items-center rounded-sm text-ink-muted transition-colors hover:bg-background hover:text-accent"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5">
          {summary.items.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon={<ShoppingBag aria-hidden="true" className="size-8" />}
                title={copy.emptyTitle}
                description={copy.emptyBody}
                action={
                  <ButtonLink href="/catalog" onClick={closeCart}>
                    {copy.emptyAction}
                  </ButtonLink>
                }
              />
            </div>
          ) : (
            <div>
              {summary.groups.map((group) => (
                <CartGroup key={group.vendor.slug} group={group} />
              ))}
              <p className="py-4 text-center text-xs text-ink-muted">
                <Link
                  href="/catalog"
                  onClick={closeCart}
                  className="underline underline-offset-4 hover:text-accent"
                >
                  {copy.emptyAction}
                </Link>
              </p>
            </div>
          )}
        </div>

        {summary.items.length > 0 ? <CartSummary /> : null}
      </div>
    </dialog>
  );
}
