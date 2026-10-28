import { describe, expect, it } from 'vitest';
import { addressSchema, readAddress } from './inputs';

function address(overrides: Record<string, string> = {}) {
  return {
    recipientName: 'Nusrat Jahan',
    phone: '01712345678',
    division: 'Dhaka',
    district: 'Tangail',
    upazila: 'Tangail Sadar',
    area: 'Santosh',
    addressLine: 'House 12, Road 4, near the bazaar',
    label: '',
    ...overrides,
  };
}

describe('checkout address validation', () => {
  it('accepts a coherent division, district and phone', () => {
    const result = addressSchema.safeParse(address());
    expect(result.success).toBe(true);
  });

  it('rejects a district from another division', () => {
    const result = addressSchema.safeParse(address({ district: 'Sylhet' }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['district']);
    }
  });

  it('rejects an invalid Bangladeshi mobile number', () => {
    expect(addressSchema.safeParse(address({ phone: '12345' })).success).toBe(false);
    expect(addressSchema.safeParse(address({ phone: '+8801712345678' })).success).toBe(true);
  });

  it('reads only the known fields from a form', () => {
    const form = new FormData();
    form.set('recipientName', 'Nusrat Jahan');
    form.set('phone', '01712345678');
    form.set('division', 'Dhaka');
    form.set('district', 'Tangail');
    form.set('upazila', 'Tangail Sadar');
    form.set('addressLine', 'House 12, Road 4');
    form.set('priceMinor', '1');

    const value = readAddress(form);
    expect(value).not.toHaveProperty('priceMinor');
    expect(value.addressLine).toBe('House 12, Road 4');
  });
});
