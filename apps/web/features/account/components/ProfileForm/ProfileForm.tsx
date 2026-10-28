'use client';

import { Button } from '@sd/ui';
import { useActionState } from 'react';
import type { Dictionary } from '../../../../i18n';
import { updateProfile, type ProfileState } from '../../actions';
import { FormField } from '../FormField';

export interface ProfileFormProps {
  /** Current stored values, rendered as uncontrolled defaults. */
  initial: { name: string; phone: string; district: string; bio: string };
  copy: Dictionary['account'];
}

const initialState: ProfileState = { status: 'idle' };

const fieldClass =
  'mt-1 w-full rounded-sm border border-line bg-background px-3 py-2 text-sm text-ink';

/** Editable name, phone, district and bio for the signed-in account. */
export function ProfileForm({ initial, copy }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="mt-5 grid gap-4 sm:grid-cols-2">
      <FormField htmlFor="profile-name" label={copy.name}>
        <input
          id="profile-name"
          name="name"
          defaultValue={initial.name}
          required
          minLength={2}
          maxLength={80}
          className={fieldClass}
        />
      </FormField>

      <FormField htmlFor="profile-phone" label={copy.phone} hint={copy.phoneHint}>
        <input
          id="profile-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          defaultValue={initial.phone}
          placeholder="01712345678"
          aria-describedby="profile-phone-hint"
          className={fieldClass}
        />
      </FormField>

      <FormField htmlFor="profile-district" label={copy.district} hint={copy.districtHint}>
        <input
          id="profile-district"
          name="district"
          defaultValue={initial.district}
          maxLength={60}
          aria-describedby="profile-district-hint"
          className={fieldClass}
        />
      </FormField>

      <div className="sm:col-span-2">
        <FormField htmlFor="profile-bio" label={copy.bio} hint={copy.bioHint}>
          <textarea
            id="profile-bio"
            name="bio"
            defaultValue={initial.bio}
            rows={3}
            maxLength={280}
            aria-describedby="profile-bio-hint"
            className={fieldClass}
          />
        </FormField>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? copy.saving : copy.save}
        </Button>
        {state.status === 'success' ? (
          <p role="status" className="text-sm text-success">
            {copy.saveSuccess}
          </p>
        ) : null}
        {state.status === 'invalid' ? (
          <p role="alert" className="text-sm text-danger">
            {copy.saveInvalid}
          </p>
        ) : null}
        {state.status === 'failed' ? (
          <p role="alert" className="text-sm text-danger">
            {copy.saveFailed}
          </p>
        ) : null}
      </div>
    </form>
  );
}
