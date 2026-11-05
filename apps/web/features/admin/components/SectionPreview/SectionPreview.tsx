import type { Dictionary, Locale } from '../../../../i18n';
import type { CmsSectionRecord } from '../../../content/sectionQueries';

export interface SectionPreviewProps {
  /** Saved section shown as the visitor would read it. */
  section: CmsSectionRecord;
  copy: Dictionary['admin'];
  /** Language the preview is written in. */
  locale: Locale;
}

/** Read-only preview of a homepage section, shown beside the editor. */
export function SectionPreview({ section, copy, locale }: SectionPreviewProps) {
  const title = locale === 'bn' ? section.titleBn : section.titleEn;
  const body = locale === 'bn' ? section.bodyBn : section.bodyEn;
  const ctaLabel = locale === 'bn' ? section.ctaLabelBn : section.ctaLabelEn;
  const kindLabel = {
    hero: copy.kindHero,
    collections: copy.kindCollections,
    banner: copy.kindBanner,
  };

  return (
    <section className="rounded-sm border border-line bg-surface p-4">
      <h2 className="font-serif text-lg text-ink">{copy.previewTitle}</h2>
      <p className="mt-1 text-xs text-ink-muted">{copy.sectionPreviewNote}</p>
      <div className="mt-3 overflow-hidden rounded-sm border border-line bg-background p-4">
        {section.imageUrl ? (
          <img
            src={section.imageUrl}
            alt={title}
            width={640}
            height={320}
            className="mb-3 h-32 w-full object-cover"
          />
        ) : null}
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {kindLabel[section.kind]}
        </p>
        <p className="mt-2 font-serif text-xl leading-snug text-ink">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
        {ctaLabel && section.ctaHref ? (
          <p className="mt-3 text-sm font-semibold text-accent">
            {ctaLabel} → {section.ctaHref}
          </p>
        ) : null}
      </div>
    </section>
  );
}
