import { MAX_REVIEW_PHOTO_CHARS } from './inputs';

const MAX_EDGE = 960;

/** Raised when a browser cannot read or shrink a chosen image. */
export class PhotoResizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PhotoResizeError';
  }
}

/**
 * Shrinks a chosen photo to a bounded JPEG data URL. Reviews keep thumbnails
 * with the row because the demo has no object-storage host; the cap keeps the
 * server action well inside its request limit.
 */
export async function compressPhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new PhotoResizeError('Only image files can be attached.');
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new PhotoResizeError('This browser cannot resize the image.');
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let quality = 0.72;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  while (dataUrl.length > MAX_REVIEW_PHOTO_CHARS && quality > 0.4) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }

  if (dataUrl.length > MAX_REVIEW_PHOTO_CHARS) {
    throw new PhotoResizeError('That photo is still too large after resizing.');
  }

  return dataUrl;
}
