import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';

export interface HelpSearchFormProps {
  /** Phrase currently searched for, or an empty string. */
  query: string;
  /** Category filter kept when the visitor searches again. */
  categorySlug: string | null;
  copy: Dictionary['content'];
}

/** Plain GET form so search works without JavaScript. */
export function HelpSearchForm({ query, categorySlug, copy }: HelpSearchFormProps) {
  return (
    <form action="/help" method="get" role="search" className="flex flex-wrap items-end gap-2">
      <label className="min-w-0 flex-1 text-xs font-semibold text-ink">
        {copy.helpSearchLabel}
        <input
          type="search"
          name="q"
          defaultValue={query}
          maxLength={80}
          placeholder={copy.helpSearchPlaceholder}
          className="mt-1 block min-h-10 w-full rounded-sm border border-line bg-background px-3 py-1.5 text-sm text-ink"
        />
      </label>
      {categorySlug ? <input type="hidden" name="category" value={categorySlug} /> : null}
      <button
        type="submit"
        className="min-h-10 rounded-sm bg-accent px-4 text-sm font-semibold text-accent-contrast"
      >
        {copy.helpSearchSubmit}
      </button>
      {query || categorySlug ? (
        <Link href="/help" className="min-h-10 px-2 py-2 text-sm text-accent underline">
          {copy.helpSearchClear}
        </Link>
      ) : null}
    </form>
  );
}
