# Git hygiene report

Audited on 2026-11-07 after the attribution cleanup, with `git` 2.x on the owner's Windows machine.

## Summary

| Check                         | Result                                                                    |
| ----------------------------- | ------------------------------------------------------------------------- |
| Branches                      | One: `main` (tracking `origin/main`). No feature branches, forks or tags. |
| Commits                       | 235                                                                       |
| Distinct authors              | 1: `Md Ibrahim Hossain Sumon <ibrahimsumon005@gmail.com>`                 |
| Distinct committers           | 1: the same identity                                                      |
| Commits with `Co-Authored-By` | 0                                                                         |
| History rewritten             | Once, on 2026-11-07, at the owner's request, to remove tool attribution   |

## The cleanup

24 commits from 2026-11-06, during the animation pass (R7 and R8), ended with
`Co-Authored-By: Codebuff <noreply@codebuff.com>`. The owner asked for the line to be removed from
every message, so the whole of `main` was rewritten with:

```bash
git filter-branch -f --msg-filter 'sh .git/trailer-filter.sh' -- main
git push --force-with-lease origin main
```

The message filter dropped the trailer line and any blank lines it left at the end of a message. No
file content changed: `git diff backup/before-trailer-cleanup HEAD --stat` was empty, the commit
count stayed at 235, and every author and committer line stayed the owner's. Every commit hash
changed, so references to old short hashes in these documents were regenerated from the rewrite.

The pre-rewrite history is kept in two places: a mirror clone outside the repository at
`../sawdagar-dokanpart-backup.git`, and the local tag `backup/before-trailer-cleanup`, which is not
pushed. `refs/original/refs/heads/main` was deleted and the repository was repacked afterwards.

## How this is enforced now

- `.husky/commit-msg` deletes any `Co-Authored-By:` line from the message before commitlint reads it,
  so a new commit cannot carry one even if the line is typed.
- `scripts/ci/check-trailers.mjs` scans the full history (`git log -i --grep=Co-Authored-By`) and exits
  non-zero on a match; the `Commit trailers` job in `.github/workflows/ci.yml` runs it on every push.
- `scripts/ci/r10-check.mjs` still requires this report to state the count, so the number stays
  visible rather than only living in the workflow log.

## How this was measured

```bash
git branch -a --format='%(refname:short)'
git rev-list --count HEAD
git log --format='%an <%ae>' | sort | uniq -c
git log --format='%cn <%ce>' | sort | uniq -c
git log --format=%B | grep -ci 'co-authored'
git diff backup/before-trailer-cleanup HEAD --stat
```
