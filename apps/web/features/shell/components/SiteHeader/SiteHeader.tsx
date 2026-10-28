import Link from 'next/link';
import { AnnouncementBar, BrandMark } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { site } from '../../../../lib/site';
import { LocaleSwitcher } from '../../../preferences/components/LocaleSwitcher';
import { ThemeToggle } from '../../../preferences/components/ThemeToggle';
import type { Theme } from '../../../preferences/theme';
import { MobileMenu } from './MobileMenu';

export interface SiteHeaderProps {
  copy: Dictionary;
  locale: Locale;
  theme: Theme;
}

/** Sticky storefront header with the announcement strip, wordmark and controls. */
export function SiteHeader({ copy, locale, theme }: SiteHeaderProps) {
  const links = [
    { label: copy.nav.design, href: '/design' },
    { label: copy.nav.repository, href: site.repositoryUrl, external: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/95 backdrop-blur">
      <AnnouncementBar message={copy.common.demoNotice} />
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-h-11 min-w-0 items-center gap-2 text-ink">
          <BrandMark className="size-7 shrink-0 text-accent" />
          <span className="truncate font-serif text-lg tracking-tight sm:text-xl">
            {copy.common.brand}
          </span>
        </Link>
        <nav aria-label={copy.nav.label} className="ml-auto hidden items-center gap-1 md:flex">
          <Link
            href="/design"
            className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink transition-colors hover:text-accent"
          >
            {copy.nav.design}
          </Link>
          <a
            href={site.repositoryUrl}
            className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink transition-colors hover:text-accent"
          >
            {copy.nav.repository}
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <LocaleSwitcher locale={locale} label={copy.preferences.language} />
          <ThemeToggle
            theme={theme}
            labels={{ useLight: copy.preferences.useLight, useDark: copy.preferences.useDark }}
          />
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
