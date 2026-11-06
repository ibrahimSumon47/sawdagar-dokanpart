import { ButtonLink } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { CopyOrderCode } from '../CopyOrderCode';

export interface GuestOrderHeaderProps {
  code: string;
  placedAt: Date;
  copy: Dictionary['checkout'];
  locale: Locale;
  trackHref: string;
}

/**
 * Large order code with a copy button and the Track this order link. Shown on
 * the guest confirmation page in place of the signed-in order title.
 */
export function GuestOrderHeader({
  code,
  placedAt,
  copy,
  locale,
  trackHref,
}: GuestOrderHeaderProps) {
  return (
    <header className="space-y-4 border-b border-line pb-6">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">{copy.guestOrderTitle}</p>
      <p className="text-sm text-ink-muted">{copy.guestOrderBody}</p>
      <div>
        <p className="text-xs font-semibold text-ink">{copy.orderCodeLabel}</p>
        <p
          data-testid="order-code"
          className="mt-1 font-mono text-3xl font-semibold tracking-wider text-ink sm:text-4xl"
        >
          {code}
        </p>
      </div>
      <p className="text-sm text-ink-muted">
        {copy.placedOn} {formatDate(placedAt, locale)}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <CopyOrderCode code={code} copyLabel={copy.copyCode} copiedLabel={copy.copiedCode} />
        <ButtonLink href={trackHref} variant="secondary">
          {copy.trackOrder}
        </ButtonLink>
      </div>
      <p className="text-xs text-ink-muted">{copy.trackOrderBody}</p>
    </header>
  );
}
