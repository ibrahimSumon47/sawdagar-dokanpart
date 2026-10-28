import type { Dictionary, Locale } from '../../../../i18n';
import type { ReviewableItem, UserReviewRecord } from '../../../reviews/queries';
import { ReviewCard } from '../../../reviews/components/ReviewCard';
import { ReviewForm } from '../../../reviews/components/ReviewForm';

export interface AccountReviewsPanelProps {
  awaiting: ReviewableItem[];
  published: UserReviewRecord[];
  copy: Dictionary['account'];
  reviewsCopy: Dictionary['reviews'];
  locale: Locale;
}

/** Two lists: delivered items awaiting a review, then the buyer's reviews. */
export function AccountReviewsPanel({
  awaiting,
  published,
  copy,
  reviewsCopy,
  locale,
}: AccountReviewsPanelProps) {
  // The form is a client component, so it receives plain strings only.
  const formLabels = {
    reviewItem: reviewsCopy.reviewItem,
    deliveredOn: reviewsCopy.deliveredOn,
    writeDescription: reviewsCopy.writeDescription,
    rating: reviewsCopy.rating,
    ratingHint: reviewsCopy.ratingHint,
    titleLabel: reviewsCopy.titleLabel,
    titlePlaceholder: reviewsCopy.titlePlaceholder,
    bodyLabel: reviewsCopy.bodyLabel,
    bodyPlaceholder: reviewsCopy.bodyPlaceholder,
    photos: reviewsCopy.photos,
    photosHint: reviewsCopy.photosHint,
    addPhotos: reviewsCopy.addPhotos,
    resizing: reviewsCopy.resizing,
    removePhoto: reviewsCopy.removePhoto,
    invalid: reviewsCopy.invalid,
    publish: reviewsCopy.publish,
    publishing: reviewsCopy.publishing,
    success: reviewsCopy.success,
    duplicate: reviewsCopy.duplicate,
    failed: reviewsCopy.failed,
    photo: reviewsCopy.photo,
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-xl text-ink">{copy.reviewsAwaiting}</h2>
        {awaiting.length === 0 ? (
          <p className="mt-2 rounded-sm border border-dashed border-line bg-surface px-4 py-5 text-sm text-ink-muted">
            {copy.reviewsAwaitingEmpty}
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {awaiting.map((item) => (
              <ReviewForm key={item.orderItemId} item={item} labels={formLabels} locale={locale} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">{copy.reviewsPublished}</h2>
        {published.length === 0 ? (
          <p className="mt-2 rounded-sm border border-dashed border-line bg-surface px-4 py-5 text-sm text-ink-muted">
            {copy.reviewsEmpty}
          </p>
        ) : (
          <div className="mt-3 rounded-sm border border-line bg-surface px-4">
            {published.map((review) => (
              <div key={review.id}>
                <p className="pt-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {locale === 'bn' ? review.productTitleBn : review.productTitleEn}
                </p>
                <ReviewCard review={review} copy={reviewsCopy} locale={locale} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
