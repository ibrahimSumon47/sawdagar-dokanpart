import { z } from 'zod';

/** Minimum password length accepted at registration and password change. */
export const MIN_PASSWORD_LENGTH = 10;

/** Digits-only Bangladeshi mobile number after the country code. */
const BD_MOBILE = /^1[3-9]\d{8}$/;

/**
 * Normalises a Bangladeshi mobile number to `+8801XXXXXXXXX`.
 *
 * The registration form accepts the local `01XXXXXXXXX` shape and the
 * international shape with or without spaces, because people type both. A
 * number that does not match the national mobile pattern returns null so the
 * caller can reject it instead of storing a half-valid phone.
 */
export function normalizeBdPhone(value: string): string | null {
  const digits = value.replace(/[\s()-]/g, '');
  const national = digits.startsWith('+880')
    ? digits.slice(4)
    : digits.startsWith('880')
      ? digits.slice(3)
      : digits.startsWith('0')
        ? digits.slice(1)
        : digits;
  return BD_MOBILE.test(national) ? `+880${national}` : null;
}

/** True when the value is a valid Bangladeshi mobile number in any accepted shape. */
export function isBdPhone(value: string): boolean {
  return normalizeBdPhone(value) !== null;
}

/** One strength band, shown by the meter and stored as a hint only. */
export type PasswordStrength = {
  /** 0 to 4, where 4 is the strongest band. */
  score: 0 | 1 | 2 | 3 | 4;
  /** Names a band the copy can render, for example "fair". */
  label: 'weak' | 'fair' | 'good' | 'strong';
  /** True when the value meets the minimum length. */
  longEnough: boolean;
};

/**
 * Scores a password for the strength meter.
 *
 * The score is advisory: only the length rule is enforced, so a long
 * passphrase is always accepted. It counts length, mixed case, digits and
 * symbols, which is enough to steer people without pretending to be an entropy
 * estimate.
 */
export function passwordStrength(value: string): PasswordStrength {
  const longEnough = value.length >= MIN_PASSWORD_LENGTH;
  let points = 0;
  if (longEnough) points += 1;
  if (value.length >= 14) points += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) points += 1;
  if (/\d/.test(value)) points += 1;
  if (/[^A-Za-z0-9]/.test(value)) points += 1;

  const score = Math.min(4, points) as PasswordStrength['score'];
  const label: PasswordStrength['label'] =
    score <= 1 ? 'weak' : score === 2 ? 'fair' : score === 3 ? 'good' : 'strong';
  return { score, label, longEnough };
}

/** The kind of account a visitor asks for at registration. */
export const signupRoles = ['buyer', 'seller'] as const;

export type SignupRole = (typeof signupRoles)[number];

/**
 * Registration input accepted by the server action.
 *
 * Everything is validated again on the server even though the form mirrors the
 * same rules, because a Server Action can be called without the form.
 */
export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'name-too-short').max(80, 'name-too-long'),
    email: z.string().trim().toLowerCase().email('email-invalid').max(160),
    phone: z.string().trim().transform(normalizeBdPhone),
    password: z.string().min(MIN_PASSWORD_LENGTH, 'password-too-short').max(128),
    confirmPassword: z.string(),
    role: z.enum(signupRoles),
    acceptTerms: z.boolean(),
    businessName: z.string().trim().max(120).optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.acceptTerms) {
      ctx.addIssue({ code: 'custom', path: ['acceptTerms'], message: 'terms-required' });
    }
    if (value.phone === null) {
      ctx.addIssue({ code: 'custom', path: ['phone'], message: 'phone-invalid' });
    }
    if (value.password !== value.confirmPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'password-mismatch' });
    }
    if (value.role === 'seller' && (value.businessName ?? '').length < 2) {
      ctx.addIssue({ code: 'custom', path: ['businessName'], message: 'business-required' });
    }
  });

/** Validated registration values; the phone is already normalised. */
export type RegisterInput = z.infer<typeof registerSchema>;

/** Login input; the password is never trimmed because spaces can be intentional. */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('email-invalid').max(160),
  password: z.string().min(1, 'password-required').max(128),
  remember: z.boolean(),
});

/** Password reset request and completion input. */
export const resetRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email('email-invalid').max(160),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(10, 'token-invalid'),
    password: z.string().min(MIN_PASSWORD_LENGTH, 'password-too-short').max(128),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'password-mismatch',
  });
