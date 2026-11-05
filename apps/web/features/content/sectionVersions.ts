import { randomUUID } from 'node:crypto';
import type { Prisma } from '../../generated/prisma/client';
import type { SectionSnapshot } from './sectionTypes';

/** How many snapshots the history keeps per section. */
const VERSION_LIMIT = 10;

/**
 * Appends one snapshot to a section's history inside the caller's transaction
 * and deletes anything older than the ten newest versions.
 */
export async function appendSectionVersion(
  tx: Prisma.TransactionClient,
  sectionId: string,
  snapshot: SectionSnapshot,
  note: string,
  authorUserId: string,
): Promise<void> {
  const last = await tx.cmsSectionVersion.aggregate({
    where: { sectionId },
    _max: { version: true },
  });

  await tx.cmsSectionVersion.create({
    data: {
      id: randomUUID(),
      sectionId,
      version: (last._max.version ?? 0) + 1,
      snapshot: snapshot as unknown as Prisma.InputJsonValue,
      note,
      authorUserId,
    },
  });

  const stale = await tx.cmsSectionVersion.findMany({
    where: { sectionId },
    orderBy: { version: 'desc' },
    skip: VERSION_LIMIT,
    select: { id: true },
  });
  if (stale.length > 0) {
    await tx.cmsSectionVersion.deleteMany({ where: { id: { in: stale.map((row) => row.id) } } });
  }
}
