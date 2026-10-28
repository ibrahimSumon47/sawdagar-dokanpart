import { catalogSpec, seedVendors } from './catalogSeedData';
import type { CatalogSeed, SeedCategory, SeedProduct, SeedVariant } from './seedTypes';

const DAY_MS = 86_400_000;
const styleFactors = [0.85, 1, 1.25] as const;

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

function lowerFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
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

/** Builds the full catalog exactly the same way on every run. */
export function buildCatalogSeed(): CatalogSeed {
  const categories = buildCategories();
  const products: SeedProduct[] = [];
  const usedSlugs = new Set<string>();
  let productNumber = 0;

  for (const top of catalogSpec) {
    for (const sub of top.subcategories) {
      for (let styleIndex = 0; styleIndex < top.styles.length; styleIndex += 1) {
        for (let colourIndex = 0; colourIndex < top.colours.length; colourIndex += 1) {
          const style = top.styles[styleIndex];
          const colour = top.colours[colourIndex];
          const titleEn = `${style.en} ${lowerFirst(sub.name.en)}, ${colour.en}`;
          const baseSlug = slugify(`${style.en} ${sub.name.en} ${colour.en}`);
          let slug = baseSlug;
          let suffix = 2;
          while (usedSlugs.has(slug)) {
            slug = `${baseSlug}-${suffix}`;
            suffix += 1;
          }
          usedSlugs.add(slug);

          const baseTaka = sub.priceTaka * styleFactors[styleIndex] * (1 + colourIndex * 0.04);
          const priceMinor = toMinor(baseTaka);
          const compareAtMinor = productNumber % 4 === 0 ? toMinor(baseTaka * 1.2) : undefined;
          const vendorSlug = top.vendorSlugs[(styleIndex * top.colours.length + colourIndex) % 2];
          const vendor = seedVendors.find((entry) => entry.slug === vendorSlug);
          if (!vendor) throw new Error(`Unknown vendor in catalog seed: ${vendorSlug}`);

          const variants = buildVariants(
            { slug, priceMinor, compareAtMinor },
            productNumber,
            top.variants,
          );

          products.push({
            id: `prd_${slug}`,
            slug,
            title: {
              en: titleEn,
              bn: `${style.bn} ${sub.name.bn}, ${colour.bn}`,
            },
            description: {
              en: `From ${vendor.name} in ${vendor.district}. ${top.description.en} ${top.craftNote.en} This ${lowerFirst(sub.name.en)} has a ${colour.en} finish. Each piece is made in small batches, so slight differences in finish and colour are part of the work.`,
              bn: `${vendor.name}-এর ${vendor.district} কারখানা থেকে। ${top.description.bn} ${top.craftNote.bn} এই ${sub.name.bn} ${colour.bn} রঙে তৈরি। ছোট ব্যাচে তৈরি হয়, তাই রঙ ও ফিনিশে সামান্য পার্থক্য থাকতে পারে।`,
            },
            categorySlug: sub.slug,
            vendorSlug,
            tone: top.tone,
            priceMinor,
            compareAtMinor,
            totalStock: variants.reduce((total, variant) => total + variant.stock, 0),
            rating: Number((4.2 + (hashSeedValue(slug) % 8) / 10).toFixed(1)),
            reviewCount: 6 + (hashSeedValue(`${slug}-reviews`) % 145),
            createdAt: new Date(Date.UTC(2026, 4, 10) + ((productNumber * 37) % 160) * DAY_MS),
            variants,
          });

          productNumber += 1;
        }
      }
    }
  }

  return { categories, vendors: seedVendors, products };
}
