import { Badge, JamdaniPattern } from '@sd/ui';
import { MapPin, ShieldCheck, Star, Users } from 'lucide-react';
import type { Dictionary, Locale } from '../../../../i18n';
import { placeName } from '../../../../i18n/places';
import { formatDate } from '../../../../lib/formatDate';

export interface PublicStoreHeaderProps {
  store: {
    name: string;
    descriptionEn: string | null;
    descriptionBn: string | null;
    district: string | null;
    verified: boolean;
    rating: number;
    reviewCount: number;
    followers: number;
    coverTone: string;
    announcementEn: string | null;
    announcementBn: string | null;
    createdAt: Date;
  };
  copy: Dictionary['seller'];
  locale: Locale;
}

const toneClass: Record<string, string> = {
  accent: 'bg-accent/10 text-accent',
  secondary: 'bg-secondary/10 text-secondary',
  highlight: 'bg-highlight/10 text-highlight',
  ink: 'bg-surface-elevated text-ink-muted',
};

/** Banner, identity and trust signals at the top of a public store page. */
export function PublicStoreHeader({ store, copy, locale }: PublicStoreHeaderProps) {
  const announcement = locale === 'bn' ? store.announcementBn : store.announcementEn;
  const description = locale === 'bn' ? store.descriptionBn : store.descriptionEn;

  return (
    <header>
      <div
        className={`relative h-36 overflow-hidden rounded-sm border border-line sm:h-48 ${
          toneClass[store.coverTone] ?? toneClass.accent
        }`}
      >
        <JamdaniPattern />
      </div>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-title leading-tight text-ink">{store.name}</h1>
            {store.verified ? (
              <Badge tone="success">
                <ShieldCheck aria-hidden="true" className="mr-1 size-3.5" />
                {copy.kycApproved}
              </Badge>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
            {store.district ? (
              <span className="inline-flex items-center gap-1">
                <MapPin aria-hidden="true" className="size-4" />
                {placeName(store.district, locale)}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <Star aria-hidden="true" className="size-4" />
              {store.rating.toFixed(1)} · {store.reviewCount} {copy.publicRating}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users aria-hidden="true" className="size-4" />
              {store.followers.toLocaleString(locale === 'bn' ? 'bn-BD' : 'en-GB')}{' '}
              {copy.publicFollowers}
            </span>
            <span>
              {copy.publicSince} {formatDate(store.createdAt, locale)}
            </span>
          </div>
        </div>
      </div>

      {announcement ? (
        <p className="mt-4 rounded-sm border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-ink">
          {announcement}
        </p>
      ) : null}
      {description ? <p className="mt-4 max-w-3xl text-ink-muted">{description}</p> : null}
    </header>
  );
}
