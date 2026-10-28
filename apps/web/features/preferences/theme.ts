/** Themes the storefront can render. Light is the default. */
export type Theme = 'light' | 'dark';

export const THEME_COOKIE = 'sd_theme';
export const DEFAULT_THEME: Theme = 'light';

/** Narrows an unknown cookie value to a supported theme. */
export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}
