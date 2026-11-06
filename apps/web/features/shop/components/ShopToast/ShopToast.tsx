'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, type PointerEvent } from 'react';
import { useShop } from '../ShopProvider';

/** Horizontal drag, in pixels, that dismisses the toast when released. */
const SWIPE_DISMISS_PX = 80;

/** Bottom toast with an optional action and undo, dismissed after six seconds or by swiping it away. */
export function ShopToast() {
  const { copy, toast, dismissToast } = useShop();
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);
  if (!toast) return null;

  const action = toast.action;
  const hasUndo = Boolean(toast.onUndo && toast.undoLabel);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // Only drags that start on the message body count, so buttons keep their clicks.
    if ((event.target as HTMLElement).closest('a, button')) return;
    startX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    setDragX(Math.max(0, event.clientX - startX.current));
  };

  const onPointerUp = () => {
    if (startX.current === null) return;
    startX.current = null;
    if (dragX >= SWIPE_DISMISS_PX) dismissToast();
    setDragX(0);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ transform: dragX ? `translateX(${dragX}px)` : undefined }}
      className="shop-toast fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-md touch-pan-y items-start gap-3 border border-line bg-surface-elevated p-4 text-sm shadow-float transition-transform duration-200 sm:left-auto sm:right-6 sm:mx-0"
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
