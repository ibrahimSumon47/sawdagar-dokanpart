import { headers } from 'next/headers';
import { recordAuditLog, requestDetails } from '../auth/audit';
import type { SellerAccess } from './session';

/** Converts a taka amount typed in a form to integer poisha for storage. */
export function toMinor(taka: number): number {
  return Math.round(taka * 100);
}

/** Turns an optional ISO date from a form into a Date, or null. */
export function parseOptionalDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T23:59:59.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** True when Prisma rejected a write because a unique field already exists. */
export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

/** Records a seller action without letting the audit write hide the result. */
export async function auditSeller(
  access: SellerAccess,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, string | number | boolean>,
): Promise<void> {
  const details = requestDetails(await headers());
  await recordAuditLog({
    actorUserId: access.viewer.id,
    actorEmail: access.viewer.email,
    action,
    targetType,
    targetId,
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
    metadata,
  });
}
