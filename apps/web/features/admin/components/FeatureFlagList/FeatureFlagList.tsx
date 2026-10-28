import { Badge, Button } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { toggleFeatureFlagAction } from '../../flagActions';
import type { FeatureFlagRecord } from '../../../content/flags';

export interface FeatureFlagListProps {
  flags: readonly FeatureFlagRecord[];
  copy: Dictionary['admin'];
  locale: Locale;
}

/** Storefront flags with an inline on/off switch and last edit date. */
export function FeatureFlagList({ flags, copy, locale }: FeatureFlagListProps) {
  if (flags.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
        {copy.noFlags}
      </p>
    );
  }

  return (
    <ul className="overflow-hidden rounded-sm border border-line bg-surface">
      {flags.map((flag) => (
        <li
          key={flag.key}
          className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 last:border-b-0"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">
              {locale === 'bn' ? flag.labelBn : flag.labelEn}
            </p>
            <p className="text-xs text-ink-muted">
              <code className="rounded-sm bg-background px-1 py-0.5">{flag.key}</code>
              {flag.descriptionEn
                ? ` · ${locale === 'bn' ? flag.descriptionBn : flag.descriptionEn}`
                : ''}
            </p>
          </div>
          <Badge tone={flag.enabled ? 'success' : 'neutral'}>
            {flag.enabled ? copy.enabledLabel : copy.disabledLabel}
          </Badge>
          <span className="text-xs text-ink-muted">{formatDate(flag.updatedAt, locale)}</span>
          <form action={toggleFeatureFlagAction}>
            <input type="hidden" name="key" value={flag.key} />
            <Button
              type="submit"
              name="enabled"
              value={flag.enabled ? 'off' : 'on'}
              variant="secondary"
              size="sm"
            >
              {flag.enabled ? copy.flagOff : copy.flagOn}
            </Button>
          </form>
        </li>
      ))}
    </ul>
  );
}
