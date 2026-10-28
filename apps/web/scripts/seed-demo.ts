import { randomUUID } from 'node:crypto';
import { demoAccounts } from '@sd/domain';
import { getAuth } from '../lib/auth';
import { getPrisma } from '../lib/prisma';

interface DemoProfile {
  phone: string | null;
  district: string | null;
  bio: string | null;
}

const profiles: Record<string, DemoProfile> = {
  'buyer@demo.sawdagar.test': {
    phone: '01712345678',
    district: 'Dhaka',
    bio: 'Buys handloom and pottery for the home.',
  },
  'vendor@demo.sawdagar.test': {
    phone: '01712345679',
    district: 'Tangail',
    bio: 'Runs a family weaving studio in Tangail.',
  },
  'staff@demo.sawdagar.test': {
    phone: null,
    district: 'Tangail',
    bio: 'Handles packing and dispatch for the studio.',
  },
};

const emptyProfile: DemoProfile = { phone: null, district: null, bio: null };

function write(message: string): void {
  process.stdout.write(`${message}\n`);
}

async function main(): Promise<void> {
  const password = process.env.DEMO_ACCOUNT_PASSWORD;
  if (!password) throw new Error('DEMO_ACCOUNT_PASSWORD is required to seed demo accounts.');
  if (password.length < 12) throw new Error('DEMO_ACCOUNT_PASSWORD must be at least 12 characters.');

  const prisma = getPrisma();
  let created = 0;
  let updated = 0;

  for (const account of demoAccounts) {
    const existing = await prisma.user.findUnique({ where: { email: account.email } });

    if (!existing) {
      await getAuth().api.signUpEmail({
        body: { email: account.email, password, name: account.name },
      });
      created += 1;
    } else {
      updated += 1;
    }

    const user = await prisma.user.update({
      where: { email: account.email },
      data: { name: account.name, role: account.role, isDemo: true, emailVerified: true },
    });

    const profile = profiles[account.email] ?? emptyProfile;
    await prisma.profile.upsert({
      where: { userId: user.id },
      create: { id: randomUUID(), userId: user.id, ...profile },
      update: profile,
    });

    if (account.organization) {
      const organization = await prisma.organization.upsert({
        where: { slug: account.organization.slug },
        create: {
          id: randomUUID(),
          name: account.organization.name,
          slug: account.organization.slug,
        },
        update: { name: account.organization.name },
      });

      await prisma.member.upsert({
        where: {
          organizationId_userId: { organizationId: organization.id, userId: user.id },
        },
        create: {
          id: randomUUID(),
          organizationId: organization.id,
          userId: user.id,
          role: account.organization.memberRole,
        },
        update: { role: account.organization.memberRole },
      });
    }
  }

  write(`Demo accounts ready: ${demoAccounts.length} (${created} created, ${updated} refreshed).`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown seeding error';
  process.stderr.write(`Seeding failed: ${message}\n`);
  process.exitCode = 1;
});
