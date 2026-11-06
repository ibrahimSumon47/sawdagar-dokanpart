import { getViewer } from '../../../../features/auth/session';
import {
  loadTrackingSnapshot,
  type TrackingReference,
} from '../../../../features/tracking/liveSnapshot';

export const dynamic = 'force-dynamic';

/** How often the server checks for a change while a stream is open. */
const STREAM_CHECK_MS = 5_000;
/** Streams end after this long, so the client reconnects and re-checks access. */
const STREAM_MAX_MS = 4 * 60 * 1000;

const PRIVATE_HEADERS = { 'Cache-Control': 'private, no-store' };

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
 * Live status for one order. A plain request answers with the snapshot and an
 * ETag, so polling clients get a 304 when nothing changed. An `Accept:
 * text/event-stream` request opens a stream that sends a snapshot whenever the
 * fingerprint moves.
 */
export async function GET(request: Request): Promise<Response> {
  const reference = await resolveReference(new URL(request.url));
  if (!reference) return notFoundResponse();

  if (request.headers.get('accept')?.includes('text/event-stream')) {
    return streamResponse(reference, request.signal);
  }

  const snapshot = await loadTrackingSnapshot(reference);
  if (!snapshot) return notFoundResponse();

  const etag = `"${snapshot.fingerprint}"`;
  if (request.headers.get('if-none-match') === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag, ...PRIVATE_HEADERS } });
  }

  return Response.json(
    { fingerprint: snapshot.fingerprint, status: snapshot.order.status },
    { headers: { ETag: etag, ...PRIVATE_HEADERS } },
  );
}

function notFoundResponse(): Response {
  return Response.json({ error: 'not-found' }, { status: 404, headers: PRIVATE_HEADERS });
}

/** Streams a `snapshot` event each time the fingerprint changes, ending after a few minutes. */
function streamResponse(reference: TrackingReference, signal: AbortSignal): Response {
  const encoder = new TextEncoder();
  const startedAt = Date.now();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let lastFingerprint: string | null = null;
      let closed = false;

      const send = (chunk: string) => controller.enqueue(encoder.encode(chunk));
      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(timer);
        controller.close();
      };

      const check = async () => {
        if (closed) return;
        const snapshot = await loadTrackingSnapshot(reference);
        if (!snapshot) {
          send('event: gone\ndata: {}\n\n');
          close();
          return;
        }
        if (snapshot.fingerprint !== lastFingerprint) {
          lastFingerprint = snapshot.fingerprint;
          send(
            `event: snapshot\ndata: ${JSON.stringify({ fingerprint: snapshot.fingerprint })}\n\n`,
          );
        }
        if (Date.now() - startedAt >= STREAM_MAX_MS) close();
      };

      const timer = setInterval(() => {
        check().catch(() => close());
      }, STREAM_CHECK_MS);

      signal.addEventListener('abort', close);
      send('retry: 5000\n\n');
      await check();
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'private, no-store',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
