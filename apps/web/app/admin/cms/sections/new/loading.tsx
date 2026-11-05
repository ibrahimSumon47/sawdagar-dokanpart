import { ContentEditorSkeleton } from '../../../../../features/admin/components/ContentEditorForm';
import { getDictionary } from '../../../../../i18n';
import { getLocale } from '../../../../../i18n/getLocale';

/** Matches the section editor: bilingual fields, media field and the save button. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return <ContentEditorSkeleton label={copy.common.loadingLabel} />;
}
