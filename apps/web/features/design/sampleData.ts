import type { ProductCardProduct } from '@sd/ui';

/**
 * Fixtures for the design gallery only. They use believable Bangladeshi names
 * and prices but are not catalog records; the seeded catalog arrives in Phase 3.
 */
export const sampleProducts: readonly ProductCardProduct[] = [
  {
    id: 'jamdani-indigo',
    title: 'Handloom jamdani saree, indigo',
    vendorName: 'Rupsha Tangail Weavers',
    priceMinor: 1_250_000,
    compareAtMinor: 1_450_000,
    rating: 4.8,
    reviewCount: 64,
    tone: 'accent',
  },
  {
    id: 'nakshi-kantha',
    title: 'Nakshi kantha bedcover, red border',
    vendorName: 'Jamalpur Kantha Collective',
    priceMinor: 680_000,
    rating: 4.9,
    reviewCount: 38,
    tone: 'highlight',
  },
  {
    id: 'terracotta-tea',
    title: 'Terracotta tea set, six cups',
    vendorName: 'Paharpur Clay Studio',
    priceMinor: 245_000,
    rating: 4.6,
    reviewCount: 21,
    tone: 'secondary',
  },
  {
    id: 'jute-tote',
    title: 'Jute tote with leather handles',
    vendorName: 'Khulna Jute Works',
    priceMinor: 189_000,
    compareAtMinor: 220_000,
    rating: 4.5,
    reviewCount: 52,
    tone: 'ink',
  },
];

export const sampleVendors = [
  {
    name: 'Rupsha Tangail Weavers',
    location: 'Tangail',
    rating: 4.8,
    reviewCount: 214,
    followers: '1,240',
    verified: true,
  },
  {
    name: 'Paharpur Clay Studio',
    location: 'Naogaon',
    rating: 4.7,
    reviewCount: 96,
    followers: '684',
    verified: false,
  },
] as const;

export const tokenSwatches = [
  'background',
  'surface',
  'surface-elevated',
  'ink',
  'ink-muted',
  'line',
  'accent',
  'accent-hover',
  'accent-contrast',
  'secondary',
  'highlight',
  'success',
  'warning',
  'danger',
  'info',
  'skeleton-base',
  'skeleton-shine',
] as const;

export const galleryWidths = [360, 640, 768, 1024, 1280, 1536] as const;
