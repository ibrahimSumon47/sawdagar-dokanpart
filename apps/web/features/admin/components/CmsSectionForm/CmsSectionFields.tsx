import type { Dictionary } from '../../../../i18n';
import type { CmsSectionRecord } from '../../../content/sectionQueries';
import { instantToDateInput } from '../../../content/urls';

export interface CmsSectionFieldsProps {
  /** Existing section, or null when creating one. */
  section: CmsSectionRecord | null;
  copy: Dictionary['admin'];
}

const control =
  'mt-1 block min-h-10 w-full rounded-sm border border-line bg-background px-2 py-1.5 text-sm text-ink';
const label = 'text-xs font-semibold text-ink';

/** Copy, media, link and scheduling inputs for a homepage section. */
export function CmsSectionFields({ section, copy }: CmsSectionFieldsProps) {
  return (
    <div className="space-y-6">
      <label className={label}>
        {copy.sectionKindLabel}
        <select name="kind" defaultValue={section?.kind ?? 'hero'} className={control}>
          <option value="hero">{copy.kindHero}</option>
          <option value="collections">{copy.kindCollections}</option>
          <option value="banner">{copy.kindBanner}</option>
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.titleEnLabel}
          <input
            type="text"
            name="titleEn"
            required
            maxLength={120}
            defaultValue={section?.titleEn ?? ''}
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
            defaultValue={section?.titleBn ?? ''}
            className={control}
          />
        </label>
      </div>

      <label className={label}>
        {copy.bodyEnLabel}
        <textarea
          name="bodyEn"
          required
          rows={3}
          maxLength={600}
          defaultValue={section?.bodyEn ?? ''}
          className={control}
        />
      </label>
      <label className={label}>
        {copy.bodyBnLabel}
        <textarea
          name="bodyBn"
          required
          rows={3}
          maxLength={600}
          defaultValue={section?.bodyBn ?? ''}
          className={control}
        />
      </label>

      <label className={label}>
        {copy.imageUrlLabel}
        <input
          type="text"
          name="imageUrl"
          maxLength={500}
          defaultValue={section?.imageUrl ?? ''}
          className={control}
        />
        <span className="mt-1 block text-xs font-normal text-ink-muted">{copy.imageUrlHint}</span>
      </label>

      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {copy.ctaLabelLabel}
        </legend>
        <label className={label}>
          {copy.ctaLabelLabel} · EN
          <input
            type="text"
            name="ctaLabelEn"
            maxLength={60}
            defaultValue={section?.ctaLabelEn ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.ctaLabelLabel} · BN
          <input
            type="text"
            name="ctaLabelBn"
            maxLength={60}
            defaultValue={section?.ctaLabelBn ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.ctaHrefLabel}
          <input
            type="text"
            name="ctaHref"
            maxLength={300}
            defaultValue={section?.ctaHref ?? ''}
            className={control}
          />
        </label>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.statusLabel}
          <select name="status" defaultValue={section?.status ?? 'draft'} className={control}>
            <option value="draft">{copy.statusDraft}</option>
            <option value="scheduled">{copy.statusScheduled}</option>
            <option value="published">{copy.statusPublished}</option>
            <option value="archived">{copy.statusArchived}</option>
          </select>
        </label>
        <label className={label}>
          {copy.publishDateLabel}
          <input
            type="date"
            name="publishDate"
            defaultValue={instantToDateInput(section?.publishAt ?? null)}
            className={control}
          />
        </label>
      </div>
    </div>
  );
}
