# ADR-013: Live order updates with server-sent events and an ETag fallback

Status: accepted (Revision 1, phase R7 slice c)

## Context

The public tracker and the signed-in order page must show a status change within about five seconds of a seller updating it. The project runs on Vercel Hobby, which does not support long-lived WebSockets or background workers, and the client JavaScript budget is at its limit.

## Decision

- One route, `GET /api/track/live`, serves two transports:
  - Server-sent events when the request sends `Accept: text/event-stream`. The server checks the order every 5 seconds and emits a `snapshot` event when the fingerprint changes. The stream closes after 4 minutes, and the browser reconnects.
  - An ETag poll otherwise. The response is 304 while nothing has changed.
- The fingerprint is a SHA-256 of the visible status fields (order status, sub-order statuses, courier and tracking number). Only the fingerprint is compared, so the payload stays small.
- Access follows the existing rules. A guest request needs the signed `sd_track` cookie for that order code. A signed-in request uses `getViewer` and must own the order. Responses are `Cache-Control: private, no-store`.
- The client (`LiveStatus`) reloads the page when a change arrives. A reload reuses the server-rendered timeline, so the client does not need the router or a state store. This keeps the added client JavaScript to a few hundred bytes.
- Polling takes over when the EventSource errors. Both transports pause while the tab is hidden.

## Alternatives considered

- WebSockets: not available on the hosting target.
- Polling only: simpler, but costs one request every five seconds per open tab even when nothing changes. The 304 path keeps that cheap.
- `router.refresh()` on a change: needs `next/navigation` in the client bundle, which pushed the storefront total past budget.

## Consequences

- Updates arrive within about five seconds, with polling as the fallback.
- Each open tab holds one server connection for up to 4 minutes on the SSE path.
- The performance budget now measures only storefront client JavaScript. The admin rich-text editor chunk, which loads lazily through `next/dynamic` and is marked by its ProseMirror content, is excluded from the total. Its 130 KiB per-chunk cap still applies. This was approved by the owner.
