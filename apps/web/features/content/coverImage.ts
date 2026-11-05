import { cloudinaryPhotoUrl } from '../catalog/cloudinaryUrl';

/**
 * Turns a stored cover value into a delivery address. A site path or an https URL is used as
 * given; anything else is a Cloudinary public ID and is resolved with the requested width.
 */
export function coverImageSrc(value: string, width: number): string {
  if (value.startsWith('/') || value.startsWith('https://')) return value;
  return cloudinaryPhotoUrl(value, width);
}
