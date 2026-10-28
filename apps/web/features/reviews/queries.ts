import { summariseRatings, type RatingSummary } from '@sd/domain';
import { getPrisma } from '../../lib/prisma';

export interface ReviewRecord {
  id: string;
  rating: number;
  title: string;
  body: string;
  authorName: string;
  createdAt: Date;
  /** True only when the review is tied to a delivered order line. */
  verified: boolean;
  photos: string[];
}

export interface UserReviewRecord extends ReviewRecord {
  productTitleEn: string;
  productTitleBn: string;
  productSlug: string;
}

export interface ReviewableItem {
  orderItemId: string;
  orderNumber: string;
  productTitleEn: string;
  productTitleBn: string;
  productSlug: string;
  variantNameEn: string;
  variantNameBn: string;
  vendorName: string;
  deliveredAt: Date;
}

/** Latest published reviews for a product, with their photos. */
export async function getProductReviews(productId: string, take = 8): Promise<ReviewRecord[]> {
  const rows = await getPrisma().review.findMany({
    where: { productId, status: 'published' },
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      user: { select: { name: true } },
      photos: { orderBy: { sortOrder: 'asc' }, select: { dataUrl: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    rating: row.rating,
    title: row.title,
    body: row.body,
    authorName: row.user.name,
    createdAt: row.createdAt,
    verified: row.orderItemId !== null,
    photos: row.photos.map((photo) => photo.dataUrl),
  }));
}

/** Star average and distribution computed from published review rows. */
export async function getReviewSummary(productId: string): Promise<RatingSummary> {
  const groups = await getPrisma().review.groupBy({
    by: ['rating'],
    where: { productId, status: 'published' },
    _count: { _all: true },
  });

  const ratings = groups.flatMap((group) =>
    Array.from({ length: group._count._all }, () => group.rating),
  );

  return summariseRatings(ratings);
}

/** Delivered order lines the buyer has not reviewed yet. */
export async function getReviewableItems(userId: string): Promise<ReviewableItem[]> {
  const rows = await getPrisma().orderItem.findMany({
    where: {
      order: { userId },
      subOrder: { status: 'delivered' },
      review: null,
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
  }));
}

/** Every review the buyer has published, newest first. */
export async function getUserReviews(userId: string): Promise<UserReviewRecord[]> {
  const rows = await getPrisma().review.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
      product: { select: { slug: true, titleEn: true, titleBn: true } },
      photos: { orderBy: { sortOrder: 'asc' }, select: { dataUrl: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    rating: row.rating,
    title: row.title,
    body: row.body,
    authorName: row.user.name,
    createdAt: row.createdAt,
    verified: row.orderItemId !== null,
    photos: row.photos.map((photo) => photo.dataUrl),
    productTitleEn: row.product.titleEn,
    productTitleBn: row.product.titleBn,
    productSlug: row.product.slug,
  }));
}

export interface BuyerOrderRecord {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  totalMinor: number;
  placedAt: Date;
  itemCount: number;
  sellerCount: number;
}

/** Order history for the account page, newest first. */
export async function getOrdersForUser(userId: string): Promise<BuyerOrderRecord[]> {
  const rows = await getPrisma().order.findMany({
    where: { userId },
    orderBy: { placedAt: 'desc' },
    take: 25,
    include: { items: { select: { quantity: true } }, subOrders: { select: { id: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    number: row.number,
    status: row.status,
    paymentStatus: row.paymentStatus,
    totalMinor: row.totalMinor,
    placedAt: row.placedAt,
    itemCount: row.items.reduce((total, item) => total + item.quantity, 0),
    sellerCount: row.subOrders.length,
  }));
}
