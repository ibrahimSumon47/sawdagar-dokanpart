import { hasArea, type PlatformRole } from '@sd/domain';
import Link from 'next/link';
import { BrandMark, MegaMenu } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { LocaleSwitcher } from '../../../preferences/components/LocaleSwitcher';
import { ThemeToggle } from '../../../preferences/components/ThemeToggle';
import { CartTrigger } from '../../../shop/components/CartTrigger';
import { CompareTrigger } from '../../../shop/components/CompareTrigger';
import type { Theme } from '../../../preferences/theme';
import { MobileMenu } from './MobileMenu';

export interface SiteHeaderProps {
  copy: Dictionary;
  locale: Locale;
  theme: Theme;
  /** Signed-in visitor, or null for guests. */
  viewer: { name: string; role: PlatformRole } | null;
  /** Top departments for the Categories panel, already in the active language. */
  categories: readonly { slug: string; label: string }[];
}

/**
 * Sticky storefront header: wordmark, catalog and category navigation, search,
 * and the language, theme, compare, cart and account controls. Project links
 * live in the footer instead, so the header reads as a shop.
 */
export function SiteHeader({ copy, locale, theme, viewer, categories }: SiteHeaderProps) {
  const accountLinks = viewer
    ? [
        { label: copy.nav.account, href: '/account' },
        ...(hasArea(viewer.role, 'seller') ? [{ label: copy.nav.seller, href: '/seller' }] : []),
        ...(hasArea(viewer.role, 'admin') ? [{ label: copy.nav.admin, href: '/admin' }] : []),
      ]
    : [{ label: copy.nav.signIn, href: '/sign-in' }];

  const menuLinks = [
    { label: copy.nav.catalog, href: '/catalog' },
    { label: copy.nav.sell, href: '/seller' },
    { label: copy.nav.wishlist, href: '/wishlist' },
    ...accountLinks,
  ];

  const categoryLinks = categories.map((category) => ({
    key: category.slug,
    label: category.label,
    href: `/catalog?category=${category.slug}`,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={copy.common.brand}
          className="flex min-h-11 min-w-0 items-center gap-2 text-ink"
        >
          <BrandMark className="size-7 shrink-0 text-accent" />
          <span className="hidden truncate font-serif text-lg tracking-tight sm:inline sm:text-xl">
            {copy.common.brand}
          </span>
        </Link>

        <nav aria-label={copy.nav.label} className="hidden items-center gap-1 lg:flex">
          <Link
            href="/catalog"
            className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink transition-colors hover:text-accent"
          >
            {copy.nav.catalog}
          </Link>
          <MegaMenu label={copy.nav.categories} links={categoryLinks} />
          <Link
            href="/seller"
            className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink transition-colors hover:text-accent"
          >
            {copy.nav.sell}
          </Link>
        </nav>

        <form
          action="/catalog"
          role="search"
          className="ml-auto hidden max-w-xs items-center gap-2 xl:flex"
        >
          <label htmlFor="header-search" className="sr-only">
            {copy.nav.search}
          </label>
          <input
            id="header-search"
            name="q"
            type="search"
            placeholder={copy.catalog.searchPlaceholder}
            className="min-h-11 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 xl:ml-0">
          <LocaleSwitcher locale={locale} label={copy.preferences.language} />
          <ThemeToggle
            theme={theme}
            labels={{ useLight: copy.preferences.useLight, useDark: copy.preferences.useDark }}
          />
          <CompareTrigger />
          <CartTrigger />
          <MobileMenu
            links={menuLinks}
            labels={{
              menu: copy.nav.menu,
              open: copy.nav.openMenu,
              close: copy.nav.closeMenu,
            }}
          />
        </div>
      </div>
      <div className="border-t border-line lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
          <MegaMenu label={copy.nav.categories} links={categoryLinks} className="lg:hidden" />
          <Link
            href="/seller"
            className="text-sm font-medium text-ink-muted transition-colors hover:text-accent"
          >
            {copy.nav.sell}
          </Link>
        </div>
      </div>
    </header>
  );
}
