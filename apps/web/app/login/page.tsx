import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AuthCard, LoginForm } from '../../features/auth/components';
import { safeNextPath } from '../../features/auth/safeNextPath';
import { getViewer, isAuthConfigured } from '../../features/auth/session';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.auth.loginTitle, description: copy.auth.loginBody };
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string; reset?: string }>;
}

/** Email and password sign-in. */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  if (await getViewer()) redirect(next);

  const copy = getDictionary(await getLocale());

  return (
    <AuthCard
      title={copy.auth.loginTitle}
      description={copy.auth.loginBody}
      footer={
        <>
          {copy.auth.noAccount}{' '}
          <Link href="/register" className="font-semibold text-accent underline underline-offset-2">
            {copy.auth.createAccount}
          </Link>
        </>
      }
    >
      <LoginForm
        copy={copy}
        next={next}
        configured={isAuthConfigured()}
        resetDone={params.reset === '1'}
      />
    </AuthCard>
  );
}
