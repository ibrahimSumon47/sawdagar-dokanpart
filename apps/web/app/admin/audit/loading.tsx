import { AdminTableSkeleton } from '../../../features/admin/components/AdminTableSkeleton';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

/** Matches an admin list page: section frame, search row and table. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return (
    <AdminTableSkeleton label={copy.common.loadingLabel} tableLabel={copy.common.loadingTable} />
  );
}
