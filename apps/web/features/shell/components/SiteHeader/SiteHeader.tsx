import { hasArea, type PlatformRole } from '@sd/domain';
import Link from 'next/link';
import { AnnouncementBar, BrandMark } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { site } from '../../../../lib/site';
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
}

/** Sticky storefront header with the announcement strip, wordmark and controls. */
export function SiteHeader({ copy, locale, theme, viewer }: SiteHeaderProps) {
  const links = [
    { label: copy.nav.catalog, href: '/catalog' },
    { label: copy.nav.wishlist, href: '/wishlist' },
    { label: copy.nav.design, href: '/design' },
    ...(viewer
      ? [
          { label: copy.nav.account, href: '/account' },
          ...(hasArea(viewer.role, 'seller') ? [{ label: copy.nav.seller, href: '/seller' }] : []),
          ...(hasArea(viewer.role, 'admin') ? [{ label: copy.nav.admin, href: '/admin' }] : []),
        ]
      : [{ label: copy.nav.signIn, href: '/sign-in' }]),
    { label: copy.nav.repository, href: site.repositoryUrl, external: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/95 backdrop-blur">
      <AnnouncementBar message={copy.common.demoNotice} />
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
        <nav aria-label={copy.nav.label} className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <LocaleSwitcher locale={locale} label={copy.preferences.language} />
          <ThemeToggle
            theme={theme}
            labels={{ useLight: copy.preferences.useLight, useDark: copy.preferences.useDark }}
          />
          <CompareTrigger />
          <CartTrigger />
          <MobileMenu
            links={links}
            labels={{
              menu: copy.nav.menu,
              open: copy.nav.openMenu,
              close: copy.nav.closeMenu,
            }}
          />
        </div>
      </div>
    </header>
  );
}
