'use server';

import { cookies } from 'next/headers';
import { isLocale, LOCALE_COOKIE } from '../../i18n';
import { isTheme, THEME_COOKIE } from './theme';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const cookieOptions = {
  path: '/',
  maxAge: ONE_YEAR_IN_SECONDS,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
} as const;

/**
 * Stores the requested theme and lets the server re-render the current route
 * with the matching tokens. Invalid values are ignored rather than trusted.
 */
export async function setTheme(formData: FormData): Promise<void> {
  const value = formData.get('theme');
  if (!isTheme(value)) return;

  const store = await cookies();
  store.set(THEME_COOKIE, value, cookieOptions);
}

/**
 * Stores the requested language. The root layout reads it on the next render,
 * so the whole document switches language in one step.
 */
export async function setLocale(formData: FormData): Promise<void> {
  const value = formData.get('locale');
  if (!isLocale(value)) return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, value, cookieOptions);
}
