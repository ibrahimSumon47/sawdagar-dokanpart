# ADR-013: Live order updates with one ETag poll

Status: accepted (Revision 1, phase R7 slice c; revised 2026-11-20 after the Vercel usage incident)

## Context

The public tracker and the signed-in order page must show a status change without
a manual reload. The project runs on Vercel Hobby, which does not support
long-lived WebSockets or background workers. The first version used server-sent
events: one function stayed open for four minutes and read the database every
five seconds, and the client fell back to a five-second poll forever after a
stream error. That pattern helped exhaust the 4-hour Fluid Active CPU allowance,
so the transport was replaced.

## Decision

- One route, `GET /api/track/live`, answers one short JSON request at a time. It
  returns `{ fingerprint, status, final }` and an `ETag`; an unchanged
  `If-None-Match` gets `304`. There is no streaming response.
- The fingerprint is a SHA-256 of the visible status fields (order status,
  sub-order statuses, courier and tracking number). Only the fingerprint is
  compared, so the payload stays small.
- The fingerprint, status and final flag are cached in Upstash for 8 seconds.
  The cache key hashes the access reference and includes the viewer id for an
  account order.
- One IP may poll 90 times per 10 minutes. The limiter fails open when Redis is
  unavailable because access still needs the signed `sd_track` cookie or the
  owner's session.
- The client polls every 25 seconds only while the tab is visible. Errors back
  off to 5 minutes, a final status stops immediately, and ten minutes without a
  change stops with a "Tap to refresh" control.
- A changed fingerprint calls `router.refresh()`, which reuses the
  server-rendered timeline. The tracking chunk stays within the client budget.
- Access follows the existing rules. A guest request needs the signed `sd_track`
  cookie for that order code. A signed-in request uses `getViewer` and must own
  the order. Responses are `Cache-Control: private, no-store`.

## Alternatives considered

- Server-sent events: rejected. A four-minute function plus a five-second
  database read costs far more than the update is worth, and Vercel still ends
  the connection.
- WebSockets: not available on the hosting target.
- Polling every five seconds: cheaper to implement but 17,280 requests per tab
  per day, and a hidden tab keeps spending. The 25-second visible-only poll with
  an 8-second cache is the smallest change that still feels current.
- No polling, only a refresh button: rejected because a buyer expects the
  timeline to move without thinking about it.

## Consequences

- A status change can take up to 25 seconds to appear, acceptable for parcel
  tracking.
- No function stays open, and one tab makes at most 24 checks per 10 minutes.
- A 304 still spends one function invocation; the saving is in CPU, database
  reads and response bytes, not in invocation count alone.
- The full estimate and the remaining dynamic-page findings are in
  [usage-audit.md](../reports/usage-audit.md).
