import { describe, expect, it } from 'vitest';
import { catalogHref, parseCatalogFilters } from './catalogQuery';

describe('catalog filters', () => {
  it('uses safe defaults for an empty URL', () => {
    expect(parseCatalogFilters({})).toEqual({
      q: '',
      category: undefined,
      vendor: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      inStock: false,
      sort: 'newest',
      page: 1,
    });
  });

  it('reads every supported filter and the first value of a repeated param', () => {
    const filters = parseCatalogFilters({
      q: ['jamdani', 'saree'],
      category: 'jamdani-saree',
      minPrice: '2000',
      maxPrice: '12000',
      rating: '4.5',
      inStock: '1',
      sort: 'price-asc',
      page: '3',
    });

    expect(filters.q).toBe('jamdani');
    expect(filters.category).toBe('jamdani-saree');
    expect(filters.minPrice).toBe(2000);
    expect(filters.maxPrice).toBe(12000);
    expect(filters.rating).toBe(4.5);
    expect(filters.inStock).toBe(true);
    expect(filters.sort).toBe('price-asc');
    expect(filters.page).toBe(3);
  });

  it('falls back when a URL carries invalid values', () => {
    const filters = parseCatalogFilters({
      q: 'x'.repeat(120),
      category: '../../etc/passwd',
      minPrice: '-5',
      maxPrice: 'not-a-number',
      rating: '3',
      sort: 'popular',
      page: '0',
    });

    expect(filters.q).toBe('');
    expect(filters.category).toBeUndefined();
    expect(filters.minPrice).toBeUndefined();
    expect(filters.maxPrice).toBeUndefined();
    expect(filters.rating).toBeUndefined();
    expect(filters.sort).toBe('newest');
    expect(filters.page).toBe(1);
  });

  it('treats blank price fields from the filter form as absent', () => {
    const filters = parseCatalogFilters({ minPrice: '', maxPrice: '', category: 'sarees' });

    expect(filters.minPrice).toBeUndefined();
    expect(filters.maxPrice).toBeUndefined();
    expect(catalogHref(filters)).toBe('/catalog?category=sarees');
  });

  it('swaps a reversed price range instead of returning nothing', () => {
    const filters = parseCatalogFilters({ minPrice: '9000', maxPrice: '2000' });
    expect(filters.minPrice).toBe(2000);
    expect(filters.maxPrice).toBe(9000);
  });

  it('builds a canonical link and keeps unrelated filters', () => {
    const filters = parseCatalogFilters({ q: 'jute', sort: 'rating', page: '2' });
    expect(catalogHref(filters, { category: 'jute-tote' })).toBe(
      '/catalog?q=jute&category=jute-tote&sort=rating',
    );
  });

  it('resets the page for a filter change but not for pagination', () => {
    const filters = parseCatalogFilters({ category: 'sarees', page: '2' });
    expect(catalogHref(filters, { inStock: true })).toBe('/catalog?category=sarees&inStock=1');
    expect(catalogHref(filters, { page: 3 })).toBe('/catalog?category=sarees&page=3');
  });

  it('encodes Bangla search terms and omits defaults', () => {
    const filters = parseCatalogFilters({ q: 'শাড়ি' });
    expect(catalogHref(filters)).toBe('/catalog?q=%E0%A6%B6%E0%A6%BE%E0%A6%A1%E0%A6%BC%E0%A6%BF');
    expect(catalogHref(parseCatalogFilters({}))).toBe('/catalog');
  });
});
