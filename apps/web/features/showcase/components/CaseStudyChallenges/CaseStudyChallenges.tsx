import { SectionHeading } from '@sd/ui';
import type { CaseStudyChallenge } from '../../caseStudy';

export interface CaseStudyChallengesProps {
  challenges: readonly CaseStudyChallenge[];
}

/**
 * Four problems that needed more than a feature: double selling, duplicate
 * payment callbacks, an explainable ledger and metadata placement. Shown after
 * the decisions section.
 */
export function CaseStudyChallenges({ challenges }: CaseStudyChallengesProps) {
  return (
    <section className="mt-14 border-t border-line pt-10">
      <SectionHeading
        title="Hard parts"
        description="The problems that survived the first implementation."
      />
      <ul className="mt-4 divide-y divide-line">
        {challenges.map((challenge) => (
          <li key={challenge.title} className="py-6">
            <h3 className="font-serif text-xl leading-snug text-ink">{challenge.title}</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                  Problem
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{challenge.problem}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  What shipped
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{challenge.solution}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
