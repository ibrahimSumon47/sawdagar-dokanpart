import type { Metadata } from 'next';
import { AuthCard, VerifyEmailPanel } from '../../features/auth/components';
import Link from 'next/link';
import { getViewer } from '../../features/auth/session';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.auth.verifyTitle, description: copy.auth.verifyBody };
}

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string; sent?: string; error?: string }>;
}

/**
 * Shows whether the address is verified.
 *
 * Better Auth's link redirects here after it sets `emailVerified`, so the page
 * only reports the outcome; it never verifies a token itself.
 */
export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const viewer = await getViewer();
  const copy = getDictionary(await getLocale());

  return (
    <AuthCard
      title={copy.auth.verifyTitle}
      description={copy.auth.verifyBody}
      footer={
        viewer ? (
          <Link
            href="/account/security"
            className="font-semibold text-accent underline underline-offset-2"
          >
            {copy.auth.securityTitle}
          </Link>
        ) : (
          <Link href="/login" className="font-semibold text-accent underline underline-offset-2">
            {copy.auth.signIn}
          </Link>
        )
      }
    >
      <VerifyEmailPanel
        copy={copy}
        email={params.email ?? viewer?.email}
        verified={viewer?.emailVerified}
        justSent={params.sent === '1'}
        invalid={Boolean(params.error)}
      />
    </AuthCard>
  );
}
