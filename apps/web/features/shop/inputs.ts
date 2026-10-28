import { z } from 'zod';

const idSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[A-Za-z0-9_-]+$/);

export const variantIdSchema = idSchema;
export const productIdSchema = idSchema;

/** One add or quantity change may not exceed ten units of a single variant. */
export const quantitySchema = z.number().int().min(1).max(10);
