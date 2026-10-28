import type { Metadata } from 'next';
import { AccountReviewsPanel } from '../../../features/account/components/AccountReviewsPanel';
import { AccountSection } from '../../../features/account/components/AccountSection';
import { requireViewer } from '../../../features/auth/session';
import { getReviewableItems, getUserReviews } from '../../../features/reviews/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.account.reviewsTitle };
}

/** Verified-purchase reviews: write one, then read the ones already published. */
export default async function AccountReviewsPage() {
  const viewer = await requireViewer('/account/reviews');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const [awaiting, published] = await Promise.all([
    getReviewableItems(viewer.id),
    getUserReviews(viewer.id),
  ]);

  return (
    <AccountSection
      active="reviews"
      title={copy.account.reviewsTitle}
      description={copy.account.reviewsDescription}
      copy={copy.account}
    >
      <AccountReviewsPanel
        awaiting={awaiting}
        published={published}
        copy={copy.account}
        reviewsCopy={copy.reviews}
        locale={locale}
      />
    </AccountSection>
  );
}
