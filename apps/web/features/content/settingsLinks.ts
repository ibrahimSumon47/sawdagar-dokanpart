import type { Locale } from '../../i18n';
import type { SiteLink } from './settingsTypes';

/** One link ready for the header or footer, in the visitor's language. */
export interface LocalisedLink {
  label: string;
  href: string;
}

/**
 * Picks the label for the current locale, falling back to the other language
 * so a half-translated menu still reads as a menu.
 */
export function localisedLinks(links: readonly SiteLink[], locale: Locale): LocalisedLink[] {
  return links.map((link) => ({
    label: (locale === 'bn' ? link.labelBn || link.labelEn : link.labelEn || link.labelBn).trim(),
    href: link.href,
  }));
}
