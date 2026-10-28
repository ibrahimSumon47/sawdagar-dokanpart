import {
  businessTypes,
  districts,
  inventoryReasons,
  productTones,
  sellerProductStatuses,
} from '@sd/domain';
import { z } from 'zod';

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null);

const bangladeshPhone = z
  .string()
  .trim()
  .regex(/^(?:\+8801|01)[3-9]\d{8}$/, 'Enter a Bangladesh mobile number');

/** Store identity, announcement and policies edited in the Seller Center. */
export const storeSchema = z.object({
  name: z.string().trim().min(2).max(80),
  announcementEn: optionalText(140),
  announcementBn: optionalText(140),
  aboutEn: optionalText(600),
  aboutBn: optionalText(600),
  returnPolicyEn: optionalText(600),
  returnPolicyBn: optionalText(600),
  shippingPolicyEn: optionalText(600),
  shippingPolicyBn: optionalText(600),
  accent: z.enum(productTones),
  coverTone: z.enum(productTones),
});

/** Business details submitted for KYC review. */
export const kycSchema = z.object({
  legalName: z.string().trim().min(2).max(120),
  businessType: z.enum(businessTypes),
  tradeLicense: z.string().trim().min(4).max(40),
  payoutPhone: bangladeshPhone,
  district: z.string().refine((value) => districts.includes(value), 'Choose a district'),
});

const priceSchema = z.coerce.number().min(1).max(1_000_000);

/** Product fields a vendor creates or edits. Variants are edited separately. */
export const productSchema = z.object({
  productId: optionalText(80),
  titleEn: z.string().trim().min(3).max(120),
  titleBn: z.string().trim().min(1).max(120),
  descriptionEn: z.string().trim().min(20).max(2000),
  descriptionBn: z.string().trim().min(1).max(2000),
  categoryId: z.string().trim().min(1).max(80),
  price: priceSchema,
  stock: z.coerce.number().int().min(0).max(100_000),
  tone: z.enum(productTones),
  status: z.enum(sellerProductStatuses),
});

/** Price and stock for one existing variant. */
export const variantSchema = z.object({
  variantId: z.string().trim().min(1).max(120),
  price: priceSchema,
  stock: z.coerce.number().int().min(0).max(100_000),
});

/** One manual stock change with a reason for the inventory history. */
export const stockAdjustmentSchema = z.object({
  variantId: z.string().trim().min(1).max(120),
  delta: z.coerce
    .number()
    .int()
    .min(-1000)
    .max(1000)
    .refine((value) => value !== 0),
  reason: z.enum(inventoryReasons),
  note: optionalText(200),
});

/** A seller answer to one product question. */
export const answerSchema = z.object({
  questionId: z.string().trim().min(1).max(80),
  body: z.string().trim().min(10).max(1000),
});

/** A seller decision on a return request. Refunds happen in the finance phase. */
export const returnDecisionSchema = z.object({
  returnRequestId: z.string().trim().min(1).max(80),
  decision: z.enum(['approved', 'rejected']),
  note: optionalText(300),
});

/** A store-scoped promotion, stored as a coupon tied to the organization. */
export const promotionSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(24)
    .regex(/^[A-Za-z0-9-]+$/)
    .transform((value) => value.toUpperCase()),
  type: z.enum(['percent', 'fixed', 'free_shipping']),
  value: z.coerce.number().min(0).max(100_000),
  minSubtotal: z.coerce.number().min(0).max(1_000_000),
  endsAt: optionalText(10),
  active: z
    .union([z.literal('on'), z.literal('true'), z.literal(''), z.null(), z.undefined()])
    .transform((value) => value === 'on' || value === 'true'),
});

export type StoreInput = z.infer<typeof storeSchema>;
export type KycInput = z.infer<typeof kycSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type PromotionInput = z.infer<typeof promotionSchema>;
