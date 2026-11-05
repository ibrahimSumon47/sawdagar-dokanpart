'use client';

import { useRef, useState } from 'react';
import type { CmsEditorCopy } from './editorCopy';

export interface CoverUploadButtonProps {
  /** Cloudinary cloud name from the public environment. */
  cloudName: string;
  /** Unsigned upload preset that accepts browser uploads. */
  preset: string;
  copy: CmsEditorCopy;
  /** Called with the new Cloudinary public ID once the upload finishes. */
  onUploaded: (publicId: string) => void;
}

const maxBytes = 5_000_000;

/** Uploads a cover straight to Cloudinary with an unsigned preset. */
export function CoverUploadButton({ cloudName, preset, copy, onUploaded }: CoverUploadButtonProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function upload(file: File) {
    if (file.size > maxBytes) {
      setFailed(true);
      return;
    }

    setUploading(true);
    setFailed(false);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('upload_preset', preset);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body,
      });
      if (!response.ok) throw new Error('upload rejected');
      const data = (await response.json()) as { public_id?: unknown };
      if (typeof data.public_id !== 'string') throw new Error('public id missing');
      onUploaded(data.public_id);
    } catch {
      setFailed(true);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  return (
    <div>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInput.current?.click()}
        className="min-h-9 rounded-sm border border-line px-3 text-sm font-medium text-ink hover:border-accent disabled:opacity-60"
      >
        {uploading ? copy.coverUploading : copy.coverUpload}
      </button>
      {failed ? (
        <p role="alert" className="mt-1 text-xs font-normal text-danger">
          {copy.coverUploadFailed}
        </p>
      ) : null}
    </div>
  );
}
