import { Badge, Button } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { formatTaka } from '@sd/domain';
import { togglePromotionAction } from '../../storeActions';
import type { SellerPromotionRecord } from '../../queries';

export interface SellerPromotionListProps {
  promotions: readonly SellerPromotionRecord[];
  copy: Dictionary['seller'];
  locale: Locale;
}

/** Coupon rows with their rule, usage and an activate or deactivate action. */
export function SellerPromotionList({ promotions, copy, locale }: SellerPromotionListProps) {
  const typeLabel = (type: string) =>
    type === 'percent' ? copy.percent : type === 'fixed' ? copy.fixed : copy.freeShipping;
  const valueLabel = (promotion: SellerPromotionRecord) => {
    if (promotion.type === 'percent') return `${promotion.value}%`;
    if (promotion.type === 'fixed') return formatTaka(promotion.value, locale);
    return copy.freeShipping;
  };

  return (
    <ul className="divide-y divide-line rounded-sm border border-line bg-surface">
      {promotions.map((promotion) => (
        <li
          key={promotion.id}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-sm font-semibold text-ink">{promotion.code}</p>
              <Badge tone={promotion.active ? 'success' : 'neutral'}>
                {promotion.active ? copy.active : copy.inactive}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              {typeLabel(promotion.type)} · {valueLabel(promotion)} · {copy.minSubtotal}{' '}
              {formatTaka(promotion.minSubtotalMinor, locale)} · {copy.redemptions}{' '}
              {promotion.redemptions}
              {promotion.endsAt
                ? ` · ${copy.endsAt} ${formatDate(promotion.endsAt, locale)}`
                : null}
            </p>
          </div>
          <form action={togglePromotionAction}>
            <input type="hidden" name="promotionId" value={promotion.id} />
            <Button type="submit" variant="secondary" size="sm">
              {promotion.active ? copy.deactivate : copy.activate}
            </Button>
          </form>
        </li>
      ))}
    </ul>
  );
}
