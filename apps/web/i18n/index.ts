import { bn } from './messages/bn';
import { en, type Dictionary } from './messages/en';

export type { Dictionary };

/** Languages the storefront supports. English is the default. */
export type Locale = 'en' | 'bn';

export const LOCALE_COOKIE = 'sd_locale';
export const DEFAULT_LOCALE: Locale = 'en';

export const dictionaries: Record<Locale, Dictionary> = { en, bn };

/** Narrows an unknown cookie value to a supported locale. */
export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'bn';
}

/** Returns the message catalog for a locale. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
