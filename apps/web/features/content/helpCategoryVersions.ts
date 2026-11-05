import { randomUUID } from 'node:crypto';
import type { Prisma } from '../../generated/prisma/client';
import type { HelpCategorySnapshot } from './helpCategoryTypes';

/** How many snapshots the history keeps per category. */
const VERSION_LIMIT = 10;

/**
 * Appends one snapshot to a category's history inside the caller's transaction
 * and deletes anything older than the ten newest versions.
 */
export async function appendHelpCategoryVersion(
  tx: Prisma.TransactionClient,
  categoryId: string,
  snapshot: HelpCategorySnapshot,
  note: string,
  authorUserId: string,
): Promise<void> {
  const last = await tx.helpCategoryVersion.aggregate({
    where: { categoryId },
    _max: { version: true },
  });

  await tx.helpCategoryVersion.create({
    data: {
      id: randomUUID(),
      categoryId,
      version: (last._max.version ?? 0) + 1,
      snapshot: snapshot as unknown as Prisma.InputJsonValue,
      note,
      authorUserId,
    },
  });

  const stale = await tx.helpCategoryVersion.findMany({
    where: { categoryId },
    orderBy: { version: 'desc' },
    skip: VERSION_LIMIT,
    select: { id: true },
  });
  if (stale.length > 0) {
    await tx.helpCategoryVersion.deleteMany({ where: { id: { in: stale.map((row) => row.id) } } });
  }
}
