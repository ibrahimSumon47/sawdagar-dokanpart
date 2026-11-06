# ADR-012: Upstash Redis for public order tracking rate limits

- Status: Accepted
- Date: 2026-11-06
- Supersedes: the Upstash rejection in [ADR-011](ADR-011-real-accounts-and-outbox-mail.md), decision 4

## Context

Revision 1 phase R7 adds a public order tracker. Anyone who knows an order code
can try a phone or email against it, so the tracker needs limits per client IP
and per order code. ADR-011 kept the database counter, but a counter in the
database is a write on every guess. The R7 spec names Upstash for this limit.

## Findings

- [Upstash Redis pricing](https://upstash.com/pricing/redis) has a $0 tier that
  needs no card: 500K commands per month and 256 MB of data, one database.
- [Upstash billing documentation](https://upstash.com/docs/redis/overall/billing)
  says a payment method upgrades free resources to paid plans. The project
  must never add one, which is already a rule in [ADR-001](ADR-001-free-services.md).
- `@upstash/ratelimit` (MIT) and `@upstash/redis` (MIT) are maintained packages
  with a sliding-window limiter. Both are small and run in serverless functions
  over HTTPS, with no connection pool.
- The tracker makes two limiter checks per lookup, so the monthly command quota
  covers far more lookups than this portfolio will receive.

## Decision and alternatives

Use Upstash Redis through `@upstash/ratelimit` for the tracker only. Two sliding
windows apply: 20 lookups per 10 minutes per IP, and 8 per 10 minutes per order
code. The credentials are `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN`, set in Vercel and GitHub by the owner.

Alternatives considered:

- **Database counter (ADR-011).** Works, but writes on every guess and is not
  what R7 specifies.
- **In-memory Map.** Lost on each cold start, so it cannot enforce a limit.
- **Vercel firewall rules.** Not in the free plan's configuration for this app.

## Consequences

- The owner must create the free database and add both variables. Until then the
  tracker cannot run, and `Redis.fromEnv()` throws a clear configuration error.
- The free-service register records the Upstash terms, and the owner is told
  never to add a payment method to that database.
- Only the tracker depends on Upstash. Other rate limits keep their current
  behaviour.
