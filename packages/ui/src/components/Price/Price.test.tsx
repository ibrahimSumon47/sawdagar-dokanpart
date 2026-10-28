import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Price } from './Price';

describe('Price', () => {
  it('renders the current price in taka', () => {
    const html = renderToStaticMarkup(<Price amountMinor={1_250_000} />);

    expect(html).toContain('৳12,500');
    expect(html).not.toContain('line-through');
  });

  it('shows a struck-through original price only when discounted', () => {
    const html = renderToStaticMarkup(<Price amountMinor={189_000} compareAtMinor={220_000} />);

    expect(html).toContain('line-through');
    expect(html).toContain('৳2,200');
  });

  it('uses Bengali numerals when asked', () => {
    const html = renderToStaticMarkup(<Price amountMinor={1_250_000} locale="bn" />);

    expect(html).toContain('৳১২,৫০০');
  });

  it('renders a negative ledger balance only when allowed', () => {
    const html = renderToStaticMarkup(<Price amountMinor={-144_000} allowNegative />);

    expect(html).toContain('-৳1,440');
    expect(() => renderToStaticMarkup(<Price amountMinor={-144_000} />)).toThrow(RangeError);
  });
});
