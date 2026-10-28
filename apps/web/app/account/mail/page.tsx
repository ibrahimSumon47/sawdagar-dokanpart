import type { Metadata } from 'next';
import { requireViewer } from '../../../features/auth/session';
import { MailOutboxList } from '../../../features/checkout/components/MailOutboxList';
import { getMailForUser } from '../../../features/checkout/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.mail.title, description: copy.mail.description };
}

/** In-app replacement for a transactional email inbox. */
export default async function MailOutboxPage() {
  const viewer = await requireViewer('/account/mail');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const messages = await getMailForUser(viewer.id);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-serif text-title leading-tight text-ink">{copy.mail.title}</h1>
        <p className="mt-2 text-ink-muted">{copy.mail.description}</p>
      </header>
      <div className="mt-8">
        <MailOutboxList messages={messages} copy={copy.mail} locale={locale} />
      </div>
    </div>
  );
}
