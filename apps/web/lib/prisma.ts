import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

let client: PrismaClient | undefined;

/** Raised when a request needs the database before its connection is configured. */
export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super('DATABASE_URL is not configured for this deployment.');
    this.name = 'DatabaseNotConfiguredError';
  }
}

/**
 * Creates the Prisma client on first use. Nothing connects during a build, and
 * a deployment without DATABASE_URL fails at request time with a typed error
 * rather than at module load.
 */
export function getPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new DatabaseNotConfiguredError();

  client ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return client;
}

/**
 * Lazily forwards property access to the real client. Better Auth asks the
 * adapter for a model delegate when the auth module loads, which must not
 * require a database connection during a static build.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    return getPrisma()[property as keyof PrismaClient];
  },
});
