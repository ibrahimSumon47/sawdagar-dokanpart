import type { Dictionary } from '../../../../i18n';
import { mediaCredits } from '../../../catalog/mediaCredits';

export interface MediaCreditsViewProps {
  copy: Dictionary['credits'];
}

/** Photograph attribution for every department image used in the catalog. */
export function MediaCreditsView({ copy }: MediaCreditsViewProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">{copy.eyebrow}</p>
        <h1 className="mt-3 font-serif text-title leading-tight text-ink">{copy.title}</h1>
        <p className="mt-3 text-ink-muted">{copy.description}</p>
      </header>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {mediaCredits.map((credit) => (
          <li
            key={credit.slug}
            className="overflow-hidden rounded-sm border border-line bg-surface"
          >
            <img
              src={credit.file}
              alt={`${credit.label} photograph`}
              width={960}
              height={720}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="p-4 text-sm">
              <p className="font-medium text-ink">{credit.label}</p>
              <dl className="mt-2 space-y-1 text-xs text-ink-muted">
                <div>
                  <dt className="inline">{copy.author}: </dt>
                  <dd className="inline">{credit.author}</dd>
                </div>
                <div>
                  <dt className="inline">{copy.license}: </dt>
                  <dd className="inline">{credit.license}</dd>
                </div>
              </dl>
              <a
                href={credit.source}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-block text-xs text-accent hover:underline"
              >
                {copy.source}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
