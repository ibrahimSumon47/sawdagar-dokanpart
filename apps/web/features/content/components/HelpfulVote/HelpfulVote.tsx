import type { Dictionary } from '../../../../i18n';
import { voteHelpAction } from '../../helpVoteActions';
import type { HelpVoteSummary } from '../../helpVotes';

export interface HelpfulVoteProps {
  /** CMS entry the vote belongs to. */
  entryId: string;
  /** Article slug, used to send the reader back to the same page. */
  slug: string;
  /** Current counts and this visitor's own answer. */
  summary: HelpVoteSummary;
  copy: Dictionary['content'];
}

const buttonBase =
  'min-h-10 rounded-sm border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const buttonIdle = 'border-line bg-background text-ink hover:border-accent hover:text-accent';
const buttonChosen = 'border-accent bg-accent/10 text-accent';

/** Asks readers whether a Help article answered their question and keeps the count. */
export function HelpfulVote({ entryId, slug, summary, copy }: HelpfulVoteProps) {
  const total = summary.helpful + summary.notHelpful;
  const counts = copy.helpHelpfulCounts
    .replace('{helpful}', String(summary.helpful))
    .replace('{total}', String(total));

  return (
    <section
      aria-labelledby="helpful-heading"
      className="mt-10 rounded-sm border border-line bg-surface-muted p-6"
    >
      <h2 id="helpful-heading" className="font-serif text-title text-ink">
        {copy.helpHelpfulTitle}
      </h2>
      <form action={voteHelpAction} className="mt-4 flex flex-wrap items-center gap-2">
        <input type="hidden" name="entryId" value={entryId} />
        <input type="hidden" name="slug" value={slug} />
        <button
          type="submit"
          name="helpful"
          value="yes"
          aria-pressed={summary.mine === true}
          className={`${buttonBase} ${summary.mine === true ? buttonChosen : buttonIdle}`}
        >
          {copy.helpHelpfulYes}
        </button>
        <button
          type="submit"
          name="helpful"
          value="no"
          aria-pressed={summary.mine === false}
          className={`${buttonBase} ${summary.mine === false ? buttonChosen : buttonIdle}`}
        >
          {copy.helpHelpfulNo}
        </button>
      </form>
      {total > 0 ? <p className="mt-3 text-sm text-ink-muted">{counts}</p> : null}
      {summary.mine !== null ? (
        <p role="status" className="mt-2 text-sm font-medium text-accent">
          {copy.helpHelpfulThanks}
        </p>
      ) : null}
    </section>
  );
}
