import { catalogSpec, seedVendors } from './catalogSeedData';
import { curatedProducts } from './curatedProducts';
import type { CatalogSeed, SeedCategory, SeedProduct, SeedVariant } from './seedTypes';

const DAY_MS = 86_400_000;

/** Normalises a title into a stable, URL-safe product or vendor slug. */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * FNV-1a hash used for deterministic stock, ratings and review counts. Seed
 * scripts reuse it so a rebuild produces the same demo content on every run.
 */
export function hashSeedValue(value: string): number {
  let result = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 0x01000193) >>> 0;
  }
  return result;
}

/** Rounds a taka amount to the nearest ten so prices read like shop prices. */
function roundTaka(value: number): number {
  return Math.round(value / 10) * 10;
}

function toMinor(taka: number): number {
  return roundTaka(taka) * 100;
}

function buildCategories(): SeedCategory[] {
  return catalogSpec.flatMap((top, topIndex) => {
    const parent: SeedCategory = {
      id: `cat_${top.slug}`,
      slug: top.slug,
      path: top.slug,
      depth: 0,
      sortOrder: topIndex * 100,
      name: top.name,
      description: top.description,
    };

    const children = top.subcategories.map((sub, subIndex) => ({
      id: `cat_${sub.slug}`,
      slug: sub.slug,
      parentSlug: top.slug,
      path: `${top.slug}/${sub.slug}`,
      depth: 1,
      sortOrder: topIndex * 100 + subIndex + 1,
      name: sub.name,
      description: {
        en: `${sub.name.en} from independent workshops across Bangladesh.`,
        bn: `${sub.name.bn} বাংলাদেশের স্বাধীন কারখানা থেকে।`,
      },
    }));

    return [parent, ...children];
  });
}

function buildVariants(
  product: { slug: string; priceMinor: number; compareAtMinor?: number },
  productNumber: number,
  variantSpecs: readonly { name: { en: string; bn: string }; priceFactor: number }[],
): SeedVariant[] {
  const outOfStock = productNumber % 17 === 0;

  return variantSpecs.map((variant, index) => {
    const priceMinor = toMinor((product.priceMinor / 100) * variant.priceFactor);
    const stock = outOfStock ? 0 : 2 + (hashSeedValue(`${product.slug}-${index}`) % 18);

    return {
      id: `var_${product.slug}_${index + 1}`,
      sku: `SD-${String(productNumber + 1).padStart(4, '0')}-${index + 1}`,
      name: variant.name,
      priceMinor,
      compareAtMinor:
        product.compareAtMinor === undefined
          ? undefined
          : toMinor((product.compareAtMinor / 100) * variant.priceFactor),
      stock,
      isDefault: index === 0,
      sortOrder: index,
    };
  });
}

/**
 * Builds the catalog from the curated product list. Every product was written
 * around a photograph that passed the image review, so the seed never creates
 * a product whose picture has to be borrowed from somewhere else. Products in
 * categories with no reviewed photo are simply absent and their categories are
 * hidden in the storefront.
 */
export function buildCatalogSeed(): CatalogSeed {
  const categories = buildCategories();
  const products: SeedProduct[] = [];
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const topBySubcategory = new Map(
    catalogSpec.flatMap((top) => top.subcategories.map((sub) => [sub.slug, top] as const)),
  );
  const usedSlugs = new Set<string>();

  for (const [index, entry] of curatedProducts.entries()) {
    if (usedSlugs.has(entry.slug)) throw new Error(`Duplicate curated slug: ${entry.slug}`);
    usedSlugs.add(entry.slug);

    const category = categoryBySlug.get(entry.subcategory);
    const top = topBySubcategory.get(entry.subcategory);
    const vendor = seedVendors.find((candidate) => candidate.slug === entry.vendorSlug);
    if (!category || category.depth !== 1) {
      throw new Error(`Curated product ${entry.slug} has no leaf category ${entry.subcategory}`);
    }
    if (!top) throw new Error(`Curated product ${entry.slug} has no department`);
    if (!vendor)
      throw new Error(`Curated product ${entry.slug} has unknown vendor ${entry.vendorSlug}`);

    const priceMinor = toMinor(entry.priceTaka);
    const compareAtMinor = index % 4 === 0 ? toMinor(entry.priceTaka * 1.2) : undefined;
    const variants = buildVariants(
      { slug: entry.slug, priceMinor, compareAtMinor },
      index,
      top.variants,
    );

    products.push({
      id: `prd_${entry.slug}`,
      slug: entry.slug,
      title: entry.title,
      description: {
        en: `${entry.description.en} Made by ${vendor.name} in ${vendor.district}. Small batches mean slight differences in finish and colour.`,
        bn: `${entry.description.bn} ${vendor.name}, ${vendor.district}-এ তৈরি। ছোট ব্যাচে তৈরি হয়, তাই রঙ ও ফিনিশে সামান্য পার্থক্য থাকতে পারে।`,
      },
      categorySlug: entry.subcategory,
      vendorSlug: entry.vendorSlug,
      tone: top.tone,
      priceMinor,
      compareAtMinor,
      totalStock: variants.reduce((total, variant) => total + variant.stock, 0),
      rating: Number((4.2 + (hashSeedValue(entry.slug) % 8) / 10).toFixed(1)),
      reviewCount: 6 + (hashSeedValue(`${entry.slug}-reviews`) % 145),
      createdAt: new Date(Date.UTC(2026, 4, 10) + ((index * 37) % 160) * DAY_MS),
      variants,
    });
  }

  return { categories, vendors: seedVendors, products };
}
