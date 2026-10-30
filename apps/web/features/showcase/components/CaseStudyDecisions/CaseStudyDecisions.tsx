import { SectionHeading } from '@sd/ui';
import type { CaseStudyDecision } from '../../caseStudy';

export interface CaseStudyDecisionsProps {
  decisions: readonly CaseStudyDecision[];
}

/**
 * The engineering choices that shaped the product, each with the reasoning
 * behind it. Rendered after the headline numbers on `/case-study`.
 */
export function CaseStudyDecisions({ decisions }: CaseStudyDecisionsProps) {
  return (
    <section className="mt-14 border-t border-line pt-10">
      <SectionHeading
        title="Decisions that shaped it"
        description="Each choice fixed a failure the simpler option would have hidden."
      />
      <dl className="mt-4 divide-y divide-line">
        {decisions.map((decision) => (
          <div key={decision.title} className="grid gap-3 py-6 md:grid-cols-[15rem_minmax(0,1fr)]">
            <dt className="font-serif text-xl leading-snug text-ink">{decision.title}</dt>
            <dd className="text-sm leading-relaxed text-ink-muted">{decision.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
