import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonStyles } from '@sd/ui';
import { getViewer } from '../../features/auth/session';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.forbidden.title, description: copy.forbidden.description };
}

/** Explains that the signed-in role does not include the requested area. */
export default async function ForbiddenPage() {
  const copy = getDictionary(await getLocale());
  const viewer = await getViewer();

  return (
    <div className="mx-auto flex min-h-[60svh] w-full max-w-3xl flex-col items-start justify-center gap-4 px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">403</p>
      <h1 className="font-serif text-display leading-tight text-ink">{copy.forbidden.title}</h1>
      <p className="max-w-xl text-lead leading-relaxed text-ink-muted">
        {copy.forbidden.description}
      </p>
      <div className="flex flex-wrap gap-3">
        {viewer ? (
          <Link href="/account" className={buttonStyles()}>
            {copy.forbidden.account}
          </Link>
        ) : null}
        <Link href="/" className={buttonStyles({ variant: 'secondary' })}>
          {copy.forbidden.home}
        </Link>
      </div>
    </div>
  );
}
