import { ButtonLink, EmptyState, ErrorState } from '@sd/ui';
import { HeartOff } from 'lucide-react';
import type { Dictionary } from '../../../../i18n';
import { GallerySection } from '../GallerySection';

export interface FeedbackSectionProps {
  copy: Dictionary['design'];
}

/** The designed empty and error states used when a list has nothing to show. */
export function FeedbackSection({ copy }: FeedbackSectionProps) {
  return (
    <GallerySection id="states" title={copy.statesTitle} description={copy.statesDescription}>
      <div className="grid gap-6 lg:grid-cols-2">
        <EmptyState
          icon={<HeartOff aria-hidden="true" className="size-7" />}
          title={copy.emptyTitle}
          description={copy.emptyBody}
          action={<ButtonLink href="/">{copy.emptyAction}</ButtonLink>}
        />
        <ErrorState title={copy.errorTitle} description={copy.errorBody} />
      </div>
    </GallerySection>
  );
}
