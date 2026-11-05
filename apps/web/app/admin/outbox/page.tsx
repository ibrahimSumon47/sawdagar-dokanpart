import type { Metadata } from 'next';
import { AdminSection } from '../../../features/admin/components/AdminSection';
import { MailOutboxList } from '../../../features/admin/components/MailOutboxList';
import { requireAdmin } from '../../../features/admin/guard';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';
import { getPrisma } from '../../../lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.outboxTitle, description: copy.admin.outboxBody };
}

/** Verification and reset mail, newest first, so the owner can open the links. */
export default async function AdminOutboxPage() {
  const viewer = await requireAdmin('admin:audit:read', '/admin/outbox');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const messages = await getPrisma().mailOutbox.findMany({
    take: 40,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      toEmail: true,
      subject: true,
      bodyText: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <AdminSection
      active="outbox"
      title={copy.admin.outboxTitle}
      description={copy.admin.outboxBody}
      role={viewer.role}
      copy={copy}
    >
      <MailOutboxList messages={messages} emptyLabel={copy.admin.outboxEmpty} locale={locale} />
    </AdminSection>
  );
}
