import type { Metadata } from 'next';
import { AdminSection } from '../../../features/admin/components/AdminSection';
import { AuditLogTable } from '../../../features/admin/components/AuditLogTable';
import { AuditPager } from '../../../features/admin/components/AuditPager';
import { getAuditPage } from '../../../features/admin/auditQueries';
import { requireAdmin } from '../../../features/admin/guard';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.auditTitle, description: copy.admin.auditDescription };
}

interface AuditPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** Append-only audit log with page links. */
export default async function AdminAuditPage({ searchParams }: AuditPageProps) {
  const params = await searchParams;
  const requested = Number.parseInt(params.page ?? '1', 10);
  const viewer = await requireAdmin('admin:audit:read', '/admin/audit');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const audit = await getAuditPage(Number.isFinite(requested) ? requested : 1);

  return (
    <AdminSection
      active="audit"
      title={copy.admin.auditTitle}
      description={copy.admin.auditDescription}
      role={viewer.role}
      copy={copy}
    >
      <div className="space-y-2">
        <AuditLogTable audit={audit} copy={copy.admin} locale={locale} />
        <AuditPager page={audit.page} pageCount={audit.pageCount} copy={copy.admin} />
      </div>
    </AdminSection>
  );
}
