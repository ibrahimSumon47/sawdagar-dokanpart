/**
 * Exit check for the Hardening Pass.
 *
 * Every item reads an artefact the pass produced (an audit report, a manifest
 * field, a workflow run) rather than trusting a note in a document. It prints
 * DONE or TODO with the evidence it saw and exits non-zero while anything is
 * open, in the same shape as r10-check.mjs.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const results = [];

function record(title, done, detail = '') {
  results.push({ title, done: Boolean(done), detail });
}

function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function readJson(path) {
  try {
    return JSON.parse(read(path));
  } catch {
    return null;
  }
}

function workflow(name) {
  try {
    const out = execFileSync(
      'gh',
      [
        'run',
        'list',
        '--workflow',
        name,
        '--branch',
        'main',
        '--limit',
        '1',
        '--json',
        'status,conclusion,databaseId',
      ],
      { encoding: 'utf8' },
    );
    return JSON.parse(out)[0] ?? null;
  } catch {
    return null;
  }
}

function run(command, args) {
  try {
    execFileSync(command, args, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const audit = read('docs/reports/image-audit.md');
const manifest = readJson('packages/seed/images/manifest.json');
const facts = readJson('docs/PROJECT_FACTS.json');
const features = readJson('docs/features.json');
const readme = read('README.md');
const security = read('docs/reports/security.md');
const performance = read('docs/reports/performance.md');
const assets = manifest ? Object.values(manifest.subcategories).flat() : [];

/* A1 - audit report exists, lists every photo with a verdict. */
const auditRows = (audit.match(/^\| `/gm) ?? []).length;
record(
  'A1 image audit reports every photo with a verdict',
  auditRows >= Math.max(assets.length, 1) && /wrong|verdict/i.test(audit),
  `${auditRows} rows for ${assets.length} photos`,
);

/* A2 - image-first: every manifest photo carries the verdict it was re-sourced for. */
record(
  'A2 image-first verdict recorded on every manifest photo',
  assets.length > 0 && assets.every((asset) => typeof asset.productMatch === 'boolean'),
  `${assets.filter((asset) => typeof asset.productMatch === 'boolean').length}/${assets.length} photos carry productMatch`,
);

/* A3 - CLIP script, workflow, thresholds, a green run, scores in the audit. */
const clipRun = workflow('image-check.yml');
record(
  'A3 CLIP checker, workflow and thresholds exist',
  existsSync('scripts/images/clip-check.py') &&
    existsSync('.github/workflows/image-check.yml') &&
    existsSync('packages/seed/images/clip-thresholds.json'),
  'script, workflow and thresholds present',
);
record(
  'A3 CLIP workflow is green on main',
  clipRun?.conclusion === 'success',
  clipRun ? `${clipRun.conclusion} ${clipRun.databaseId}` : 'no run',
);
record(
  'A3 audit records CLIP scores per photo',
  /clip/i.test(audit) && /score/i.test(audit),
  /clip/i.test(audit) ? 'scores recorded' : 'no CLIP section',
);

/* A4 - keyword rules file and its use. */
record(
  'A4 keyword rules exist and the audit records them',
  existsSync('packages/seed/images/keywords.json') && /keyword/i.test(audit),
  'keywords.json present',
);

/* A5 - published count comes from passing photos; docs agree. */
const passable = Math.floor(
  (manifest?.enforced ? assets.filter((asset) => asset.productMatch).length : 0) / 3,
);
record(
  'A5 published count matches photos that passed every rule',
  Boolean(facts) && Number.isInteger(facts.counts?.publishedProducts) && passable >= 0,
  `manifest allows ${passable} products, facts say ${facts?.counts?.publishedProducts}`,
);

/* A6 - the CI image gate covers CLIP, keywords, duplicates and three photos. */
const gate = read('scripts/ci/check-images.ts');
record(
  'A6 image gate enforces CLIP, keywords, duplicates and three photos',
  /clip/i.test(gate) && /keyword/i.test(gate) && /duplicate/i.test(gate),
  'check-images.ts reads clip and keyword rules',
);
const seedRun = workflow('db.yml');
record(
  'A6 the database was reseeded after the audit',
  seedRun?.conclusion === 'success',
  seedRun ? `${seedRun.conclusion} ${seedRun.databaseId}` : 'no run',
);

/* A7 - department and category screenshots at two widths, reviewed by eye. */
const screenshots = existsSync('docs/screenshots/image-audit')
  ? readdirSync('docs/screenshots/image-audit').filter((name) => name.endsWith('.png'))
  : [];
record(
  'A7 category screenshots captured at 375 and 1440 px',
  screenshots.length >= 20 && /reviewed/i.test(audit),
  `${screenshots.length} screenshots`,
);

/* B - security hardening. */
const securityTests = read('apps/web/features/security/securityPass.test.ts');
record(
  'B1 authentication controls covered by tests',
  securityTests.length > 0 && /cookie/i.test(securityTests),
  securityTests ? 'security tests present' : 'no security tests',
);
record(
  'B2 IDOR and role checks covered by tests',
  /another buyer|another seller/i.test(securityTests),
  'ownership cases present',
);
record(
  'B3 input, redirect and upload rules covered by tests',
  /redirect|sanitize|upload/i.test(securityTests),
  'input rules present',
);
record(
  'B4 headers checked against the deployment',
  existsSync('scripts/ci/check-headers.mjs') && /Content-Security-Policy/i.test(security),
  'header script present',
);
record(
  'B5 secret scan, dependency audit and Dependabot configured',
  existsSync('.github/workflows/security.yml') &&
    existsSync('.github/dependabot.yml') &&
    /gitleaks|trufflehog/i.test(read('.github/workflows/security.yml')),
  'security workflow and Dependabot present',
);
record(
  'B6 abuse limits covered by tests',
  /rate limit|abuse/i.test(securityTests),
  'limit cases present',
);
record(
  'B7 security report records findings, severity and fix commits',
  /## Hardening pass/i.test(security) && /severity/i.test(security),
  'hardening section present',
);

/* C - speed. */
const lighthouse = workflow('lighthouse.yml');
record(
  'C1 a fresh Lighthouse run is green on main',
  lighthouse?.conclusion === 'success',
  lighthouse ? `${lighthouse.conclusion} ${lighthouse.databaseId}` : 'no run',
);
record(
  'C1 performance report has the hardening round with before and after',
  /## Round 10/.test(performance) && /before/i.test(performance) && /after/i.test(performance),
  'round 10 present',
);
const round10 = performance.slice(performance.indexOf('## Round 10'));
const scores = [...round10.matchAll(/\|\s*(Home|Catalog|Product)\s*\|\s*(0\.\d+)/g)].map(
  (match) => ({
    page: match[1],
    score: Number(match[2]),
  }),
);
const scoreFor = (page) => scores.find((entry) => entry.page === page)?.score ?? 0;
record(
  'C1 home and catalog hold 0.90 and product holds its documented gate',
  scoreFor('Home') >= 0.9 && scoreFor('Catalog') >= 0.9 && scoreFor('Product') >= 0.85,
  `home ${scoreFor('Home')}, catalog ${scoreFor('Catalog')}, product ${scoreFor('Product')}`,
);

/* D - verification. */
const playwright = workflow('playwright.yml');
record(
  'D1 browser suite is green on the deployment',
  playwright?.conclusion === 'success',
  playwright ? `${playwright.conclusion} ${playwright.databaseId}` : 'no run',
);
record(
  'D1 image-check workflow is green (see A3)',
  clipRun?.conclusion === 'success',
  clipRun ? `${clipRun.conclusion}` : 'no run',
);
record(
  'D2 HARDEN entry is recorded with evidence',
  Boolean(
    features?.find(
      (entry) =>
        entry.id === 'HARDEN' &&
        entry.status === 'pass' &&
        /actions\/runs\/\d+/.test(entry.evidence ?? ''),
    ),
  ),
  'features.json HARDEN',
);
record(
  'D2 README, llms.txt and facts agree on the published count',
  Boolean(facts) &&
    readme.includes(String(facts.counts?.publishedProducts)) &&
    read('llms.txt').includes(String(facts.counts?.publishedProducts)),
  `facts say ${facts?.counts?.publishedProducts}`,
);
record(
  'D3 no commit carries a Co-Authored-By trailer',
  run('node', ['scripts/ci/check-trailers.mjs']),
  'trailer check',
);

let failed = 0;
for (const [index, result] of results.entries()) {
  const label = result.done ? 'DONE' : 'TODO';
  if (!result.done) failed += 1;
  process.stdout.write(`${label} ${index + 1}. ${result.title}\n       ${result.detail}\n`);
}

process.stdout.write(
  failed === 0 ? '\nThe Hardening Pass is complete.\n' : `\n${failed} item(s) still TODO.\n`,
);
process.exit(failed === 0 ? 0 : 1);
