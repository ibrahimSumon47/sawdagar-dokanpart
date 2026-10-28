'use client';

import { ImagePlus, X } from 'lucide-react';
import { useState } from 'react';
import { MAX_REVIEW_PHOTOS } from '../../inputs';
import { PhotoResizeError, compressPhoto } from '../../reviewPhotos';

/** Plain strings only; the spinner and errors render in the browser. */
export interface ReviewPhotoPickerLabels {
  photo: string;
  photos: string;
  photosHint: string;
  addPhotos: string;
  resizing: string;
  removePhoto: string;
  invalid: string;
}

export interface ReviewPhotoPickerProps {
  labels: ReviewPhotoPickerLabels;
}

/** Resizes up to three chosen photos in the browser and posts them as data URLs. */
export function ReviewPhotoPicker({ labels }: ReviewPhotoPickerProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy(true);
    const next = [...photos];

    for (const file of Array.from(files)) {
      if (next.length >= MAX_REVIEW_PHOTOS) break;
      try {
        next.push(await compressPhoto(file));
      } catch (caught) {
        setError(caught instanceof PhotoResizeError ? caught.message : labels.invalid);
      }
    }

    setPhotos(next);
    setBusy(false);
  }

  return (
    <div>
      <p className="text-sm font-medium text-ink">{labels.photos}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{labels.photosHint}</p>

      {photos.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-3">
          {photos.map((photo, index) => (
            <li key={`${index}-${photo.length}`} className="relative">
              <span
                role="img"
                aria-label={labels.photo.replace('{index}', String(index + 1))}
                className="block size-20 rounded-sm border border-line bg-cover bg-center"
                style={{ backgroundImage: `url(${photo})` }}
              />
              <button
                type="button"
                onClick={() => setPhotos(photos.filter((_, position) => position !== index))}
                aria-label={labels.removePhoto.replace('{index}', String(index + 1))}
                className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full border border-line bg-surface text-ink shadow-sm"
              >
                <X aria-hidden="true" className="size-3.5" />
              </button>
              <input type="hidden" name="photos" value={photo} />
            </li>
          ))}
        </ul>
      ) : null}

      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-sm font-medium text-ink focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
        <ImagePlus aria-hidden="true" className="size-4" />
        {busy ? labels.resizing : labels.addPhotos}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={busy || photos.length >= MAX_REVIEW_PHOTOS}
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = '';
          }}
          className="sr-only"
        />
      </label>

      {error ? (
        <p role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
