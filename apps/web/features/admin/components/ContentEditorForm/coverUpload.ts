/** Public Cloudinary values the browser needs for an unsigned cover upload. */
export interface CoverUploadConfig {
  cloudName: string;
  preset: string;
}

/**
 * Reads the upload configuration from the environment. Both values are public: the cloud name
 * appears in every image address and the preset only allows uploads into this project's folder
 * structure. Returns null until the owner creates the unsigned preset.
 */
export function coverUploadConfig(): CoverUploadConfig | null {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';
  if (!cloudName || !preset) return null;
  return { cloudName, preset };
}
