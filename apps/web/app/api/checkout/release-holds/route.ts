import { timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { releaseExpiredGuestHolds } from '../../../../features/checkout/releaseHolds';

export const runtime = 'nodejs';

/** Compares the bearer token in constant time so the secret cannot be guessed by timing. */
function isAuthorized(header: string | null, secret: string): boolean {
  if (!header?.startsWith('Bearer ')) return false;
  const given = Buffer.from(header.slice('Bearer '.length));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Scheduled sweep that frees stock held by guest checkouts past their 15-minute
 * window. Called by the GitHub Action with CRON_SECRET; without the secret the
 * route refuses every request.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret || !isAuthorized(request.headers.get('authorization'), secret)) {
    return NextResponse.json({ ok: false, code: 'unauthorized' }, { status: 401 });
  }

  const result = await releaseExpiredGuestHolds();
  return NextResponse.json({ ok: true, ...result });
}
