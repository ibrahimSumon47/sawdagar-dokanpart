import type { Metadata } from 'next';
import { AccountQuestionsPanel } from '../../../features/account/components/AccountQuestionsPanel';
import { AccountSection } from '../../../features/account/components/AccountSection';
import { requireViewer } from '../../../features/auth/session';
import { getUserQuestions } from '../../../features/questions/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.account.questionsTitle };
}

/** Questions the buyer asked, with the seller answers received so far. */
export default async function AccountQuestionsPage() {
  const viewer = await requireViewer('/account/questions');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const questions = await getUserQuestions(viewer.id);

  return (
    <AccountSection
      active="questions"
      title={copy.account.questionsTitle}
      description={copy.account.questionsDescription}
      copy={copy.account}
    >
      <AccountQuestionsPanel
        questions={questions}
        copy={copy.account}
        questionsCopy={copy.questions}
        locale={locale}
      />
    </AccountSection>
  );
}
