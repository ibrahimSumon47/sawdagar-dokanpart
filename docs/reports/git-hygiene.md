# Git hygiene report

Audited on 2026-11-07 at commit `82dd626`, with `git` 2.x on the owner's Windows machine.

## Summary

| Check                         | Result                                                                     |
| ----------------------------- | -------------------------------------------------------------------------- |
| Branches                      | One: `main` (tracking `origin/main`). No feature branches, forks or tags.  |
| Commits                       | 224                                                                        |
| Distinct authors              | 1: `Md Ibrahim Hossain Sumon <ibrahimsumon005@gmail.com>`                  |
| Distinct committers           | 1: the same identity                                                       |
| Commits with `Co-Authored-By` | 24, all from 2026-11-06                                                    |
| Commits after this audit      | None carry a trailer; every commit from `82dd626` onward is authored alone |
| History rewritten             | Never. No force-push, amend or rebase of pushed commits was performed      |

## How this was measured

```bash
git branch -a --format='%(refname:short)'
git rev-list --count HEAD
git log --format='%an <%ae>' | sort | uniq -c
git log --format='%cn <%ce>' | sort | uniq -c
git log --grep='Co-Authored-By' -i --format='%h %ad %s' --date=short
```

## The 24 commits with a `Co-Authored-By` trailer

Every one of them is dated 2026-11-06, during the animation pass (R7 and R8). Newest first:

```
c887adb bd3026d 4e02190 a67ab96 eed2d78 d0b10ad c3e327b de0cb47
ba0cccc 3e7e9c1 306b49c 1d7d0be b202af5 5154a51 06d6832 5a0373f
0aa4acb 120dae3 a1472a2 b6b0d91 2000024 dd055d6 bde3a24 d8f0094
```

They add no author: the trailer names a tool, and every one of the 224 commits was authored and
committed by the owner's own identity.

## What the owner may want to do

Git history is not rewritten by an agent. Removing the trailer from those 24 commits means an
interactive rebase over the range `d8f0094^..c887adb` followed by a force-push, which the working
agreement forbids unless the owner asks for it. Up to the owner:

```bash
git rebase -i d8f0094^   # drop every Co-Authored-By line in the listed commits
git push --force-with-lease origin main
```

If the history stays as it is, the repository still shows one human author for every commit; the
trailer only explains which tool helped write the code.
