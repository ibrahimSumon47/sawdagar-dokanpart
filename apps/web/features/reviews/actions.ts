'use server';

import { isReviewable } from '@sd/domain';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { getPrisma } from '../../lib/prisma';
import { recordAuditLog, requestDetails } from '../auth/audit';
import { requireViewer } from '../auth/session';
import { reviewSchema } from './inputs';
import type { ReviewState } from './state';

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

/**
 * Publishes one review for a delivered order line owned by the viewer. The
 * server decides the product, buyer and verification badge; the form only
 * sends the line id, stars and text.
 */
export async function submitReview(
  _previous: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const viewer = await requireViewer('/account/reviews');
  const parsed = reviewSchema.safeParse({
    orderItemId: formData.get('orderItemId'),
    rating: formData.get('rating'),
    title: formData.get('title'),
    body: formData.get('body'),
    photos: formData.getAll('photos').map(String),
  });

  if (!parsed.success) {
    return { status: 'invalid', field: parsed.error.issues[0]?.path.join('.') };
  }

  const prisma = getPrisma();
  const item = await prisma.orderItem.findFirst({
    where: { id: parsed.data.orderItemId, order: { userId: viewer.id } },
    include: {
      review: { select: { id: true } },
      subOrder: { select: { status: true } },
      product: { select: { slug: true } },
    },
  });

  if (!item) return { status: 'invalid', field: 'orderItemId' };
  if (!isReviewable(item.subOrder.status, item.review !== null)) return { status: 'duplicate' };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          id: randomUUID(),
          orderItemId: item.id,
          productId: item.productId,
          userId: viewer.id,
          rating: parsed.data.rating,
          title: parsed.data.title,
          body: parsed.data.body,
          photos: {
            create: parsed.data.photos.map((dataUrl, index) => ({
              id: randomUUID(),
              dataUrl,
              sortOrder: index,
            })),
          },
        },
      });

      const aggregate = await tx.review.aggregate({
        where: { productId: item.productId, status: 'published' },
        _avg: { rating: true },
        _count: { _all: true },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: {
          rating: Math.round((aggregate._avg.rating ?? 0) * 10) / 10,
          reviewCount: aggregate._count._all,
        },
      });
    });

    const requestHeaders = await headers();
    const details = requestDetails(requestHeaders);
    await recordAuditLog({
      actorUserId: viewer.id,
      actorEmail: viewer.email,
      action: 'review.published',
      targetType: 'product',
      targetId: item.productId,
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      metadata: { rating: parsed.data.rating, photos: parsed.data.photos.length },
    });

    revalidatePath(`/product/${item.product.slug}`);
    revalidatePath('/account/reviews');
    revalidatePath('/catalog');
    revalidatePath('/');
    return { status: 'success' };
  } catch (error) {
    if (isUniqueViolation(error)) return { status: 'duplicate' };
    return { status: 'failed' };
  }
}
