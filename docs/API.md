# API

## Implemented

Better Auth serves authentication endpoints under `/api/auth/*` through [the route handler](../apps/web/app/api/auth/%5B...all%5D/route.ts). The flows in use are:

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/sign-in/email` | Email and password sign-in; used server-side by the demo action and available to future forms |
| `POST /api/auth/sign-out` | Revokes the current session |
| `GET /api/auth/get-session` | Returns the current session and user, or null |

Requests are rate limited with a database-backed counter: 10 sign-in attempts per minute and 30 requests per minute per key. The public demo action accepts only the eight seeded demo emails; it does not accept a role or user id from the client. Next.js Server Actions handle theme, language, profile and sign-in forms; they are page actions, not versioned API endpoints.

The catalog and shop have no HTTP API yet. Listing and product pages query Prisma directly on the server and read filters from validated URL parameters. The shop client calls Server Actions, which validate every id and quantity on the server, resolve the viewer from the session and re-read stock before writing.

## Shop Server Actions

Defined in [actions.ts](../apps/web/features/shop/actions.ts). Every action accepts only ids and quantities, never a price, user id or role.

| Action | Input | Behaviour |
|---|---|---|
| `addCartItem` | `variantId`, `quantity` (1–10) | Creates or reuses the guest cookie cart or user cart; rejects inactive products and quantities above stock; returns the full cart rows |
| `updateCartItem` | `variantId`, `quantity` (1–10) | Sets an exact quantity after a stock check; zero is handled by `removeCartItem` |
| `removeCartItem` | `variantId` | Deletes the row and returns the cart rows; removal still works when a product later becomes inactive |
| `toggleWishlist` | `productId` | Requires a session; adds or removes an active product and enforces the 100-item cap |
| `toggleCompare` | `productId` | Adds or removes one active product in the `sd_compare` cookie, capped at four |
| `clearCompare` | none | Deletes the comparison cookie |

Cart rows include server-side variant prices, stock and vendor details. The client never computes the amount sent to the server, and totals shown in the drawer are an estimate until checkout.

## Not yet implemented

There are no marketplace REST endpoints, OpenAPI document or SDK yet. The [architecture specification](spec/03-architecture.md) proposes a versioned `/api/v1` API with RFC 9457 errors and an OpenAPI document. Document endpoints here as they land.
