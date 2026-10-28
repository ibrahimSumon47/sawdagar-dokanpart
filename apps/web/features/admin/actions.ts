'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getPrisma } from '../../lib/prisma';
import { adminFail, auditAdmin, requireAdmin } from './guard';

const storeDecisionSchema = z.object({
  storeId: z.string().trim().min(1).max(80),
  decision: z.enum(['approve', 'reject']),
  note: z
    .string()
    .trim()
    .max(300)
    .transform((value) => value || null),
});

const reviewDecisionSchema = z.object({
  reviewId: z.string().trim().min(1).max(80),
  decision: z.enum(['publish', 'hide']),
});

/** Approves or rejects one store's KYC and selling status. */
export async function reviewStoreAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:moderate:catalog', '/admin/stores');
  const parsed = storeDecisionSchema.safeParse({
    storeId: formData.get('storeId'),
    decision: formData.get('decision'),
    note: formData.get('note') ?? '',
  });
  if (!parsed.success) adminFail('/admin/stores', 'invalid');

  const store = await getPrisma().organization.findUnique({
    where: { id: parsed.data.storeId },
    select: { id: true, name: true },
  });
  if (!store) adminFail('/admin/stores', 'invalid');

  const approved = parsed.data.decision === 'approve';
  await getPrisma().organization.update({
    where: { id: store.id },
    data: {
      status: approved ? 'approved' : 'rejected',
      kycStatus: approved ? 'approved' : 'rejected',
      verified: approved,
      kycReviewedAt: new Date(),
      kycNote: approved ? null : parsed.data.note,
    },
  });

  await auditAdmin(
    viewer,
    `store.${approved ? 'approved' : 'rejected'}`,
    'organization',
    store.id,
    {
      name: store.name,
    },
  );
  revalidatePath('/admin/stores');
  revalidatePath('/admin');
  revalidatePath('/store/[slug]', 'page');
  redirect('/admin/stores?saved=1');
}

/** Publishes or hides one review and recalculates the product's rating. */
export async function moderateReviewAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:moderate:reviews', '/admin/reviews');
  const parsed = reviewDecisionSchema.safeParse({
    reviewId: formData.get('reviewId'),
    decision: formData.get('decision'),
  });
  if (!parsed.success) adminFail('/admin/reviews', 'invalid');

  const prisma = getPrisma();
  const review = await prisma.review.findUnique({
    where: { id: parsed.data.reviewId },
    select: { id: true, productId: true, product: { select: { slug: true } } },
  });
  if (!review) adminFail('/admin/reviews', 'invalid');

  await prisma.$transaction(async (tx) => {
    await tx.review.update({
      where: { id: review.id },
      data: { status: parsed.data.decision === 'publish' ? 'published' : 'hidden' },
    });
    const aggregate = await tx.review.aggregate({
      where: { productId: review.productId, status: 'published' },
      _avg: { rating: true },
      _count: { _all: true },
    });
    await tx.product.update({
      where: { id: review.productId },
      data: {
        rating: aggregate._avg.rating ?? 0,
        reviewCount: aggregate._count._all,
      },
    });
  });

  await auditAdmin(viewer, `review.${parsed.data.decision}`, 'review', review.id);
  revalidatePath('/admin/reviews');
  revalidatePath(`/product/${review.product.slug}`);
  revalidatePath('/catalog');
  redirect('/admin/reviews?saved=1');
}
