import { z } from 'zod';

/** Reasons offered for a return; stored as the stable key, labelled by i18n. */
export const returnReasons = [
  'damaged',
  'wrong_item',
  'not_as_described',
  'changed_mind',
  'other',
] as const;

export type ReturnReason = (typeof returnReasons)[number];

/** Server-side shape of the return request form. */
export const returnRequestSchema = z.object({
  // Ownership is checked in the action; seeded rows use readable ids.
  orderItemId: z.string().trim().min(1).max(80),
  reason: z.enum(returnReasons),
  note: z
    .string()
    .trim()
    .max(400)
    .transform((value) => value || null),
});
