import { z } from 'zod';

/** Longest question text the product page accepts. */
export const MAX_QUESTION_LENGTH = 400;

/** Server-side shape of the ask-the-seller form. */
export const questionSchema = z.object({
  productId: z.string().uuid(),
  body: z.string().trim().min(10).max(MAX_QUESTION_LENGTH),
});
