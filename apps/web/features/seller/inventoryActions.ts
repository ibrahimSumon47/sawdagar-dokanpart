'use server';

import { applyInventoryAdjustment } from '@sd/domain';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import { auditSeller, toMinor } from './actionHelpers';
import { stockAdjustmentSchema, variantSchema } from './inputs';
import { requireSellerAction } from './session';

function fail(path: string, code: string): never {
  redirect(`${path}?error=${code}`);
}

/** Recalculates a product's cached total from its variant rows. */
async function syncProductTotal(productId: string): Promise<void> {
  const aggregate = await getPrisma().productVariant.aggregate({
    where: { productId },
    _sum: { stock: true },
  });
  await getPrisma().product.update({
    where: { id: productId },
    data: { totalStock: aggregate._sum.stock ?? 0 },
  });
}

/** Saves the price and stock of one variant and records a stock change. */
export async function saveVariantAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/inventory');
  const parsed = variantSchema.safeParse({
    variantId: formData.get('variantId'),
    price: formData.get('price'),
    stock: formData.get('stock'),
  });
  if (!parsed.success) fail('/seller/inventory', 'invalid');

  const variant = await getPrisma().productVariant.findFirst({
    where: {
      id: parsed.data.variantId,
      product: { organizationId: access.organizationId },
    },
    select: { id: true, stock: true, productId: true },
  });
  if (!variant) fail('/seller/inventory', 'invalid');

  const delta = parsed.data.stock - variant.stock;
  await getPrisma().$transaction(async (tx) => {
    await tx.productVariant.update({
      where: { id: variant.id },
      data: { priceMinor: toMinor(parsed.data.price), stock: parsed.data.stock },
    });
    if (delta !== 0) {
      await tx.inventoryAdjustment.create({
        data: {
          id: randomUUID(),
          variantId: variant.id,
          actorUserId: access.viewer.id,
          delta,
          reason: 'correction',
          note: 'Edited from the inventory table',
          stockAfter: parsed.data.stock,
        },
      });
    }
  });
  await syncProductTotal(variant.productId);
  await auditSeller(access, 'seller.variant.updated', 'variant', variant.id, { delta });

  revalidatePath('/seller/inventory');
  revalidatePath('/seller/products');
  redirect('/seller/inventory?saved=1');
}

/** Applies one signed stock adjustment with a reason and keeps its history. */
export async function adjustStockAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/inventory');
  const parsed = stockAdjustmentSchema.safeParse({
    variantId: formData.get('variantId'),
    delta: formData.get('delta'),
    reason: formData.get('reason'),
    note: formData.get('note') ?? '',
  });
  if (!parsed.success) fail('/seller/inventory', 'invalid');

  const variant = await getPrisma().productVariant.findFirst({
    where: {
      id: parsed.data.variantId,
      product: { organizationId: access.organizationId },
    },
    select: { id: true, stock: true, productId: true },
  });
  if (!variant) fail('/seller/inventory', 'invalid');

  const result = applyInventoryAdjustment(variant.stock, parsed.data.delta);
  if (!result.ok) fail('/seller/inventory', result.code);

  await getPrisma().$transaction(async (tx) => {
    await tx.productVariant.update({
      where: { id: variant.id },
      data: { stock: result.stock },
    });
    await tx.inventoryAdjustment.create({
      data: {
        id: randomUUID(),
        variantId: variant.id,
        actorUserId: access.viewer.id,
        delta: parsed.data.delta,
        reason: parsed.data.reason,
        note: parsed.data.note,
        stockAfter: result.stock,
      },
    });
  });
  await syncProductTotal(variant.productId);
  await auditSeller(access, 'seller.stock.adjusted', 'variant', variant.id, {
    delta: parsed.data.delta,
    stock: result.stock,
  });

  revalidatePath('/seller/inventory');
  revalidatePath('/seller/products');
  redirect('/seller/inventory?saved=1');
}
