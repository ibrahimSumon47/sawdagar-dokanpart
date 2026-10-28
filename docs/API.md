# API

## Current status

No application API endpoints, authentication, request validation or OpenAPI document exist yet. The two Server Actions in [preferences/actions.ts](../apps/web/features/preferences/actions.ts) accept only a `theme` or `locale` form field, reject any value outside the supported set, and write a preference cookie; they are page actions, not an API. The homepage and `/design` are server-rendered pages.

## Planned direction

The [architecture specification](spec/03-architecture.md) proposes a versioned REST API with server-side validation, authorization and an OpenAPI document. Document actual endpoints, schemas, authorization rules, errors and examples as they are implemented; do not treat the proposed API as available today.
