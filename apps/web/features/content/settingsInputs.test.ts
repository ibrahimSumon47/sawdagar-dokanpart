import { describe, expect, it } from 'vitest';
import { settingsSchema } from './settingsInputs';

const valid = {
  announcementEnabled: 'off',
  announcementEn: '',
  announcementBn: '',
  announcementHref: '',
  seoTitleEn: '',
  seoTitleBn: '',
  seoDescriptionEn: '',
  seoDescriptionBn: '',
  shippingPolicyEn: '',
  shippingPolicyBn: '',
  returnsPolicyEn: '',
  returnsPolicyBn: '',
  navigation: '[]',
  footerLinks: '[]',
};

const link = { labelEn: 'Refunds', labelBn: 'ফেরত', href: '/policies' };

describe('settingsSchema', () => {
  it('accepts untouched defaults', () => {
    expect(settingsSchema.safeParse(valid).success).toBe(true);
  });

  it('turns blank optional text into null', () => {
    const result = settingsSchema.parse({ ...valid, seoTitleEn: '   ', shippingPolicyBn: '' });
    expect(result.seoTitleEn).toBeNull();
    expect(result.shippingPolicyBn).toBeNull();
  });

  it('reads link lists sent as JSON', () => {
    const result = settingsSchema.parse({ ...valid, footerLinks: JSON.stringify([link]) });
    expect(result.footerLinks).toEqual([link]);
  });

  it('rejects a link list that is not JSON', () => {
    expect(settingsSchema.safeParse({ ...valid, navigation: 'not json' }).success).toBe(false);
  });

  it('rejects more footer links than the footer holds', () => {
    const tooMany = Array.from({ length: 6 }, () => link);
    expect(
      settingsSchema.safeParse({ ...valid, footerLinks: JSON.stringify(tooMany) }).success,
    ).toBe(false);
  });

  it('accepts six header links', () => {
    const six = Array.from({ length: 6 }, () => link);
    expect(settingsSchema.safeParse({ ...valid, navigation: JSON.stringify(six) }).success).toBe(
      true,
    );
  });

  it('accepts a link labelled in one language only', () => {
    const englishOnly = { labelEn: 'Refunds', labelBn: '', href: '/policies' };
    expect(
      settingsSchema.safeParse({ ...valid, navigation: JSON.stringify([englishOnly]) }).success,
    ).toBe(true);
  });

  it('rejects a link with no label in either language', () => {
    const unlabelled = { labelEn: '  ', labelBn: '', href: '/policies' };
    expect(
      settingsSchema.safeParse({ ...valid, navigation: JSON.stringify([unlabelled]) }).success,
    ).toBe(false);
  });

  it('rejects a link that is neither a site path nor https', () => {
    const unsafe = [{ ...link, href: 'javascript:alert(1)' }];
    expect(settingsSchema.safeParse({ ...valid, navigation: JSON.stringify(unsafe) }).success).toBe(
      false,
    );
  });

  it('requires English text when the announcement is on', () => {
    const result = settingsSchema.safeParse({
      ...valid,
      announcementEnabled: 'on',
      announcementBn: 'ঈদের ছুটি',
    });
    expect(result.success).toBe(false);
  });

  it('accepts an announcement with English text and a site path', () => {
    const result = settingsSchema.safeParse({
      ...valid,
      announcementEnabled: 'on',
      announcementEn: 'Eid delivery closes on 18 March.',
      announcementHref: '/help',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an announcement link that is not a site path or https', () => {
    const result = settingsSchema.safeParse({
      ...valid,
      announcementHref: 'http://example.com',
    });
    expect(result.success).toBe(false);
  });
});
