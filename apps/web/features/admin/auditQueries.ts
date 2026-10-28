import { getPrisma } from '../../lib/prisma';

export interface AuditRow {
  id: string;
  action: string;
  actorEmail: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: Date;
}

export interface AuditPage {
  rows: AuditRow[];
  total: number;
  page: number;
  pageCount: number;
}

const PAGE_SIZE = 40;

/** One page of the append-only audit log, newest first. */
export async function getAuditPage(requestedPage: number): Promise<AuditPage> {
  const prisma = getPrisma();
  const total = await prisma.auditLog.count();
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), pageCount);

  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      action: true,
      actorEmail: true,
      targetType: true,
      targetId: true,
      createdAt: true,
    },
  });

  return { rows, total, page, pageCount };
}
