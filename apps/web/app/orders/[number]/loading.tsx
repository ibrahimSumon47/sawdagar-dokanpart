import { OrderConfirmationSkeleton } from '../../../features/checkout/components/OrderConfirmation';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

/** Matches the order receipt: header, item list and payment summary. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return <OrderConfirmationSkeleton label={copy.common.loadingLabel} />;
}
