import { getViewer } from '../../../../features/auth/session';
import {
  loadTrackingSnapshot,
  type TrackingReference,
} from '../../../../features/tracking/liveSnapshot';
import { isLiveTrackingLimited } from '../../../../features/tracking/rateLimit';
import {
  readSnapshotCache,
  snapshotCacheKey,
  writeSnapshotCache,
  type CachedSnapshot,
} from '../../../../features/tracking/snapshotCache';

export const dynamic = 'force-dynamic';

const PRIVATE_HEADERS = { 'Cache-Control': 'private, no-store' };

/** Vercel writes the caller address here; the first entry is the client. */
function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Resolves the reference from the query string. `?code=` is a guest order code
 * and `?number=` is a signed-in order number. A signed-in number needs a session.
 */
async function resolveReference(url: URL): Promise<TrackingReference | null> {
  const code = url.searchParams.get('code');
  if (code) return { kind: 'guest', orderCode: code };

  const number = url.searchParams.get('number');
  if (!number) return null;

  const viewer = await getViewer();
  return viewer ? { kind: 'account', number, userId: viewer.id } : null;
}

/**
 * One polling answer for one order: the snapshot fingerprint, order status and
 * whether the timeline is final. An unchanged answer returns 304 with the same
 * ETag. There is no streaming response; each call finishes immediately, and a
 * short Redis cache plus a per-IP window keep repeated checks cheap.
 */
export async function GET(request: Request): Promise<Response> {
  if (await isLiveTrackingLimited(clientIp(request))) {
    return Response.json(
      { error: 'rate-limited' },
      { status: 429, headers: { ...PRIVATE_HEADERS, 'Retry-After': '60' } },
    );
  }

  const reference = await resolveReference(new URL(request.url));
  if (!reference) return notFoundResponse();

  const cacheKey = snapshotCacheKey(reference);
  let snapshot = await readSnapshotCache(cacheKey);
  if (!snapshot) {
    const loaded = await loadTrackingSnapshot(reference);
    if (!loaded) return notFoundResponse();
    snapshot = {
      fingerprint: loaded.fingerprint,
      status: loaded.order.status,
      final: loaded.final,
    } satisfies CachedSnapshot;
    await writeSnapshotCache(cacheKey, snapshot);
  }

  const etag = `"${snapshot.fingerprint}"`;
  if (request.headers.get('if-none-match') === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag, ...PRIVATE_HEADERS } });
  }

  return Response.json(snapshot, { headers: { ETag: etag, ...PRIVATE_HEADERS } });
}

function notFoundResponse(): Response {
  return Response.json({ error: 'not-found' }, { status: 404, headers: PRIVATE_HEADERS });
}
