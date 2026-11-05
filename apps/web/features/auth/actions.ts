'use server';

import { loginSchema, registerSchema, resetPasswordSchema, resetRequestSchema } from '@sd/domain';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { randomUUID } from 'node:crypto';
import { getAuth } from '../../lib/auth';
import { getPrisma } from '../../lib/prisma';
import { mergeGuestCartIntoUser } from '../shop/cartMutations';
import { recordAuditLog, requestDetails } from './audit';
import { safeNextPath } from './safeNextPath';
import { isAuthConfigured } from './session';
import type { AuthFormState } from './state';

function fieldErrorsFrom(error: {
  issues: readonly { path: readonly PropertyKey[]; message: string }[];
}): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}

/** True when Better Auth rejected the request for too many attempts. */
function isRateLimited(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const status =
    (error as { status?: unknown }).status ?? (error as { statusCode?: unknown }).statusCode;
  return Number(status) === 429;
}

/** Revokes the current session and returns to the storefront. */
export async function signOut(): Promise<void> {
  await getAuth().api.signOut({ headers: await headers() });
  redirect('/');
}

/**
 * Signs in with email and password through Better Auth's normal endpoint.
 *
 * The message is the same for an unknown address and a wrong password so the
 * form cannot be used to enumerate registered accounts.
 */
export async function signInAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email') ?? '',
    password: formData.get('password') ?? '',
    remember: formData.get('remember') === 'on',
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };
  if (!isAuthConfigured()) return { error: 'notConfigured' };

  const nextPath = safeNextPath(formData.get('next'));
  const requestHeaders = await headers();

  try {
    const result = await getAuth().api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        rememberMe: parsed.data.remember,
      },
      headers: requestHeaders,
    });
    const details = requestDetails(requestHeaders);
    await mergeGuestCartIntoUser(result.user.id);
    await recordAuditLog({
      actorUserId: result.user.id,
      actorEmail: result.user.email,
      action: 'auth.sign_in',
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
    });
  } catch (error) {
    if (isRateLimited(error)) return { error: 'tooManyAttempts' };
    return { error: 'invalidCredentials' };
  }

  redirect(nextPath);
}

/**
 * Creates a real account from the registration form.
 *
 * Better Auth writes the user and hashes the password; this action adds the
 * phone, the terms timestamp, an optional seller application and an audit row
 * before asking Better Auth to send the verification mail into the outbox.
 */
export async function registerAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') ?? '',
    password: formData.get('password') ?? '',
    confirmPassword: formData.get('confirmPassword') ?? '',
    role: formData.get('role') ?? 'buyer',
    acceptTerms: formData.get('acceptTerms') === 'on',
    businessName: formData.get('businessName') ?? '',
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };
  if (!isAuthConfigured()) return { error: 'notConfigured' };

  const input = parsed.data;
  // `superRefine` rejects a null phone, so this only narrows the type.
  if (!input.phone) return { fieldErrors: { phone: 'phone-invalid' } };
  const phone = input.phone;
  const prisma = getPrisma();
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { phone }] },
    select: { id: true },
  });
  // The same answer either way, so registration cannot reveal an address.
  if (existing) return { error: 'emailTaken' };

  const requestHeaders = await headers();
  const details = requestDetails(requestHeaders);

  let userId: string;
  try {
    const result = await getAuth().api.signUpEmail({
      body: { email: input.email, password: input.password, name: input.name },
      headers: requestHeaders,
    });
    userId = result.user.id;
  } catch (error) {
    if (isRateLimited(error)) return { error: 'tooManyAttempts' };
    return { error: 'emailTaken' };
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        phone,
        termsAcceptedAt: new Date(),
        role: input.role === 'seller' ? 'vendor_owner' : 'buyer',
      },
    });
    await tx.profile.upsert({
      where: { userId },
      create: { id: randomUUID(), userId },
      update: {},
    });
    if (input.role === 'seller') {
      await tx.sellerApplication.create({
        data: {
          id: randomUUID(),
          userId,
          businessName: (input.businessName ?? '').trim(),
          phone,
        },
      });
      // The owner only gets the seller role once an admin approves the shop.
      await tx.user.update({ where: { id: userId }, data: { role: 'buyer' } });
    }
  });

  await recordAuditLog({
    actorUserId: userId,
    actorEmail: input.email,
    action: input.role === 'seller' ? 'auth.register_seller' : 'auth.register',
    targetType: 'user',
    targetId: userId,
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
  });

  // The verification mail is sent by Better Auth's sendOnSignUp hook.
  redirect(`/verify-email?email=${encodeURIComponent(input.email)}`);
}

/** Queues a reset link. Always reports success so addresses cannot be probed. */
export async function requestPasswordResetAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resetRequestSchema.safeParse({ email: formData.get('email') ?? '' });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };
  if (!isAuthConfigured()) return { error: 'notConfigured' };

  try {
    await getAuth().api.requestPasswordReset({
      body: { email: parsed.data.email, redirectTo: '/reset-password' },
    });
  } catch (error) {
    if (isRateLimited(error)) return { error: 'tooManyAttempts' };
  }

  return { sent: true };
}

/** Completes a reset with the token from the emailed link. */
export async function resetPasswordAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get('token') ?? '',
    password: formData.get('password') ?? '',
    confirmPassword: formData.get('confirmPassword') ?? '',
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };
  if (!isAuthConfigured()) return { error: 'notConfigured' };

  try {
    await getAuth().api.resetPassword({
      body: { newPassword: parsed.data.password, token: parsed.data.token },
    });
  } catch {
    return { error: 'resetInvalid' };
  }

  redirect('/login?reset=1');
}

/** Sends a fresh verification link to the signed-in account. */
export async function resendVerificationAction(): Promise<void> {
  if (!isAuthConfigured()) return;
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session || session.user.emailVerified) return;

  await getAuth().api.sendVerificationEmail({
    body: { email: session.user.email, callbackURL: '/verify-email' },
    headers: requestHeaders,
  });
  redirect('/verify-email?sent=1');
}

/**
 * Changes the password of the signed-in user.
 *
 * Better Auth revokes every other session, which is why the form explains that
 * other devices are signed out.
 */
export async function changePasswordAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!isAuthConfigured()) return { error: 'notConfigured' };
  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (newPassword.length < 10) return { fieldErrors: { newPassword: 'passwordShort' } };
  if (newPassword !== confirmPassword) {
    return { fieldErrors: { confirmPassword: 'passwordMismatch' } };
  }

  try {
    await getAuth().api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions: true },
      headers: await headers(),
    });
  } catch {
    return { error: 'passwordWrong' };
  }

  return { saved: true };
}
