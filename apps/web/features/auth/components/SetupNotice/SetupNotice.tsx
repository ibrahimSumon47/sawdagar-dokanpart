import { Database } from 'lucide-react';

export interface SetupNoticeProps {
  title: string;
  body: string;
  hint: string;
}

/**
 * Explains that sign-in is unavailable because the deployment has no database
 * or auth secret. It names the variables an owner must add in the dashboards.
 */
export function SetupNotice({ title, body, hint }: SetupNoticeProps) {
  return (
    <div className="mt-10 flex flex-col items-start gap-3 rounded-sm border border-dashed border-line bg-surface px-6 py-10">
      <Database aria-hidden="true" className="size-6 text-accent" />
      <h2 className="font-serif text-xl text-ink">{title}</h2>
      <p className="max-w-xl text-sm text-ink-muted">{body}</p>
      <p className="max-w-xl rounded-sm bg-background px-3 py-2 text-xs text-ink-muted">{hint}</p>
    </div>
  );
}
