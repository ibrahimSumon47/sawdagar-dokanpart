import type { PlatformRole } from './roles';

/** A seeded demo login shown on the sign-in page. */
export interface DemoAccount {
  /** Non-routable demo address, for example buyer@demo.sawdagar.test. */
  email: string;
  name: string;
  role: PlatformRole;
  /** Store owned or staffed by this account, when the role belongs to one. */
  organization?: {
    name: string;
    slug: string;
    memberRole: 'owner' | 'staff';
  };
}

/**
 * One account per platform role. These are the only accounts the public Try
 * demo action can open, and the seed script creates them idempotently.
 */
export const demoAccounts: readonly DemoAccount[] = [
  {
    email: 'buyer@demo.sawdagar.test',
    name: 'Nusrat Jahan',
    role: 'buyer',
  },
  {
    email: 'vendor@demo.sawdagar.test',
    name: 'Farhana Rahman',
    role: 'vendor_owner',
    organization: {
      name: 'Rupsha Tangail Weavers',
      slug: 'rupsha-tangail-weavers',
      memberRole: 'owner',
    },
  },
  {
    email: 'staff@demo.sawdagar.test',
    name: 'Shahidul Islam',
    role: 'vendor_staff',
    organization: {
      name: 'Rupsha Tangail Weavers',
      slug: 'rupsha-tangail-weavers',
      memberRole: 'staff',
    },
  },
  {
    email: 'support@demo.sawdagar.test',
    name: 'Tanvir Ahmed',
    role: 'support',
  },
  {
    email: 'moderator@demo.sawdagar.test',
    name: 'Sabrina Chowdhury',
    role: 'moderator',
  },
  {
    email: 'finance@demo.sawdagar.test',
    name: 'Rezaul Karim',
    role: 'finance',
  },
  {
    email: 'editor@demo.sawdagar.test',
    name: 'Ayesha Siddiqua',
    role: 'content_editor',
  },
  {
    email: 'admin@demo.sawdagar.test',
    name: 'Imran Hossain',
    role: 'super_admin',
  },
];

/** Finds a demo account by email; the allowlist for the public demo action. */
export function findDemoAccount(email: unknown): DemoAccount | undefined {
  if (typeof email !== 'string') return undefined;
  return demoAccounts.find((account) => account.email === email);
}
