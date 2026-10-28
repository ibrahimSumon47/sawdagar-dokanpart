'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

export interface MegaMenuLink {
  key: string;
  label: string;
  href: string;
  /** Optional one-line description shown under the label. */
  note?: string;
}

export interface MegaMenuProps {
  /** Trigger text, for example "Categories". */
  label: string;
  links: readonly MegaMenuLink[];
  className?: string;
}

/**
 * Desktop navigation panel for the category tree. Opens on click rather than
 * hover so keyboard and touch users get the same behaviour, and closes on
 * Escape or a click outside the panel.
 */
export function MegaMenu({ label, links, className }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-11 items-center gap-1 px-3 text-sm font-medium text-ink transition-colors hover:text-accent"
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn('size-4 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open ? (
        <div
          id={panelId}
          className="absolute left-0 top-full z-50 w-[min(38rem,calc(100vw-2rem))] rounded-md border border-line bg-surface-elevated p-5 shadow-float"
        >
          <ul className="grid grid-cols-3 gap-x-4 gap-y-1">
            {links.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className="block rounded-sm px-2 py-2 text-sm text-ink transition-colors hover:bg-background hover:text-accent"
                >
                  {link.label}
                  {link.note ? (
                    <span className="mt-0.5 block text-xs text-ink-muted">{link.note}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
