import type { ReactNode } from 'react';
import { SectionHeading } from '@sd/ui';

export interface GallerySectionProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

/** Named section wrapper so the gallery has a consistent rhythm and anchors. */
export function GallerySection({ id, title, description, children }: GallerySectionProps) {
  return (
    <section id={id} aria-label={title} className="scroll-mt-28">
      <SectionHeading title={title} description={description} />
      <div className="mt-6">{children}</div>
    </section>
  );
}
