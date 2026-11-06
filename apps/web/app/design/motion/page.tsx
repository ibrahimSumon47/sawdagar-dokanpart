import type { Metadata } from 'next';
import { MotionCatalog } from '../../../features/design/components/MotionCatalog';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: `Motion · ${copy.design.title}`, description: copy.design.description };
}

/** Catalog of the storefront motion system. Linked from the footer only. */
export default async function MotionPage() {
  const copy = getDictionary(await getLocale());
  return <MotionCatalog copy={copy} />;
}
