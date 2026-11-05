import { Database } from 'lucide-react';
import type { AuthCopy } from '../../copy';

export interface AuthSetupNoticeProps {
  copy: AuthCopy;
}

/**
 * Shown on the account forms when the deployment has no database or auth
 * secret. It names the variables an owner must add in the dashboards.
 */
export function AuthSetupNotice({ copy }: AuthSetupNoticeProps) {
  return (
    <div className="mb-5 flex flex-col items-start gap-2 rounded-sm border border-dashed border-line bg-surface px-4 py-4">
      <Database aria-hidden="true" className="size-5 text-accent" />
      <p className="font-semibold text-ink">{copy.auth.setupTitle}</p>
      <p className="text-sm text-ink-muted">{copy.auth.setupBody}</p>
      <p className="rounded-sm bg-background px-3 py-2 text-xs text-ink-muted">
        {copy.auth.setupHint}
      </p>
    </div>
  );
}
