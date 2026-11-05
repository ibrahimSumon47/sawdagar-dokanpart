import { AdminPanelSkeleton } from '../../features/admin/components/AdminPanel';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

/** Matches the admin overview: count tiles, section links and recent activity. */
export default async function AdminLoading() {
  const copy = getDictionary(await getLocale());

  return <AdminPanelSkeleton label={copy.common.loadingLabel} />;
}
