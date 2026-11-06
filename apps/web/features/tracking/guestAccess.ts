import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/** Cookie that proves the visitor passed the contact check for one order code. */
export const TRACK_COOKIE = 'sd_track';

/** A guest keeps timeline access for 30 minutes after a successful lookup. */
const ACCESS_TTL_MS = 30 * 60 * 1000;

const trackCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: ACCESS_TTL_MS / 1000,
};

function signingSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error('BETTER_AUTH_SECRET is required to sign tracking access.');
  return secret;
}

function sign(orderCode: string, expiresAt: number): string {
  return createHmac('sha256', signingSecret())
    .update(`track.${orderCode}.${expiresAt}`)
    .digest('base64url');
}

/** Builds the cookie value: `expiresAt.signature`, with the code bound into the signature. */
export function createTrackToken(orderCode: string, now: number = Date.now()): string {
  const expiresAt = now + ACCESS_TTL_MS;
  return `${expiresAt}.${sign(orderCode, expiresAt)}`;
}

/** Checks a token for one order code. The expiry is inside the signed payload. */
export function verifyTrackToken(
  orderCode: string,
  token: string | undefined,
  now: number = Date.now(),
): boolean {
  if (!token) return false;
  const [expiresPart, signature] = token.split('.');
  if (!expiresPart || !signature) return false;

  const expiresAt = Number(expiresPart);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;

  const expected = Buffer.from(sign(orderCode, expiresAt));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

/** Stores the signed access cookie after a successful contact check. */
export async function grantTrackAccess(orderCode: string): Promise<void> {
  const store = await cookies();
  store.set(TRACK_COOKIE, createTrackToken(orderCode), trackCookieOptions);
}

/** True when the request carries a valid access cookie for this order code. */
export async function hasTrackAccess(orderCode: string): Promise<boolean> {
  const store = await cookies();
  return verifyTrackToken(orderCode, store.get(TRACK_COOKIE)?.value);
}
