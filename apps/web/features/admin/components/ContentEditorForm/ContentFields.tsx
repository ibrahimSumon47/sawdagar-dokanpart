'use client';

import { useState } from 'react';
import type { CmsEntryRecord, ContentKind } from '../../../content';
import type { HelpCategoryRecord } from '../../../content/helpCategoryQueries';
import type { CategoryLanguage } from '../../../content/helpCategoryTypes';
import { ContentBodyFields } from './ContentBodyFields';
import type { CmsEditorCopy } from './editorCopy';
import { ContentIdentityFields } from './ContentIdentityFields';
import { ContentJournalFields } from './ContentJournalFields';
import { ContentPublishFields } from './ContentPublishFields';
import { ContentSeoFields } from './ContentSeoFields';
import { ContentTextFields } from './ContentTextFields';

export interface ContentFieldsProps {
  /** Existing entry, or null when creating one. */
  entry: CmsEntryRecord | null;
  /** Area preselected for a new entry. */
  defaultKind: ContentKind;
  /** Categories that a Help article can be filed under. */
  categories: readonly HelpCategoryRecord[];
  copy: CmsEditorCopy;
  /** Language used for the category options. */
  locale: CategoryLanguage;
  /** Credentials for cover uploads, or null when they are not configured. */
  upload: { cloudName: string; preset: string } | null;
}

/** Every editable field. Holds the state that depends on the chosen content area. */
export function ContentFields({
  entry,
  defaultKind,
  categories,
  copy,
  locale,
  upload,
}: ContentFieldsProps) {
  const [kind, setKind] = useState<ContentKind>(entry?.kind ?? defaultKind);
  const [bodyEn, setBodyEn] = useState(entry?.bodyEn ?? '');
  const [bodyBn, setBodyBn] = useState(entry?.bodyBn ?? '');
  const [coverImage, setCoverImage] = useState(entry?.coverImageUrl ?? '');
  const [tags, setTags] = useState(entry?.tags.join(', ') ?? '');

  return (
    <div className="space-y-6">
      <ContentIdentityFields
        kind={kind}
        onKindChange={setKind}
        slug={entry?.slug ?? ''}
        helpCategoryId={entry?.helpCategoryId ?? null}
        categories={categories}
        copy={copy}
        locale={locale}
      />

      <ContentTextFields
        titleEn={entry?.titleEn ?? ''}
        titleBn={entry?.titleBn ?? ''}
        excerptEn={entry?.excerptEn ?? ''}
        excerptBn={entry?.excerptBn ?? ''}
        copy={copy}
      />

      <ContentBodyFields
        kind={kind}
        bodyEn={bodyEn}
        bodyBn={bodyBn}
        onChangeBody={(language, value) =>
          language === 'en' ? setBodyEn(value) : setBodyBn(value)
        }
        copy={copy}
      />

      {kind === 'journal' ? (
        <ContentJournalFields
          coverImage={coverImage}
          onCoverChange={setCoverImage}
          coverImageAltEn={entry?.coverImageAltEn ?? ''}
          coverImageAltBn={entry?.coverImageAltBn ?? ''}
          tags={tags}
          onTagsChange={setTags}
          copy={copy}
          upload={upload}
        />
      ) : null}

      <ContentSeoFields entry={entry} copy={copy} />
      <ContentPublishFields entry={entry} copy={copy} />
    </div>
  );
}
