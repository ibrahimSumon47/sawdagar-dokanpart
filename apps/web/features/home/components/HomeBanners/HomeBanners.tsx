import { ButtonLink } from '@sd/ui';
import type { Locale } from '../../../../i18n';
import type { CmsSectionRecord } from '../../../content/sectionQueries';
import { pageLayout } from '../../../shell/pageLayout';

export interface HomeBannersProps {
  /** Published banner sections, already in display order. */
  banners: readonly CmsSectionRecord[];
  locale: Locale;
}

/** CMS banners shown between the opening block and the catalog. */
export function HomeBanners({ banners, locale }: HomeBannersProps) {
  if (banners.length === 0) return null;

  return (
    <section className={pageLayout.sectionTight}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {banners.map((banner) => {
          const title = locale === 'bn' ? banner.titleBn : banner.titleEn;
          const body = locale === 'bn' ? banner.bodyBn : banner.bodyEn;
          const ctaLabel = locale === 'bn' ? banner.ctaLabelBn : banner.ctaLabelEn;

          return (
            <li
              key={banner.id}
              className="flex flex-col overflow-hidden rounded-sm border border-line bg-surface"
            >
              {banner.imageUrl ? (
                <img
                  src={banner.imageUrl}
                  alt={title}
                  width={640}
                  height={280}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-serif text-xl leading-snug text-ink">{title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{body}</p>
                {ctaLabel && banner.ctaHref ? (
                  <div className="mt-4">
                    <ButtonLink href={banner.ctaHref} variant="secondary" size="sm">
                      {ctaLabel}
                    </ButtonLink>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
