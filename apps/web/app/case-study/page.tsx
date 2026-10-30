import type { Metadata } from 'next';
import { CaseStudyChallenges } from '../../features/showcase/components/CaseStudyChallenges';
import { CaseStudyDecisions } from '../../features/showcase/components/CaseStudyDecisions';
import { CaseStudyHero } from '../../features/showcase/components/CaseStudyHero';
import { CaseStudyJsonLd } from '../../features/showcase/components/CaseStudyJsonLd';
import { CaseStudyLinks } from '../../features/showcase/components/CaseStudyLinks';
import { CaseStudyMetrics } from '../../features/showcase/components/CaseStudyMetrics';
import {
  caseStudyChallenges,
  caseStudyDecisions,
  caseStudyLinks,
  caseStudyMetrics,
} from '../../features/showcase/caseStudy';

export const metadata: Metadata = {
  title: 'Case study',
  description:
    'How a bilingual multi-vendor marketplace demonstration was built: catalog, checkout, Seller Center, ledger, CMS and the engineering decisions behind them.',
  alternates: { canonical: '/case-study' },
};

/** Public write-up of the project: numbers, decisions, hard parts and links. */
export default function CaseStudyPage() {
  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <CaseStudyJsonLd />
      <CaseStudyHero />
      <CaseStudyMetrics metrics={caseStudyMetrics} />
      <CaseStudyDecisions decisions={caseStudyDecisions} />
      <CaseStudyChallenges challenges={caseStudyChallenges} />
      <CaseStudyLinks links={caseStudyLinks} />
    </article>
  );
}
