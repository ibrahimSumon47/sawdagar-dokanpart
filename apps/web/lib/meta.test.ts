import { describe, expect, it } from 'vitest';
import { metaDescription } from './meta';

describe('metaDescription', () => {
  it('keeps short text and collapses whitespace', () => {
    expect(metaDescription('  Handwoven   saree\nfrom Tangail  ')).toBe(
      'Handwoven saree from Tangail',
    );
  });

  it('shortens long text at a word boundary within the limit', () => {
    const text = Array.from({ length: 60 }, (_, index) => `word${index}`).join(' ');
    const result = metaDescription(text);

    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith('…')).toBe(true);
    expect(result.slice(0, -1)).not.toMatch(/wor$/);
    expect(text.startsWith(result.slice(0, -1))).toBe(true);
  });

  it('cuts inside a long unbroken token rather than returning nothing', () => {
    const result = metaDescription('x'.repeat(200));

    expect(result).toHaveLength(160);
    expect(result.endsWith('…')).toBe(true);
  });
});
