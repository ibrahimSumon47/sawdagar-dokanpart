import { ButtonLink } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { departmentPhoto } from '../../../catalog/media';
import type { HomeHeroContent } from '../../heroContent';
import { TrustStrip } from '../../../shell/components/TrustStrip';
import { pageLayout } from '../../../shell/pageLayout';

export interface HomeIntroProps {
  copy: Dictionary;
  locale: Locale;
  /** Opening copy from the published CMS hero, or the dictionary fallback. */
  hero: HomeHeroContent;
}

/** Opening statement and the three delivery promises under the hero. */
export function HomeIntro({ copy, locale, hero }: HomeIntroProps) {
  const heroPhoto = departmentPhoto('handloom', 'home-hero', locale);
  const imageUrl = hero.imageUrl ?? heroPhoto?.src ?? null;

  return (
    <>
      <section className={pageLayout.home}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {hero.eyebrow}
            </p>
            <h1 className="mt-4 text-hero font-serif leading-[1.02] tracking-tight text-ink">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lead leading-relaxed text-ink-muted">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={hero.primaryHref}>{hero.primaryLabel}</ButtonLink>
              <ButtonLink href="/seller" variant="secondary">
                {copy.home.secondaryCta}
              </ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-accent/10 text-accent sm:aspect-[5/4] lg:aspect-[4/5]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={copy.home.heroImageAlt}
                width={800}
                height={600}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 border-t border-line bg-surface/95 p-4 text-ink backdrop-blur">
              <p className="font-serif text-lg">{copy.common.brand}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TrustStrip points={copy.home.trust} />
      </section>
    </>
  );
}
