import { z } from 'zod';
import { sectionKinds, sectionStatuses } from './sectionTypes';

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => value || null);

const linkHref = optionalText(300).refine(
  (value) => value === null || value.startsWith('/') || value.startsWith('https://'),
  { message: 'Use a site path or an https link' },
);

const publishDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a publish date')
  .or(z.literal(''))
  .nullish();

/** Fields saved by the homepage section editor. */
export const sectionSchema = z
  .object({
    id: optionalText(80),
    kind: z.enum(sectionKinds),
    titleEn: z.string().trim().min(2).max(120),
    titleBn: z.string().trim().min(1).max(120),
    bodyEn: z.string().trim().min(10).max(600),
    bodyBn: z.string().trim().min(10).max(600),
    imageUrl: optionalText(500),
    ctaLabelEn: optionalText(60),
    ctaLabelBn: optionalText(60),
    ctaHref: linkHref,
    status: z.enum(sectionStatuses),
    publishDate,
  })
  .refine((value) => value.status !== 'scheduled' || Boolean(value.publishDate), {
    message: 'A scheduled section needs a publish date',
    path: ['publishDate'],
  })
  .refine((value) => !value.ctaHref || Boolean(value.ctaLabelEn && value.ctaLabelBn), {
    message: 'A link needs a label in both languages',
    path: ['ctaLabelEn'],
  });

/** Ordered ids sent by the drag or keyboard reorder control. */
export const sectionOrderSchema = z.object({
  ids: z.array(z.string().trim().min(1).max(80)).min(1).max(50),
});

/** A section version id chosen from the history panel. */
export const restoreSectionVersionSchema = z.object({
  versionId: z.string().trim().min(1).max(80),
});

/** Snapshot read back from the JSON column before restoring it. */
export const sectionSnapshotSchema = z.object({
  titleEn: z.string(),
  titleBn: z.string(),
  bodyEn: z.string(),
  bodyBn: z.string(),
  imageUrl: z.string().nullable(),
  ctaLabelEn: z.string().nullable(),
  ctaLabelBn: z.string().nullable(),
  ctaHref: z.string().nullable(),
});

/** Parsed form values for one section save. */
export type SectionInput = z.infer<typeof sectionSchema>;
