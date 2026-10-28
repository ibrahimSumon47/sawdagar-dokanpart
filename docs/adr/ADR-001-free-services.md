# ADR-001: Free service evaluation

Date: 2026-10-28

Status: Proposed; account setup and actual deployment are not yet verified.

## Context

The project is a non-commercial portfolio demo, with sandbox payments only. Service terms can change; an advertised free tier cannot guarantee permanent availability. No paid plan, expiring trial, or required credit card is acceptable. Verify eligibility before creating accounts or connecting services.

## Findings

- [Vercel Hobby](https://vercel.com/docs/plans/hobby) is free for personal, non-commercial use, with a limit of 200 projects. The [fair-use policy](https://vercel.com/docs/limits/fair-use-guidelines) prohibits commercial activity, including processing real payments. Exceeding included usage can pause service. Gravity's service catalog states that Hobby does not require a card, but the official pages consulted did not explicitly confirm the sign-up requirement; confirm it during account setup. The project should remain a portfolio demonstration and never solicit actual sales.
- [Neon Free](https://neon.com/pricing) states there is no time limit or card requirement. Its published limits include 1 GB of Postgres storage per project, 20 GB per account, and 5 GB of public network transfer per project per month. Compute scales to zero when idle; free-plan branches may be archived and restored automatically. See [plan limits](https://neon.com/faqs/free-plan-limits-and-quotas) and [branch management](https://neon.com/docs/manage/branches). Keep data compact and degrade gracefully within quotas.
- [GitHub Actions](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions) is free for standard runners in public repositories, subject to GitHub's terms and limits. Do not assume private repositories have the same allowance.

## Decision and alternatives

Use the specified Vercel Hobby and Neon Free only after the owner confirms eligibility and creates or connects the projects. Keep the database unconnected until its implementation phase. Vercel's documented project limit does not currently require consolidating the web and API, but quotas and workload compatibility should be checked again when the API is built. A self-hosted database or alternate hosting would introduce maintenance or a separate eligibility review. Other services in the architecture are not approved or integrated by this slice and must be checked before use.
