'use client';

import Image from 'next/image';
import { coverImageSrc } from '../../../content/coverImage';
import { CoverUploadButton } from './CoverUploadButton';
import type { CmsEditorCopy } from './editorCopy';
import { controlClass, hintClass, labelClass } from './fieldStyles';

export interface CoverImageFieldProps {
  /** Stored cover value, or an empty string. */
  value: string;
  onChange: (value: string) => void;
  /** Alt text already written for each language. */
  altEn: string;
  altBn: string;
  copy: CmsEditorCopy;
  /** Credentials for browser uploads, or null when they are not configured. */
  upload: { cloudName: string; preset: string } | null;
}

/** Journal cover address, preview and, when configured, a Cloudinary upload button. */
export function CoverImageField({
  value,
  onChange,
  altEn,
  altBn,
  copy,
  upload,
}: CoverImageFieldProps) {
  return (
    <div className="space-y-3">
      <label className={labelClass}>
        {copy.coverImageLabel}
        <input
          type="text"
          name="coverImageUrl"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={controlClass}
        />
        <span className={hintClass}>{copy.coverImageHint}</span>
      </label>

      {value ? (
        <Image
          src={coverImageSrc(value, 640)}
          alt=""
          width={640}
          height={320}
          className="h-32 w-full rounded-sm object-cover"
        />
      ) : null}

      {upload ? (
        <CoverUploadButton
          cloudName={upload.cloudName}
          preset={upload.preset}
          copy={copy}
          onUploaded={onChange}
        />
      ) : (
        <p className="text-xs text-ink-muted">{copy.coverUploadMissing}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {copy.coverImageAltEnLabel}
          <input
            type="text"
            name="coverImageAltEn"
            maxLength={160}
            defaultValue={altEn}
            className={controlClass}
          />
        </label>
        <label className={labelClass}>
          {copy.coverImageAltBnLabel}
          <input
            type="text"
            name="coverImageAltBn"
            maxLength={160}
            defaultValue={altBn}
            className={controlClass}
          />
        </label>
      </div>
      <p className={hintClass}>{copy.coverImageAltHint}</p>
    </div>
  );
}
