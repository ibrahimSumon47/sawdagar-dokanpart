import { hasPermission, type PlatformRole } from '@sd/domain';
import type { Dictionary } from '../../i18n';

/** Sections of the admin area, in navigation order. */
export type AdminTab =
  'overview' | 'stores' | 'reviews' | 'content' | 'analytics' | 'flags' | 'audit' | 'finance';

export interface AdminNavItem {
  key: AdminTab;
  href: string;
  label: string;
}

/**
 * Builds the admin navigation for one role. Links the role cannot open are
 * left out, matching the guard on each page rather than hiding it only in CSS.
 */
export function adminNavItems(copy: Dictionary['admin'], role: PlatformRole): AdminNavItem[] {
  const items: (AdminNavItem & { allowed: boolean })[] = [
    { key: 'overview', href: '/admin', label: copy.navOverview, allowed: true },
    {
      key: 'stores',
      href: '/admin/stores',
      label: copy.navStores,
      allowed: hasPermission(role, 'admin:moderate:catalog'),
    },
    {
      key: 'reviews',
      href: '/admin/reviews',
      label: copy.navReviews,
      allowed: hasPermission(role, 'admin:moderate:reviews'),
    },
    {
      key: 'content',
      href: '/admin/content',
      label: copy.navContent,
      allowed: hasPermission(role, 'admin:cms:write'),
    },
    { key: 'analytics', href: '/admin/analytics', label: copy.navAnalytics, allowed: true },
    {
      key: 'flags',
      href: '/admin/flags',
      label: copy.navFlags,
      allowed: hasPermission(role, 'admin:settings:write'),
    },
    {
      key: 'audit',
      href: '/admin/audit',
      label: copy.navAudit,
      allowed: hasPermission(role, 'admin:audit:read'),
    },
    {
      key: 'finance',
      href: '/admin/finance',
      label: copy.navFinance,
      allowed: hasPermission(role, 'admin:finance:read'),
    },
  ];

  return items
    .filter((item) => item.allowed)
    .map((item) => ({ key: item.key, href: item.href, label: item.label }));
}
