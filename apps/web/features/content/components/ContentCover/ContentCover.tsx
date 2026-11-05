import Image from 'next/image';
import { coverImageSrc } from '../../coverImage';

export interface ContentCoverProps {
  /** Stored cover: Cloudinary public ID, https URL or a path on this site. */
  src: string;
  /** Alt text in the reader's language; the title is used when it is empty. */
  alt: string | null;
  /** Fallback alt text, normally the entry title. */
  title: string;
  /** Width requested from Cloudinary. */
  width: number;
  /** card: compact index header, hero: wide article header. */
  variant?: 'card' | 'hero';
}

/** Cover photo for a Journal card or post, cropped to a fixed frame. */
export function ContentCover({ src, alt, title, width, variant = 'card' }: ContentCoverProps) {
  const hero = variant === 'hero';

  return (
    <div
      className={`relative overflow-hidden bg-accent/10 ${
        hero ? 'aspect-[16/9] rounded-sm' : 'aspect-[2/1]'
      }`}
    >
      <Image
        src={coverImageSrc(src, width)}
        alt={alt?.trim() || title}
        fill
        sizes={hero ? '(min-width: 768px) 768px, 100vw' : '(min-width: 768px) 50vw, 100vw'}
        className="object-cover"
      />
    </div>
  );
}
