import type { Metadata } from 'next';
import { AdminSection } from '../../../features/admin/components/AdminSection';
import { ReviewModerationList } from '../../../features/admin/components/ReviewModerationList';
import { requireAdmin } from '../../../features/admin/guard';
import { getReviewModeration } from '../../../features/admin/reviewQueries';
import { SellerNotice } from '../../../features/seller/components/SellerNotice';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.reviewsTitle, description: copy.admin.reviewsDescription };
}

interface ReviewsPageProps {
  searchParams: Promise<{ saved?: string; error?: string }>;
}

/** Recent buyer reviews with a publish or hide decision. */
export default async function AdminReviewsPage({ searchParams }: ReviewsPageProps) {
  const params = await searchParams;
  const viewer = await requireAdmin('admin:moderate:reviews', '/admin/reviews');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const moderation = await getReviewModeration();

  const notice = params.error
    ? { message: copy.admin.reviewInvalid, tone: 'error' as const }
    : params.saved
      ? { message: copy.admin.reviewSaved, tone: 'success' as const }
      : null;

  return (
    <AdminSection
      active="reviews"
      title={copy.admin.reviewsTitle}
      description={copy.admin.reviewsDescription}
      role={viewer.role}
      copy={copy}
    >
      <div className="space-y-4">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <ReviewModerationList moderation={moderation} copy={copy.admin} locale={locale} />
      </div>
    </AdminSection>
  );
}
