import type { Dictionary, Locale } from '../../../../i18n';
import { ActionSection } from '../ActionSection';
import { FeedbackSection } from '../FeedbackSection';
import { NavigationSection } from '../NavigationSection';
import { SkeletonSection } from '../SkeletonSection';
import { ThemeSection } from '../ThemeSection';
import { TokenSection } from '../TokenSection';
import { WidthSection } from '../WidthSection';

export interface DesignGalleryProps {
  copy: Dictionary;
  locale: Locale;
}

/** Full component gallery for Phase 1: tokens, states, themes and widths. */
export function DesignGallery({ copy, locale }: DesignGalleryProps) {
  const design = copy.design;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {design.eyebrow}
        </p>
        <h1 className="mt-3 text-display font-serif leading-tight text-ink">{design.title}</h1>
        <p className="mt-3 text-lead leading-relaxed text-ink-muted">{design.description}</p>
        <p className="mt-3 text-xs text-ink-muted">{design.sampleNote}</p>
      </header>

      <div className="mt-12 space-y-16">
        <TokenSection copy={design} />
        <ActionSection copy={design} locale={locale} />
        <FeedbackSection copy={design} />
        <ThemeSection copy={design} locale={locale} brand={copy.common.brand} />
        <WidthSection copy={design} locale={locale} brand={copy.common.brand} />
        <SkeletonSection copy={design} locale={locale} />
        <NavigationSection copy={design} locale={locale} />
      </div>
    </div>
  );
}
