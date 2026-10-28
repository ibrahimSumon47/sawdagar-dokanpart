import type { Metadata } from 'next';
import { requireViewer } from '../../features/auth/session';
import { productGridLabels } from '../../features/catalog/components/ProductGrid';
import { getWishlistProducts } from '../../features/shop/queries';
import { WishlistView } from '../../features/shop/components/WishlistView';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.shop.wishlistTitle, description: copy.shop.wishlistDescription };
}

/** Products the signed-in buyer saved, with hearts that remove them in place. */
export default async function WishlistPage() {
  const viewer = await requireViewer('/wishlist');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const products = await getWishlistProducts(viewer.id);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-serif text-title leading-tight text-ink">{copy.shop.wishlistTitle}</h1>
        <p className="mt-2 text-ink-muted">{copy.shop.wishlistDescription}</p>
      </header>
      <div className="mt-8">
        <WishlistView
          products={products}
          locale={locale}
          labels={productGridLabels(products, copy.catalog)}
          empty={{
            title: copy.shop.wishlistEmptyTitle,
            body: copy.shop.wishlistEmptyBody,
            action: copy.shop.wishlistEmptyAction,
          }}
        />
      </div>
    </div>
  );
}
