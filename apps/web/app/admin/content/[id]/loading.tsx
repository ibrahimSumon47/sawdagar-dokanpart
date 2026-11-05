import { ContentEditorSkeleton } from '../../../../features/admin/components/ContentEditorForm';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

/** Matches the CMS editor: bilingual fields, body editors and the publish button. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return <ContentEditorSkeleton label={copy.common.loadingLabel} />;
}
