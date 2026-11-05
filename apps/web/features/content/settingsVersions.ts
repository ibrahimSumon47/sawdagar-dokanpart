import { randomUUID } from 'node:crypto';
import type { Prisma } from '../../generated/prisma/client';
import type { SettingsSnapshot } from './settingsTypes';

/** How many snapshots the history keeps. */
const VERSION_LIMIT = 10;

/**
 * Appends one settings snapshot inside the caller's transaction and deletes
 * anything older than the ten newest versions.
 */
export async function appendSettingsVersion(
  tx: Prisma.TransactionClient,
  settingsId: string,
  snapshot: SettingsSnapshot,
  note: string,
  authorUserId: string,
): Promise<void> {
  const last = await tx.siteSettingsVersion.aggregate({
    where: { settingsId },
    _max: { version: true },
  });

  await tx.siteSettingsVersion.create({
    data: {
      id: randomUUID(),
      settingsId,
      version: (last._max.version ?? 0) + 1,
      snapshot: snapshot as unknown as Prisma.InputJsonValue,
      note,
      authorUserId,
    },
  });

  const stale = await tx.siteSettingsVersion.findMany({
    where: { settingsId },
    orderBy: { version: 'desc' },
    skip: VERSION_LIMIT,
    select: { id: true },
  });
  if (stale.length > 0) {
    await tx.siteSettingsVersion.deleteMany({ where: { id: { in: stale.map((row) => row.id) } } });
  }
}
