import { RETURN_WINDOW_DAYS } from '@sd/domain';
import { getPrisma } from '../../lib/prisma';

const DAY_MS = 86_400_000;

export interface ReturnableItem {
  orderItemId: string;
  orderNumber: string;
  productTitleEn: string;
  productTitleBn: string;
  productSlug: string;
  variantNameEn: string;
  variantNameBn: string;
  vendorName: string;
  deliveredAt: Date;
  lineTotalMinor: number;
}

export interface ReturnRequestRecord {
  id: string;
  status: string;
  reason: string;
  note: string | null;
  createdAt: Date;
  resolutionNote: string | null;
  productTitleEn: string;
  productTitleBn: string;
  productSlug: string;
  orderNumber: string;
  vendorName: string;
  lineTotalMinor: number;
}

/** Delivered lines still inside the seven-day return window. */
export async function getReturnableItems(userId: string): Promise<ReturnableItem[]> {
  const windowStart = new Date(Date.now() - RETURN_WINDOW_DAYS * DAY_MS);

  const rows = await getPrisma().orderItem.findMany({
    where: {
      order: { userId },
      subOrder: { status: 'delivered', deliveredAt: { gte: windowStart } },
      returnRequest: null,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { slug: true } },
      subOrder: {
        select: {
          deliveredAt: true,
          order: { select: { number: true } },
          organization: { select: { name: true } },
        },
      },
    },
  });

  return rows.map((row) => ({
    orderItemId: row.id,
    orderNumber: row.subOrder.order.number,
    productTitleEn: row.titleEn,
    productTitleBn: row.titleBn,
    productSlug: row.product.slug,
    variantNameEn: row.variantNameEn,
    variantNameBn: row.variantNameBn,
    vendorName: row.subOrder.organization.name,
    deliveredAt: row.subOrder.deliveredAt ?? row.createdAt,
    lineTotalMinor: row.lineTotalMinor,
  }));
}

/** Every return request the buyer has opened, newest first. */
export async function getUserReturns(userId: string): Promise<ReturnRequestRecord[]> {
  const rows = await getPrisma().returnRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItem: {
        include: {
          product: { select: { slug: true, titleEn: true, titleBn: true } },
          subOrder: {
            include: {
              order: { select: { number: true } },
              organization: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    reason: row.reason,
    note: row.note,
    createdAt: row.createdAt,
    resolutionNote: row.resolutionNote,
    productTitleEn: row.orderItem.product.titleEn,
    productTitleBn: row.orderItem.product.titleBn,
    productSlug: row.orderItem.product.slug,
    orderNumber: row.orderItem.subOrder.order.number,
    vendorName: row.orderItem.subOrder.organization.name,
    lineTotalMinor: row.orderItem.lineTotalMinor,
  }));
}
