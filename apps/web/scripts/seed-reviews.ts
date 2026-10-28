import { hashSeedValue } from '@sd/domain';
import type { PrismaClient } from '../generated/prisma/client';

const DAY_MS = 86_400_000;
const ANCHOR = new Date('2026-10-01T00:00:00Z');

interface ReviewTemplate {
  rating: number;
  title: string;
  body: string;
}

const englishTemplates: ReviewTemplate[] = [
  {
    rating: 5,
    title: 'Exactly as described',
    body: 'The {title} arrived well packed and the colour matches the photos. Delivery inside Dhaka took two days.',
  },
  {
    rating: 5,
    title: 'The finish is careful',
    body: 'You can see the handwork up close on this {title}. The edges are clean, and the seller answered my question before I ordered.',
  },
  {
    rating: 5,
    title: 'Bought a second one',
    body: 'I ordered this {title} for myself and came back for another as a gift. Both parcels were sealed and complete.',
  },
  {
    rating: 4,
    title: 'Good value for the price',
    body: 'The {title} is a little smaller than I pictured, but the material is honest and it has held up well so far.',
  },
  {
    rating: 4,
    title: 'Happy with it',
    body: 'Delivery took four days to Chattogram. The {title} matches the description and the finish is even.',
  },
  {
    rating: 4,
    title: 'Nearly perfect',
    body: 'Lovely {title}, though the packaging could be sturdier. Nothing was damaged, just a crushed outer carton.',
  },
  {
    rating: 3,
    title: 'Fine, with a small flaw',
    body: 'The {title} is usable, but one edge is uneven. The seller offered a partial refund when I sent a photo.',
  },
  {
    rating: 2,
    title: 'Not the shade I expected',
    body: 'The {title} is more muted in person than on screen. The return was accepted within the week.',
  },
];

const banglaTemplates: ReviewTemplate[] = [
  {
    rating: 5,
    title: 'ছবির মতোই পেয়েছি',
    body: '“{title}” যত্ন করে প্যাক করা ছিল। রং আর বুনন ছবির সঙ্গে মিলে গেছে, ঢাকায় দুই দিনে পৌঁছেছে।',
  },
  {
    rating: 5,
    title: 'হাতের কাজ খুব যত্নের',
    body: '“{title}” কাছ থেকে দেখলে কাজের দক্ষতা বোঝা যায়। সুতোর টান নেই, বিক্রেতা অর্ডারের আগে প্রশ্নের উত্তরও দিয়েছেন।',
  },
  {
    rating: 5,
    title: 'আরেকটি নিলাম',
    body: 'নিজের জন্য “{title}” কিনে উপহার হিসেবে আরেকটি অর্ডার করেছি। দুটো প্যাকেটই সিল করা ছিল।',
  },
  {
    rating: 4,
    title: 'দামের তুলনায় ভালো',
    body: '“{title}” ভেবেছিলাম তার চেয়ে একটু ছোট, তবে গড়ন ভালো আর ব্যবহারের পরও ঠিক আছে।',
  },
  {
    rating: 4,
    title: 'সন্তুষ্ট',
    body: 'চট্টগ্রামে পৌঁছাতে চার দিন লেগেছে। “{title}” বর্ণনার সঙ্গে মেলে, ফিনিশও সমান।',
  },
  {
    rating: 3,
    title: 'একটু ত্রুটি আছে',
    body: '“{title}” ব্যবহার করা যাচ্ছে, তবে এক পাশের কিনারা সমান নয়। ছবি পাঠানোর পর বিক্রেতা আংশিক ফেরত দিয়েছেন।',
  },
  {
    rating: 2,
    title: 'রং অন্যরকম',
    body: 'স্ক্রিনে যেমন দেখেছিলাম “{title}” বাস্তবে তার চেয়ে ফেকাশে। এক সপ্তাহের মধ্যে ফেরত নেওয়া হয়েছে।',
  },
];

const reviewerNames = [
  'Farhana Islam',
  'Tanvir Ahmed',
  'Nusrat Jahan',
  'Rakib Hasan',
  'Sharmeen Akter',
  'Imran Kabir',
  'Sadia Chowdhury',
  'Mahin Alam',
  'Rumana Haque',
  'Arif Chowdhury',
  'Tasnim Rahman',
  'Sabbir Hossain',
  'Mitu Akter',
  'Jubayer Khan',
  'Nazia Sultana',
  'Fahim Reza',
  'Rima Das',
  'Shafin Mahmud',
  'Anika Tabassum',
  'Zahid Hasan',
  'Priya Roy',
  'Nayeem Uddin',
  'Laila Karim',
  'Omar Faruk',
] as const;

const ratingPool = [5, 5, 4, 5, 4, 3, 5, 4, 2, 5] as const;

function pickTemplate(templates: readonly ReviewTemplate[], rating: number, seed: number) {
  const matches = templates.filter((template) => template.rating === rating);
  return matches[seed % matches.length] ?? templates[0];
}

function reviewerFor(index: number) {
  return {
    id: `seed_reviewer_${String(index + 1).padStart(2, '0')}`,
    name: reviewerNames[index] ?? reviewerNames[0],
    email: `reviewer${String(index + 1).padStart(2, '0')}@demo.sawdagar.test`,
  };
}

/**
 * Writes the reviewer accounts and the historical reviews that make product
 * ratings real rows instead of display counters. Every value derives from the
 * product slug, so a rerun refreshes the same reviews without duplicating them.
 */
export async function seedReviews(prisma: PrismaClient): Promise<string> {
  const reviewerUsers = reviewerNames.map((_, index) => reviewerFor(index));

  await prisma.user.createMany({
    data: reviewerUsers.map((reviewer) => ({
      id: reviewer.id,
      name: reviewer.name,
      email: reviewer.email,
      role: 'buyer',
      isDemo: true,
      emailVerified: true,
    })),
    skipDuplicates: true,
  });

  const products = await prisma.product.findMany({
    where: { status: 'active' },
    select: { id: true, slug: true, titleEn: true, titleBn: true },
    orderBy: { slug: 'asc' },
  });

  let written = 0;

  for (const product of products) {
    const reviewCount = 2 + (hashSeedValue(`${product.slug}-review-count`) % 5);

    for (let index = 0; index < reviewCount; index += 1) {
      const seed = hashSeedValue(`${product.slug}-review-${index}`);
      const rating = ratingPool[seed % ratingPool.length] ?? 4;
      const bangla = seed % 3 === 0;
      const template = pickTemplate(bangla ? banglaTemplates : englishTemplates, rating, seed);
      const title = bangla ? product.titleBn : product.titleEn;
      const reviewer = reviewerUsers[seed % reviewerUsers.length] ?? reviewerUsers[0];
      const id = `seed_review_${product.slug}_${index}`;

      await prisma.review.upsert({
        where: { id },
        create: {
          id,
          productId: product.id,
          userId: reviewer.id,
          rating,
          title: template.title,
          body: template.body.replaceAll('{title}', title),
          status: 'published',
          createdAt: new Date(ANCHOR.getTime() - (4 + (seed % 150)) * DAY_MS),
          updatedAt: new Date(ANCHOR.getTime() - (4 + (seed % 150)) * DAY_MS),
        },
        update: {
          productId: product.id,
          userId: reviewer.id,
          rating,
          title: template.title,
          body: template.body.replaceAll('{title}', title),
          status: 'published',
        },
      });
      written += 1;
    }

    // Read the aggregate back instead of using the generated ratings: a buyer
    // review written on the live demo must stay in the average after a reseed.
    const aggregate = await prisma.review.aggregate({
      where: { productId: product.id, status: 'published' },
      _avg: { rating: true },
      _count: { _all: true },
    });
    await prisma.product.update({
      where: { id: product.id },
      data: {
        rating: Math.round((aggregate._avg.rating ?? 0) * 10) / 10,
        reviewCount: aggregate._count._all,
      },
    });
  }

  // Seeded reviews never come from an order, so they carry no order item id
  // and never show the verified-purchase badge in the UI.
  return `${written} reviews across ${products.length} products.`;
}
