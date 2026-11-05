import { getPrisma } from '../../lib/prisma';

/** First-party cookie that identifies one browser voting on help articles. */
export const HELP_VISITOR_COOKIE = 'sd_help_visitor';

/** Counts shown under an article, plus the visitor's own vote when known. */
export interface HelpVoteSummary {
  helpful: number;
  notHelpful: number;
  /** True or false for the visitor's vote, null when they have not voted. */
  mine: boolean | null;
}

/** A visitor id is a generated UUID; anything else is treated as absent. */
export function isHelpVisitorId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f-]{36}$/i.test(value);
}

/** Vote counts for one article and the visitor's own vote, if any. */
export async function getHelpVoteSummary(
  entryId: string,
  visitorId: string | null,
): Promise<HelpVoteSummary> {
  const prisma = getPrisma();
  const [grouped, mine] = await Promise.all([
    prisma.helpArticleVote.groupBy({ by: ['helpful'], where: { entryId }, _count: true }),
    visitorId
      ? prisma.helpArticleVote.findUnique({
          where: { entryId_visitorId: { entryId, visitorId } },
          select: { helpful: true },
        })
      : null,
  ]);

  const countFor = (helpful: boolean) =>
    grouped.find((row) => row.helpful === helpful)?._count ?? 0;

  return {
    helpful: countFor(true),
    notHelpful: countFor(false),
    mine: mine ? mine.helpful : null,
  };
}

/** Stores or replaces one visitor's vote for an article. */
export async function recordHelpVote(
  entryId: string,
  visitorId: string,
  helpful: boolean,
): Promise<void> {
  await getPrisma().helpArticleVote.upsert({
    where: { entryId_visitorId: { entryId, visitorId } },
    create: { id: crypto.randomUUID(), entryId, visitorId, helpful },
    update: { helpful },
  });
}
