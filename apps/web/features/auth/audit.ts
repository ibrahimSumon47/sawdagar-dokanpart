import { randomUUID } from 'node:crypto';
import { getPrisma } from '../../lib/prisma';

export interface AuditEntry {
  actorUserId?: string;
  actorEmail: string;
  action: string;
  targetType?: string;
  targetId?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Appends one privileged or security-relevant action to the audit log.
 * The table is append-only in application code; no update or delete helper is
 * exported.
 */
export async function recordAuditLog(entry: AuditEntry): Promise<void> {
  await getPrisma().auditLog.create({
    data: {
      id: randomUUID(),
      actorUserId: entry.actorUserId,
      actorEmail: entry.actorEmail,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId,
      ipAddress: entry.ipAddress ?? undefined,
      userAgent: entry.userAgent ?? undefined,
      metadata: entry.metadata,
    },
  });
}

/** Reads client details from request headers for an audit entry. */
export function requestDetails(headers: Headers): {
  ipAddress: string | null;
  userAgent: string | null;
} {
  return {
    ipAddress:
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? headers.get('x-real-ip') ?? null,
    userAgent: headers.get('user-agent'),
  };
}
