import { ButtonLink, JamdaniPattern, SectionHeading } from '@sd/ui';
import { TrustStrip } from '../features/shell/components/TrustStrip';
import { getDictionary } from '../i18n';
import { getLocale } from '../i18n/getLocale';
import { site } from '../lib/site';

/** Marketing-free introduction to the demonstration and the current phase. */
export default async function HomePage() {
  const copy = getDictionary(await getLocale());

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {copy.home.eyebrow}
            </p>
            <h1 className="mt-4 text-hero font-serif leading-[1.02] tracking-tight text-ink">
              {copy.home.title}
            </h1>
            <p className="mt-6 max-w-xl text-lead leading-relaxed text-ink-muted">
              {copy.home.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/design">{copy.home.primaryCta}</ButtonLink>
              <ButtonLink href={site.repositoryUrl} variant="secondary">
                {copy.home.secondaryCta}
              </ButtonLink>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-accent/10 text-accent sm:aspect-[5/4] lg:aspect-[4/5]"
          >
            <JamdaniPattern className="opacity-70" />
            <div className="absolute inset-x-0 bottom-0 border-t border-line bg-surface/95 p-4 text-ink backdrop-blur">
              <p className="font-serif text-lg">{copy.common.brand}</p>
              <p className="text-xs text-ink-muted">{copy.common.demoNotice}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TrustStrip points={copy.home.trust} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={copy.home.statusEyebrow}
          title={copy.home.statusTitle}
          description={copy.home.statusBody}
          action={
            <ButtonLink href={site.repositoryUrl} variant="ghost">
              {copy.home.statusLink}
            </ButtonLink>
          }
        />
      </section>
    </>
  );
}
