import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';

export interface TagFilterProps {
  /** Tag slugs with the number of published posts using each. */
  tags: readonly { tag: string; count: number }[];
  /** The tag currently filtering the index, or null for all posts. */
  activeTag: string | null;
  copy: Dictionary;
}

const chipClass = 'rounded-full border px-3 py-1 text-sm transition-colors';
const idleClass = 'border-line text-ink-muted hover:border-accent hover:text-accent';
const activeClass = 'border-accent bg-accent text-surface';

/** Row of tag links that narrows the Journal index to one topic. */
export function TagFilter({ tags, activeTag, copy }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <nav aria-label={copy.content.filterByTag} className="mt-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/journal"
            aria-current={activeTag === null ? 'page' : undefined}
            className={`${chipClass} ${activeTag === null ? activeClass : idleClass}`}
          >
            {copy.content.allTags}
          </Link>
        </li>
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <Link
              href={`/journal?tag=${tag}`}
              aria-current={activeTag === tag ? 'page' : undefined}
              className={`${chipClass} ${activeTag === tag ? activeClass : idleClass}`}
            >
              {tag.replace(/-/g, ' ')}
              <span className="ml-1.5 text-xs opacity-70">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
