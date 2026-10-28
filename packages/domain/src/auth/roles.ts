/**
 * Platform roles and permissions.
 *
 * Role checks live here, away from the UI and route handlers, so the same rules
 * can be unit-tested and reused by pages, server actions and future API guards.
 */

export const platformRoles = [
  'buyer',
  'vendor_owner',
  'vendor_staff',
  'support',
  'moderator',
  'finance',
  'content_editor',
  'super_admin',
] as const;

export type PlatformRole = (typeof platformRoles)[number];

export const platformAreas = ['account', 'seller', 'admin'] as const;

export type PlatformArea = (typeof platformAreas)[number];

export type Permission =
  | 'profile:read'
  | 'profile:write'
  | 'seller:read'
  | 'seller:manage'
  | 'admin:access'
  | 'admin:users:read'
  | 'admin:moderate:catalog'
  | 'admin:moderate:reviews'
  | 'admin:finance:read'
  | 'admin:finance:write'
  | 'admin:cms:write'
  | 'admin:audit:read'
  | 'admin:settings:write';

const buyerPermissions = ['profile:read', 'profile:write'] as const;

const allPermissions: readonly Permission[] = [
  'profile:read',
  'profile:write',
  'seller:read',
  'seller:manage',
  'admin:access',
  'admin:users:read',
  'admin:moderate:catalog',
  'admin:moderate:reviews',
  'admin:finance:read',
  'admin:finance:write',
  'admin:cms:write',
  'admin:audit:read',
  'admin:settings:write',
];

const rolePermissions: Record<PlatformRole, readonly Permission[]> = {
  buyer: buyerPermissions,
  vendor_owner: [...buyerPermissions, 'seller:read', 'seller:manage'],
  vendor_staff: [...buyerPermissions, 'seller:read'],
  support: [...buyerPermissions, 'admin:access', 'admin:users:read'],
  moderator: [
    ...buyerPermissions,
    'admin:access',
    'admin:moderate:catalog',
    'admin:moderate:reviews',
  ],
  finance: [...buyerPermissions, 'admin:access', 'admin:finance:read', 'admin:finance:write'],
  content_editor: [...buyerPermissions, 'admin:access', 'admin:cms:write'],
  super_admin: allPermissions,
};

const areaPermission: Record<PlatformArea, Permission> = {
  account: 'profile:read',
  seller: 'seller:read',
  admin: 'admin:access',
};

/** Narrows an arbitrary stored value to a known platform role. */
export function isPlatformRole(value: unknown): value is PlatformRole {
  return typeof value === 'string' && (platformRoles as readonly string[]).includes(value);
}

/** Falls back to the buyer role when a stored value is missing or unknown. */
export function normalizeRole(value: unknown): PlatformRole {
  return isPlatformRole(value) ? value : 'buyer';
}

/** Returns the permissions granted to a role. */
export function permissionsFor(role: PlatformRole): readonly Permission[] {
  return rolePermissions[role];
}

/** Checks one permission, ignoring unknown roles by treating them as buyers. */
export function hasPermission(role: unknown, permission: Permission): boolean {
  return rolePermissions[normalizeRole(role)].includes(permission);
}

/** Checks whether a role may open a top-level area of the application. */
export function hasArea(role: unknown, area: PlatformArea): boolean {
  return hasPermission(role, areaPermission[area]);
}
