import { describe, expect, it } from 'vitest';
import { contentSchema } from './inputs';

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
});
