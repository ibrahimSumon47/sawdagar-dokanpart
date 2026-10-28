# Database

## Current status

No database, schema, migrations, seed pipeline, or database connection is implemented or verified. The static home page does not persist or query data.

## Planned direction and budget

The [architecture specification](spec/03-architecture.md) proposes PostgreSQL on Neon with Prisma. The [free-service evaluation](adr/ADR-001-free-services.md) records the reviewed plan limits and conditions; those terms and account eligibility must be rechecked before use. Avoid storing media files in the database and measure actual usage once data exists. No database size, query plan, index, or entity relationship diagram is available yet.

Migrations and seeding are intended to run in GitHub Actions, not on a developer machine. Connection strings must be stored in service dashboards rather than committed or shared in chat.
