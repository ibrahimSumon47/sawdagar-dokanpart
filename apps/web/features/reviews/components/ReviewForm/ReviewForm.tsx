'use client';

import { Button } from '@sd/ui';
import Link from 'next/link';
import { useActionState } from 'react';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { submitReview } from '../../actions';
import { initialReviewState } from '../../state';
import type { ReviewableItem } from '../../queries';
import { RatingInput } from '../RatingInput';
import { ReviewPhotoPicker } from '../ReviewPhotoPicker';

export interface ReviewFormProps {
  item: ReviewableItem;
  copy: Dictionary['reviews'];
  locale: Locale;
}

const fieldClass =
  'mt-1 w-full rounded-sm border border-line bg-background px-3 py-2 text-sm text-ink';

/** Collapsed review form for one delivered order line. */
export function ReviewForm({ item, copy, locale }: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(submitReview, initialReviewState);
  const productTitle = locale === 'bn' ? item.productTitleBn : item.productTitleEn;

  return (
    <details className="rounded-sm border border-line bg-surface">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-accent">
        {copy.reviewItem}
      </summary>

      <div className="border-t border-line px-4 py-4">
        <p className="font-serif text-lg text-ink">{productTitle}</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {copy.deliveredOn} {formatDate(item.deliveredAt, locale)} ·{' '}
          <Link href={`/orders/${item.orderNumber}`} className="underline underline-offset-2">
            {item.orderNumber}
          </Link>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">{copy.writeDescription}</p>

        <form action={formAction} className="mt-4 space-y-4">
          <input type="hidden" name="orderItemId" value={item.orderItemId} />
          <RatingInput label={copy.rating} hint={copy.ratingHint} />

          <div>
            <label
              htmlFor={`review-title-${item.orderItemId}`}
              className="text-sm font-medium text-ink"
            >
              {copy.titleLabel}
            </label>
            <input
              id={`review-title-${item.orderItemId}`}
              name="title"
              required
              minLength={4}
              maxLength={80}
              placeholder={copy.titlePlaceholder}
              className={fieldClass}
            />
          </div>

          <div>
            <label
              htmlFor={`review-body-${item.orderItemId}`}
              className="text-sm font-medium text-ink"
            >
              {copy.bodyLabel}
            </label>
            <textarea
              id={`review-body-${item.orderItemId}`}
              name="body"
              required
              rows={4}
              minLength={20}
              maxLength={1200}
              placeholder={copy.bodyPlaceholder}
              className={fieldClass}
            />
          </div>

          <ReviewPhotoPicker copy={copy} />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? copy.publishing : copy.publish}
            </Button>
            {state.status === 'success' ? (
              <p role="status" className="text-sm text-success">
                {copy.success}
              </p>
            ) : null}
            {state.status === 'invalid' ? (
              <p role="alert" className="text-sm text-danger">
                {copy.invalid}
              </p>
            ) : null}
            {state.status === 'duplicate' ? (
              <p role="alert" className="text-sm text-danger">
                {copy.duplicate}
              </p>
            ) : null}
            {state.status === 'failed' ? (
              <p role="alert" className="text-sm text-danger">
                {copy.failed}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </details>
  );
}
