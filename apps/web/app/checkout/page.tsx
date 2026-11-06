import type { Metadata } from 'next';
import { getViewer } from '../../features/auth/session';
import { CheckoutView } from '../../features/checkout/components/CheckoutView';
import { getCheckoutData, getGuestCheckoutData } from '../../features/checkout/queries';
import { pageLayout } from '../../features/shell/pageLayout';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.checkout.title, description: copy.checkout.description };
}

/** Checkout for signed-in buyers (saved addresses) and guests (single-page form). */
export default async function CheckoutPage() {
  const viewer = await getViewer();
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const data = viewer ? await getCheckoutData(viewer.id) : await getGuestCheckoutData();

  return (
    <div className={pageLayout.wide}>
      <header className="max-w-2xl">
        <h1 className="font-serif text-title leading-tight text-ink">{copy.checkout.title}</h1>
        <p className="mt-2 text-ink-muted">{copy.checkout.description}</p>
      </header>
      <div className="mt-8">
        <CheckoutView
          items={data.items}
          coupon={data.coupon}
          addresses={data.addresses}
          isGuest={viewer === null}
          copy={copy.checkout}
          locale={locale}
        />
      </div>
    </div>
  );
}
