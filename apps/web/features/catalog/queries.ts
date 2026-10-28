import { productTones, type LocalisedName, type ProductTone } from '@sd/domain';
import { cache } from 'react';
import type { Prisma } from '../../generated/prisma/client';
import { getPrisma } from '../../lib/prisma';
import type { CatalogFilters } from './catalogQuery';

export const CATALOG_PAGE_SIZE = 12;

export interface CatalogCategory {
  slug: string;
  name: LocalisedName;
  productCount: number;
  children: { slug: string; name: LocalisedName; productCount: number }[];
}

export interface CatalogProduct {
  id: string;
  slug: string;
  title: LocalisedName;
  vendorName: string;
  vendorSlug: string;
  priceMinor: number;
  compareAtMinor?: number;
  rating: number;
  reviewCount: number;
  tone: ProductTone;
  totalStock: number;
}

export interface CatalogResult {
  products: CatalogProduct[];
  total: number;
  page: number;
  pageCount: number;
}

export interface CatalogCategoryDetail {
  slug: string;
  path: string;
  name: LocalisedName;
  description: LocalisedName;
  parent?: { slug: string; name: LocalisedName };
}

export interface ProductDetail extends CatalogProduct {
  description: LocalisedName;
  createdAt: Date;
  category: { slug: string; name: LocalisedName; parent?: { slug: string; name: LocalisedName } };
  vendor: {
    name: string;
    slug: string;
    district: string | null;
    verified: boolean;
    rating: number;
    reviewCount: number;
    followers: number;
    productCount: number;
  };
  variants: {
    id: string;
    sku: string;
    name: LocalisedName;
    priceMinor: number;
    compareAtMinor?: number;
    stock: number;
    isDefault: boolean;
  }[];
}

export function normaliseProductTone(value: string): ProductTone {
  return (productTones as readonly string[]).includes(value) ? (value as ProductTone) : 'accent';
}

type ProductWithVendor = Prisma.ProductGetPayload<{
  include: { organization: { select: { name: true; slug: true } } };
}>;

export function toCatalogProduct(product: ProductWithVendor): CatalogProduct {
  return {
    id: product.id,
    slug: product.slug,
    title: { en: product.titleEn, bn: product.titleBn },
    vendorName: product.organization.name,
    vendorSlug: product.organization.slug,
    priceMinor: product.priceMinor,
    compareAtMinor: product.compareAtMinor ?? undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    tone: normaliseProductTone(product.tone),
    totalStock: product.totalStock,
  };
}

/** Top-level categories and their leaf categories, with active product counts. */
export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const prisma = getPrisma();
  const [categories, counts] = await Promise.all([
    prisma.category.findMany({
      where: { depth: 0 },
      orderBy: { sortOrder: 'asc' },
      include: { children: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.product.groupBy({
      by: ['categoryId'],
      where: { status: 'active' },
      _count: { _all: true },
    }),
  ]);

  const countById = new Map(counts.map((row) => [row.categoryId, row._count._all]));

  return categories.map((category) => {
    const children = category.children.map((child) => ({
      slug: child.slug,
      name: { en: child.nameEn, bn: child.nameBn },
      productCount: countById.get(child.id) ?? 0,
    }));

    return {
      slug: category.slug,
      name: { en: category.nameEn, bn: category.nameBn },
      productCount: children.reduce((total, child) => total + child.productCount, 0),
      children,
    };
  });
}

/** One category with its parent, used for headings and breadcrumbs. */
export async function getCatalogCategory(slug: string): Promise<CatalogCategoryDetail | null> {
  const category = await getPrisma().category.findUnique({
    where: { slug },
    include: { parent: true },
  });
  if (!category) return null;

  return {
    slug: category.slug,
    path: category.path,
    name: { en: category.nameEn, bn: category.nameBn },
    description: { en: category.descriptionEn, bn: category.descriptionBn },
    parent: category.parent
      ? {
          slug: category.parent.slug,
          name: { en: category.parent.nameEn, bn: category.parent.nameBn },
        }
      : undefined,
  };
}

function buildWhere(filters: CatalogFilters, categoryPath?: string): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [{ status: 'active' }];

  if (categoryPath) {
    and.push({
      OR: [
        { category: { path: categoryPath } },
        { category: { path: { startsWith: `${categoryPath}/` } } },
      ],
    });
  }

  if (filters.vendor) and.push({ organization: { slug: filters.vendor } });
  if (filters.inStock) and.push({ totalStock: { gt: 0 } });
  if (filters.minPrice !== undefined) and.push({ priceMinor: { gte: filters.minPrice * 100 } });
  if (filters.maxPrice !== undefined) and.push({ priceMinor: { lte: filters.maxPrice * 100 } });
  if (filters.rating !== undefined) and.push({ rating: { gte: filters.rating } });

  if (filters.q) {
    const contains = { contains: filters.q, mode: 'insensitive' as const };
    and.push({
      OR: [
        { titleEn: contains },
        { titleBn: contains },
        { category: { nameEn: contains } },
        { category: { nameBn: contains } },
      ],
    });
  }

  return and.length === 1 ? and[0] : { AND: and };
}

function orderFor(sort: CatalogFilters['sort']): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'price-asc':
      return [{ priceMinor: 'asc' }, { id: 'asc' }];
    case 'price-desc':
      return [{ priceMinor: 'desc' }, { id: 'asc' }];
    case 'rating':
      return [{ rating: 'desc' }, { reviewCount: 'desc' }, { id: 'asc' }];
    default:
      return [{ createdAt: 'desc' }, { id: 'asc' }];
  }
}

/** Applies every catalog filter, counts the matches and clamps the page. */
export async function searchCatalog(filters: CatalogFilters): Promise<CatalogResult> {
  const prisma = getPrisma();
  const category =
    filters.category === undefined
      ? null
      : await prisma.category.findUnique({ where: { slug: filters.category } });

  if (filters.category && !category) {
    return { products: [], total: 0, page: 1, pageCount: 1 };
  }

  const where = buildWhere(filters, category?.path);
  const total = await prisma.product.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);

  const products = await prisma.product.findMany({
    where,
    orderBy: orderFor(filters.sort),
    skip: (page - 1) * CATALOG_PAGE_SIZE,
    take: CATALOG_PAGE_SIZE,
    include: { organization: { select: { name: true, slug: true } } },
  });

  return { products: products.map(toCatalogProduct), total, page, pageCount };
}

/** Vendor name for the active vendor filter, if it exists. */
export async function getCatalogVendor(slug: string) {
  return getPrisma().organization.findUnique({
    where: { slug },
    select: { slug: true, name: true },
  });
}

/** Highest-rated in-stock products for the home page. */
export async function getFeaturedProducts(limit = 8): Promise<CatalogProduct[]> {
  const products = await getPrisma().product.findMany({
    where: { status: 'active', totalStock: { gt: 0 } },
    orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
    take: limit,
    include: { organization: { select: { name: true, slug: true } } },
  });

  return products.map(toCatalogProduct);
}

/** One product with variants, vendor and category for the detail page. */
export const getProductBySlug = cache(async (slug: string): Promise<ProductDetail | null> => {
  const product = await getPrisma().product.findUnique({
    where: { slug },
    include: {
      organization: { include: { _count: { select: { products: true } } } },
      category: { include: { parent: true } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!product || product.status !== 'active') return null;

  return {
    id: product.id,
    slug: product.slug,
    title: { en: product.titleEn, bn: product.titleBn },
    description: { en: product.descriptionEn, bn: product.descriptionBn },
    vendorName: product.organization.name,
    vendorSlug: product.organization.slug,
    priceMinor: product.priceMinor,
    compareAtMinor: product.compareAtMinor ?? undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    tone: normaliseProductTone(product.tone),
    totalStock: product.totalStock,
    createdAt: product.createdAt,
    category: {
      slug: product.category.slug,
      name: { en: product.category.nameEn, bn: product.category.nameBn },
      parent: product.category.parent
        ? {
            slug: product.category.parent.slug,
            name: { en: product.category.parent.nameEn, bn: product.category.parent.nameBn },
          }
        : undefined,
    },
    vendor: {
      name: product.organization.name,
      slug: product.organization.slug,
      district: product.organization.district,
      verified: product.organization.verified,
      rating: product.organization.rating,
      reviewCount: product.organization.reviewCount,
      followers: product.organization.followers,
      productCount: product.organization._count.products,
    },
    variants: product.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      name: { en: variant.nameEn, bn: variant.nameBn },
      priceMinor: variant.priceMinor,
      compareAtMinor: variant.compareAtMinor ?? undefined,
      stock: variant.stock,
      isDefault: variant.isDefault,
    })),
  };
});

/** Four other products from the same leaf category. */
export async function getRelatedProducts(
  productId: string,
  categorySlug: string,
  limit = 4,
): Promise<CatalogProduct[]> {
  const products = await getPrisma().product.findMany({
    where: {
      status: 'active',
      category: { slug: categorySlug },
      id: { not: productId },
    },
    orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
    take: limit,
    include: { organization: { select: { name: true, slug: true } } },
  });

  return products.map(toCatalogProduct);
}
