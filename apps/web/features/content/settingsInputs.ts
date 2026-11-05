import { z } from 'zod';
import { linkLimits } from './settingsTypes';

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => value || null);

const linkHref = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .refine((value) => value.startsWith('/') || value.startsWith('https://'), {
    message: 'Use a site path or an https link',
  });

const linkSchema = z
  .object({
    labelEn: z.string().trim().max(60),
    labelBn: z.string().trim().max(60),
    href: linkHref,
  })
  .refine((link) => Boolean(link.labelEn || link.labelBn), {
    message: 'Every link needs a label in at least one language',
    path: ['labelEn'],
  });

const linkList = (limit: number) =>
  z
    .string()
    .trim()
    .max(6000)
    .transform((value, ctx) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(value || '[]');
      } catch {
        ctx.addIssue({ code: 'custom', message: 'The links could not be read' });
        return z.NEVER;
      }
      const result = z.array(linkSchema).max(limit).safeParse(parsed);
      if (!result.success) {
        ctx.addIssue({ code: 'custom', message: 'Check the link labels and addresses' });
        return z.NEVER;
      }
      return result.data;
    });

const checkbox = z.preprocess((value) => value === 'on' || value === 'true', z.boolean());

/** Fields saved by the site settings editor. */
export const settingsSchema = z
  .object({
    announcementEnabled: checkbox,
    announcementEn: optionalText(160),
    announcementBn: optionalText(160),
    announcementHref: optionalText(300),
    seoTitleEn: optionalText(70),
    seoTitleBn: optionalText(70),
    seoDescriptionEn: optionalText(160),
    seoDescriptionBn: optionalText(160),
    shippingPolicyEn: optionalText(1200),
    shippingPolicyBn: optionalText(1200),
    returnsPolicyEn: optionalText(1200),
    returnsPolicyBn: optionalText(1200),
    navigation: linkList(linkLimits.navigation),
    footerLinks: linkList(linkLimits.footer),
  })
  .refine((value) => !value.announcementEnabled || Boolean(value.announcementEn), {
    message: 'The announcement needs English text',
    path: ['announcementEn'],
  })
  .refine(
    (value) =>
      !value.announcementHref ||
      value.announcementHref.startsWith('/') ||
      value.announcementHref.startsWith('https://'),
    { message: 'Use a site path or an https link', path: ['announcementHref'] },
  );

/** Snapshot read back from the JSON column before restoring it. */
export const settingsSnapshotSchema = z.object({
  announcementEnabled: z.boolean(),
  announcementEn: z.string().nullable(),
  announcementBn: z.string().nullable(),
  announcementHref: z.string().nullable(),
  seoTitleEn: z.string().nullable(),
  seoTitleBn: z.string().nullable(),
  seoDescriptionEn: z.string().nullable(),
  seoDescriptionBn: z.string().nullable(),
  shippingPolicyEn: z.string().nullable(),
  shippingPolicyBn: z.string().nullable(),
  returnsPolicyEn: z.string().nullable(),
  returnsPolicyBn: z.string().nullable(),
  navigation: z.array(linkSchema).max(linkLimits.navigation),
  footerLinks: z.array(linkSchema).max(linkLimits.footer),
});

/** A settings version id chosen from the history panel. */
export const restoreSettingsVersionSchema = z.object({
  versionId: z.string().trim().min(1).max(80),
});

/** Parsed form values for one settings save. */
export type SettingsInput = z.infer<typeof settingsSchema>;
