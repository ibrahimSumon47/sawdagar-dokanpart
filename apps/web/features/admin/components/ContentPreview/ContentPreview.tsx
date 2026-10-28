import type { Dictionary, Locale } from '../../../../i18n';
import { ArticleBody } from '../../../content/components/ArticleBody';
import type { CmsEntryRecord } from '../../../content';

export interface ContentPreviewProps {
  entry: CmsEntryRecord | null;
  copy: Dictionary['admin'];
  locale: Locale;
}

/** Shows the stored entry as it will read on the storefront. */
export function ContentPreview({ entry, copy, locale }: ContentPreviewProps) {
  return (
    <section className="rounded-sm border border-line bg-surface p-4">
      <h2 className="font-serif text-lg text-ink">{copy.previewTitle}</h2>
      <p className="mt-1 text-xs text-ink-muted">{copy.previewNote}</p>
      {entry ? (
        <article className="mt-4 border-t border-line pt-4">
          <h3 className="font-serif text-xl leading-tight text-ink">
            {locale === 'bn' ? entry.titleBn : entry.titleEn}
          </h3>
          {entry.excerptEn || entry.excerptBn ? (
            <p className="mt-2 text-sm text-ink-muted">
              {locale === 'bn' ? entry.excerptBn : entry.excerptEn}
            </p>
          ) : null}
          <div className="mt-3 max-h-96 overflow-y-auto">
            <ArticleBody body={locale === 'bn' ? entry.bodyBn : entry.bodyEn} />
          </div>
        </article>
      ) : (
        <p className="mt-3 text-sm text-ink-muted">{copy.noContent}</p>
      )}
    </section>
  );
}
