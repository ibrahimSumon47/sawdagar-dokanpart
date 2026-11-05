# ADR-011: Real accounts with database rate limits and an in-app mail outbox

- Status: accepted
- Date: 2026-11-05

## Context

Revision 1 removes the one-click demo shortcut. A visitor must be able to register with an email address and a Bangladeshi mobile number, sign in with a password, reset a forgotten password and verify the address, all through the same endpoints a real store would use. The seeded role accounts must keep working for review purposes without becoming a bypass.

Two services the usual recipe depends on are not available: no transactional email provider with a verified sender domain, and no hosted rate-limit store. The free-forever policy rules out a trial or card-backed plan for either.

## Decision

- **Registration is a real row.** `registerAction` validates with `registerSchema`, creates the user through Better Auth's `signUpEmail`, then writes the phone, `termsAcceptedAt`, a profile and an optional `seller_applications` row in one transaction. A seller applicant keeps the `buyer` role until an admin approves the shop.
- **Sign-in has no shortcut.** The login form posts to `signInAction`, which calls `signInEmail` with the submitted password. The demo picker is a `<details>` block that only writes the email into the field; `DEMO_ACCOUNT_PASSWORD` stays server-side and in the seed workflow. `signInAction` returns the same `invalidCredentials` message for an unknown address and a wrong password.
- **Verification is not a gate.** Better Auth's `requireEmailVerification` stays off so an account works while the mail path is being exercised; `/verify-email` and `/account/security` report the state and offer a fresh link. A buyer who never opens the mail is not locked out.
- **Mail is queued, not sent.** `queueAuthMail` writes `mail_outbox` rows with the recipient, subject and full body, which is where the reset and verification links live. `/admin/outbox` renders them for an authorised admin, and the email hooks point at that path instead of an external sender. Swapping in a provider later means changing that one function and nothing else.
- **Rate limits use Better Auth's own database limiter.** The `rate_limits` table already existed; enabled windows cover sign-in, registration and reset. No second service or in-memory counter is needed, and the limit survives a cold start because it is a row.
- **Input rules live in `@sd/domain`.** `normalizeBdPhone` accepts `01712 345678`, `+8801712345678` and `880-1712-345678` and stores one canonical `+8801XXXXXXXXX`; `passwordStrength` scores length, case, digits and symbols; the minimum length is 10. Field codes are kebab-case (`password-too-short`) and `authMessage` maps them to catalogue keys, so the same schema serves the server action and the client meter.
- **The canonical routes are `/login` and `/register`.** `/sign-in` now redirects to `/login` so old links and bookmarks keep working.
- **Form state lives beside the actions.** `features/auth/state.ts` holds `AuthFormState` and `emptyAuthState` because an `'use server'` module may only export async functions.

## Alternatives considered

1. **Resend with a verified domain.** The correct production choice, but it needs an account, a domain and DNS records the owner has not set up. The outbox keeps every flow testable now and leaves one seam for later.
2. **Log the reset link to the console.** Rejected: it hides the message from the person who needs it and leaves nothing to audit.
3. **Autodelete verification links after one visit.** Rejected for now: the admin outbox is a review surface, and links already expire through Better Auth's token window.
4. **Upstash Redis rate limiting.** Rejected under the free-forever policy for a dependency the database counter already covers. The limiter is per key and stored, which is enough for the traffic this deployment sees.
5. **Block sign-in until the address is verified.** Rejected: with no real mail provider, that would lock out every new account on the deployed site.

## Consequences

- A new account can sign in without verifying the address, and the outbox is readable by any signed-in admin role that holds `admin:audit:read`. That is acceptable for a portfolio deployment with seeded, non-sensitive data, and must change before real customers exist.
- The reset flow depends on someone opening `/admin/outbox`; the page states this plainly instead of pretending a mail was delivered.
- The seeded accounts share `DEMO_ACCOUNT_PASSWORD`; changing it requires re-running the seed workflow.
- Google sign-in is wired but hidden until `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set; the login page shows the setup notice instead of a broken button.
- Two-factor authentication is not implemented in this revision, though the library supports it.
