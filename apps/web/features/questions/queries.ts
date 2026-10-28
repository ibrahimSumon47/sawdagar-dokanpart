import { getPrisma } from '../../lib/prisma';

export interface QuestionRecord {
  id: string;
  body: string;
  askedByName: string;
  createdAt: Date;
  answerBody: string | null;
  answeredAt: Date | null;
}

export interface UserQuestionRecord extends QuestionRecord {
  productTitleEn: string;
  productTitleBn: string;
  productSlug: string;
}

/** Recent public questions for one product, with seller answers when present. */
export async function getProductQuestions(productId: string, take = 6): Promise<QuestionRecord[]> {
  const rows = await getPrisma().productQuestion.findMany({
    where: { productId, status: { in: ['open', 'answered'] } },
    orderBy: { createdAt: 'desc' },
    take,
    include: { user: { select: { name: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    body: row.body,
    askedByName: row.user.name,
    createdAt: row.createdAt,
    answerBody: row.answerBody,
    answeredAt: row.answeredAt,
  }));
}

/** Every question the buyer has asked, newest first. */
export async function getUserQuestions(userId: string): Promise<UserQuestionRecord[]> {
  const rows = await getPrisma().productQuestion.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { product: { select: { slug: true, titleEn: true, titleBn: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    body: row.body,
    askedByName: '',
    createdAt: row.createdAt,
    answerBody: row.answerBody,
    answeredAt: row.answeredAt,
    productTitleEn: row.product.titleEn,
    productTitleBn: row.product.titleBn,
    productSlug: row.product.slug,
  }));
}
