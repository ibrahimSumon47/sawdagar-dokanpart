import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard, ResetPasswordForm } from '../../features/auth/components';
import { authCopyFor } from '../../features/auth/copy';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.auth.resetTitle, description: copy.auth.resetBody };
}

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

/** Sets a new password when the link carries a token. */
export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;
  const copy = getDictionary(await getLocale());

  return (
    <AuthCard
      title={copy.auth.resetTitle}
      description={copy.auth.resetBody}
      footer={
        <Link
          href="/forgot-password"
          className="font-semibold text-accent underline underline-offset-2"
        >
          {copy.auth.forgot}
        </Link>
      }
    >
      {token ? (
        <ResetPasswordForm copy={authCopyFor(copy)} token={token} />
      ) : (
        <p role="alert" className="text-sm text-danger">
          {copy.auth.resetInvalid}
        </p>
      )}
    </AuthCard>
  );
}
