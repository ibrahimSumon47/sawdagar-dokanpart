# ADR-006: Server Actions as the write boundary, with Zod and server-resolved ownership

- Status: accepted
- Date: 2026-10-30

## Context

Cart, checkout, reviews, the Seller Center, finance and the CMS all change data from forms and buttons inside server-rendered pages. A client can send any value, and prices, roles, stock and ownership decide whether a write is allowed. The project runs as a single Next.js deployment; the planned versioned API has no consumer yet.

## Decision

- Every mutation is a Next.js Server Action marked `'use server'`, colocated with its feature and called from a form or a small client controller. The browser sends ids, enums, bounded text and image data URLs, never a price, total, role, user id or store id.
- Each action parses its input with Zod before touching the database. Invalid shapes return a typed result with a code the UI can translate; they do not throw for ordinary validation failures.
- The action resolves the viewer from the Better Auth session, then re-reads the row it intends to change. Order lines are found by id **and** buyer, Seller Center rows by the session's store membership, and admin actions by a specific permission such as `admin:finance:write` or `admin:cms:write`.
- Money and stock are recalculated on the server: checkout re-reads the cart, re-evaluates the coupon and shipping, and decrements stock with a conditional update inside the order transaction. A repeated delivery, payout or callback is made harmless by a unique reference rather than by trusting the caller.
- The only non-action writes are the Better Auth route handler and the signed MockPay callback. Server Actions are not treated as a public API and have no versioning contract.

## Alternatives considered

1. **A separate REST or NestJS API.** The architecture specification proposes `/api/v1`, but a second deployment would need its own auth, CORS and validation while the storefront is the only client. The pure rules already live in `@sd/domain`, so an API can wrap them later.
2. **Route handlers for every mutation.** They would add a second request format, a fetch client and duplicated authorization for no consumer that needs them.
3. **Client-side validation only.** Insufficient: a browser can bypass it, and stock, coupon and ownership checks need database reads.
4. **Trusting the form's price or role and re-checking later.** Rejected: a single missed check would let a buyer or seller change what the server charges or permits.

## Consequences

- There is no marketplace OpenAPI document or SDK yet; [`docs/API.md`](../API.md) documents the actions by hand.
- Actions return feature-specific result types rather than RFC 9457 errors. A future API must translate those codes at its boundary.
- Authorization is repeated in many actions. The shared guards and domain permission map keep it consistent, but an integration test that signs in against the database is still missing.
- Server Actions share the page's deployment and request lifecycle, so a long action holds a request open. Checkout and refunds are the longest paths and are covered by transactions rather than by a queue.
