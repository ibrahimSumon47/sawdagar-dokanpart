import { hasPermission, type Permission } from '@sd/domain';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { recordAuditLog, requestDetails } from '../auth/audit';
import { requireArea, type Viewer } from '../auth/session';

/**
 * Guards an admin page or action with one permission. The role comes from the
 * session, never from the request.
 */
export async function requireAdmin(permission: Permission, path: string): Promise<Viewer> {
  const { viewer, role } = await requireArea('admin', path);
  if (!hasPermission(role, permission)) redirect('/forbidden');
  return viewer;
}

/** Records one admin action with its request context. */
export async function auditAdmin(
  viewer: Viewer,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, string | number | boolean>,
): Promise<void> {
  const details = requestDetails(await headers());
  await recordAuditLog({
    actorUserId: viewer.id,
    actorEmail: viewer.email,
    action,
    targetType,
    targetId,
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
    metadata,
  });
}

/** Redirects back to an admin page with an error flag. */
export function adminFail(path: string, code: string): never {
  redirect(`${path}?error=${code}`);
}
