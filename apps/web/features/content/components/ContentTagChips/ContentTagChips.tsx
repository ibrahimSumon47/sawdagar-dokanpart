import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';

export interface ContentTagChipsProps {
  /** Tag slugs stored on the entry. */
  tags: readonly string[];
  copy: Dictionary;
  /** Extra classes for the list. */
  className?: string;
  /**
   * Render each tag as a link to the filtered Journal index. Pass false inside a
   * card that is already a link, because one anchor cannot sit inside another.
   */
  linked?: boolean;
}

const chipClass =
  'inline-block rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-muted transition-colors hover:border-accent hover:text-accent';

/** Tag chips for a Journal card or post; links to the index unless told otherwise. */
export function ContentTagChips({
  tags,
  copy,
  className = '',
  linked = true,
}: ContentTagChipsProps) {
  if (tags.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => {
        const label = tag.replace(/-/g, ' ');
        return (
          <li key={tag}>
            {linked ? (
              <Link
                href={`/journal?tag=${tag}`}
                aria-label={`${copy.content.filterByTag}: ${label}`}
                className={chipClass}
              >
                {label}
              </Link>
            ) : (
              <span className={chipClass}>{label}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
