'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useShop } from '../ShopProvider';

/** Bottom toast with an optional action and undo, dismissed after six seconds. */
export function ShopToast() {
  const { copy, toast, dismissToast } = useShop();
  if (!toast) return null;

  const action = toast.action;
  const hasUndo = Boolean(toast.onUndo && toast.undoLabel);

  return (
    <div
      role="status"
      aria-live="polite"
      className="shop-toast fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-md items-start gap-3 border border-line bg-surface-elevated p-4 text-sm shadow-float sm:left-auto sm:right-6 sm:mx-0"
    >
      <p className="min-w-0 flex-1 leading-relaxed text-ink">{toast.message}</p>
      <div className="flex shrink-0 items-center gap-2">
        {action?.href ? (
          <Link
            href={action.href}
            onClick={dismissToast}
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            {action.label}
          </Link>
        ) : action?.onClick ? (
          <button
            type="button"
            onClick={() => {
              action.onClick?.();
              dismissToast();
            }}
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            {action.label}
          </button>
        ) : null}
        {hasUndo ? (
          <button
            type="button"
            onClick={() => {
              toast.onUndo?.();
              dismissToast();
            }}
            className="font-medium text-ink-muted underline underline-offset-4 hover:text-accent"
          >
            {toast.undoLabel}
          </button>
        ) : null}
        <button
          type="button"
          onClick={dismissToast}
          aria-label={copy.dismiss}
          className="grid size-8 place-items-center rounded-sm text-ink-muted hover:text-accent"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}
