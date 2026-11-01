/**
 * Builds the Cloudinary delivery URL for a stored product photo. The cloud name
 * is public (it appears in every image URL), so it is read from a NEXT_PUBLIC
 * variable and is never a secret.
 */
export function cloudinaryPhotoUrl(publicId: string, width: number): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,f_auto,q_auto,w_${width}/${publicId}`;
}
