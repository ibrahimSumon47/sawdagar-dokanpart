import { hasPermission, normalizeRole, permissionsFor } from '@sd/domain';
import type { Metadata } from 'next';
import { requireArea } from '../../features/auth/session';
import { AdminPanel } from '../../features/admin/components/AdminPanel';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';
import { getPrisma } from '../../lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.title, description: copy.admin.description };
}

/** Admin overview, filtered by the permissions of the signed-in role. */
export default async function AdminPage() {
  const { role } = await requireArea('admin', '/admin');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const prisma = getPrisma();

  const canReadUsers = hasPermission(role, 'admin:users:read');
  const canReadAudit = hasPermission(role, 'admin:audit:read');

  const [totalUsers, demoUsers, users, auditEntries] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isDemo: true } }),
    canReadUsers
      ? prisma.user.findMany({
          take: 20,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, email: true, role: true, isDemo: true, createdAt: true },
        })
      : Promise.resolve([]),
    canReadAudit
      ? prisma.auditLog.findMany({
          take: 20,
          orderBy: { createdAt: 'desc' },
          select: { id: true, action: true, actorEmail: true, createdAt: true },
        })
      : Promise.resolve([]),
  ]);

  return (
    <AdminPanel
      role={role}
      permissions={permissionsFor(role)}
      totalUsers={totalUsers}
      demoUsers={demoUsers}
      users={users.map((user) => ({ ...user, role: normalizeRole(user.role) }))}
      auditEntries={auditEntries}
      canReadUsers={canReadUsers}
      canReadAudit={canReadAudit}
      copy={copy}
      locale={locale}
    />
  );
}
