import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins/admin';
import { organization } from 'better-auth/plugins/organization';
import { queueAuthMail } from '../features/auth/authMail';
import { getPrisma } from './prisma';
import { site } from './site';

/** True when both Google OAuth values exist, so the button can be offered. */
export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;

  return betterAuth({
    appName: site.name,
    baseURL: process.env.BETTER_AUTH_URL ?? site.demoUrl,
    ...(secret ? { secret } : {}),
    database: prismaAdapter(getPrisma(), { provider: 'postgresql' }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      sendResetPassword: async ({ user, url }) => {
        await queueAuthMail({
          userId: user.id,
          toEmail: user.email,
          subject: `Reset your ${site.name} password`,
          bodyText: `Use this link within one hour to choose a new password:\n${url}`,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await queueAuthMail({
          userId: user.id,
          toEmail: user.email,
          subject: `Verify your ${site.name} email address`,
          bodyText: `Open this link to verify your address:\n${url}`,
        });
      },
    },
    socialProviders: googleConfigured()
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        }
      : {},
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
        // Registration and reset are cheaper to abuse than sign-in, so they
        // get tighter windows; storage is the database because no Upstash
        // account is available (see ADR-011).
        '/sign-up/email': { window: 60, max: 5 },
        '/request-password-reset': { window: 300, max: 3 },
        '/reset-password': { window: 300, max: 5 },
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
