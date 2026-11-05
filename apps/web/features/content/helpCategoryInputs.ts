import { z } from 'zod';

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
  .min(2)
  .max(40)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens');

/** Fields saved by the Help Center category editor. */
export const helpCategorySchema = z.object({
  id: optionalText(80),
  slug,
  nameEn: z.string().trim().min(2).max(60),
  nameBn: z.string().trim().min(1).max(60),
  descriptionEn: optionalText(240),
  descriptionBn: optionalText(240),
});

/** Category id and the direction a move button asked for. */
export const helpCategoryMoveSchema = z.object({
  id: z.string().trim().min(1).max(80),
  direction: z.enum(['up', 'down']),
});

/** A category version id chosen from the history panel. */
export const restoreHelpCategoryVersionSchema = z.object({
  versionId: z.string().trim().min(1).max(80),
});

/** Snapshot read back from the JSON column before restoring it. */
export const helpCategorySnapshotSchema = z.object({
  slug: z.string(),
  nameEn: z.string(),
  nameBn: z.string(),
  descriptionEn: z.string().nullable(),
  descriptionBn: z.string().nullable(),
});

/** Parsed form values for one category save. */
export type HelpCategoryInput = z.infer<typeof helpCategorySchema>;
