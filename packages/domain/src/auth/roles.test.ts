import { describe, expect, it } from 'vitest';
import {
  hasArea,
  hasPermission,
  isPlatformRole,
  normalizeRole,
  permissionsFor,
  platformRoles,
} from './roles';

describe('platform roles', () => {
  it('recognises only the eight documented roles', () => {
    for (const role of platformRoles) expect(isPlatformRole(role)).toBe(true);
    expect(isPlatformRole('admin')).toBe(false);
    expect(isPlatformRole(undefined)).toBe(false);
  });

  it('falls back to buyer for missing or unknown roles', () => {
    expect(normalizeRole('owner')).toBe('buyer');
    expect(normalizeRole(null)).toBe('buyer');
    expect(normalizeRole('moderator')).toBe('moderator');
  });

  it('serves the account area to every role but seller to vendor roles only', () => {
    for (const role of platformRoles) {
      expect(hasArea(role, 'account'), role).toBe(true);
    }

    expect(hasArea('vendor_owner', 'seller')).toBe(true);
    expect(hasArea('vendor_staff', 'seller')).toBe(true);
    expect(hasArea('buyer', 'seller')).toBe(false);
    expect(hasArea('support', 'seller')).toBe(false);
  });

  it('restricts the admin area to platform staff', () => {
    expect(hasArea('buyer', 'admin')).toBe(false);
    expect(hasArea('vendor_owner', 'admin')).toBe(false);
    expect(hasArea('support', 'admin')).toBe(true);
    expect(hasArea('super_admin', 'admin')).toBe(true);
  });

  it('does not let vendor staff manage the store', () => {
    expect(hasPermission('vendor_staff', 'seller:read')).toBe(true);
    expect(hasPermission('vendor_staff', 'seller:manage')).toBe(false);
    expect(hasPermission('vendor_owner', 'seller:manage')).toBe(true);
  });

  it('keeps the audit trail to the super admin', () => {
    expect(hasPermission('support', 'admin:audit:read')).toBe(false);
    expect(hasPermission('super_admin', 'admin:audit:read')).toBe(true);
  });

  it('gives the super admin every permission and unique permission arrays', () => {
    const all = new Set(platformRoles.flatMap((role) => permissionsFor(role)));

    for (const permission of all) {
      expect(hasPermission('super_admin', permission), permission).toBe(true);
    }

    for (const role of platformRoles) {
      expect(new Set(permissionsFor(role)).size, role).toBe(permissionsFor(role).length);
    }
  });
});
