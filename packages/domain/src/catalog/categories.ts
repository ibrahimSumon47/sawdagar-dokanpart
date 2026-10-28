/** A category name in the two languages the storefront supports. */
export interface LocalisedName {
  en: string;
  bn: string;
}

/** A top-level marketplace category shown in navigation and category tiles. */
export interface Category {
  slug: string;
  name: LocalisedName;
}

/**
 * The twelve top-level categories of the marketplace.
 *
 * These names are curated for the demo and will seed the category tree in the
 * catalog phase. Slugs are stable identifiers, so navigation can be built from
 * this list without waiting for database access.
 */
export const topLevelCategories: readonly Category[] = [
  { slug: 'sarees', name: { en: 'Sarees', bn: 'শাড়ি' } },
  { slug: 'panjabi', name: { en: 'Panjabi and kurta', bn: 'পাঞ্জাবি ও কুর্তা' } },
  { slug: 'handloom', name: { en: 'Handloom textiles', bn: 'তাঁতের কাপড়' } },
  { slug: 'nakshi-kantha', name: { en: 'Nakshi kantha', bn: 'নকশি কাঁথা' } },
  { slug: 'jute', name: { en: 'Jute crafts', bn: 'পাটজাত পণ্য' } },
  { slug: 'cane-bamboo', name: { en: 'Cane and bamboo', bn: 'বেত ও বাঁশ' } },
  { slug: 'pottery', name: { en: 'Pottery and terracotta', bn: 'মাটির পণ্য' } },
  { slug: 'brassware', name: { en: 'Brassware', bn: 'পিতলের পণ্য' } },
  { slug: 'leather', name: { en: 'Leather goods', bn: 'চামড়াজাত পণ্য' } },
  { slug: 'home-kitchen', name: { en: 'Home and kitchen', bn: 'ঘর ও রান্নাঘর' } },
  { slug: 'beauty-care', name: { en: 'Beauty and care', bn: 'সৌন্দর্য ও যত্ন' } },
  { slug: 'books-stationery', name: { en: 'Books and stationery', bn: 'বই ও স্টেশনারি' } },
];
