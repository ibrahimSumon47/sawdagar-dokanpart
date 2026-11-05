'use client';

import { CoverImageField } from './CoverImageField';
import type { CmsEditorCopy } from './editorCopy';
import { TagField } from './TagField';

export interface ContentJournalFieldsProps {
  /** Cover stored as a Cloudinary public ID or an HTTPS address. */
  coverImage: string;
  onCoverChange: (value: string) => void;
  coverImageAltEn: string;
  coverImageAltBn: string;
  /** Comma separated tags. */
  tags: string;
  onTagsChange: (value: string) => void;
  copy: CmsEditorCopy;
  upload: { cloudName: string; preset: string } | null;
}

/** Cover and tags, shown only for Journal entries. */
export function ContentJournalFields({
  coverImage,
  onCoverChange,
  coverImageAltEn,
  coverImageAltBn,
  tags,
  onTagsChange,
  copy,
  upload,
}: ContentJournalFieldsProps) {
  return (
    <div className="space-y-4">
      <CoverImageField
        value={coverImage}
        onChange={onCoverChange}
        altEn={coverImageAltEn}
        altBn={coverImageAltBn}
        copy={copy}
        upload={upload}
      />
      <TagField value={tags} onChange={onTagsChange} copy={copy} />
    </div>
  );
}
