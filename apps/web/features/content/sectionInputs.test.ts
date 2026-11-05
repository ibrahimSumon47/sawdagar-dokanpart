import { describe, expect, it } from 'vitest';
import { sectionOrderSchema, sectionSchema } from './sectionInputs';

const valid = {
  kind: 'hero',
  titleEn: 'Every dokan, one marketplace.',
  titleBn: 'প্রতিটি দোকান, এক বাজার।',
  bodyEn: 'Independent sellers from across Bangladesh, in one storefront.',
  bodyBn: 'সারা বাংলাদেশের স্বাধীন বিক্রেতারা, একই দোকানে।',
  imageUrl: '',
  ctaLabelEn: '',
  ctaLabelBn: '',
  ctaHref: '',
  status: 'published',
  publishDate: '',
};

describe('sectionSchema', () => {
  it('accepts a published hero without a link', () => {
    expect(sectionSchema.safeParse(valid).success).toBe(true);
  });

  it('normalises empty optional text to null', () => {
    const result = sectionSchema.parse({ ...valid, imageUrl: '  ', ctaHref: '' });
    expect(result.imageUrl).toBeNull();
    expect(result.ctaHref).toBeNull();
  });

  it('rejects a scheduled section without a publish date', () => {
    const result = sectionSchema.safeParse({ ...valid, status: 'scheduled', publishDate: '' });
    expect(result.success).toBe(false);
  });

  it('accepts a scheduled section with a date', () => {
    const result = sectionSchema.safeParse({
      ...valid,
      status: 'scheduled',
      publishDate: '2027-01-15',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a link without a label in both languages', () => {
    const result = sectionSchema.safeParse({
      ...valid,
      ctaHref: '/catalog',
      ctaLabelEn: 'Browse',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a link that is neither a site path nor https', () => {
    const result = sectionSchema.safeParse({
      ...valid,
      ctaHref: 'javascript:alert(1)',
      ctaLabelEn: 'Browse',
      ctaLabelBn: 'দেখুন',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown section type', () => {
    expect(sectionSchema.safeParse({ ...valid, kind: 'footer' }).success).toBe(false);
  });
});

describe('sectionOrderSchema', () => {
  it('accepts a list of ids', () => {
    expect(sectionOrderSchema.safeParse({ ids: ['a', 'b'] }).success).toBe(true);
  });

  it('rejects an empty order', () => {
    expect(sectionOrderSchema.safeParse({ ids: [] }).success).toBe(false);
  });
});
