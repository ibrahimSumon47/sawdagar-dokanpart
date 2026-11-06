import { districts, divisions, findDivisionForDistrict, upazilasByDistrict } from '@sd/domain';
import { z } from 'zod';

const phonePattern = /^(?:\+8801|01)[3-9]\d{8}$/;

/** One delivery address from the checkout form or the saved address book. */
export const addressSchema = z
  .object({
    recipientName: z.string().trim().min(2).max(80),
    phone: z.string().trim().regex(phonePattern),
    division: z.string().trim().min(1).max(40),
    district: z.string().trim().min(1).max(40),
    upazila: z.string().trim().min(2).max(60),
    area: z.string().trim().max(80),
    addressLine: z.string().trim().min(8).max(160),
    postcode: z.string().trim().max(10),
    landmark: z.string().trim().max(120),
    label: z.string().trim().max(40),
  })
  .superRefine((value, context) => {
    if (!divisions.some((division) => division.name === value.division)) {
      context.addIssue({ code: 'custom', path: ['division'], message: 'Unknown division' });
      return;
    }
    if (!districts.includes(value.district)) {
      context.addIssue({ code: 'custom', path: ['district'], message: 'Unknown district' });
      return;
    }
    if (findDivisionForDistrict(value.district)?.name !== value.division) {
      context.addIssue({
        code: 'custom',
        path: ['district'],
        message: 'District does not belong to the division',
      });
      return;
    }
    if (!(upazilasByDistrict[value.district] ?? []).includes(value.upazila)) {
      context.addIssue({ code: 'custom', path: ['upazila'], message: 'Unknown upazila' });
    }
  });

export type AddressInput = z.infer<typeof addressSchema>;

/** Payment choices implemented by this demo. */
export const paymentMethodSchema = z.enum(['cod', 'mockpay']);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

/** Delivery choices offered at checkout. The fee is set by the shipping rules, not the form. */
export const deliveryMethodSchema = z.enum(['standard', 'express']);

export type DeliveryMethod = z.infer<typeof deliveryMethodSchema>;

/** The checkout form fields that are always present. */
export const checkoutFormSchema = z.object({
  paymentMethod: paymentMethodSchema,
  deliveryMethod: deliveryMethodSchema,
  addressId: z.string().trim().max(120),
  notes: z.string().trim().max(300),
});

/** Guest contact details; a signed-in buyer's account email is used instead. */
export const guestContactSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  phone: z.string().trim().regex(phonePattern),
});

/** Reads the address fields from a checkout form without trusting any total. */
export function readAddress(formData: FormData): AddressInput {
  return {
    recipientName: String(formData.get('recipientName') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    division: String(formData.get('division') ?? ''),
    district: String(formData.get('district') ?? ''),
    upazila: String(formData.get('upazila') ?? ''),
    area: String(formData.get('area') ?? ''),
    addressLine: String(formData.get('addressLine') ?? ''),
    postcode: String(formData.get('postcode') ?? ''),
    landmark: String(formData.get('landmark') ?? ''),
    label: String(formData.get('label') ?? ''),
  };
}
