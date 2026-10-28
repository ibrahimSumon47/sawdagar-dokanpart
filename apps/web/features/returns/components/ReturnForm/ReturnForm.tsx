'use client';

import { Button } from '@sd/ui';
import { useActionState } from 'react';
import type { Dictionary } from '../../../../i18n';
import { requestReturn } from '../../actions';
import { initialReturnState } from '../../state';

export interface ReturnFormProps {
  orderItemId: string;
  copy: Dictionary['returns'];
}

/** Collapsed return request form for one delivered order line. */
export function ReturnForm({ orderItemId, copy }: ReturnFormProps) {
  const [state, formAction, pending] = useActionState(requestReturn, initialReturnState);
  const id = `return-${orderItemId}`;

  return (
    <form action={formAction} className="mt-2 border-t border-line pt-3">
      <input type="hidden" name="orderItemId" value={orderItemId} />

      <label htmlFor={`${id}-reason`} className="text-xs font-medium text-ink">
        {copy.reason}
      </label>
      <select
        id={`${id}-reason`}
        name="reason"
        required
        defaultValue="damaged"
        className="mt-1 w-full rounded-sm border border-line bg-background px-3 py-2 text-sm text-ink sm:w-64"
      >
        <option value="damaged">{copy.reasons.damaged}</option>
        <option value="wrong_item">{copy.reasons.wrong_item}</option>
        <option value="not_as_described">{copy.reasons.not_as_described}</option>
        <option value="changed_mind">{copy.reasons.changed_mind}</option>
        <option value="other">{copy.reasons.other}</option>
      </select>

      <label htmlFor={`${id}-note`} className="mt-2 block text-xs font-medium text-ink">
        {copy.note}
      </label>
      <textarea
        id={`${id}-note`}
        name="note"
        rows={2}
        maxLength={400}
        className="mt-1 w-full rounded-sm border border-line bg-background px-3 py-2 text-sm text-ink"
      />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? copy.submitting : copy.submit}
        </Button>
        {state.status === 'success' ? (
          <p role="status" className="text-sm text-success">
            {copy.success}
          </p>
        ) : null}
        {state.status === 'window' ? (
          <p role="alert" className="text-sm text-danger">
            {copy.window}
          </p>
        ) : null}
        {state.status === 'invalid' ? (
          <p role="alert" className="text-sm text-danger">
            {copy.invalid}
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
