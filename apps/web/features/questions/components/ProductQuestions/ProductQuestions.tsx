import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { formatTemplate } from '../../../shop/formatTemplate';
import type { QuestionRecord } from '../../queries';
import { AskQuestionForm } from '../AskQuestionForm';

export interface ProductQuestionsProps {
  productId: string;
  productSlug: string;
  questions: QuestionRecord[];
  copy: Dictionary['questions'];
  signInLabel: string;
  signedIn: boolean;
  locale: Locale;
}

/** Public buyer questions with seller answers, plus the ask form. */
export function ProductQuestions({
  productId,
  productSlug,
  questions,
  copy,
  signInLabel,
  signedIn,
  locale,
}: ProductQuestionsProps) {
  return (
    <section aria-labelledby="product-questions-title" className="mt-14">
      <h2 id="product-questions-title" className="font-serif text-2xl text-ink">
        {copy.title}
      </h2>
      <p className="mt-1 text-sm text-ink-muted">{copy.description}</p>

      {questions.length === 0 ? (
        <p className="mt-4 rounded-sm border border-dashed border-line bg-surface px-4 py-5 text-sm text-ink-muted">
          {copy.empty}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-sm border border-line bg-surface">
          {questions.map((question) => (
            <li key={question.id} className="px-4 py-4">
              <p className="text-sm font-medium text-ink">{question.body}</p>
              <p className="mt-1 text-xs text-ink-muted">
                {formatTemplate(copy.askedBy, { name: question.askedByName })} ·{' '}
                {formatDate(question.createdAt, locale)}
              </p>
              {question.answerBody ? (
                <div className="mt-2 border-l-2 border-accent/40 pl-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {copy.answer}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                    {question.answerBody}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs italic text-ink-muted">{copy.awaitingAnswer}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {signedIn ? (
        <AskQuestionForm productId={productId} copy={copy} />
      ) : (
        <Link
          href={`/sign-in?next=${encodeURIComponent(`/product/${productSlug}`)}`}
          className="mt-4 inline-block text-sm font-medium text-accent underline underline-offset-4"
        >
          {signInLabel}
        </Link>
      )}
    </section>
  );
}
