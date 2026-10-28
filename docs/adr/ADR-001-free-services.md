# ADR-001: Free service evaluation

Date: 2026-10-28

Status: Proposed for future integrations; the static page is deployed on Vercel and a Neon project exists in a Free organization. Database connectivity remains unverified.

## Context

The project is a non-commercial portfolio demo, with sandbox payments only. Service terms can change; an advertised free tier cannot guarantee permanent availability. No paid plan, expiring trial, or required credit card is acceptable. Verify eligibility before creating accounts or connecting services.

## Findings

- [Vercel Hobby](https://vercel.com/docs/plans/hobby) is free for personal, non-commercial use, with a limit of 200 projects. The [fair-use policy](https://vercel.com/docs/limits/fair-use-guidelines) prohibits commercial activity, including processing real payments. Exceeding included usage can pause service. Gravity's service catalog states that Hobby does not require a card, but the official pages consulted did not explicitly confirm the sign-up requirement; confirm it during account setup. The project should remain a portfolio demonstration and never solicit actual sales.
- [Neon Free](https://neon.com/pricing) states there is no time limit or card requirement. Its published limits include 1 GB of Postgres storage per project, 20 GB per account, and 5 GB of public network transfer per project per month. Compute scales to zero when idle; free-plan branches may be archived and restored automatically. See [plan limits](https://neon.com/faqs/free-plan-limits-and-quotas) and [branch management](https://neon.com/docs/manage/branches). Keep data compact and degrade gracefully within quotas.
- [GitHub Actions](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions) is free for standard runners in public repositories, subject to GitHub's terms and limits. Do not assume private repositories have the same allowance.
- [Cloudinary](https://cloudinary.com/pricing) advertises a free-forever plan with no card and 25 monthly credits shared across storage, transformations, and bandwidth. Confirm current overage and watermark terms before use; no media account has been connected.
- [Resend](https://resend.com/products/transactional-emails) advertises a free plan with no card; its [pricing](https://resend.com/pricing) lists 3,000 emails per month and 100 per day. Sending to others requires a verified domain; its [testing domain](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain) is restricted. No account has been connected.
- [Upstash Redis](https://upstash.com/pricing/redis) offers a no-card $0 tier with usage limits. Its [billing documentation](https://upstash.com/docs/redis/overall/billing) warns that adding a payment method upgrades free resources to paid plans. Verify the current limits and no-expiry terms before use; no account has been connected.
- [Hugging Face Spaces](https://huggingface.co/docs/hub/spaces-overview) now states that creating a Docker Space running on compute requires a paid plan, even though CPU Basic has no hourly charge. This conflicts with the free-only policy, so the proposed Phase 10 Java hosting is blocked pending an independently verified free alternative. Static Spaces do not provide the required Java server.
- [Stripe sandboxes](https://docs.stripe.com/sandboxes) and the [SSLCOMMERZ sandbox](https://developer.sslcommerz.com/registration/) support simulated payments without real transactions. The reviewed pages do not establish all card, expiry, or branding requirements; verify them before adopting either provider. No payment provider is integrated.

## Decision and alternatives

The owner connected the specified Vercel Hobby project; a Neon project was created in a Free organization. Keep the database unconnected until its implementation phase. Vercel's documented project limit does not currently require consolidating the web and API, but quotas and workload compatibility should be checked again when the API is built. A self-hosted database or alternate hosting would introduce maintenance or a separate eligibility review. Other services in the architecture are not approved or integrated by this slice; unresolved card, expiry, branding, quota, and eligibility terms must be checked before use. The Phase 10 Java hosting proposal must be replaced with a free-compliant option before implementation.
