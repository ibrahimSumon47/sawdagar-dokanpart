import { topLevelCategories } from '@sd/domain';
import { describe, expect, it } from 'vitest';
import { departmentPhoto } from './media';
import { mediaCredits } from './mediaCredits';

describe('department photography', () => {
  it('provides localized representative descriptions for every credited department', () => {
    expect(mediaCredits).toHaveLength(topLevelCategories.length);
    for (const credit of mediaCredits) {
      const category = topLevelCategories.find((item) => item.slug === credit.slug);
      expect(category).toBeDefined();
      const english = departmentPhoto(credit.slug, 'sample', 'en');
      const bangla = departmentPhoto(credit.slug, 'sample', 'bn');
      expect(english?.alt).toContain(category?.name.en);
      expect(english?.alt).toContain('Representative');
      expect(bangla?.alt).toContain(category?.name.bn);
      expect(bangla?.alt).toContain('প্রতিনিধিত্বমূলক');
      expect(bangla?.src).toBe(english?.src);
      expect(bangla?.objectPosition).toBe(english?.objectPosition);
    }
  });

  it('returns no photograph for an unknown or missing department', () => {
    expect(departmentPhoto(undefined, 'sample', 'bn')).toBeNull();
    expect(departmentPhoto('unknown', 'sample', 'en')).toBeNull();
  });
});
