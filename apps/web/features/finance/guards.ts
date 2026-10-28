import { hasPermission } from '@sd/domain';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { recordAuditLog, requestDetails } from '../auth/audit';
import { requireArea, type Viewer } from '../auth/session';

/** Redirects back to a finance page with an error flag. */
export function financeFail(path: string, code: string): never {
  redirect(`${path}?error=${code}`);
}

/**
 * Guards the platform finance queue: the role must hold the write permission
 * before any payout or refund is processed.
 */
export async function requireFinance(): Promise<Viewer> {
  const { viewer, role } = await requireArea('admin', '/admin/finance');
  if (!hasPermission(role, 'admin:finance:write')) redirect('/forbidden');
  return viewer;
}

/** Records one privileged finance action with its request context. */
export async function auditFinance(
  actor: { id: string; email: string },
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, string | number>,
): Promise<void> {
  const details = requestDetails(await headers());
  await recordAuditLog({
    actorUserId: actor.id,
    actorEmail: actor.email,
    action,
    targetType,
    targetId,
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
    metadata,
  });
}
