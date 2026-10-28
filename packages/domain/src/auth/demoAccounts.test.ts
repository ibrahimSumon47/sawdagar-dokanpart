import { describe, expect, it } from 'vitest';
import { demoAccounts, findDemoAccount } from './demoAccounts';
import { platformRoles } from './roles';

describe('demo accounts', () => {
  it('has exactly one account per platform role', () => {
    expect(demoAccounts).toHaveLength(platformRoles.length);
    expect(new Set(demoAccounts.map((account) => account.role)).size).toBe(platformRoles.length);
  });

  it('uses a non-routable demo domain for every account', () => {
    for (const account of demoAccounts) {
      expect(account.email.endsWith('@demo.sawdagar.test'), account.email).toBe(true);
    }
  });

  it('finds only known accounts', () => {
    expect(findDemoAccount('buyer@demo.sawdagar.test')?.role).toBe('buyer');
    expect(findDemoAccount('someone@example.com')).toBeUndefined();
    expect(findDemoAccount(undefined)).toBeUndefined();
  });
});
