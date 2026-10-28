import { buildCatalogSeed, hashSeedValue, productTones } from '@sd/domain';
import type { PrismaClient } from '../generated/prisma/client';

/**
 * Writes the curated catalog idempotently. Categories and vendors are upserted
 * by their stable slugs, products by slug and variants by SKU, so re-running
 * the workflow refreshes demo content without duplicating rows.
 */
export async function seedCatalog(prisma: PrismaClient): Promise<string> {
  const seed = buildCatalogSeed();
  const categoryIds = new Map<string, string>();
  const vendorIds = new Map<string, string>();

  const topLevel = seed.categories.filter((category) => category.depth === 0);
  const children = seed.categories.filter((category) => category.depth === 1);

  for (const category of [...topLevel, ...children]) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      create: {
        id: category.id,
        slug: category.slug,
        nameEn: category.name.en,
        nameBn: category.name.bn,
        descriptionEn: category.description.en,
        descriptionBn: category.description.bn,
        path: category.path,
        depth: category.depth,
        sortOrder: category.sortOrder,
        parentId: category.parentSlug ? categoryIds.get(category.parentSlug) : null,
      },
      update: {
        nameEn: category.name.en,
        nameBn: category.name.bn,
        descriptionEn: category.description.en,
        descriptionBn: category.description.bn,
        path: category.path,
        depth: category.depth,
        sortOrder: category.sortOrder,
        parentId: category.parentSlug ? categoryIds.get(category.parentSlug) : null,
      },
    });
    categoryIds.set(category.slug, saved.id);
  }

  for (const [index, vendor] of seed.vendors.entries()) {
    const seedValue = hashSeedValue(vendor.slug);
    const storefront = {
      status: 'approved',
      kycStatus: 'approved',
      kycSubmittedAt: new Date(Date.UTC(2026, 3, 1)),
      kycReviewedAt: new Date(Date.UTC(2026, 3, 3)),
      legalName: vendor.name,
      businessType: 'sole_proprietor',
      tradeLicense: `TRAD-${seedValue.toString().padStart(6, '0')}`,
      payoutPhone: `017${String(10_000_000 + (seedValue % 90_000_000)).slice(0, 8)}`,
      accent: productTones[index % productTones.length],
      coverTone: productTones[(index + 2) % productTones.length],
      announcementEn: `Small-batch work from ${vendor.district}. Message the store for custom orders.`,
      announcementBn: `${vendor.district}-এর ছোট ব্যাচের কাজ। কাস্টম অর্ডারের জন্য দোকানে বার্তা দিন।`,
      aboutEn: `${vendor.description.en} The store ships from ${vendor.district} and packs each order by hand.`,
      aboutBn: `${vendor.description.bn} ${vendor.district} থেকে পাঠানো হয়, প্রতিটি অর্ডার হাতে প্যাক করা হয়।`,
      returnPolicyEn:
        'Returns are accepted within seven days of delivery if the item is unused and in its original packing.',
      returnPolicyBn:
        'পণ্য অব্যবহৃত ও আসল প্যাকিংয়ে থাকলে ডেলিভারির সাত দিনের মধ্যে ফেরত নেওয়া হয়।',
      shippingPolicyEn:
        'Orders are packed within two working days and shipped by courier across Bangladesh.',
      shippingPolicyBn:
        'অর্ডার দুই কর্মদিবসের মধ্যে প্যাক হয়ে সারা বাংলাদেশে কুরিয়ারে পাঠানো হয়।',
    };

    const saved = await prisma.organization.upsert({
      where: { slug: vendor.slug },
      create: {
        id: vendor.id,
        name: vendor.name,
        slug: vendor.slug,
        district: vendor.district,
        descriptionEn: vendor.description.en,
        descriptionBn: vendor.description.bn,
        verified: vendor.verified,
        rating: vendor.rating,
        reviewCount: vendor.reviewCount,
        followers: vendor.followers,
        ...storefront,
      },
      update: {
        name: vendor.name,
        district: vendor.district,
        descriptionEn: vendor.description.en,
        descriptionBn: vendor.description.bn,
        verified: vendor.verified,
        rating: vendor.rating,
        reviewCount: vendor.reviewCount,
        followers: vendor.followers,
        ...storefront,
      },
    });
    vendorIds.set(vendor.slug, saved.id);
  }

  for (const product of seed.products) {
    const categoryId = categoryIds.get(product.categorySlug);
    const organizationId = vendorIds.get(product.vendorSlug);
    if (!categoryId || !organizationId) {
      throw new Error(`Product ${product.slug} references a missing category or vendor.`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        id: product.id,
        slug: product.slug,
        titleEn: product.title.en,
        titleBn: product.title.bn,
        descriptionEn: product.description.en,
        descriptionBn: product.description.bn,
        status: 'active',
        tone: product.tone,
        priceMinor: product.priceMinor,
        compareAtMinor: product.compareAtMinor,
        totalStock: product.totalStock,
        rating: product.rating,
        reviewCount: product.reviewCount,
        categoryId,
        organizationId,
        createdAt: product.createdAt,
      },
      update: {
        titleEn: product.title.en,
        titleBn: product.title.bn,
        descriptionEn: product.description.en,
        descriptionBn: product.description.bn,
        status: 'active',
        tone: product.tone,
        priceMinor: product.priceMinor,
        compareAtMinor: product.compareAtMinor,
        totalStock: product.totalStock,
        rating: product.rating,
        reviewCount: product.reviewCount,
        categoryId,
        organizationId,
        createdAt: product.createdAt,
      },
    });

    for (const variant of product.variants) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        create: {
          id: variant.id,
          productId: product.id,
          sku: variant.sku,
          nameEn: variant.name.en,
          nameBn: variant.name.bn,
          priceMinor: variant.priceMinor,
          compareAtMinor: variant.compareAtMinor,
          stock: variant.stock,
          isDefault: variant.isDefault,
          sortOrder: variant.sortOrder,
        },
        update: {
          productId: product.id,
          nameEn: variant.name.en,
          nameBn: variant.name.bn,
          priceMinor: variant.priceMinor,
          compareAtMinor: variant.compareAtMinor,
          stock: variant.stock,
          isDefault: variant.isDefault,
          sortOrder: variant.sortOrder,
        },
      });
    }
  }

  return `Catalog ready: ${seed.categories.length} categories, ${seed.vendors.length} vendors, ${seed.products.length} products, ${seed.products.reduce((total, product) => total + product.variants.length, 0)} variants.`;
}
