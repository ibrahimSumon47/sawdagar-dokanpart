import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins/admin';
import { organization } from 'better-auth/plugins/organization';
import { getPrisma } from './prisma';
import { site } from './site';

function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;

  return betterAuth({
    appName: site.name,
    baseURL: process.env.BETTER_AUTH_URL ?? site.demoUrl,
    ...(secret ? { secret } : {}),
    database: prismaAdapter(getPrisma(), { provider: 'postgresql' }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
    },
    user: {
      additionalFields: {
        isDemo: {
          type: 'boolean',
          defaultValue: false,
          input: false,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    rateLimit: {
      enabled: true,
      storage: 'database',
      window: 60,
      max: 30,
      customRules: {
        '/sign-in/email': { window: 60, max: 10 },
      },
    },
    trustedOrigins: [site.demoUrl],
    plugins: [admin(), organization(), nextCookies()],
  });
}

let instance: ReturnType<typeof createAuth> | undefined;

/**
 * Better Auth instance shared by route handlers, server actions and guards.
 *
 * It is created on the first request, never while a page is being compiled, so
 * a build or a deployment without DATABASE_URL stays buildable. Email and
 * password is the only enabled provider; the admin plugin supplies ban fields
 * and the organization plugin models a vendor store with owner and staff.
 */
export function getAuth(): ReturnType<typeof createAuth> {
  instance ??= createAuth();
  return instance;
}

export type Auth = ReturnType<typeof getAuth>;
