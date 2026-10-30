import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ProductGrid } from './ProductGrid';
import { ProductGridSkeleton } from './ProductGridSkeleton';
import { productGridClass } from './productGridLayout';

vi.mock('../../../shop/components/WishlistButton', () => ({
  WishlistButton: () => <button type="button">Save</button>,
}));

describe('product grid layout', () => {
  it('uses the same responsive columns for products and loading cards', () => {
    const product = {
      id: 'one',
      slug: 'one',
      title: { en: 'Saree', bn: 'শাড়ি' },
      vendorName: 'Weavers',
      vendorSlug: 'weavers',
      priceMinor: 10000,
      rating: 4,
      reviewCount: 2,
      tone: 'accent' as const,
      totalStock: 1,
      departmentSlug: 'sarees',
    };
    const loaded = renderToStaticMarkup(
      <ProductGrid
        products={[product]}
        locale="en"
        labels={{ sale: 'Sale', soldOut: 'Sold out', ratingLabels: { one: 'Rated 4' } }}
      />,
    );
    const loading = renderToStaticMarkup(<ProductGridSkeleton count={1} label="Loading" />);

    expect(loaded).toContain('class="@container min-w-0"');
    expect(loading).toContain('class="@container min-w-0"');
    expect(loaded).toContain(`class="${productGridClass}"`);
    expect(loading).toContain(`class="${productGridClass}"`);
    expect(productGridClass).toContain('grid-cols-2');
    expect(productGridClass).toContain('@min-[70rem]:grid-cols-5');
  });
});
