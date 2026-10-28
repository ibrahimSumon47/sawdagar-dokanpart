import type { ReactNode } from 'react';
import type { Dictionary } from '../../../../i18n';
import { SellerNav, type SellerTab } from '../SellerNav';

export interface SellerSectionProps {
  active: SellerTab;
  title: string;
  description: string;
  copy: Dictionary['seller'];
  children: ReactNode;
}

/** Page frame shared by Seller Center pages: heading, section tabs and content. */
export function SellerSection({ active, title, description, copy, children }: SellerSectionProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-serif text-title leading-tight text-ink">{title}</h1>
        <p className="mt-2 text-ink-muted">{description}</p>
      </header>
      <div className="mt-6">
        <SellerNav active={active} copy={copy} />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
