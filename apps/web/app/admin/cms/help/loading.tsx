import { AdminTableSkeleton } from '../../../../features/admin/components/AdminTableSkeleton';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

/** Matches the sections list: section frame and one row per section. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return (
    <AdminTableSkeleton label={copy.common.loadingLabel} tableLabel={copy.common.loadingTable} />
  );
}
