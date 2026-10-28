import { districts, divisions, findDivisionForDistrict } from '@sd/domain';
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
    }
  });

export type AddressInput = z.infer<typeof addressSchema>;

/** Payment choices implemented by this demo. */
export const paymentMethodSchema = z.enum(['cod', 'mockpay']);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

/** The checkout form fields that are always present. */
export const checkoutFormSchema = z.object({
  paymentMethod: paymentMethodSchema,
  addressId: z.string().trim().max(120),
  notes: z.string().trim().max(300),
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
    label: String(formData.get('label') ?? ''),
  };
}
