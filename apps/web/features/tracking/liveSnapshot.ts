import { createHash } from 'node:crypto';
import { getOrderForViewer, getGuestOrderByCode } from '../checkout/queries';
import type { OrderRecord } from '../checkout/queries';
import { hasTrackAccess } from './guestAccess';

/** What a live client follows: a guest order code, or a signed-in order number. */
export type TrackingReference =
  { kind: 'guest'; orderCode: string } | { kind: 'account'; number: string; userId: string };

/** A snapshot of the timeline state, with a fingerprint the client compares to detect changes. */
export interface TrackingSnapshot {
  fingerprint: string;
  order: OrderRecord;
}

/**
 * Loads the order for a reference, enforcing the same access rules as the
 * pages. A guest reference needs the signed cookie; an account reference needs
 * the viewer to own the order. Returns null when access is refused or the order
 * does not exist, so callers answer with one generic not-found response.
 */
export async function loadTrackingSnapshot(
  reference: TrackingReference,
): Promise<TrackingSnapshot | null> {
  if (reference.kind === 'guest') {
    if (!(await hasTrackAccess(reference.orderCode))) return null;
    const order = await getGuestOrderByCode(reference.orderCode);
    return order ? toSnapshot(order) : null;
  }

  const order = await getOrderForViewer(reference.number, reference.userId);
  return order ? toSnapshot(order) : null;
}

/**
 * Hashes only the fields the timeline displays. A change in any of them changes
 * the fingerprint, so the client reloads only when something visible moved.
 */
export function toSnapshot(order: OrderRecord): TrackingSnapshot {
  const visible = {
    status: order.status,
    paymentStatus: order.paymentStatus,
    subOrders: order.subOrders.map((sub) => ({
      id: sub.id,
      status: sub.status,
      courier: sub.courier,
      trackingNumber: sub.trackingNumber,
      confirmedAt: sub.confirmedAt,
      packedAt: sub.packedAt,
      shippedAt: sub.shippedAt,
      deliveredAt: sub.deliveredAt,
      cancelledAt: sub.cancelledAt,
    })),
  };
  const fingerprint = createHash('sha256').update(JSON.stringify(visible)).digest('base64url');
  return { fingerprint, order };
}
