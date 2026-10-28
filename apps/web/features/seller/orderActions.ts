'use server';

import { canTransitionSubOrder, subOrderStatuses, type SubOrderStatus } from '@sd/domain';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import { auditSeller } from './actionHelpers';
import { answerSchema, returnDecisionSchema } from './inputs';
import { requireSellerAction } from './session';

function fail(path: string, code: string): never {
  redirect(`${path}?error=${code}`);
}

function timestampField(status: SubOrderStatus) {
  switch (status) {
    case 'confirmed':
      return { confirmedAt: new Date() };
    case 'packed':
      return { packedAt: new Date() };
    case 'shipped':
      return { shippedAt: new Date() };
    case 'delivered':
      return { deliveredAt: new Date() };
    case 'cancelled':
      return { cancelledAt: new Date() };
    default:
      return {};
  }
}

/**
 * Moves a store's sub-order one step along confirmed, packed, shipped and
 * delivered. Shipping needs a courier and tracking number, and cancelling
 * restores the stock that checkout reserved for the lines.
 */
export async function advanceSubOrderAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/orders');
  const subOrderId = String(formData.get('subOrderId') ?? '');
  const target = String(formData.get('status') ?? '') as SubOrderStatus;
  if (!subOrderId || !(subOrderStatuses as readonly string[]).includes(target)) {
    fail('/seller/orders', 'invalid');
  }

  const prisma = getPrisma();
  const subOrder = await prisma.subOrder.findFirst({
    where: { id: subOrderId, organizationId: access.organizationId },
    select: {
      id: true,
      status: true,
      orderId: true,
      items: { select: { variantId: true, productId: true, quantity: true } },
      order: { select: { subOrders: { select: { id: true, status: true } } } },
    },
  });
  if (!subOrder) fail('/seller/orders', 'invalid');
  if (!canTransitionSubOrder(subOrder.status as SubOrderStatus, target)) {
    fail(`/seller/orders/${subOrder.id}`, 'invalid');
  }

  const courier = String(formData.get('courier') ?? '')
    .trim()
    .slice(0, 40);
  const trackingNumber = String(formData.get('trackingNumber') ?? '')
    .trim()
    .slice(0, 40);
  if (target === 'shipped' && (courier.length < 2 || trackingNumber.length < 4)) {
    fail(`/seller/orders/${subOrder.id}`, 'tracking');
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.subOrder.update({
        where: { id: subOrder.id },
        data: {
          status: target,
          ...timestampField(target),
          ...(target === 'shipped' ? { courier, trackingNumber } : {}),
        },
      });

      if (target === 'cancelled') {
        const productIds = new Set<string>();
        for (const item of subOrder.items) {
          const updated = await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
            select: { stock: true },
          });
          productIds.add(item.productId);
          await tx.inventoryAdjustment.create({
            data: {
              id: randomUUID(),
              variantId: item.variantId,
              actorUserId: access.viewer.id,
              delta: item.quantity,
              reason: 'return',
              note: 'Stock restored after seller cancellation',
              stockAfter: updated.stock,
            },
          });
        }
        for (const productId of productIds) {
          const aggregate = await tx.productVariant.aggregate({
            where: { productId },
            _sum: { stock: true },
          });
          await tx.product.update({
            where: { id: productId },
            data: { totalStock: aggregate._sum.stock ?? 0 },
          });
        }
      }

      const statuses = subOrder.order.subOrders.map((entry) =>
        entry.id === subOrder.id ? target : entry.status,
      );
      const orderStatus = statuses.every((status) => status === 'delivered')
        ? 'completed'
        : statuses.every((status) => status === 'cancelled')
          ? 'cancelled'
          : 'confirmed';
      await tx.order.update({ where: { id: subOrder.orderId }, data: { status: orderStatus } });
    });
    await auditSeller(access, 'seller.suborder.advanced', 'subOrder', subOrder.id, {
      from: subOrder.status,
      to: target,
    });
  } catch {
    fail(`/seller/orders/${subOrder.id}`, 'failed');
  }

  revalidatePath('/seller/orders');
  revalidatePath(`/seller/orders/${subOrder.id}`);
  revalidatePath('/account/orders');
  redirect(`/seller/orders/${subOrder.id}?saved=1`);
}

/** Publishes the store's answer to one buyer question. */
export async function answerQuestionAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/questions');
  const parsed = answerSchema.safeParse({
    questionId: formData.get('questionId'),
    body: formData.get('body'),
  });
  if (!parsed.success) fail('/seller/questions', 'invalid');

  const question = await getPrisma().productQuestion.findFirst({
    where: { id: parsed.data.questionId, product: { organizationId: access.organizationId } },
    select: { id: true, productId: true, product: { select: { slug: true } } },
  });
  if (!question) fail('/seller/questions', 'invalid');

  await getPrisma().productQuestion.update({
    where: { id: question.id },
    data: {
      answerBody: parsed.data.body,
      answeredAt: new Date(),
      answeredByUserId: access.viewer.id,
      status: 'answered',
    },
  });
  await auditSeller(access, 'seller.question.answered', 'productQuestion', question.id);

  revalidatePath('/seller/questions');
  revalidatePath(`/product/${question.product.slug}`);
  redirect('/seller/questions?saved=1');
}

/** Approves or rejects one return request; money is handled in the finance phase. */
export async function resolveReturnAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/returns');
  const parsed = returnDecisionSchema.safeParse({
    returnRequestId: formData.get('returnRequestId'),
    decision: formData.get('decision'),
    note: formData.get('note') ?? '',
  });
  if (!parsed.success) fail('/seller/returns', 'invalid');

  const request = await getPrisma().returnRequest.findFirst({
    where: {
      id: parsed.data.returnRequestId,
      orderItem: { subOrder: { organizationId: access.organizationId } },
    },
    select: { id: true },
  });
  if (!request) fail('/seller/returns', 'invalid');

  await getPrisma().returnRequest.update({
    where: { id: request.id },
    data: {
      status: parsed.data.decision,
      resolutionNote: parsed.data.note,
    },
  });
  await auditSeller(access, `seller.return.${parsed.data.decision}`, 'returnRequest', request.id);

  revalidatePath('/seller/returns');
  revalidatePath('/account/returns');
  redirect('/seller/returns?saved=1');
}
