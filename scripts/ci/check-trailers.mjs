/**
 * Fails when any commit in the checked-out history carries a Co-Authored-By trailer.
 *
 * Runs in CI on every push to main, with a full clone so the whole history is read. The history
 * was rewritten once to remove tool attribution, and the hook in .husky/commit-msg strips the
 * line from new messages, so a match here means one of those two guards stopped working.
 */
import { execFileSync } from 'node:child_process';

const output = execFileSync('git', ['log', '--format=%h %s', '-i', '--grep=Co-Authored-By'], {
  encoding: 'utf8',
});

const offenders = output
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

if (offenders.length > 0) {
  process.stdout.write(`${offenders.length} commit(s) carry a Co-Authored-By trailer:\n`);
  for (const line of offenders) process.stdout.write(`  ${line}\n`);
  process.exit(1);
}

process.stdout.write('No commit carries a Co-Authored-By trailer.\n');
