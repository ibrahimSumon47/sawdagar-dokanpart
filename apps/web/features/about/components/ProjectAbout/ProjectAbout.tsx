import { ButtonLink } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';

export interface ProjectAboutProps {
  copy: Dictionary;
  /** Public repository URL, opened in a new tab. */
  repositoryUrl: string;
}

/**
 * Body of /about/project: what the store is, what the seeded data represents,
 * how it is built, and the project links that used to sit in the header.
 * The README keeps the longer engineering story.
 */
export function ProjectAbout({ copy, repositoryUrl }: ProjectAboutProps) {
  const links = [
    { label: copy.footer.caseStudy, href: '/case-study' },
    { label: copy.footer.design, href: '/design' },
    { label: copy.footer.csLab, href: '/cs-lab' },
    { label: copy.footer.credits, href: '/credits' },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {copy.footer.projectTitle}
      </p>
      <h1 className="mt-3 text-display font-serif leading-tight text-ink">
        {copy.about.projectTitle}
      </h1>
      <p className="mt-4 text-lead leading-relaxed text-ink-muted">{copy.about.projectIntro}</p>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="font-serif text-2xl text-ink">{copy.about.dataTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{copy.about.dataBody}</p>
      </section>

      <section className="mt-8 border-t border-line pt-6">
        <h2 className="font-serif text-2xl text-ink">{copy.about.buildTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{copy.about.buildBody}</p>
      </section>

      <section className="mt-8 border-t border-line pt-6">
        <h2 className="font-serif text-2xl text-ink">{copy.about.linksTitle}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-accent underline underline-offset-4">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={repositoryUrl} className="text-accent underline underline-offset-4">
              {copy.footer.repository}
            </a>
          </li>
        </ul>
      </section>

      <div className="mt-10">
        <ButtonLink href="/catalog">{copy.about.backToShop}</ButtonLink>
      </div>
    </div>
  );
}
