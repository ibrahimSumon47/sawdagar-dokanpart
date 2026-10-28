import { Badge, Button } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { answerQuestionAction } from '../../orderActions';
import type { SellerQuestionRecord } from '../../queries';

export interface SellerQuestionListProps {
  questions: readonly SellerQuestionRecord[];
  copy: Dictionary['seller'];
  locale: Locale;
}

/** Buyer questions with their answer or an inline answer form. */
export function SellerQuestionList({ questions, copy, locale }: SellerQuestionListProps) {
  return (
    <ul className="space-y-4">
      {questions.map((question) => (
        <li key={question.id} className="rounded-sm border border-line bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-ink-muted">
                {copy.askedBy} {question.askerName} · {formatDate(question.createdAt, locale)}
              </p>
              <Link
                href={`/product/${question.productSlug}`}
                className="mt-1 block font-medium text-ink hover:text-accent"
              >
                {locale === 'bn' ? question.productTitleBn : question.productTitleEn}
              </Link>
            </div>
            <Badge tone={question.answerBody ? 'success' : 'warning'}>
              {question.answerBody ? copy.answeredOn : copy.awaitingAnswer}
            </Badge>
          </div>

          <p className="mt-3 text-sm text-ink">{question.body}</p>

          {question.answerBody ? (
            <div className="mt-4 border-l-2 border-accent/40 pl-3">
              <p className="text-xs font-semibold text-ink-muted">{copy.answer}</p>
              <p className="mt-1 text-sm text-ink">{question.answerBody}</p>
            </div>
          ) : (
            <form action={answerQuestionAction} className="mt-4 space-y-2">
              <input type="hidden" name="questionId" value={question.id} />
              <label htmlFor={`answer-${question.id}`} className="text-xs font-semibold text-ink">
                {copy.answer}
              </label>
              <textarea
                id={`answer-${question.id}`}
                name="body"
                required
                minLength={10}
                maxLength={1000}
                rows={3}
                placeholder={copy.answerPlaceholder}
                className="block w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              <Button type="submit" size="sm">
                {copy.publishAnswer}
              </Button>
            </form>
          )}
        </li>
      ))}
    </ul>
  );
}
