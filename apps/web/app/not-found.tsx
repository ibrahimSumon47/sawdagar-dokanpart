import { ButtonLink } from '@sd/ui';
import { getDictionary } from '../i18n';
import { getLocale } from '../i18n/getLocale';

/** Shared 404 for unknown routes and products that are no longer in the catalog. */
export default async function NotFoundPage() {
  const copy = getDictionary(await getLocale());

  return (
    <div className="mx-auto flex min-h-[60svh] w-full max-w-3xl flex-col items-start justify-center gap-4 px-4 py-16 sm:px-6">
      <p className="font-serif text-5xl tabular-nums text-accent">404</p>
      <h1 className="font-serif text-3xl text-ink">{copy.notFound.title}</h1>
      <p className="max-w-lg text-ink-muted">{copy.notFound.description}</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/catalog">{copy.notFound.catalog}</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          {copy.notFound.home}
        </ButtonLink>
      </div>
    </div>
  );
}
