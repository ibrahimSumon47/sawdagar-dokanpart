'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { normalizeTrackingCode, normalizeTrackingContact } from '@sd/domain';
import { recordAuditLog, requestDetails } from '../auth/audit';
import { grantTrackAccess } from './guestAccess';
import { findOrderForTracking } from './lookup';
import { isTrackingLimited } from './rateLimit';

/** Result of a tracking lookup. `found` carries the path to the timeline page. */
export interface TrackingFormState {
  /** Set only for the generic failure, so the form shows one fixed sentence. */
  failed?: boolean;
  /** Field-level problem with the input shape, shown inline without revealing a match. */
  fieldError?: 'code' | 'contact';
  /** Set when the lookup matched; the client follows this path. */
  redirectTo?: string;
}

const trackingInput = z.object({
  code: z.string().trim().min(1),
  contact: z.string().trim().min(1),
});

/**
 * Looks up an order for the public tracker. Wrong ID, wrong contact and rate
 * limiting all produce the same failed state, so the response is no oracle.
 * Every failure is written to the audit log with its real reason.
 */
export async function trackOrderAction(
  _previous: TrackingFormState,
  formData: FormData,
): Promise<TrackingFormState> {
  const parsed = trackingInput.safeParse({
    code: formData.get('code'),
    contact: formData.get('contact'),
  });
  if (!parsed.success) return { fieldError: 'code' };

  const code = normalizeTrackingCode(parsed.data.code);
  if (!code) return { fieldError: 'code' };

  const contact = normalizeTrackingContact(parsed.data.contact);
  if (!contact) return { fieldError: 'contact' };

  const requestHeaders = await headers();
  const details = requestDetails(requestHeaders);
  const ipAddress = details.ipAddress ?? '';

  if (await isTrackingLimited(ipAddress, code)) {
    await logFailedAttempt('rate-limited', code, details);
    return { failed: true };
  }

  const order = await findOrderForTracking(code, contact);
  if (!order) {
    await logFailedAttempt('not-found', code, details);
    return { failed: true };
  }

  await grantTrackAccess(order.orderCode);
  return { redirectTo: `/track/${encodeURIComponent(order.orderCode)}` };
}

/**
 * Writes one failed attempt to the audit log. The order code is recorded, but the
 * contact the visitor typed is never stored.
 */
async function logFailedAttempt(
  reason: 'not-found' | 'rate-limited',
  code: string,
  details: { ipAddress: string | null; userAgent: string | null },
): Promise<void> {
  await recordAuditLog({
    actorEmail: 'anonymous',
    action: 'tracking.lookup_failed',
    targetType: 'order',
    targetId: code,
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
    metadata: { reason },
  });
}
