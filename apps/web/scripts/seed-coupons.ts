import { randomUUID } from 'node:crypto';
import type { PrismaClient } from '../generated/prisma/client';

interface DemoCoupon {
  code: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  value: number;
  scope: 'global' | 'vendor';
  vendorSlug?: string;
  minSubtotalMinor: number;
  maxDiscountMinor?: number;
  endsAt: string;
}

const coupons: DemoCoupon[] = [
  {
    code: 'BOISHAKH10',
    type: 'percent',
    value: 1_000,
    scope: 'global',
    minSubtotalMinor: 200_000,
    maxDiscountMinor: 100_000,
    endsAt: '2027-04-30T23:59:59.000Z',
  },
  {
    code: 'DHAKA200',
    type: 'fixed',
    value: 20_000,
    scope: 'global',
    minSubtotalMinor: 150_000,
    endsAt: '2027-12-31T23:59:59.000Z',
  },
  {
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    scope: 'global',
    minSubtotalMinor: 100_000,
    endsAt: '2027-12-31T23:59:59.000Z',
  },
  {
    code: 'TANGAIL15',
    type: 'percent',
    value: 1_500,
    scope: 'vendor',
    vendorSlug: 'rupsha-tangail-weavers',
    minSubtotalMinor: 300_000,
    maxDiscountMinor: 150_000,
    endsAt: '2027-12-31T23:59:59.000Z',
  },
];

/** Upserts the four demo coupons, resolving vendor scope by store slug. */
export async function seedCoupons(prisma: PrismaClient): Promise<number> {
  for (const coupon of coupons) {
    const organization = coupon.vendorSlug
      ? await prisma.organization.findUnique({
          where: { slug: coupon.vendorSlug },
          select: { id: true },
        })
      : null;

    await prisma.coupon.upsert({
      where: { code: coupon.code },
      create: {
        id: randomUUID(),
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        scope: coupon.scope,
        organizationId: organization?.id ?? null,
        minSubtotalMinor: coupon.minSubtotalMinor,
        maxDiscountMinor: coupon.maxDiscountMinor ?? null,
        endsAt: new Date(coupon.endsAt),
        active: true,
      },
      update: {
        type: coupon.type,
        value: coupon.value,
        scope: coupon.scope,
        organizationId: organization?.id ?? null,
        minSubtotalMinor: coupon.minSubtotalMinor,
        maxDiscountMinor: coupon.maxDiscountMinor ?? null,
        endsAt: new Date(coupon.endsAt),
        active: true,
      },
    });
  }

  return coupons.length;
}
