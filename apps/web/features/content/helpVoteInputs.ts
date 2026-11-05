import { z } from 'zod';

/** One "was this helpful" answer posted from a Help article. */
export const helpVoteSchema = z.object({
  entryId: z.string().trim().min(1).max(80),
  helpful: z.enum(['yes', 'no']).transform((value) => value === 'yes'),
});

export type HelpVoteInput = z.infer<typeof helpVoteSchema>;
