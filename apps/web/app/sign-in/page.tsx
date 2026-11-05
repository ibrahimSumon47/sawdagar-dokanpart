import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { safeNextPath } from '../../features/auth/safeNextPath';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.auth.loginTitle, description: copy.auth.loginBody };
}

interface SignInPageProps {
  searchParams: Promise<{ next?: string }>;
}

/** Keeps old links working after the sign-in page moved to `/login`. */
export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next } = await searchParams;
  redirect(`/login?next=${encodeURIComponent(safeNextPath(next))}`);
}
