import { topLevelCategories } from '@sd/domain';
import { MegaMenu } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { GallerySection } from '../GallerySection';

export interface NavigationSectionProps {
  copy: Dictionary['design'];
  locale: Locale;
}

/**
 * Mega menu demo. Links point at the category list further down this page
 * because catalog routes arrive with the seeded catalog in Phase 3.
 */
export function NavigationSection({ copy, locale }: NavigationSectionProps) {
  const links = topLevelCategories.map((category) => ({
    key: category.slug,
    label: category.name[locale],
    href: `#category-${category.slug}`,
  }));

  return (
    <GallerySection
      id="navigation"
      title={copy.navigationTitle}
      description={copy.navigationDescription}
    >
      <div className="rounded-sm border border-line bg-surface p-4">
        <MegaMenu label={copy.categories} links={links} />
      </div>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {topLevelCategories.map((category) => (
          <li
            key={category.slug}
            id={`category-${category.slug}`}
            className="scroll-mt-28 rounded-sm border border-line bg-surface px-3 py-2 text-sm"
          >
            <span className="font-medium text-ink">{category.name[locale]}</span>
            <span className="ml-2 text-xs text-ink-muted">{category.slug}</span>
          </li>
        ))}
      </ul>
    </GallerySection>
  );
}
