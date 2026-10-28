# Security

## Current scope

The application renders public content and has two preference forms (theme and language) implemented as Server Actions that only set cookies with `path=/`, `sameSite=lax`, a one-year lifetime and `secure` in production. There are no accounts, user records, application API, database, file uploads or payment integration. The sandbox-payment notice describes the intended demo; it does not imply that a payment system exists.

## Threats and planned controls

As the application gains features, relevant threats include unauthorized access to other users' data, forged mutations, untrusted prices, malicious uploads, webhook replay, cookie tampering and exposure of credentials. Cookies currently hold only a validated `light`/`dark` value and an `en`/`bn` value; unknown values fall back to the defaults. The [architecture specification](spec/03-architecture.md) describes planned validation, authorization, secure headers, rate limiting and audit logging. Those controls are not implemented or independently assessed. An OWASP ASVS mapping and feature-specific threat models must accompany the relevant implementations.

## Reporting and secrets

Do not include secrets or personal data in public issues. No security contact or private reporting channel has been configured. Configure runtime secrets only in the relevant Vercel or GitHub dashboard; do not commit them or paste them into chat.
