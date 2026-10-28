/**
 * Layout constants shared by the product card and its skeleton.
 *
 * Both components read the same values so reserved space always matches the
 * loaded layout. The design gallery and tests also read these values instead of
 * duplicating measurements.
 */
export const productCardLayout = {
  id: 'product-card',
  mediaAspect: 'aspect-[4/5]',
  bodyGap: 'gap-1.5',
  titleLines: 2,
  titleLineHeight: 'h-4',
  priceLineHeight: 'h-5',
} as const;
