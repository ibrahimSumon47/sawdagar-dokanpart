import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AuthCard, RegisterForm } from '../../features/auth/components';
import { authCopyFor } from '../../features/auth/copy';
import { getViewer, isAuthConfigured } from '../../features/auth/session';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.auth.registerTitle, description: copy.auth.registerBody };
}

/** Creates a real buyer account or a seller application. */
export default async function RegisterPage() {
  if (await getViewer()) redirect('/account');

  const copy = getDictionary(await getLocale());

  return (
    <AuthCard
      title={copy.auth.registerTitle}
      description={copy.auth.registerBody}
      footer={
        <>
          {copy.auth.haveAccount}{' '}
          <Link href="/login" className="font-semibold text-accent underline underline-offset-2">
            {copy.auth.signIn}
          </Link>
        </>
      }
    >
      <RegisterForm copy={authCopyFor(copy)} configured={isAuthConfigured()} />
    </AuthCard>
  );
}
