import { describe, expect, it } from 'vitest';
import {
  isBdPhone,
  loginSchema,
  normalizeBdPhone,
  passwordStrength,
  registerSchema,
} from './credentials';

const validRegistration = {
  name: 'Rabiul Hasan',
  email: 'Rabiul@Example.com',
  phone: '01712 345678',
  password: 'handloom-thread-2026',
  confirmPassword: 'handloom-thread-2026',
  role: 'buyer' as const,
  acceptTerms: true as const,
};

describe('normalizeBdPhone', () => {
  it('accepts the local shape with spaces and the international shape', () => {
    expect(normalizeBdPhone('01712 345678')).toBe('+8801712345678');
    expect(normalizeBdPhone('+8801712345678')).toBe('+8801712345678');
    expect(normalizeBdPhone('880-1712-345678')).toBe('+8801712345678');
  });

  it('rejects numbers outside the mobile pattern', () => {
    expect(normalizeBdPhone('0123456789')).toBeNull();
    expect(normalizeBdPhone('+88001712345678')).toBeNull();
    expect(isBdPhone('not a phone')).toBe(false);
  });
});

describe('passwordStrength', () => {
  it('marks a short password as weak and not long enough', () => {
    const result = passwordStrength('abc123');
    expect(result.longEnough).toBe(false);
    expect(result.label).toBe('weak');
  });

  it('rewards length, case, digits and symbols', () => {
    expect(passwordStrength('handloomthread').label).toBe('fair');
    expect(passwordStrength('Handloom-Thread-2026').label).toBe('strong');
  });
});

describe('registerSchema', () => {
  it('normalises the email and phone and accepts a matching password', () => {
    const parsed = registerSchema.parse(validRegistration);
    expect(parsed.email).toBe('rabiul@example.com');
    expect(parsed.phone).toBe('+8801712345678');
  });

  it('rejects a missing terms acceptance, a bad phone and mismatched passwords', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      acceptTerms: false,
      phone: '12345',
      confirmPassword: 'other-password',
    });
    expect(result.success).toBe(false);
    const paths = result.success ? [] : result.error.issues.map((issue) => issue.path[0]);
    expect(paths).toEqual(expect.arrayContaining(['acceptTerms', 'phone', 'confirmPassword']));
  });

  it('requires a business name when applying to sell', () => {
    const result = registerSchema.safeParse({ ...validRegistration, role: 'seller' });
    expect(result.success).toBe(false);
    expect(result.success ? [] : result.error.issues[0]?.path).toEqual(['businessName']);
  });
});

describe('loginSchema', () => {
  it('lowercases the email and keeps the password verbatim', () => {
    const parsed = loginSchema.parse({
      email: ' Buyer@Example.com ',
      password: ' pass word ',
      remember: true,
    });
    expect(parsed.email).toBe('buyer@example.com');
    expect(parsed.password).toBe(' pass word ');
  });
});
