import { z } from 'zod';

/** Longest question text the product page accepts. */
export const MAX_QUESTION_LENGTH = 400;

/** Server-side shape of the ask-the-seller form. */
export const questionSchema = z.object({
  // Seeded product ids are readable strings; the action checks the product is active.
  productId: z.string().trim().min(1).max(80),
  body: z.string().trim().min(10).max(MAX_QUESTION_LENGTH),
});
