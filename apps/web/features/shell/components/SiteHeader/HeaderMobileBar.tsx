import { MegaMenu } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';
import { HeaderSearch } from './HeaderSearch';

export interface HeaderMobileBarProps {
  copy: Dictionary;
  /** Categories for the panel, already in the active language. */
  categories: readonly { key: string; label: string; href: string }[];
}

/**
 * Second header row below the extra-large breakpoint. The desktop row keeps
 * the full menu; on phones and tablets this row carries categories, the seller
 * link and the search field.
 */
export function HeaderMobileBar({ copy, categories }: HeaderMobileBarProps) {
  return (
    <div className="border-t border-line xl:hidden">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
        <MegaMenu label={copy.nav.categories} links={categories} className="xl:hidden" />
        <Link
          href="/seller"
          className="text-sm font-medium text-ink-muted transition-colors hover:text-accent"
        >
          {copy.nav.sell}
        </Link>
      </div>
      <HeaderSearch
        id="mobile-header-search"
        label={copy.nav.search}
        placeholder={copy.catalog.searchPlaceholder}
        className="mx-auto w-full max-w-7xl px-4 pb-2 sm:px-6"
      />
    </div>
  );
}
