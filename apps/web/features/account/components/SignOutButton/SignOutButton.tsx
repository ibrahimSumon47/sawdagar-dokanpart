import { Button } from '@sd/ui';
import { signOut } from '../../../auth/actions';

export interface SignOutButtonProps {
  label: string;
}

/** Server-action form that revokes the session and returns home. */
export function SignOutButton({ label }: SignOutButtonProps) {
  return (
    <form action={signOut}>
      <Button type="submit" variant="secondary">
        {label}
      </Button>
    </form>
  );
}
