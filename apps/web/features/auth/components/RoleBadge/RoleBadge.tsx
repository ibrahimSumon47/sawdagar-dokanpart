import { hasArea, type PlatformRole } from '@sd/domain';
import { Badge } from '@sd/ui';

export interface RoleBadgeProps {
  role: PlatformRole;
  /** Localised role name. */
  label: string;
}

/** Role label with a tone that reflects the area the role belongs to. */
export function RoleBadge({ role, label }: RoleBadgeProps) {
  const tone = hasArea(role, 'admin') ? 'accent' : hasArea(role, 'seller') ? 'success' : 'neutral';

  return <Badge tone={tone}>{label}</Badge>;
}
