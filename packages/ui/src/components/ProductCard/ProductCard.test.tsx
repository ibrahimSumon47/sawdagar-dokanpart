import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { productCardLayout } from './productCardLayout';

const sample = {
  id: 'jamdani-indigo',
  title: 'Handloom jamdani saree, indigo',
  vendorName: 'Rupsha Tangail Weavers',
  priceMinor: 1_250_000,
  compareAtMinor: 1_450_000,
  rating: 4.8,
  reviewCount: 64,
} as const;

function layoutAttributes(html: string): { layout: string; aspect: string } {
  const layout = /data-layout="([^"]+)"/.exec(html)?.[1];
  const aspect = /data-media-aspect="([^"]+)"/.exec(html)?.[1];
  if (!layout || !aspect) throw new Error('Layout attributes are missing from the markup.');
  return { layout, aspect };
}

describe('ProductCard', () => {
  it('shows the product, vendor, rating and price', () => {
    const html = renderToStaticMarkup(
      <ProductCard product={sample} ratingLabel="Rated 4.8 out of 5" saleLabel="Sale" />,
    );

    expect(html).toContain('Handloom jamdani saree, indigo');
    expect(html).toContain('Rupsha Tangail Weavers');
    expect(html).toContain('Rated 4.8 out of 5');
    expect(html).toContain('৳12,500');
    expect(html).toContain('Sale');
  });

  it('shows a department photograph instead of the pattern when one is supplied', () => {
    const html = renderToStaticMarkup(
      <ProductCard
        product={{
          ...sample,
          image: { src: '/media/departments/sarees.jpg', alt: 'Saree photograph' },
        }}
        ratingLabel="Rated 4.8 out of 5"
        saleLabel="Sale"
      />,
    );

    expect(html).toContain('/media/departments/sarees.jpg');
    expect(html).toContain('alt="Saree photograph"');
  });

  it('keeps the same reserved layout as its skeleton', () => {
    const card = layoutAttributes(
      renderToStaticMarkup(
        <ProductCard product={sample} ratingLabel="Rated 4.8 out of 5" saleLabel="Sale" />,
      ),
    );
    const skeleton = layoutAttributes(renderToStaticMarkup(<ProductCardSkeleton />));

    expect(card).toEqual(skeleton);
    expect(card).toEqual({
      layout: productCardLayout.id,
      aspect: productCardLayout.mediaAspect,
    });
  });
});
