import { SectionHeading } from '@sd/ui';
import type { CaseStudyLink } from '../../caseStudy';

export interface CaseStudyLinksProps {
  links: readonly CaseStudyLink[];
}

/**
 * Where to read more: the deployment, repository and the documents a reviewer
 * would open next. Closes the case study page.
 */
export function CaseStudyLinks({ links }: CaseStudyLinksProps) {
  return (
    <section className="mt-14 border-t border-line pt-10">
      <SectionHeading title="Where to look next" />
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href} className="border-l border-line pl-4">
            <a
              href={link.href}
              className="font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {link.label}
            </a>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{link.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
