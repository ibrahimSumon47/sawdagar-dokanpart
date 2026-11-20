# Vercel usage: limits, reading the dashboard and the weekly check

The deployment runs on the Vercel Hobby plan. It is free forever but the team is
paused when a monthly allowance runs out, so usage is a correctness concern, not
only a cost one.

## Limits that matter

| Meter                  | Hobby allowance | What spends it                                                   |
| ---------------------- | --------------- | ---------------------------------------------------------------- |
| Fluid Active CPU       | 4 hours / month | Time a function actually computes, not time spent waiting on I/O |
| Function Invocations   | 1 million / month | Every request that reaches a function, including a 304 answer  |
| CDN Requests           | 1 million / month | Every asset and every cacheable page response                    |
| Fast Data Transfer     | 100 GB / month  | Response and asset bytes                                         |

A request answered by Vercel's CDN does **not** spend a function invocation. A
request that reaches a dynamic route always does, even when the answer is small
or returns `304`.

## The signal to watch

Function invocations and CDN requests should not be almost equal. When they are
(for example 731K invocations against 776K CDN requests), nearly every request is
reaching a function. Normal browsing downloads many cacheable assets per page, so
the CDN count should be several times the invocation count. Equal counts mean
programmatic traffic, uncached pages, prefetches, polling or a stream.

## How to read the Usage page

1. Open the Vercel dashboard, choose the team, then the project.
2. Open **Observability → Usage** and set the range to the current billing month.
3. Open **Functions** and group by **Route**. The route at the top is the cause;
   do not start with the total.
4. Open **Fluid Active CPU** for the same range. A route with many invocations
   and little CPU is cheap per call but still spends the invocation allowance.
5. Open **CDN Requests** and compare the total with function invocations.
6. Check **Logs** for one busy route, filtered to the same period, to see whether
   the caller is a browser, a bot, a prefetch or a scheduled job.

## Weekly check (ten minutes)

- Note invocations, CDN requests and Fluid Active CPU for the month to date.
- Compare invocations with the previous week; a jump with flat traffic is a loop
  or a crawler.
- Open the top five routes by invocations. Each should be a page a person asked
  for, a short poll, or a deliberate cron.
- Confirm `/api/track/live` is polling, not streaming: a normal answer is a small
  JSON body, `304` when unchanged, and one request per visible tab per 25 seconds.
- Confirm scheduled workflows are disabled while the team is paused, and that no
  new workflow calls the production origin on a schedule.
- Check Vercel Firewall for the rate-limit rule in [OWNER_TODO.md](../OWNER_TODO.md).
- Record the numbers in `docs/reports/usage-audit.md` when they change a decision.

## Rules

- Automated tests never loop against production. Run Playwright against a preview
  deployment or a locally built server, once per finished slice at most.
- Lighthouse runs on demand or monthly, never weekly against production.
- No long-lived streaming functions on Vercel. Use one short request with an ETag.
- Poll only while the tab is visible, back off on errors, and stop after a final
  status or ten quiet minutes.
- A scheduled job that calls production must justify every run; correctness
  fallbacks belong at read time, not in a frequent cron.
- Public pages should answer from the CDN wherever the shell allows it. The
  remaining cookie-driven dynamic routes are listed in the usage audit.
