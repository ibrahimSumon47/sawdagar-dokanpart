# Owner actions

These steps need the Vercel dashboard or the GitHub UI. Do them after Vercel
unpauses the team; nothing here requires a secret in chat or in git.

## 1. Vercel Firewall rate limit for live tracking

1. Open the Vercel dashboard, choose the team, then **sawdagar-dokanpart**.
2. Open **Firewall** (or **Security → Firewall**) and choose **Add rule**.
3. Name it `track-live-rate-limit`.
4. Condition: **Request path** `equals` `/api/track/live`.
5. Action: **Rate limit**. Set **60 requests per 60 seconds per IP**; choose
   **Deny** (or **Challenge** if the dashboard offers it for this plan).
6. Save and enable the rule. Keep it in **Log** mode for one day if you want to
   confirm normal buyers are not caught; three visible tabs need about 7 requests
   per minute, so 60 leaves room.
7. Optional second rule: path `/api/checkout/release-holds`, method `POST`,
   action **Deny** for every IP except the GitHub Actions runner. The route also
   checks `CRON_SECRET`, so this is defence in depth, not the only guard.
8. If the Usage page shows an attack, enable **Attack Challenge Mode** for the
   project until the spike stops.

## 2. Re-enable the paused GitHub workflows

The three workflows are disabled on GitHub while the team is paused. Re-enable
them only after the unpause, one at a time:

```bash
gh workflow enable "Release guest holds"
gh workflow enable "Lighthouse"
gh workflow enable "Playwright"
```

- **Release guest holds** now runs weekly (`17 3 * * 1`). Run it once by hand with
  `gh workflow run release-holds.yml` and confirm the route returns 200.
- **Lighthouse** now runs monthly (`0 4 1 * *`). Prefer a manual run after a
  performance slice instead of a schedule.
- **Playwright** is manual only and no longer defaults to production. Enter a
  preview deployment URL, or run it against a locally built server. Do not point
  a loop at `https://sawdagar-dokanpart.vercel.app`.

## 3. Confirm the usage guards

1. In Vercel, open **Settings → Environment Variables** and confirm
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` exist for Production
   and Preview. The live poll rate limit and the 8-second snapshot cache use them.
2. Open **Observability → Usage** after 24 hours and check that function
   invocations are no longer almost equal to CDN requests.
3. Add the weekly check from [docs/USAGE.md](docs/USAGE.md) to your routine.
