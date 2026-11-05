import type { Metadata } from 'next';
import { SecurityPanel } from '../../../features/auth/components';
import { requireViewer } from '../../../features/auth/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.auth.securityTitle, description: copy.auth.securityBody };
}

/** Password change and verification status for the signed-in account. */
export default async function AccountSecurityPage() {
  const viewer = await requireViewer('/account/security');
  const copy = getDictionary(await getLocale());

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-serif text-3xl leading-tight text-ink">{copy.auth.securityTitle}</h1>
        <p className="mt-2 text-sm text-ink-muted">{copy.auth.securityBody}</p>
      </header>
      <div className="mt-8">
        <SecurityPanel copy={copy} email={viewer.email} verified={viewer.emailVerified} />
      </div>
    </div>
  );
}
