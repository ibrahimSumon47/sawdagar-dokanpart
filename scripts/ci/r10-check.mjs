#!/usr/bin/env node
/**
 * Revision 1 exit check (R10). Prints every exit criterion as DONE or TODO and exits 1
 * while any of them is still TODO.
 *
 * The script reads GitHub Actions through the `gh` CLI, the repository's own gates through
 * pnpm, and the documentation as plain text. It is read-only: nothing is committed, pushed
 * or deployed, so it is safe to run at any point in a session.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', '..');
const isWindows = process.platform === 'win32';

/** Runs a command from the repository root with the platform's shell. */
function run(command, args) {
  return spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    shell: isWindows,
    maxBuffer: 32 * 1024 * 1024,
  });
}

/** Reads a repository file, or returns an empty string when it is missing. */
function read(relativePath) {
  const absolute = path.join(root, relativePath);
  return existsSync(absolute) ? readFileSync(absolute, 'utf8') : '';
}

/** Returns the newest workflow run on main, or an error string when gh cannot answer. */
function latestRun(workflow) {
  const result = run('gh', [
    'run',
    'list',
    '--workflow',
    workflow,
    '--branch',
    'main',
    '--limit',
    '1',
    '--json',
    'databaseId,conclusion,status,displayTitle,url',
  ]);
  if (result.status !== 0) {
    return { error: (result.stderr || result.stdout || 'gh failed').trim() };
  }
  const [newest] = JSON.parse(result.stdout || '[]');
  return newest ?? { error: 'no run on main' };
}

const results = [];
const record = (title, done, detail) => results.push({ title, done, detail });

/** 1. The newest Lighthouse run on main must be green. */
const lighthouse = latestRun('lighthouse.yml');
record(
  'Latest Lighthouse workflow run on main is green',
  lighthouse.conclusion === 'success',
  lighthouse.error ?? `${lighthouse.conclusion ?? lighthouse.status} ${lighthouse.url ?? ''}`,
);

/** 2. The newest full Playwright run on the deployment must have zero failures. */
const playwright = latestRun('playwright.yml');
record(
  'Latest Playwright workflow run on main has zero failures',
  playwright.conclusion === 'success',
  playwright.error ?? `${playwright.conclusion ?? playwright.status} ${playwright.url ?? ''}`,
);

/** 3. The project state must no longer carry the fixed performance and demo-framing lines. */
const state = read('docs/PROJECT_STATE.md');
const staleClaims = [
  'Lighthouse performance is below the CI gate',
  'labels the whole site as demo data',
  'one representative locally stored photograph per department',
].filter((claim) => state.includes(claim));
record(
  'PROJECT_STATE.md carries no fixed blocker or stale claim',
  state.length > 0 && staleClaims.length === 0,
  staleClaims.length ? `found: ${staleClaims.join('; ')}` : 'docs/PROJECT_STATE.md is clean',
);

/** 4. The local gates must pass. `test` output is kept for the README count check. */
const gates = [
  ['facts:check', 'Generated project facts match the repository'],
  ['repo-map:check', 'Generated repository map matches the repository'],
  ['lint', 'Lint and formatting pass'],
  ['typecheck', 'Typecheck passes'],
  ['test', 'Unit tests pass'],
];
let testOutput = '';
for (const [script, title] of gates) {
  const result = run('pnpm', [script]);
  // Turbo colours its task prefixes, so strip ANSI escapes before reading the counts out.
  if (script === 'test') {
    testOutput = `${result.stdout ?? ''}${result.stderr ?? ''}`.replace(/\u001b\[[0-9;]*m/g, '');
  }
  record(title, result.status === 0, `pnpm ${script} exited ${result.status ?? 'null'}`);
}

/** 5. The git hygiene report must exist and count commits with a Co-Authored-By line. */
const hygiene = read('docs/reports/git-hygiene.md');
record(
  'docs/reports/git-hygiene.md exists and counts Co-Authored-By commits',
  hygiene.length > 0 && /co-authored-by/i.test(hygiene) && /\d+/.test(hygiene),
  hygiene.length ? 'report present' : 'docs/reports/git-hygiene.md is missing',
);

/** 6. R10 must be recorded as pass with at least one run link. */
const features = JSON.parse(read('docs/features.json') || '[]');
const r10 = Array.isArray(features) ? features.find((feature) => feature.id === 'R10') : undefined;
record(
  'docs/features.json records R10 as pass with evidence links',
  r10?.status === 'pass' &&
    /https:\/\/github\.com\/\S+\/actions\/runs\/\d+/.test(r10.evidence ?? ''),
  r10 ? `status ${r10.status}` : 'R10 is missing',
);

/** 7. README test counts must match the measured totals. */
const counts = [...testOutput.matchAll(/@sd\/([\w-]+):test:\s+Tests\s+(\d+) passed/g)].map(
  ([, name, passed]) => ({ name, passed: Number(passed) }),
);
const readme = read('README.md');
const total = counts.reduce((sum, entry) => sum + entry.passed, 0);
const declared = new Map();
for (const line of readme.split(String.fromCharCode(10))) {
  const cells = line.split('|').map((cell) => cell.trim());
  const label = cells[1] ?? '';
  if (label.startsWith('`@sd/') && label.endsWith('`')) {
    const value = Number(cells[2]);
    if (Number.isInteger(value)) declared.set(label.slice(5, -1), value);
  }
}

const countsMatch =
  counts.length > 0 &&
  total > 0 &&
  readme.includes(String(total) + ' unit tests') &&
  counts.every((entry) => declared.get(entry.name) === entry.passed);
record(
  'README test counts match the measured totals',
  countsMatch,
  counts.length
    ? `measured ${total}: ${counts.map((entry) => `${entry.name} ${entry.passed}`).join(', ')}`
    : 'pnpm test printed no per-package counts',
);

let failed = 0;
for (const [index, result] of results.entries()) {
  const label = result.done ? 'DONE' : 'TODO';
  if (!result.done) failed += 1;
  process.stdout.write(`${label} ${index + 1}. ${result.title}\n       ${result.detail}\n`);
}

process.stdout.write(failed === 0 ? '\nR10 is complete.\n' : `\n${failed} item(s) still TODO.\n`);
process.exit(failed === 0 ? 0 : 1);
