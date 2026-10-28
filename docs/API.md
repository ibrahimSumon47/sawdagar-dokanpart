# API

## Implemented

Better Auth serves authentication endpoints under `/api/auth/*` through [the route handler](../apps/web/app/api/auth/%5B...all%5D/route.ts). The flows in use are:

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/sign-in/email` | Email and password sign-in; used server-side by the demo action and available to future forms |
| `POST /api/auth/sign-out` | Revokes the current session |
| `GET /api/auth/get-session` | Returns the current session and user, or null |

Requests are rate limited with a database-backed counter: 10 sign-in attempts per minute and 30 requests per minute per key. The public demo action accepts only the eight seeded demo emails; it does not accept a role or user id from the client. Next.js Server Actions handle theme, language, profile and sign-in forms; they are page actions, not versioned API endpoints.

The catalog has no HTTP API in Phase 3. The listing and product pages query Prisma directly on the server and read filters from validated URL parameters. This keeps prices, stock and seller data out of client-controlled requests until the cart needs an API.

## Not yet implemented

There are no marketplace REST endpoints, OpenAPI document or SDK yet. The [architecture specification](spec/03-architecture.md) proposes a versioned `/api/v1` API with RFC 9457 errors and an OpenAPI document. Document endpoints here as they land.
