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
    seoTitleEn: optionalText(120),
    seoTitleBn: optionalText(120),
    seoDescriptionEn: optionalText(200),
    seoDescriptionBn: optionalText(200),
    status: z.enum(contentStatuses),
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
  seoTitleEn: z.string().nullable(),
  seoTitleBn: z.string().nullable(),
  seoDescriptionEn: z.string().nullable(),
  seoDescriptionBn: z.string().nullable(),
});

export type ContentInput = z.infer<typeof contentSchema>;
