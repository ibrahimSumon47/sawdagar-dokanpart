import { describe, expect, it } from 'vitest';
import { contentSchema, isCoverImage, maxTags, normalizeTags, tagFilterSchema } from './inputs';

const valid = {
  kind: 'help',
  slug: 'delivery-times',
  titleEn: 'Delivery times',
  titleBn: 'ডেলিভারির সময়',
  excerptEn: 'How long a parcel takes.',
  excerptBn: 'পার্সেল কত সময় নেয়।',
  bodyEn: 'Couriers need one to five working days depending on the district.',
  bodyBn: 'জেলা অনুযায়ী কুরিয়ারে এক থেকে পাঁচ কর্মদিবস লাগে।',
  seoTitleEn: 'Delivery times',
  seoTitleBn: 'ডেলিভারির সময়',
  seoDescriptionEn: 'Packing and courier timelines.',
  seoDescriptionBn: 'প্যাকিং ও কুরিয়ারের সময়সূচি।',
  status: 'published',
  publishDate: '',
};

describe('contentSchema', () => {
  it('accepts a complete published entry', () => {
    const result = contentSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('normalises empty optional text to null', () => {
    const result = contentSchema.parse({ ...valid, excerptEn: '  ', seoTitleBn: '' });
    expect(result.excerptEn).toBeNull();
    expect(result.seoTitleBn).toBeNull();
  });

  it('rejects a scheduled entry without a publish date', () => {
    const result = contentSchema.safeParse({ ...valid, status: 'scheduled', publishDate: '' });
    expect(result.success).toBe(false);
  });

  it('accepts a scheduled entry with a date', () => {
    const result = contentSchema.safeParse({
      ...valid,
      status: 'scheduled',
      publishDate: '2027-02-20',
    });
    expect(result.success).toBe(true);
  });

  it('rejects slugs with capitals or spaces', () => {
    expect(contentSchema.safeParse({ ...valid, slug: 'Delivery Times' }).success).toBe(false);
  });

  it('rejects an unknown content area', () => {
    expect(contentSchema.safeParse({ ...valid, kind: 'blog' }).success).toBe(false);
  });

  it('stores normalised tags and a Cloudinary cover', () => {
    const result = contentSchema.parse({
      ...valid,
      kind: 'journal',
      tags: 'Handloom, jamdani, Handloom',
      coverImageUrl: 'sawdagar/journal/jamdani',
    });
    expect(result.tags).toEqual(['handloom', 'jamdani']);
    expect(result.coverImageUrl).toBe('sawdagar/journal/jamdani');
  });

  it('rejects a cover hosted somewhere other than Cloudinary', () => {
    expect(
      contentSchema.safeParse({ ...valid, coverImageUrl: 'https://example.com/a.jpg' }).success,
    ).toBe(false);
  });
});

describe('normalizeTags', () => {
  it('lowercases, hyphenates and removes duplicates', () => {
    expect(normalizeTags('Handloom Weaving, handloom-weaving, Tangail ')).toEqual([
      'handloom-weaving',
      'tangail',
    ]);
  });

  it('keeps at most the allowed number of tags', () => {
    const tags = normalizeTags('a,b,c,d,e,f,g');
    expect(tags).toHaveLength(maxTags);
  });

  it('drops empty segments', () => {
    expect(normalizeTags(' , ,jamdani, ')).toEqual(['jamdani']);
  });
});

describe('isCoverImage', () => {
  it('accepts a public ID, a Cloudinary URL and a site path', () => {
    expect(isCoverImage('sawdagar/journal/jamdani')).toBe(true);
    expect(isCoverImage('https://res.cloudinary.com/demo/image/upload/a.jpg')).toBe(true);
    expect(isCoverImage('/images/journal/jamdani.jpg')).toBe(true);
  });

  it('rejects other hosts, protocol relative paths and spaces', () => {
    expect(isCoverImage('https://example.com/a.jpg')).toBe(false);
    expect(isCoverImage('//example.com/a.jpg')).toBe(false);
    expect(isCoverImage('/images/a b.jpg')).toBe(false);
  });
});

describe('tagFilterSchema', () => {
  it('accepts and lowercases a tag slug', () => {
    expect(tagFilterSchema.parse('Jamdani')).toBe('jamdani');
  });

  it('rejects a value with punctuation', () => {
    expect(tagFilterSchema.safeParse('jamdani saree').success).toBe(false);
  });
});
