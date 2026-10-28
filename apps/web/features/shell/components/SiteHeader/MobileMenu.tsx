'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { cn } from '@sd/ui';

export interface MobileMenuLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface MobileMenuProps {
  links: readonly MobileMenuLink[];
  labels: { menu: string; open: string; close: string };
  className?: string;
}

/**
 * Disclosure menu for narrow screens. It stays a plain list of links so the
 * page keeps one tab order and closes as soon as a destination is chosen.
 */
export function MobileMenu({ links, labels, className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div className={cn('lg:hidden', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen((current) => !current)}
        className="grid size-11 place-items-center rounded-sm text-ink transition-colors hover:bg-surface hover:text-accent"
      >
        {open ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <Menu aria-hidden="true" className="size-5" />
        )}
      </button>
      {open ? (
        <nav
          id={panelId}
          aria-label={labels.menu}
          className="absolute inset-x-0 top-full border-b border-line bg-surface p-3 shadow-float"
        >
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink transition-colors hover:bg-background hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
