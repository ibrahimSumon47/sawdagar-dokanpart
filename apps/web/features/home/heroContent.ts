import type { Dictionary, Locale } from '../../i18n';
import type { CmsSectionRecord } from '../content/sectionQueries';

/** Everything the opening block on the home page shows. */
export interface HomeHeroContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  /** CMS image when the hero has one; the department photo is used otherwise. */
  imageUrl: string | null;
}

/**
 * Builds the opening block from the published CMS hero, falling back to the
 * dictionary copy when no hero is published. Keeping the fallback here means
 * the storefront looks complete before the first hero is written.
 */
export function homeHeroContent(
  hero: CmsSectionRecord | null,
  copy: Dictionary,
  locale: Locale,
): HomeHeroContent {
  if (!hero) {
    return {
      eyebrow: copy.home.eyebrow,
      title: copy.home.title,
      description: copy.home.description,
      primaryLabel: copy.home.primaryCta,
      primaryHref: '/catalog',
      imageUrl: null,
    };
  }

  const ctaLabel = locale === 'bn' ? hero.ctaLabelBn : hero.ctaLabelEn;

  return {
    eyebrow: copy.home.eyebrow,
    title: locale === 'bn' ? hero.titleBn : hero.titleEn,
    description: locale === 'bn' ? hero.bodyBn : hero.bodyEn,
    primaryLabel: ctaLabel || copy.home.primaryCta,
    primaryHref: hero.ctaHref ?? '/catalog',
    imageUrl: hero.imageUrl ?? null,
  };
}
