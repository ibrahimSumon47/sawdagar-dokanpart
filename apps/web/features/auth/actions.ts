'use server';

import { findDemoAccount } from '@sd/domain';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth } from '../../lib/auth';
import { recordAuditLog, requestDetails } from './audit';
import { safeNextPath } from './safeNextPath';
import { isAuthConfigured } from './session';

export type DemoSignInError = 'unknown' | 'not-configured' | 'failed';

/** Revokes the current session and returns to the storefront. */
export async function signOut(): Promise<void> {
  await getAuth().api.signOut({ headers: await headers() });
  redirect('/');
}

/**
 * Opens one allowlisted demo account. The role is inferred from the email on
 * the server, never from a hidden field, and the destination is restricted to
 * an internal path.
 */
export async function signInWithDemo(formData: FormData): Promise<void> {
  const nextPath = safeNextPath(formData.get('next'));
  const account = findDemoAccount(formData.get('email'));

  if (!account) redirect(`/sign-in?error=unknown&next=${encodeURIComponent(nextPath)}`);

  const password = process.env.DEMO_ACCOUNT_PASSWORD;
  if (!isAuthConfigured() || !password) {
    redirect(`/sign-in?error=not-configured&next=${encodeURIComponent(nextPath)}`);
  }

  const requestHeaders = await headers();

  try {
    const result = await getAuth().api.signInEmail({
      body: { email: account.email, password },
      headers: requestHeaders,
    });
    const details = requestDetails(requestHeaders);

    await recordAuditLog({
      actorUserId: result.user.id,
      actorEmail: result.user.email,
      action: 'auth.demo_sign_in',
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      metadata: { role: account.role },
    });
  } catch {
    redirect(`/sign-in?error=failed&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}
