import { demandSignal, type DemandSignal } from '@sd/cs-core';
import { summariseSellerSales, type SellerSalesSummary } from '@sd/domain';
import { getPrisma } from '../../lib/prisma';

export interface SellerStoreRecord {
  id: string;
  name: string;
  slug: string;
  status: string;
  kycStatus: string;
  kycNote: string | null;
  kycSubmittedAt: Date | null;
  verified: boolean;
  district: string | null;
  legalName: string | null;
  businessType: string | null;
  tradeLicense: string | null;
  payoutPhone: string | null;
  accent: string;
  coverTone: string;
  announcementEn: string | null;
  announcementBn: string | null;
  aboutEn: string | null;
  aboutBn: string | null;
  returnPolicyEn: string | null;
  returnPolicyBn: string | null;
  shippingPolicyEn: string | null;
  shippingPolicyBn: string | null;
  rating: number;
  reviewCount: number;
  followers: number;
}

export interface SellerProductRecord {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  status: string;
  priceMinor: number;
  totalStock: number;
  updatedAt: Date;
  categoryId: string;
  categoryNameEn: string;
  categoryNameBn: string;
  variants: {
    id: string;
    sku: string;
    nameEn: string;
    nameBn: string;
    priceMinor: number;
    stock: number;
    isDefault: boolean;
  }[];
}

export interface SellerOrderRecord {
  id: string;
  number: string;
  status: string;
  totalMinor: number;
  createdAt: Date;
  itemCount: number;
  buyerName: string;
  orderNumber: string;
  courier: string | null;
  trackingNumber: string | null;
}

export interface SellerOrderDetail extends SellerOrderRecord {
  subtotalMinor: number;
  shippingMinor: number;
  discountMinor: number;
  shippingPhone: string;
  shippingDistrict: string;
  shippingUpazila: string;
  shippingLine: string;
  notes: string | null;
  placedAt: Date;
  confirmedAt: Date | null;
  packedAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  items: {
    id: string;
    titleEn: string;
    titleBn: string;
    variantNameEn: string;
    variantNameBn: string;
    sku: string;
    quantity: number;
    lineTotalMinor: number;
  }[];
}

export interface SellerQuestionRecord {
  id: string;
  body: string;
  answerBody: string | null;
  answeredAt: Date | null;
  createdAt: Date;
  askerName: string;
  productTitleEn: string;
  productTitleBn: string;
  productSlug: string;
}

export interface SellerReturnRecord {
  id: string;
  status: string;
  reason: string;
  note: string | null;
  resolutionNote: string | null;
  createdAt: Date;
  buyerName: string;
  orderNumber: string;
  productTitleEn: string;
  productTitleBn: string;
  productSlug: string;
  quantity: number;
}

export interface SellerPromotionRecord {
  id: string;
  code: string;
  type: string;
  value: number;
  minSubtotalMinor: number;
  endsAt: Date | null;
  active: boolean;
  redemptions: number;
}

export interface SellerDashboard {
  deliveredMinor: number;
  pipelineMinor: number;
  ordersToPack: number;
  openQuestions: number;
  openReturns: number;
  lowStock: number;
  recentOrders: SellerOrderRecord[];
}

/** The seller's own store, including the fields the settings form edits. */
export async function getSellerStore(organizationId: string): Promise<SellerStoreRecord | null> {
  return getPrisma().organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      kycStatus: true,
      kycNote: true,
      kycSubmittedAt: true,
      verified: true,
      district: true,
      legalName: true,
      businessType: true,
      tradeLicense: true,
      payoutPhone: true,
      accent: true,
      coverTone: true,
      announcementEn: true,
      announcementBn: true,
      aboutEn: true,
      aboutBn: true,
      returnPolicyEn: true,
      returnPolicyBn: true,
      shippingPolicyEn: true,
      shippingPolicyBn: true,
      rating: true,
      reviewCount: true,
      followers: true,
    },
  });
}

const orderSelect = {
  id: true,
  number: true,
  status: true,
  totalMinor: true,
  createdAt: true,
  courier: true,
  trackingNumber: true,
  order: { select: { number: true, shippingName: true } },
  items: { select: { quantity: true } },
} as const;

function toOrderRecord(row: {
  id: string;
  number: string;
  status: string;
  totalMinor: number;
  createdAt: Date;
  courier: string | null;
  trackingNumber: string | null;
  order: { number: string; shippingName: string };
  items: { quantity: number }[];
}): SellerOrderRecord {
  return {
    id: row.id,
    number: row.number,
    status: row.status,
    totalMinor: row.totalMinor,
    createdAt: row.createdAt,
    itemCount: row.items.reduce((total, item) => total + item.quantity, 0),
    buyerName: row.order.shippingName,
    orderNumber: row.order.number,
    courier: row.courier,
    trackingNumber: row.trackingNumber,
  };
}

/** Dashboard totals for one store, computed from its sub-orders. */
export async function getSellerDashboard(organizationId: string): Promise<SellerDashboard> {
  const prisma = getPrisma();
  const [subOrders, ordersToPack, openQuestions, openReturns, lowStock] = await Promise.all([
    prisma.subOrder.findMany({
      where: { organizationId },
      select: { status: true, totalMinor: true, items: { select: { quantity: true } } },
    }),
    prisma.subOrder.count({
      where: { organizationId, status: { in: ['confirmed', 'packed'] } },
    }),
    prisma.productQuestion.count({
      where: { product: { organizationId }, status: 'open' },
    }),
    prisma.returnRequest.count({
      where: { orderItem: { subOrder: { organizationId } }, status: 'requested' },
    }),
    prisma.productVariant.count({
      where: { stock: { lte: 5 }, product: { organizationId, status: 'active' } },
    }),
  ]);

  const sales = summariseSellerSales(
    subOrders.map((subOrder) => ({
      status: subOrder.status,
      totalMinor: subOrder.totalMinor,
      quantity: subOrder.items.reduce((total, item) => total + item.quantity, 0),
    })),
  );

  const recent = await prisma.subOrder.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: orderSelect,
  });

  return {
    deliveredMinor: sales.deliveredMinor,
    pipelineMinor: sales.pipelineMinor,
    ordersToPack,
    openQuestions,
    openReturns,
    lowStock,
    recentOrders: recent.map(toOrderRecord),
  };
}

/** Every product in the store, newest first, with its variants. */
export async function getSellerProducts(organizationId: string): Promise<SellerProductRecord[]> {
  const rows = await getPrisma().product.findMany({
    where: { organizationId },
    orderBy: { updatedAt: 'desc' },
    take: 100,
    include: {
      category: { select: { id: true, nameEn: true, nameBn: true } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    titleEn: row.titleEn,
    titleBn: row.titleBn,
    descriptionEn: row.descriptionEn,
    descriptionBn: row.descriptionBn,
    status: row.status,
    priceMinor: row.priceMinor,
    totalStock: row.totalStock,
    updatedAt: row.updatedAt,
    categoryId: row.category.id,
    categoryNameEn: row.category.nameEn,
    categoryNameBn: row.category.nameBn,
    variants: row.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      nameEn: variant.nameEn,
      nameBn: variant.nameBn,
      priceMinor: variant.priceMinor,
      stock: variant.stock,
      isDefault: variant.isDefault,
    })),
  }));
}

/** One store product for the edit page, or null when it belongs to another store. */
export async function getSellerProduct(
  organizationId: string,
  productId: string,
): Promise<SellerProductRecord | null> {
  const row = await getPrisma().product.findFirst({
    where: { id: productId, organizationId },
    include: {
      category: { select: { id: true, nameEn: true, nameBn: true } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    titleEn: row.titleEn,
    titleBn: row.titleBn,
    descriptionEn: row.descriptionEn,
    descriptionBn: row.descriptionBn,
    status: row.status,
    priceMinor: row.priceMinor,
    totalStock: row.totalStock,
    updatedAt: row.updatedAt,
    categoryId: row.category.id,
    categoryNameEn: row.category.nameEn,
    categoryNameBn: row.category.nameBn,
    variants: row.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      nameEn: variant.nameEn,
      nameBn: variant.nameBn,
      priceMinor: variant.priceMinor,
      stock: variant.stock,
      isDefault: variant.isDefault,
    })),
  };
}

/** Leaf categories a product can be filed under. */
export async function getSellerCategories(): Promise<
  { id: string; nameEn: string; nameBn: string; parentNameEn: string | null }[]
> {
  const rows = await getPrisma().category.findMany({
    where: { depth: 1, children: { none: {} } },
    orderBy: [{ sortOrder: 'asc' }, { nameEn: 'asc' }],
    include: { parent: { select: { nameEn: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    nameEn: row.nameEn,
    nameBn: row.nameBn,
    parentNameEn: row.parent?.nameEn ?? null,
  }));
}

/** Sub-orders for the store, optionally filtered to one status. */
export async function getSellerOrders(
  organizationId: string,
  status?: string,
): Promise<SellerOrderRecord[]> {
  const rows = await getPrisma().subOrder.findMany({
    where: { organizationId, ...(status ? { status } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: orderSelect,
  });
  return rows.map(toOrderRecord);
}

/** One sub-order with the delivery details a seller needs to fulfill it. */
export async function getSellerOrder(
  organizationId: string,
  subOrderId: string,
): Promise<SellerOrderDetail | null> {
  const row = await getPrisma().subOrder.findFirst({
    where: { id: subOrderId, organizationId },
    select: {
      ...orderSelect,
      subtotalMinor: true,
      shippingMinor: true,
      discountMinor: true,
      confirmedAt: true,
      packedAt: true,
      shippedAt: true,
      deliveredAt: true,
      order: {
        select: {
          number: true,
          shippingName: true,
          shippingPhone: true,
          shippingDistrict: true,
          shippingUpazila: true,
          shippingLine: true,
          notes: true,
          placedAt: true,
        },
      },
      items: {
        select: {
          id: true,
          titleEn: true,
          titleBn: true,
          variantNameEn: true,
          variantNameBn: true,
          sku: true,
          quantity: true,
          lineTotalMinor: true,
        },
      },
    },
  });
  if (!row) return null;

  return {
    ...toOrderRecord(row),
    subtotalMinor: row.subtotalMinor,
    shippingMinor: row.shippingMinor,
    discountMinor: row.discountMinor,
    shippingPhone: row.order.shippingPhone,
    shippingDistrict: row.order.shippingDistrict,
    shippingUpazila: row.order.shippingUpazila,
    shippingLine: row.order.shippingLine,
    notes: row.order.notes,
    placedAt: row.order.placedAt,
    confirmedAt: row.confirmedAt,
    packedAt: row.packedAt,
    shippedAt: row.shippedAt,
    deliveredAt: row.deliveredAt,
    items: row.items,
  };
}

/** Buyer questions across the store's products, unanswered first. */
export async function getSellerQuestions(organizationId: string): Promise<SellerQuestionRecord[]> {
  const rows = await getPrisma().productQuestion.findMany({
    where: { product: { organizationId } },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 100,
    include: {
      user: { select: { name: true } },
      product: { select: { slug: true, titleEn: true, titleBn: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    body: row.body,
    answerBody: row.answerBody,
    answeredAt: row.answeredAt,
    createdAt: row.createdAt,
    askerName: row.user.name,
    productTitleEn: row.product.titleEn,
    productTitleBn: row.product.titleBn,
    productSlug: row.product.slug,
  }));
}

/** Return requests made against delivered lines from this store. */
export async function getSellerReturns(organizationId: string): Promise<SellerReturnRecord[]> {
  const rows = await getPrisma().returnRequest.findMany({
    where: { orderItem: { subOrder: { organizationId } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { name: true } },
      orderItem: {
        select: {
          titleEn: true,
          titleBn: true,
          quantity: true,
          product: { select: { slug: true } },
          subOrder: { select: { order: { select: { number: true } } } },
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    reason: row.reason,
    note: row.note,
    resolutionNote: row.resolutionNote,
    createdAt: row.createdAt,
    buyerName: row.user.name,
    orderNumber: row.orderItem.subOrder.order.number,
    productTitleEn: row.orderItem.titleEn,
    productTitleBn: row.orderItem.titleBn,
    productSlug: row.orderItem.product.slug,
    quantity: row.orderItem.quantity,
  }));
}

/** Store-scoped coupons with their redemption counts. */
export async function getSellerPromotions(
  organizationId: string,
): Promise<SellerPromotionRecord[]> {
  const rows = await getPrisma().coupon.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { redemptions: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    code: row.code,
    type: row.type,
    value: row.value,
    minSubtotalMinor: row.minSubtotalMinor,
    endsAt: row.endsAt,
    active: row.active,
    redemptions: row._count.redemptions,
  }));
}

export interface SellerInventoryRow {
  id: string;
  sku: string;
  nameEn: string;
  nameBn: string;
  stock: number;
  priceMinor: number;
  productTitleEn: string;
  productTitleBn: string;
  productId: string;
}

/** Every variant in the store, lowest stock first. */
export async function getSellerInventory(organizationId: string): Promise<SellerInventoryRow[]> {
  const rows = await getPrisma().productVariant.findMany({
    where: { product: { organizationId } },
    orderBy: [{ stock: 'asc' }, { sku: 'asc' }],
    take: 100,
    include: {
      product: { select: { id: true, titleEn: true, titleBn: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    sku: row.sku,
    nameEn: row.nameEn,
    nameBn: row.nameBn,
    stock: row.stock,
    priceMinor: row.priceMinor,
    productTitleEn: row.product.titleEn,
    productTitleBn: row.product.titleBn,
    productId: row.product.id,
  }));
}

export interface SellerAnalytics {
  sales: SellerSalesSummary;
  topProducts: {
    titleEn: string;
    titleBn: string;
    units: number;
    units30: number;
    revenueMinor: number;
    signal: DemandSignal['signal'];
    daysOfCover: number;
    restockUnits: number;
  }[];
  lowStock: { id: string; sku: string; nameEn: string; nameBn: string; stock: number }[];
}

/** Ninety-day sales totals, best sellers and variants running low. */
export async function getSellerAnalytics(organizationId: string): Promise<SellerAnalytics> {
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const prisma = getPrisma();

  const [subOrders, items, lowStock, products] = await Promise.all([
    prisma.subOrder.findMany({
      where: { organizationId, createdAt: { gte: since } },
      select: { status: true, totalMinor: true, items: { select: { quantity: true } } },
    }),
    prisma.orderItem.findMany({
      where: {
        subOrder: { organizationId, status: { not: 'cancelled' }, createdAt: { gte: since } },
      },
      select: {
        titleEn: true,
        titleBn: true,
        quantity: true,
        lineTotalMinor: true,
        createdAt: true,
      },
    }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 }, product: { organizationId, status: 'active' } },
      orderBy: { stock: 'asc' },
      take: 12,
      select: {
        id: true,
        sku: true,
        nameEn: true,
        nameBn: true,
        stock: true,
      },
    }),
    prisma.product.findMany({
      where: { organizationId },
      select: { titleEn: true, variants: { select: { stock: true } } },
    }),
  ]);

  const stockByTitle = new Map<string, number>();
  for (const product of products) {
    const stock = product.variants.reduce((total, variant) => total + variant.stock, 0);
    stockByTitle.set(product.titleEn, (stockByTitle.get(product.titleEn) ?? 0) + stock);
  }

  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const productTotals = new Map<
    string,
    { titleEn: string; titleBn: string; units: number; units30: number; revenueMinor: number }
  >();
  for (const item of items) {
    const key = item.titleEn;
    const current = productTotals.get(key) ?? {
      titleEn: item.titleEn,
      titleBn: item.titleBn,
      units: 0,
      units30: 0,
      revenueMinor: 0,
    };
    current.units += item.quantity;
    if (item.createdAt.getTime() >= monthAgo) current.units30 += item.quantity;
    current.revenueMinor += item.lineTotalMinor;
    productTotals.set(key, current);
  }

  return {
    sales: summariseSellerSales(
      subOrders.map((subOrder) => ({
        status: subOrder.status,
        totalMinor: subOrder.totalMinor,
        quantity: subOrder.items.reduce((total, item) => total + item.quantity, 0),
      })),
    ),
    topProducts: [...productTotals.values()]
      .sort((left, right) => right.units - left.units)
      .slice(0, 8)
      .map((product) => ({
        ...product,
        ...demandSignal({
          units30: product.units30,
          units90: product.units,
          stock: stockByTitle.get(product.titleEn) ?? 0,
        }),
      })),
    lowStock,
  };
}

/** A store's public page data: approved store, active products and policies. */
export type PublicStoreRecord = NonNullable<Awaited<ReturnType<typeof getPublicStore>>>;

export async function getPublicStore(slug: string) {
  return getPrisma().organization.findFirst({
    where: { slug, status: 'approved', kycStatus: 'approved' },
    select: {
      name: true,
      slug: true,
      descriptionEn: true,
      descriptionBn: true,
      district: true,
      verified: true,
      rating: true,
      reviewCount: true,
      followers: true,
      accent: true,
      coverTone: true,
      announcementEn: true,
      announcementBn: true,
      aboutEn: true,
      aboutBn: true,
      returnPolicyEn: true,
      returnPolicyBn: true,
      shippingPolicyEn: true,
      shippingPolicyBn: true,
      createdAt: true,
      products: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 24,
        select: {
          id: true,
          slug: true,
          titleEn: true,
          titleBn: true,
          priceMinor: true,
          compareAtMinor: true,
          rating: true,
          reviewCount: true,
          tone: true,
          totalStock: true,
          category: { select: { id: true, nameEn: true, nameBn: true } },
          variants: { select: { id: true, stock: true } },
        },
      },
    },
  });
}
