import { ButtonLink } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { UserQuestionRecord } from '../../../questions/queries';

export interface AccountQuestionsPanelProps {
  questions: UserQuestionRecord[];
  copy: Dictionary['account'];
  questionsCopy: Dictionary['questions'];
  locale: Locale;
}

/** The buyer's questions with their product links and seller answers. */
export function AccountQuestionsPanel({
  questions,
  copy,
  questionsCopy,
  locale,
}: AccountQuestionsPanelProps) {
  if (questions.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-line bg-surface px-6 py-10 text-center">
        <h2 className="font-serif text-xl text-ink">{copy.questionsEmptyTitle}</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink-muted">{copy.questionsEmptyBody}</p>
        <ButtonLink href="/catalog" className="mt-4">
          {copy.questionsEmptyAction}
        </ButtonLink>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line rounded-sm border border-line bg-surface">
      {questions.map((question) => (
        <li key={question.id} className="px-4 py-4">
          <Link
            href={`/product/${question.productSlug}`}
            className="text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
          >
            {locale === 'bn' ? question.productTitleBn : question.productTitleEn}
          </Link>
          <p className="mt-1 text-sm font-medium text-ink">{question.body}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{formatDate(question.createdAt, locale)}</p>
          {question.answerBody ? (
            <div className="mt-2 border-l-2 border-accent/40 pl-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {questionsCopy.answer}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{question.answerBody}</p>
            </div>
          ) : (
            <p className="mt-1 text-xs italic text-ink-muted">{questionsCopy.awaitingAnswer}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
