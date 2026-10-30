# ADR-001: Free service evaluation

- Status: accepted
- Date: 2026-10-28

## Context

The project is a non-commercial portfolio demo, with sandbox payments only. Service terms can change; an advertised free tier cannot guarantee permanent availability. No paid plan, expiring trial, or required credit card is acceptable. Verify eligibility before creating accounts or connecting services.

## Findings

- [Vercel Hobby](https://vercel.com/docs/plans/hobby) is free for personal, non-commercial use, with a limit of 200 projects. The [fair-use policy](https://vercel.com/docs/limits/fair-use-guidelines) prohibits commercial activity, including processing real payments. Exceeding included usage can pause service. The project stays a portfolio demonstration and never solicits actual sales.
- [Neon Free](https://neon.com/pricing) states there is no time limit or card requirement. Its published limits include 1 GB of Postgres storage per project, 20 GB per account, and 5 GB of public network transfer per project per month. Compute scales to zero when idle; free-plan branches may be archived and restored automatically. See [plan limits](https://neon.com/faqs/free-plan-limits-and-quotas) and [branch management](https://neon.com/docs/manage/branches). The demo keeps data compact and degrades gracefully within quotas.
- [GitHub Actions](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions) is free for standard runners in public repositories, subject to GitHub's terms and limits. The three-operating-system checks, reference-module job and weekly Lighthouse run all fit this allowance.
- [Cloudinary](https://cloudinary.com/pricing) advertises a free-forever plan with no card and 25 monthly credits shared across storage, transformations, and bandwidth. Confirm current overage and watermark terms before use; no media account has been connected. Catalog photographs are committed to the repository instead, and review photos are bounded data URLs.
- [Resend](https://resend.com/products/transactional-emails) advertises a free plan with no card; its [pricing](https://resend.com/pricing) lists 3,000 emails per month and 100 per day. Sending to others requires a verified domain; its [testing domain](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain) is restricted. No account has been connected; order mail goes to an in-app outbox.
- [Upstash Redis](https://upstash.com/pricing/redis) offers a no-card $0 tier with usage limits. Its [billing documentation](https://upstash.com/docs/redis/overall/billing) warns that adding a payment method upgrades free resources to paid plans. No cache account is connected; the app has no cache dependency.
- [Hugging Face Spaces](https://huggingface.co/docs/hub/spaces-overview) now states that creating a Docker Space running on compute requires a paid plan, even though CPU Basic has no hourly charge. The Java settlement module is therefore a reference implementation exercised by CI, not a hosted service.
- [Stripe sandboxes](https://docs.stripe.com/sandboxes) and the [SSLCOMMERZ sandbox](https://developer.sslcommerz.com/registration/) support simulated payments without real transactions. The reviewed pages do not establish all card, expiry, or branding requirements; no payment provider is integrated. Checkout offers cash on delivery and the MockPay sandbox.
- [Prettier 3.9.10](https://www.npmjs.com/package/prettier) is an MIT-licensed open-source formatter. It is a development dependency and requires no hosted service, account, or payment.

## Decision and alternatives

Vercel Hobby hosts the web application, Neon Free holds PostgreSQL, and GitHub Actions runs every check, migration and Lighthouse audit. A self-hosted database, a paid runner or a separate API host would each add maintenance or an eligibility review without changing what the demo can demonstrate. Services in the findings without an integrated feature are deliberately unused: there is no media, mail, cache or payment account to fall back on. Re-check quotas and terms before adopting any of them, especially if usage grows.
