import { describe, expect, it } from 'vitest';
import { topLevelCategories } from './categories';

describe('topLevelCategories', () => {
  it('covers the twelve planned top-level categories', () => {
    expect(topLevelCategories).toHaveLength(12);
  });

  it('has unique slugs and a name in both languages', () => {
    const slugs = new Set(topLevelCategories.map((category) => category.slug));
    expect(slugs.size).toBe(topLevelCategories.length);

    for (const category of topLevelCategories) {
      expect(category.name.en.trim()).not.toBe('');
      expect(category.name.bn.trim()).not.toBe('');
    }
  });

  it('uses Bangla script for the Bangla names', () => {
    for (const category of topLevelCategories) {
      expect(category.name.bn).toMatch(/[\u0980-\u09FF]/);
    }
  });
});
