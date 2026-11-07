import { getPrisma } from '../../lib/prisma';

/** Quantities that expired holds still occupy, keyed by product and by variant. */
export interface ExpiredHoldAdjustments {
  byProduct: Map<string, number>;
  byVariant: Map<string, number>;
}

/**
 * Adds back the stock that expired guest holds still occupy. A hold is released
 * by the hourly sweep, but a buyer must not see or hit a sold-out row in the
 * gap between expiry and that sweep, so availability is computed as if the
 * release had already happened. The sweep still runs to normalise the rows and
 * cancel the abandoned orders.
 */
export async function expiredHoldAdjustments(
  productIds: string[],
  now: Date = new Date(),
): Promise<ExpiredHoldAdjustments> {
  const adjustments: ExpiredHoldAdjustments = { byProduct: new Map(), byVariant: new Map() };
  if (productIds.length === 0) return adjustments;

  const expired = await getPrisma().stockReservation.findMany({
    where: {
      status: 'held',
      expiresAt: { lt: now },
      order: { userId: null },
      variant: { productId: { in: productIds } },
    },
    select: { quantity: true, variantId: true, variant: { select: { productId: true } } },
  });

  for (const hold of expired) {
    const productId = hold.variant.productId;
    adjustments.byProduct.set(
      productId,
      (adjustments.byProduct.get(productId) ?? 0) + hold.quantity,
    );
    adjustments.byVariant.set(
      hold.variantId,
      (adjustments.byVariant.get(hold.variantId) ?? 0) + hold.quantity,
    );
  }

  return adjustments;
}

/** Stock a buyer can actually take for one variant, expired holds included. */
export async function availableVariantStock(
  variantId: string,
  now: Date = new Date(),
): Promise<number> {
  const variant = await getPrisma().productVariant.findUnique({
    where: { id: variantId },
    select: { stock: true, productId: true },
  });
  if (!variant) return 0;

  const adjustments = await expiredHoldAdjustments([variant.productId], now);
  return variant.stock + (adjustments.byVariant.get(variantId) ?? 0);
}
