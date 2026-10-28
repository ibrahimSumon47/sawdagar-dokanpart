import { defineConfig } from 'prisma/config';

/**
 * Prisma CLI configuration. The database URL is read at command time so the
 * generated client can be produced on builds that never open a connection.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx scripts/seed-demo.ts',
  },
  datasource: {
    // Migrations use the direct Neon connection; the app uses the pooled one.
    url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL ?? '',
  },
});
