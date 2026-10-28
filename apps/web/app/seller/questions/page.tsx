import type { Metadata } from 'next';
import { SellerEmpty } from '../../../features/seller/components/SellerEmpty';
import { SellerNotice } from '../../../features/seller/components/SellerNotice';
import { SellerQuestionList } from '../../../features/seller/components/SellerQuestionList';
import { SellerSection } from '../../../features/seller/components/SellerSection';
import { sellerNotice } from '../../../features/seller/notice';
import { getSellerQuestions } from '../../../features/seller/queries';
import { requireSellerPage } from '../../../features/seller/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.questionsTitle };
}

interface QuestionsPageProps {
  searchParams: Promise<{ saved?: string; error?: string }>;
}

/** Buyer questions across the store's products. */
export default async function SellerQuestionsPage({ searchParams }: QuestionsPageProps) {
  const params = await searchParams;
  const { access } = await requireSellerPage('/seller/questions');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const questions = await getSellerQuestions(access.organizationId);
  const notice = sellerNotice(copy.seller, params);

  return (
    <SellerSection
      active="questions"
      title={copy.seller.questionsTitle}
      description={copy.seller.questionsDescription}
      copy={copy.seller}
    >
      <div className="space-y-4">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        {questions.length === 0 ? (
          <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
            {copy.seller.noQuestions}
          </p>
        ) : (
          <SellerQuestionList questions={questions} copy={copy.seller} locale={locale} />
        )}
      </div>
    </SellerSection>
  );
}
