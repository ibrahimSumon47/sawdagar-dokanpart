import type { Dictionary } from '../../../../i18n';
import type { ContentKind, CmsEntryRecord } from '../../../content';
import { instantToDateInput } from '../../../content/urls';

export interface ContentFieldsProps {
  /** Existing entry, or null when creating one. */
  entry: CmsEntryRecord | null;
  /** Area preselected for a new entry. */
  defaultKind: ContentKind;
  copy: Dictionary['admin'];
}

const control =
  'mt-1 block min-h-10 w-full rounded-sm border border-line bg-background px-2 py-1.5 text-sm text-ink';
const area = `${control} min-h-40 leading-relaxed`;
const label = 'text-xs font-semibold text-ink';

/** Text, status and scheduling inputs shared by create and edit. */
export function ContentFields({ entry, defaultKind, copy }: ContentFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.kindLabel}
          <select name="kind" defaultValue={entry?.kind ?? defaultKind} className={control}>
            <option value="page">{copy.kindPage}</option>
            <option value="help">{copy.kindHelp}</option>
            <option value="journal">{copy.kindJournal}</option>
          </select>
        </label>
        <label className={label}>
          {copy.slugLabel}
          <input
            type="text"
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            defaultValue={entry?.slug ?? ''}
            className={control}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.titleEnLabel}
          <input
            type="text"
            name="titleEn"
            required
            maxLength={120}
            defaultValue={entry?.titleEn ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.titleBnLabel}
          <input
            type="text"
            name="titleBn"
            required
            maxLength={120}
            defaultValue={entry?.titleBn ?? ''}
            className={control}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.excerptEnLabel}
          <textarea
            name="excerptEn"
            rows={2}
            maxLength={240}
            defaultValue={entry?.excerptEn ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.excerptBnLabel}
          <textarea
            name="excerptBn"
            rows={2}
            maxLength={240}
            defaultValue={entry?.excerptBn ?? ''}
            className={control}
          />
        </label>
      </div>

      <label className={label}>
        {copy.bodyEnLabel}
        <textarea
          name="bodyEn"
          required
          maxLength={12_000}
          defaultValue={entry?.bodyEn ?? ''}
          className={area}
        />
      </label>
      <label className={label}>
        {copy.bodyBnLabel}
        <textarea
          name="bodyBn"
          required
          maxLength={12_000}
          defaultValue={entry?.bodyBn ?? ''}
          className={area}
        />
      </label>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          SEO
        </legend>
        <label className={label}>
          {copy.seoTitleLabel} · EN
          <input
            type="text"
            name="seoTitleEn"
            maxLength={120}
            defaultValue={entry?.seoTitleEn ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.seoTitleLabel} · BN
          <input
            type="text"
            name="seoTitleBn"
            maxLength={120}
            defaultValue={entry?.seoTitleBn ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.seoDescriptionLabel} · EN
          <textarea
            name="seoDescriptionEn"
            rows={2}
            maxLength={200}
            defaultValue={entry?.seoDescriptionEn ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.seoDescriptionLabel} · BN
          <textarea
            name="seoDescriptionBn"
            rows={2}
            maxLength={200}
            defaultValue={entry?.seoDescriptionBn ?? ''}
            className={control}
          />
        </label>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.statusLabel}
          <select name="status" defaultValue={entry?.status ?? 'draft'} className={control}>
            <option value="draft">{copy.statusDraft}</option>
            <option value="scheduled">{copy.statusScheduled}</option>
            <option value="published">{copy.statusPublished}</option>
          </select>
        </label>
        <label className={label}>
          {copy.publishDateLabel}
          <input
            type="date"
            name="publishDate"
            defaultValue={instantToDateInput(entry?.publishAt ?? null)}
            className={control}
          />
        </label>
      </div>
    </div>
  );
}
