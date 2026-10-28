import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignInPanel } from '../../features/auth/components/SignInPanel';
import { safeNextPath } from '../../features/auth/safeNextPath';
import { getViewer, isAuthConfigured } from '../../features/auth/session';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';
import type { DemoSignInError } from '../../features/auth/actions';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.signIn.title, description: copy.signIn.description };
}

const errors = ['unknown', 'failed', 'not-configured'] as const;

function parseError(value: string | undefined): DemoSignInError | undefined {
  return errors.find((error) => error === value);
}

interface SignInPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

/** Public entry point for the demo sign-in buttons. */
export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const viewer = await getViewer();
  if (viewer) redirect(next);

  const copy = getDictionary(await getLocale());

  return (
    <SignInPanel
      copy={copy}
      next={next}
      configured={isAuthConfigured()}
      error={parseError(params.error)}
    />
  );
}
