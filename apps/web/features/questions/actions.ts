'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { getPrisma } from '../../lib/prisma';
import { recordAuditLog, requestDetails } from '../auth/audit';
import { requireViewer } from '../auth/session';
import { questionSchema } from './inputs';
import type { QuestionState } from './state';

const HOURLY_QUESTION_LIMIT = 5;

/**
 * Stores one buyer question about a product. Questions are public once asked;
 * only the owning seller will be able to answer them from the Seller Center.
 */
export async function askQuestion(
  _previous: QuestionState,
  formData: FormData,
): Promise<QuestionState> {
  const viewer = await requireViewer('/account/questions');
  const parsed = questionSchema.safeParse({
    productId: formData.get('productId'),
    body: formData.get('body'),
  });

  if (!parsed.success) {
    return { status: 'invalid', field: parsed.error.issues[0]?.path.join('.') };
  }

  const prisma = getPrisma();
  const product = await prisma.product.findFirst({
    where: { id: parsed.data.productId, status: 'active' },
    select: { id: true, slug: true },
  });
  if (!product) return { status: 'invalid', field: 'productId' };

  const recent = await prisma.productQuestion.count({
    where: { userId: viewer.id, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
  });
  if (recent >= HOURLY_QUESTION_LIMIT) return { status: 'limit' };

  try {
    await prisma.productQuestion.create({
      data: {
        id: randomUUID(),
        productId: product.id,
        userId: viewer.id,
        body: parsed.data.body,
      },
    });

    const requestHeaders = await headers();
    const details = requestDetails(requestHeaders);
    await recordAuditLog({
      actorUserId: viewer.id,
      actorEmail: viewer.email,
      action: 'question.asked',
      targetType: 'product',
      targetId: product.id,
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
    });

    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/account/questions');
    return { status: 'success' };
  } catch {
    return { status: 'failed' };
  }
}
