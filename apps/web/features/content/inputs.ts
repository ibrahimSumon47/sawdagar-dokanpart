import { z } from 'zod';
import { contentKinds, contentStatuses } from './contentTypes';

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => value || null);

const slug = z
  .string()
  .trim()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens');

/** Most tags one Journal post may carry; extra labels are dropped in order. */
export const maxTags = 6;

/**
 * Normalises a comma separated tag field into lowercase slugs: trimmed, lowercased, spaces and
 * punctuation collapsed to single hyphens, duplicates removed, at most {@link maxTags} kept.
 */
export function normalizeTags(value: unknown): string[] {
  const parts = Array.isArray(value) ? value : String(value ?? '').split(',');
  const tags = parts
    .map((part) =>
      String(part)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 24)
        .replace(/-+$/g, ''),
    )
    .filter(Boolean);
  return [...new Set(tags)].slice(0, maxTags);
}

/** `?tag=` on the Journal index; anything that is not a tag slug is ignored. */
export const tagFilterSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(24)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

/**
 * Accepts a Cloudinary public ID (`sawdagar/journal/post`), a `res.cloudinary.com` https URL,
 * or a path on this site (`/images/example.jpg`). Anything else is rejected so a cover can
 * never point at an arbitrary host.
 */
export function isCoverImage(value: string): boolean {
  if (value.startsWith('/')) return !value.startsWith('//') && !value.includes(' ');
  if (value.startsWith('https://')) {
    try {
      return new URL(value).hostname === 'res.cloudinary.com';
    } catch {
      return false;
    }
  }
  return /^[a-z0-9][a-z0-9/_-]*$/.test(value);
}

const coverImage = z
  .string()
  .trim()
  .max(300)
  .nullish()
  .transform((value) => value || null)
  .refine(
    (value) => value === null || isCoverImage(value),
    'Use a Cloudinary image or a site path',
  );

const publishDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a publish date')
  .or(z.literal(''))
  .nullish();

/** Fields saved by the CMS editor. */
export const contentSchema = z
  .object({
    id: optionalText(80),
    kind: z.enum(contentKinds),
    slug,
    titleEn: z.string().trim().min(3).max(120),
    titleBn: z.string().trim().min(1).max(120),
    excerptEn: optionalText(240),
    excerptBn: optionalText(240),
    bodyEn: z.string().trim().min(20).max(12_000),
    bodyBn: z.string().trim().min(20).max(12_000),
    coverImageUrl: coverImage,
    coverImageAltEn: optionalText(160),
    coverImageAltBn: optionalText(160),
    tags: z
      .union([z.string(), z.array(z.string())])
      .nullish()
      .transform((value) => normalizeTags(value ?? '')),
    seoTitleEn: optionalText(120),
    seoTitleBn: optionalText(120),
    seoDescriptionEn: optionalText(200),
    seoDescriptionBn: optionalText(200),
    status: z.enum(contentStatuses),
    helpCategoryId: optionalText(80),
    publishDate,
  })
  .refine((value) => value.status !== 'scheduled' || Boolean(value.publishDate), {
    message: 'A scheduled entry needs a publish date',
    path: ['publishDate'],
  });

/** A version id chosen from the history panel. */
export const restoreVersionSchema = z.object({
  versionId: z.string().trim().min(1).max(80),
});

/** Snapshot shape read back from the JSON column. */
export const snapshotSchema = z.object({
  titleEn: z.string(),
  titleBn: z.string(),
  excerptEn: z.string().nullable(),
  excerptBn: z.string().nullable(),
  bodyEn: z.string(),
  bodyBn: z.string(),
  coverImageUrl: z
    .string()
    .nullish()
    .transform((value) => value ?? null),
  coverImageAltEn: z
    .string()
    .nullish()
    .transform((value) => value ?? null),
  coverImageAltBn: z
    .string()
    .nullish()
    .transform((value) => value ?? null),
  tags: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
  seoTitleEn: z.string().nullable(),
  seoTitleBn: z.string().nullable(),
  seoDescriptionEn: z.string().nullable(),
  seoDescriptionBn: z.string().nullable(),
});

export type ContentInput = z.infer<typeof contentSchema>;
