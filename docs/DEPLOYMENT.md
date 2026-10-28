# Deployment

## Owner actions

- In the Vercel dashboard, connect the GitHub repository to a Hobby project if it is not already connected. Confirm the account can use Hobby without a payment card, set the project root directory to `apps/web` and Node.js to version 24, and enable Git deployments for `main`. Keep the demo non-commercial and use sandbox payments only. Tell the developer when the deployment is ready so its status can be verified.
- For the Phase 0 database setup, create a Neon Free project in the Neon dashboard after confirming the free-plan limits in [ADR-001](adr/ADR-001-free-services.md). No connection is used by the current page; do not share its connection string in chat.
- No environment variables are needed for the foundation page. Do not put secrets in chat or commit them; future variables belong in the Vercel and GitHub dashboards.

## Environment variables

None for the current static page.

## GitHub description and topics

Description: A non-commercial Bangladeshi multi-vendor marketplace demonstration.

Topics: `marketplace`, `bangladesh`, `nextjs`, `typescript`, `monorepo`.
