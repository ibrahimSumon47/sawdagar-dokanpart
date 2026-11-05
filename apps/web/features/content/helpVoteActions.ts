'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { helpVoteSchema } from './helpVoteInputs';
import { getPublicContentEntry } from './queries';
import { HELP_VISITOR_COOKIE, isHelpVisitorId, recordHelpVote } from './helpVotes';

/** The visitor cookie lasts a year; one browser counts as one reader. */
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const visitorCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: VISITOR_COOKIE_MAX_AGE,
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Reads the visitor id, minting and storing one on the first vote. */
async function readOrCreateVisitorId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(HELP_VISITOR_COOKIE)?.value;
  if (isHelpVisitorId(existing)) return existing;

  const visitorId = randomUUID();
  store.set(HELP_VISITOR_COOKIE, visitorId, visitorCookieOptions);
  return visitorId;
}

/** Stores one answer to "was this article helpful?" and returns to the article. */
export async function voteHelpAction(formData: FormData): Promise<void> {
  const slugValue = formData.get('slug');
  const slug = typeof slugValue === 'string' && slugPattern.test(slugValue) ? slugValue : '';
  const back = slug ? `/help/${slug}` : '/help';

  const parsed = helpVoteSchema.safeParse({
    entryId: formData.get('entryId'),
    helpful: formData.get('helpful'),
  });
  if (!parsed.success || !slug) redirect(back);

  const entry = await getPublicContentEntry('help', slug);
  if (!entry || entry.id !== parsed.data.entryId) redirect('/help');

  const visitorId = await readOrCreateVisitorId();
  await recordHelpVote(entry.id, visitorId, parsed.data.helpful);

  revalidatePath('/help');
  revalidatePath(back);
  redirect(back);
}
