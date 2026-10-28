import type { PrismaClient } from '../generated/prisma/client';

const DAY_MS = 86_400_000;

interface SeedLine {
  productIndex: number;
  quantity: number;
}

interface SeedOrder {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  placedDaysAgo: number;
  deliveredDaysAgo: number;
  lines: SeedLine[];
  shippingPerSeller: number;
}

// Two delivered orders: one still inside the seven-day return window, one past
// it, so the account can demonstrate both states without waiting for a seller.
const seedOrders: SeedOrder[] = [
  {
    id: 'seed_order_recent',
    number: 'SD-20261024-410001',
    status: 'completed',
    paymentStatus: 'paid',
    placedDaysAgo: 4,
    deliveredDaysAgo: 2,
    lines: [
      { productIndex: 0, quantity: 1 },
      { productIndex: 1, quantity: 2 },
    ],
    shippingPerSeller: 60,
  },
  {
    id: 'seed_order_older',
    number: 'SD-20261006-410002',
    status: 'completed',
    paymentStatus: 'paid',
    placedDaysAgo: 22,
    deliveredDaysAgo: 20,
    lines: [{ productIndex: 2, quantity: 1 }],
    shippingPerSeller: 60,
  },
];

/**
 * Gives the demo buyer two delivered orders so reviews and return requests can
 * be tested on the live demo before the Seller Center exists. Dates are relative
 * to the seed run because a fixed date would close the return window over time.
 */
export async function seedDemoOrders(prisma: PrismaClient): Promise<string> {
  const buyer = await prisma.user.findUnique({ where: { email: 'buyer@demo.sawdagar.test' } });
  if (!buyer) throw new Error('The demo buyer must exist before seeding orders.');

  const products = await prisma.product.findMany({
    where: { status: 'active', totalStock: { gt: 0 } },
    orderBy: { slug: 'asc' },
    take: 8,
    include: {
      variants: { orderBy: { sortOrder: 'asc' }, take: 1 },
      organization: { select: { id: true, name: true, slug: true } },
    },
  });

  if (products.length < 3) throw new Error('The catalog needs at least three products for orders.');

  const now = Date.now();
  let orderCount = 0;

  for (const seed of seedOrders) {
    const placedAt = new Date(now - seed.placedDaysAgo * DAY_MS);
    const deliveredAt = new Date(now - seed.deliveredDaysAgo * DAY_MS);
    const chosen = seed.lines.map((line) => {
      const product = products[line.productIndex % products.length];
      const variant = product?.variants[0];
      if (!product || !variant) throw new Error('A seeded order line needs a product variant.');
      return { line, product, variant };
    });

    const subtotalMinor = chosen.reduce(
      (total, entry) => total + entry.variant.priceMinor * entry.line.quantity,
      0,
    );
    const shippingMinor = seed.shippingPerSeller * chosen.length;

    await prisma.$transaction(async (tx) => {
      await tx.order.upsert({
        where: { id: seed.id },
        create: {
          id: seed.id,
          number: seed.number,
          userId: buyer.id,
          status: seed.status,
          paymentStatus: seed.paymentStatus,
          paymentMethod: 'cod',
          subtotalMinor,
          shippingMinor,
          discountMinor: 0,
          totalMinor: subtotalMinor + shippingMinor,
          shippingName: buyer.name,
          shippingPhone: '01712345678',
          shippingDivision: 'Dhaka',
          shippingDistrict: 'Dhaka',
          shippingUpazila: 'Dhanmondi',
          shippingArea: 'Road 27',
          shippingLine: 'House 14, near Rifles Square',
          placedAt,
          confirmedAt: placedAt,
        },
        update: {
          status: seed.status,
          paymentStatus: seed.paymentStatus,
          subtotalMinor,
          shippingMinor,
          totalMinor: subtotalMinor + shippingMinor,
          placedAt,
          confirmedAt: placedAt,
        },
      });

      for (const [index, entry] of chosen.entries()) {
        const subOrderId = `${seed.id}_sub_${index + 1}`;
        const lineTotal = entry.variant.priceMinor * entry.line.quantity;

        await tx.subOrder.upsert({
          where: { id: subOrderId },
          create: {
            id: subOrderId,
            number: `${seed.number}-${index + 1}`,
            orderId: seed.id,
            organizationId: entry.product.organization.id,
            status: 'delivered',
            subtotalMinor: lineTotal,
            shippingMinor: seed.shippingPerSeller,
            discountMinor: 0,
            totalMinor: lineTotal + seed.shippingPerSeller,
            deliveredAt,
            createdAt: placedAt,
          },
          update: {
            status: 'delivered',
            subtotalMinor: lineTotal,
            shippingMinor: seed.shippingPerSeller,
            totalMinor: lineTotal + seed.shippingPerSeller,
            deliveredAt,
          },
        });

        await tx.orderItem.upsert({
          where: { id: `${subOrderId}_item_1` },
          create: {
            id: `${subOrderId}_item_1`,
            orderId: seed.id,
            subOrderId,
            productId: entry.product.id,
            variantId: entry.variant.id,
            titleEn: entry.product.titleEn,
            titleBn: entry.product.titleBn,
            variantNameEn: entry.variant.nameEn,
            variantNameBn: entry.variant.nameBn,
            sku: entry.variant.sku,
            tone: entry.product.tone,
            unitPriceMinor: entry.variant.priceMinor,
            quantity: entry.line.quantity,
            lineTotalMinor: lineTotal,
            createdAt: placedAt,
          },
          update: {
            quantity: entry.line.quantity,
            unitPriceMinor: entry.variant.priceMinor,
            lineTotalMinor: lineTotal,
          },
        });
      }

      await tx.payment.upsert({
        where: { id: `${seed.id}_payment` },
        create: {
          id: `${seed.id}_payment`,
          orderId: seed.id,
          provider: 'cod',
          status: seed.paymentStatus,
          amountMinor: subtotalMinor + shippingMinor,
          paidAt: seed.paymentStatus === 'paid' ? deliveredAt : null,
        },
        update: {
          status: seed.paymentStatus,
          amountMinor: subtotalMinor + shippingMinor,
          paidAt: seed.paymentStatus === 'paid' ? deliveredAt : null,
        },
      });
    });

    orderCount += 1;
  }

  return `${orderCount} demo orders ready for the buyer account.`;
}
