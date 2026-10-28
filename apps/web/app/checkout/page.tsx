import type { Metadata } from 'next';
import { requireViewer } from '../../features/auth/session';
import { CheckoutView } from '../../features/checkout/components/CheckoutView';
import { getCheckoutData } from '../../features/checkout/queries';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.checkout.title, description: copy.checkout.description };
}

/** Signed-in checkout with saved addresses and two sandbox payment methods. */
export default async function CheckoutPage() {
  const viewer = await requireViewer('/checkout');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const data = await getCheckoutData(viewer.id);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-serif text-title leading-tight text-ink">{copy.checkout.title}</h1>
        <p className="mt-2 text-ink-muted">{copy.checkout.description}</p>
      </header>
      <div className="mt-8">
        <CheckoutView
          items={data.items}
          coupon={data.coupon}
          addresses={data.addresses}
          copy={copy.checkout}
          locale={locale}
        />
      </div>
    </div>
  );
}
