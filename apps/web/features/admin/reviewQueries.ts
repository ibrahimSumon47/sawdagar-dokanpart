import { getPrisma } from '../../lib/prisma';

export interface ModerationReview {
  id: string;
  rating: number;
  title: string;
  body: string;
  status: string;
  createdAt: Date;
  authorName: string;
  productTitleEn: string;
  productTitleBn: string;
  productSlug: string;
}

export interface ReviewModeration {
  reviews: ModerationReview[];
  published: number;
  hidden: number;
}

/** Recent reviews with the counts the moderation screen shows. */
export async function getReviewModeration(): Promise<ReviewModeration> {
  const prisma = getPrisma();
  const [rows, published, hidden] = await Promise.all([
    prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 60,
      include: {
        user: { select: { name: true } },
        product: { select: { slug: true, titleEn: true, titleBn: true } },
      },
    }),
    prisma.review.count({ where: { status: 'published' } }),
    prisma.review.count({ where: { status: 'hidden' } }),
  ]);

  return {
    reviews: rows.map((row) => ({
      id: row.id,
      rating: row.rating,
      title: row.title,
      body: row.body,
      status: row.status,
      createdAt: row.createdAt,
      authorName: row.user.name,
      productTitleEn: row.product.titleEn,
      productTitleBn: row.product.titleBn,
      productSlug: row.product.slug,
    })),
    published,
    hidden,
  };
}
