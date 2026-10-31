import type { Metadata } from 'next';
import { ProjectAbout } from '../../../features/about/components/ProjectAbout';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';
import { site } from '../../../lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return {
    title: copy.about.projectTitle,
    description: copy.about.projectIntro,
    alternates: { canonical: '/about/project' },
  };
}

/** Public page for the project links that no longer belong in the header. */
export default async function AboutProjectPage() {
  const copy = getDictionary(await getLocale());
  return <ProjectAbout copy={copy} repositoryUrl={site.repositoryUrl} />;
}
