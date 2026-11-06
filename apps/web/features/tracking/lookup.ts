import { getPrisma } from '../../lib/prisma';

export interface TrackedOrderRef {
  id: string;
  orderCode: string;
}

/**
 * Finds one guest-facing order by code and checks the contact the buyer typed.
 * Signed-in orders have no guest contact, so they never match here. The caller
 * receives the same null for an unknown code and a wrong contact, so the response
 * cannot be used to probe which codes exist.
 */
export async function findOrderForTracking(
  orderCode: string,
  contact: { kind: 'phone' | 'email'; value: string },
): Promise<TrackedOrderRef | null> {
  const order = await getPrisma().order.findFirst({
    where: {
      orderCode,
      userId: null,
      ...(contact.kind === 'email'
        ? { guestEmail: { equals: contact.value, mode: 'insensitive' } }
        : { shippingPhone: contact.value }),
    },
    select: { id: true, orderCode: true },
  });

  if (!order || !order.orderCode) return null;
  return { id: order.id, orderCode: order.orderCode };
}
