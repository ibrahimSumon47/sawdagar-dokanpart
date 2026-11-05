import { CheckoutViewSkeleton } from '../../features/checkout/components/CheckoutView';
import { pageLayout } from '../../features/shell/pageLayout';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

/** Matches checkout: page heading, address and payment panels beside the summary card. */
export default async function CheckoutLoading() {
  const copy = getDictionary(await getLocale());

  return (
    <div className={pageLayout.wide}>
      <header className="max-w-2xl">
        <h1 className="font-serif text-title leading-tight text-ink">{copy.checkout.title}</h1>
        <p className="mt-2 text-ink-muted">{copy.checkout.description}</p>
      </header>
      <div className="mt-8">
        <CheckoutViewSkeleton label={copy.common.loadingLabel} />
      </div>
    </div>
  );
}
