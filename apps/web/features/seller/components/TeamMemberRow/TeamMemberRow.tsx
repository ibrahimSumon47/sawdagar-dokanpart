import { Badge } from '@sd/ui';

export interface TeamMemberRowProps {
  name: string;
  email: string;
  /** Localised store role for this member. */
  roleLabel: string;
  joinedLabel: string;
  joinedAt: string;
}

/** One store team member, stacked so it stays readable on phones. */
export function TeamMemberRow({
  name,
  email,
  roleLabel,
  joinedLabel,
  joinedAt,
}: TeamMemberRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{name}</p>
        <p className="truncate text-xs text-ink-muted">{email}</p>
      </div>
      <Badge tone="neutral">{roleLabel}</Badge>
      <span className="text-xs tabular-nums text-ink-muted">
        {joinedLabel} · {joinedAt}
      </span>
    </li>
  );
}
