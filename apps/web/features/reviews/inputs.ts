import { REVIEW_MAX_RATING, REVIEW_MIN_RATING } from '@sd/domain';
import { z } from 'zod';

/** How many photos a review may attach. */
export const MAX_REVIEW_PHOTOS = 3;

/** Longest accepted data URL; the browser resizes photos well below this. */
export const MAX_REVIEW_PHOTO_CHARS = 220_000;

const photoPattern = /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

/** A resized photo needs a real image type and a bounded payload. */
export const reviewPhotoSchema = z
  .string()
  .max(MAX_REVIEW_PHOTO_CHARS, 'Photo is too large')
  .regex(photoPattern, 'Photo must be a JPEG, PNG or WebP data URL');

/** Server-side shape of the review form. */
export const reviewSchema = z.object({
  orderItemId: z.string().uuid(),
  rating: z.coerce.number().int().min(REVIEW_MIN_RATING).max(REVIEW_MAX_RATING),
  title: z.string().trim().min(4).max(80),
  body: z.string().trim().min(20).max(1200),
  photos: z.array(reviewPhotoSchema).max(MAX_REVIEW_PHOTOS),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
