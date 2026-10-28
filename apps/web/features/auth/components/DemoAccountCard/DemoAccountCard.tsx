import { Badge } from '@sd/ui';
import { signInWithDemo } from '../../actions';
import { SubmitButton } from '../SubmitButton';

export interface DemoAccountCardProps {
  email: string;
  name: string;
  /** Localised role name shown as a badge. */
  roleLabel: string;
  /** Internal page to open after sign-in. */
  next: string;
  labels: { tryDemo: string; pending: string };
}

/** One allowlisted demo login, submitted as a server action form. */
export function DemoAccountCard({ email, name, roleLabel, next, labels }: DemoAccountCardProps) {
  return (
    <form
      action={signInWithDemo}
      className="flex h-full flex-col gap-3 rounded-sm border border-line bg-surface p-4"
    >
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="next" value={next} />
      <Badge tone="neutral" className="self-start">
        {roleLabel}
      </Badge>
      <div className="flex-1">
        <p className="font-serif text-lg text-ink">{name}</p>
        <p className="truncate text-xs text-ink-muted">{email}</p>
      </div>
      <SubmitButton label={labels.tryDemo} pendingLabel={labels.pending} size="sm" />
    </form>
  );
}
