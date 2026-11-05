import { hasArea, type PlatformRole } from '@sd/domain';
import Link from 'next/link';
import { Heart, UserRound } from 'lucide-react';
import { BrandMark, MegaMenu } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { LocaleSwitcher } from '../../../preferences/components/LocaleSwitcher';
import { ThemeToggle } from '../../../preferences/components/ThemeToggle';
import { CartTrigger } from '../../../shop/components/CartTrigger';
import type { Theme } from '../../../preferences/theme';
import { HeaderMobileBar } from './HeaderMobileBar';
import { MobileMenu } from './MobileMenu';
import { HeaderSearch } from './HeaderSearch';

export interface SiteHeaderProps {
  copy: Dictionary;
  locale: Locale;
  theme: Theme;
  /** Signed-in visitor, or null for guests. */
  viewer: { name: string; role: PlatformRole } | null;
  /** Top departments for the Categories panel, already in the active language. */
  categories: readonly { slug: string; label: string }[];
  /** Extra links an editor added in site settings, in the active language. */
  extraLinks?: readonly { label: string; href: string }[];
}

/**
 * Sticky storefront header: wordmark, catalog and category navigation, search,
 * and the language, theme, wishlist, cart and account controls. Project links
 * live in the footer instead, so the header reads as a shop.
 */
export function SiteHeader({
  copy,
  locale,
  theme,
  viewer,
  categories,
  extraLinks = [],
}: SiteHeaderProps) {
  const accountLinks = viewer
    ? [
        { label: copy.nav.account, href: '/account' },
        ...(hasArea(viewer.role, 'seller') ? [{ label: copy.nav.seller, href: '/seller' }] : []),
        ...(hasArea(viewer.role, 'admin') ? [{ label: copy.nav.admin, href: '/admin' }] : []),
      ]
    : [{ label: copy.nav.signIn, href: '/login' }];

  const menuLinks = [
    { label: copy.nav.catalog, href: '/catalog' },
    { label: copy.nav.sell, href: '/seller' },
    ...extraLinks.map((link) => ({ label: link.label, href: link.href })),
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

        <nav aria-label={copy.nav.label} className="hidden items-center gap-1 xl:flex">
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
          {extraLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <HeaderSearch
          id="header-search"
          label={copy.nav.search}
          placeholder={copy.catalog.searchPlaceholder}
          className="ml-auto hidden max-w-xs items-center gap-2 xl:flex"
        />

        <div className="ml-auto flex items-center gap-1 xl:ml-0">
          <LocaleSwitcher locale={locale} label={copy.preferences.language} />
          <ThemeToggle
            theme={theme}
            labels={{ useLight: copy.preferences.useLight, useDark: copy.preferences.useDark }}
          />
          <Link
            href="/wishlist"
            aria-label={copy.nav.wishlist}
            className="hidden size-11 items-center justify-center rounded-sm text-ink hover:bg-surface focus-visible:outline-2 xl:inline-flex"
          >
            <Heart aria-hidden="true" className="size-5" />
          </Link>
          <CartTrigger />
          <Link
            href={viewer ? '/account' : '/login'}
            aria-label={viewer ? copy.nav.account : copy.nav.signIn}
            className="hidden size-11 items-center justify-center rounded-sm text-ink hover:bg-surface focus-visible:outline-2 xl:inline-flex"
          >
            <UserRound aria-hidden="true" className="size-5" />
          </Link>
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
      <HeaderMobileBar copy={copy} categories={categoryLinks} />
    </header>
  );
}
