'use client';

import type { ContentKind } from '../../../content';
import type { HelpCategoryRecord } from '../../../content/helpCategoryQueries';
import type { CategoryLanguage } from '../../../content/helpCategoryTypes';
import { HelpCategorySelect } from '../HelpCategorySelect';
import type { CmsEditorCopy } from './editorCopy';
import { controlClass, labelClass } from './fieldStyles';

export interface ContentIdentityFieldsProps {
  /** Selected content area. */
  kind: ContentKind;
  onKindChange: (kind: ContentKind) => void;
  /** Slug already stored, or empty for a new entry. */
  slug: string;
  /** Category already chosen for a Help article, or null. */
  helpCategoryId: string | null;
  categories: readonly HelpCategoryRecord[];
  copy: CmsEditorCopy;
  locale: CategoryLanguage;
}

/** Content area, slug and, for Help articles, the category it belongs to. */
export function ContentIdentityFields({
  kind,
  onKindChange,
  slug,
  helpCategoryId,
  categories,
  copy,
  locale,
}: ContentIdentityFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {copy.kindLabel}
          <select
            name="kind"
            value={kind}
            onChange={(event) => onKindChange(event.target.value as ContentKind)}
            className={controlClass}
          >
            <option value="page">{copy.kindPage}</option>
            <option value="help">{copy.kindHelp}</option>
            <option value="journal">{copy.kindJournal}</option>
          </select>
        </label>
        <label className={labelClass}>
          {copy.slugLabel}
          <input
            type="text"
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            defaultValue={slug}
            className={controlClass}
          />
        </label>
      </div>

      {kind === 'help' ? (
        <HelpCategorySelect
          categories={[...categories]}
          selectedId={helpCategoryId}
          label={copy.helpCategoryLabel}
          noneLabel={copy.helpCategoryNone}
          hint={copy.helpCategoryHint}
          locale={locale}
        />
      ) : null}
    </div>
  );
}
