import { SectionHeading } from '@sd/ui';
import type { CaseStudyMetric } from '../../caseStudy';

export interface CaseStudyMetricsProps {
  metrics: readonly CaseStudyMetric[];
}

/**
 * Headline numbers for the case study as a ruled grid: catalog size, roles, test
 * count, measured performance and the CS modules. Rendered once below the
 * opening block.
 */
export function CaseStudyMetrics({ metrics }: CaseStudyMetricsProps) {
  return (
    <section className="mt-14 border-t border-line pt-10">
      <SectionHeading
        title="The project in numbers"
        description="Measured on the deployment and in the repository, not targets."
      />
      <dl className="mt-6 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-surface p-5">
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              {metric.label}
            </dt>
            <dd className="mt-2 font-serif text-3xl leading-none text-ink">{metric.value}</dd>
            <dd className="mt-3 text-sm leading-relaxed text-ink-muted">{metric.hint}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
