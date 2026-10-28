'use server';

import { isReturnable } from '@sd/domain';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { getPrisma } from '../../lib/prisma';
import { recordAuditLog, requestDetails } from '../auth/audit';
import { requireViewer } from '../auth/session';
import { returnRequestSchema } from './inputs';
import type { ReturnState } from './state';

/**
 * Opens a return request for one delivered line inside the seven-day window.
 * Ownership, delivery and the window are checked on the server from the
 * session and the stored delivery time, never from the form.
 */
export async function requestReturn(
  _previous: ReturnState,
  formData: FormData,
): Promise<ReturnState> {
  const viewer = await requireViewer('/account/returns');
  const parsed = returnRequestSchema.safeParse({
    orderItemId: formData.get('orderItemId'),
    reason: formData.get('reason'),
    note: formData.get('note') ?? '',
  });

  if (!parsed.success) {
    return { status: 'invalid', field: parsed.error.issues[0]?.path.join('.') };
  }

  const prisma = getPrisma();
  const item = await prisma.orderItem.findFirst({
    where: { id: parsed.data.orderItemId, order: { userId: viewer.id } },
    include: {
      returnRequest: { select: { id: true } },
      order: { select: { number: true } },
      subOrder: { select: { status: true, deliveredAt: true } },
    },
  });

  if (!item) return { status: 'invalid', field: 'orderItemId' };

  const allowed = isReturnable(
    item.subOrder.status,
    item.subOrder.deliveredAt,
    new Date(),
    item.returnRequest !== null,
  );
  if (!allowed) return { status: 'window' };

  try {
    await prisma.returnRequest.create({
      data: {
        id: randomUUID(),
        orderItemId: item.id,
        userId: viewer.id,
        reason: parsed.data.reason,
        note: parsed.data.note,
      },
    });

    const requestHeaders = await headers();
    const details = requestDetails(requestHeaders);
    await recordAuditLog({
      actorUserId: viewer.id,
      actorEmail: viewer.email,
      action: 'return.requested',
      targetType: 'order_item',
      targetId: item.id,
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      metadata: { reason: parsed.data.reason },
    });

    revalidatePath('/account/returns');
    revalidatePath(`/orders/${item.order.number}`);
    return { status: 'success' };
  } catch {
    return { status: 'failed' };
  }
}
