# Tooling

This file records the global agent tooling for this project (spec `docs/spec/06-revision-1.md`, section 9). Everything here is free, needs no account or paid key, and runs without administrator rights. Anything else is listed under "Skipped".

Verified on 2026-11-06 on Windows with Node 24 and npm 11.

## Locations

- Active skills (loaded by the agent): `%USERPROFILE%\.agents\skills`, 94 folders.
- Library (installed, not loaded until activated): `%USERPROFILE%\.agents\skill-library`, with the loader `skill-library.mjs`.
- Source clones of the 12 reference repos: `%USERPROFILE%\.agents\skill-install-staging`. The spec suggested `%USERPROFILE%\.agents\library`; the earlier install used this staging folder and it has not been renamed.

## Installed tools

| Tool                           | Installed?                 | Where                                               | Version           | Notes                                                                                                                                                                                                               |
| ------------------------------ | -------------------------- | --------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| skills CLI (`npx skills`)      | yes                        | `npx -y skills`                                     | run on demand     | `npx skills list -g` shows the global skills.                                                                                                                                                                       |
| REA (`rea-agents`)             | CLI only                   | global `rea`                                        | 6.8.0             | MCP registration not added: Freebuff is not a supported host. 4 REA skills (`rea-analysis-optimization`, `rea-changelog-update`, `rea-ci-tests-audit`, `rea-tool-design`) are in the lock file but missing on disk. |
| claude-seo                     | yes, 26 skills             | `~\.agents\skills\seo*`                             | in install report | Python 3.14.7 and Chromium ready (`claude-seo doctor`). Subagent definitions not installed: Freebuff has no subagent registry.                                                                                      |
| replica-skill                  | yes, 11 skills             | `~\.agents\skills\replica-*`                        | in install report | Use for UX analysis only.                                                                                                                                                                                           |
| diagram-design                 | yes, 1 skill               | `~\.agents\skills\diagram-design`                   | in install report |                                                                                                                                                                                                                     |
| youtube-agent-skill            | yes, 11 skills             | `~\.agents\skills\yt-*`                             | in install report | Needs `yt-dlp` 2026.10.26, installed with `uv tool install yt-dlp`. No API key needed.                                                                                                                              |
| anthropic-cybersecurity-skills | 14 skills active           | `~\.agents\skills\`                                 | n/a               | Chosen from the web, API, auth, OWASP and CI topics (below). The other 800+ skills stay in the library.                                                                                                             |
| awesome-design-md              | reference only             | `skill-install-staging\awesome-design-md`           | `fcc7028`         | Design-system notes, not a skill repo.                                                                                                                                                                              |
| awesome-harness-engineering    | reference only             | `skill-install-staging\awesome-harness-engineering` | `2a035cb`         | Awesome list, not a skill repo. Used for ideas only.                                                                                                                                                                |
| stitch-skills                  | removed from active        | library only                                        | `0337446`         | See Skipped.                                                                                                                                                                                                        |
| scientific-agent-skills        | library only               | `skill-library\scientific-agent-skills`             | `5f2bc03`         | Off-topic for a store; nothing activated.                                                                                                                                                                           |
| agentmemory                    | CLI installed, not running | global `agentmemory`                                | 0.9.31            | Freebuff is not a supported host and the daemon is not started.                                                                                                                                                     |
| OpenViking                     | CLI installed, not running | global `openviking`, `ov`                           | 0.5.2.1           | AGPL-3.0. Skills stay in the library. Never copied into this repo.                                                                                                                                                  |

The Python shim in `~\.local\bin` and `uv` were added for the tools above. Nothing needed admin rights.

## Active cybersecurity skills (14 of 15 allowed)

- testing-api-security-with-owasp-top-10
- testing-for-xss-vulnerabilities
- testing-jwt-token-security
- testing-cors-misconfiguration
- performing-security-headers-audit
- performing-csrf-attack-simulation
- exploiting-idor-vulnerabilities
- exploiting-broken-function-level-authorization
- exploiting-mass-assignment-in-rest-apis
- implementing-api-rate-limiting-and-throttling
- implementing-secrets-scanning-in-ci-cd
- securing-github-actions-workflows
- exploiting-sql-injection-vulnerabilities
- testing-for-host-header-injection

`performing-sca-dependency-scanning-with-snyk` was left out because Snyk needs an account and token.

## Skipped

- REA MCP registration: Freebuff is not a supported host for REA's MCP setup.
- Stitch skills (8 installed, then removed from active): they need a Stitch MCP server with Google credentials. No free, card-less account was available. The copies stay in the library.
- Snyk-based dependency scanning: needs an account and token.
- scientific-agent-skills: off-topic for a store; no skills activated.
- youtube-agent-skill: no skill needed an API key, so it is installed, not skipped.
- agentmemory daemon: needs a localhost server, which the spec allows only where Freebuff is supported and the tool installs without admin rights. Freebuff is not in agentmemory's supported host list, so the server was not started and no local address was added to any project file.
- OpenViking server: AGPL-3.0, needs a model provider and embedding model, and its installer targets macOS and Linux. Binaries are installed; the server is not started.
- Claude Code subagent definitions for claude-seo: Freebuff has no equivalent registry.
- Stitch-style design generation from the stitch skills: depends on the skipped Stitch server.

## Use in this project (spec 9.3)

These items are not done yet. Each one needs its own slice, and none is claimed here:

- `docs/DESIGN.md` from awesome-design-md (Editorial Heritage tokens).
- UX benchmarks in `docs/research/ux-benchmarks.md` from replica-skill.
- Diagrams in `docs/diagrams/` from diagram-design.
- SEO audit report in `docs/reports/seo.md` from claude-seo.
- Security review in `docs/reports/security.md` from the cybersecurity skills, plus `pnpm audit` and a secret scan in GitHub Actions.

## Reproduce on your machine

Run these in PowerShell or Git Bash. Each step is free and needs no admin rights.

```bash
# Tier 1: clone the reference repositories (read-only)
mkdir -p ~/.agents/skill-install-staging && cd ~/.agents/skill-install-staging
for r in morluto/rea AgricIDaniel/claude-seo Jakeschincariol/replica-skill voltagent/awesome-design-md \
  google-labs-code/stitch-skills Jakeschincariol/youtube-agent-skill rohitg00/agentmemory \
  k-dense-ai/scientific-agent-skills cathrynlavery/diagram-design mukul975/anthropic-cybersecurity-skills \
  ai-boost/awesome-harness-engineering volcengine/OpenViking; do
  git clone --depth 1 "https://github.com/$r.git" "$(basename "$r")"
done

# Tier 2: install only the skills this project uses
npx -y skills add https://github.com/cathrynlavery/diagram-design --list
npx -y skills add https://github.com/cathrynlavery/diagram-design -g -s diagram-design -a '*' -y --copy
npx -y skills list -g
```

Then copy the chosen cybersecurity skill folders from `~/.agents/skill-library` with `node skill-library.mjs activate <group/skill>` (see the list above). Check the result with `node skill-library.mjs validate`.

- Diagram PNGs: rendered with the Playwright Chromium already in node_modules (via @playwright/test), from a script outside the repo. No new package installed.
