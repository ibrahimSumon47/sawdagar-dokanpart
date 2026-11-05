import type { Metadata } from 'next';
import { AuthCard, ForgotPasswordForm } from '../../features/auth/components';
import { authCopyFor } from '../../features/auth/copy';
import Link from 'next/link';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.auth.forgotTitle, description: copy.auth.forgotBody };
}

/** Asks for the address and queues a reset link. */
export default async function ForgotPasswordPage() {
  const copy = getDictionary(await getLocale());

  return (
    <AuthCard
      title={copy.auth.forgotTitle}
      description={copy.auth.forgotBody}
      footer={
        <Link href="/login" className="font-semibold text-accent underline underline-offset-2">
          {copy.auth.signIn}
        </Link>
      }
    >
      <ForgotPasswordForm copy={authCopyFor(copy)} />
    </AuthCard>
  );
}
