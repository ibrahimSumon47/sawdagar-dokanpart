'use client';

import { Button } from '@sd/ui';
import { useActionState } from 'react';
import type { Dictionary } from '../../../../i18n';
import { askQuestion } from '../../actions';
import { initialQuestionState } from '../../state';

export interface AskQuestionFormProps {
  productId: string;
  copy: Dictionary['questions'];
}

/** Signed-in buyer's question form on a product page. */
export function AskQuestionForm({ productId, copy }: AskQuestionFormProps) {
  const [state, formAction, pending] = useActionState(askQuestion, initialQuestionState);

  return (
    <form action={formAction} className="mt-4">
      <input type="hidden" name="productId" value={productId} />
      <label htmlFor={`question-${productId}`} className="text-sm font-medium text-ink">
        {copy.askTitle}
      </label>
      <textarea
        id={`question-${productId}`}
        name="body"
        rows={2}
        required
        minLength={10}
        maxLength={400}
        placeholder={copy.placeholder}
        className="mt-1 w-full rounded-sm border border-line bg-background px-3 py-2 text-sm text-ink"
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? copy.asking : copy.ask}
        </Button>
        {state.status === 'success' ? (
          <p role="status" className="text-sm text-success">
            {copy.asked}
          </p>
        ) : null}
        {state.status === 'invalid' ? (
          <p role="alert" className="text-sm text-danger">
            {copy.invalid}
          </p>
        ) : null}
        {state.status === 'limit' ? (
          <p role="alert" className="text-sm text-danger">
            {copy.limit}
          </p>
        ) : null}
        {state.status === 'failed' ? (
          <p role="alert" className="text-sm text-danger">
            {copy.failed}
          </p>
        ) : null}
      </div>
    </form>
  );
}
