# Security

## Current scope

The current application renders public static content. It has no accounts, forms, application API, database, file uploads, or payment integration. Its sandbox-payment notice describes the intended demo; it does not imply that a payment system exists.

## Threats and planned controls

As the application gains features, relevant threats include unauthorized access to other users' data, forged mutations, untrusted prices, malicious uploads, webhook replay, and exposure of credentials. The [architecture specification](spec/03-architecture.md) describes planned validation, authorization, secure headers, rate limiting, and audit logging. Those controls have not yet been implemented or independently assessed. An OWASP ASVS mapping and feature-specific threat models must accompany the relevant implementations.

## Reporting and secrets

Do not include secrets or personal data in public issues. No security contact or private reporting channel has been configured. Configure runtime secrets only in the relevant Vercel or GitHub dashboard; do not commit them or paste them into chat.
