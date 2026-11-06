import { normalizeBdPhone } from '../auth/credentials';
import { isOrderCode } from './orderCode';

/**
 * A contact the buyer typed at checkout, normalised for comparison. Phones use
 * the canonical `+8801XXXXXXXXX` form; emails are lower-cased and trimmed.
 */
export type TrackingContact = { kind: 'phone'; value: string } | { kind: 'email'; value: string };

/** Accepts an email address in a simple, common shape. The database match is the real check. */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Turns a free-typed contact into a comparable form. Anything containing `@` is
 * treated as an email; otherwise the value must be a valid Bangladeshi phone.
 * Returns null when neither shape fits, so the caller can give the same generic reply.
 */
export function normalizeTrackingContact(raw: string): TrackingContact | null {
  const value = raw.trim();
  if (value.includes('@')) {
    const email = value.toLowerCase();
    return emailPattern.test(email) ? { kind: 'email', value: email } : null;
  }
  const phone = normalizeBdPhone(value);
  return phone ? { kind: 'phone', value: phone } : null;
}

/** Normalises an order code typed by hand: trims spaces and upper-cases letters. */
export function normalizeTrackingCode(raw: string): string | null {
  const code = raw.trim().toUpperCase();
  return isOrderCode(code) ? code : null;
}
