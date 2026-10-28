#!/usr/bin/env node
/**
 * Runs the Python and Java reference modules over the CS core fixtures and
 * compares their output with the expected values the TypeScript ports are
 * tested against.
 *
 * CI passes --require, which makes a missing toolchain a failure. Locally the
 * script reports the missing tool and exits 0, so a normal `pnpm test` run does
 * not need Python or a JDK installed.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const requireToolchains = process.argv.includes('--require');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageDir = path.join(root, 'packages', 'cs-core');
const fixturesDir = path.join(packageDir, 'fixtures');

function readFixture(name) {
  return JSON.parse(readFileSync(path.join(fixturesDir, name), 'utf8'));
}

function findCommand(candidates) {
  for (const [command, prefix] of candidates) {
    const result = spawnSync(command, [...prefix, '--version'], { encoding: 'utf8' });
    if (result.status === 0) return { command, prefix };
  }
  return null;
}

function reportMissing(tool) {
  const message = `${tool} was not found; the reference module check was skipped.`;
  if (requireToolchains) {
    console.error(`${message} Run with --require only where the toolchain is installed.`);
    process.exit(1);
  }
  console.warn(message);
}

const failures = [];

function checkPython() {
  const python = findCommand([
    ['python3', []],
    ['python', []],
    ['py', ['-3']],
  ]);
  if (!python) {
    reportMissing('Python 3');
    return;
  }

  const result = spawnSync(
    python.command,
    [...python.prefix, path.join(packageDir, 'python', 'insights.py'), path.join(fixturesDir, 'insights.json')],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    failures.push(`insights.py exited ${result.status}: ${result.stderr}`);
    return;
  }

  const cases = readFixture('insights.json').cases;
  const actual = JSON.parse(result.stdout);
  cases.forEach((item, index) => {
    const expected = item.expected;
    const received = actual[index];
    if (JSON.stringify(expected) !== JSON.stringify(received)) {
      failures.push(`insights case ${index}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(received)}`);
    }
  });
  console.log(`insights.py: ${cases.length} fixtures checked.`);
}

function checkJava() {
  const javac = findCommand([['javac', []]]);
  const java = findCommand([['java', []]]);
  if (!javac || !java) {
    reportMissing('A JDK (javac and java)');
    return;
  }

  const scratch = mkdtempSync(path.join(tmpdir(), 'sd-settlement-'));
  try {
    const compile = spawnSync(
      javac.command,
      [...javac.prefix, '-d', scratch, path.join(packageDir, 'java', 'Settlement.java')],
      { encoding: 'utf8' },
    );
    if (compile.status !== 0) {
      failures.push(`javac failed: ${compile.stderr}`);
      return;
    }

    const cases = readFixture('settlement.json').cases;
    cases.forEach((item, index) => {
      const run = spawnSync(
        java.command,
        [
          ...java.prefix,
          '-cp',
          scratch,
          'Settlement',
          String(item.minimumPoisha),
          ...item.amounts.map(String),
        ],
        { encoding: 'utf8' },
      );
      if (run.status !== 0) {
        failures.push(`settlement case ${index} exited ${run.status}: ${run.stderr}`);
        return;
      }
      const parsed = Object.fromEntries(
        (run.stdout.trim().split(';') ?? []).map((pair) => pair.split('=')),
      );
      const actual = {
        count: Number(parsed.count),
        paidPoisha: Number(parsed.paid),
        carriedPoisha: Number(parsed.carried),
      };
      if (JSON.stringify(actual) !== JSON.stringify(item.expected)) {
        failures.push(`settlement case ${index}: expected ${JSON.stringify(item.expected)}, got ${JSON.stringify(actual)}`);
      }
    });
    console.log(`Settlement.java: ${cases.length} fixtures checked.`);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

checkPython();
checkJava();

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
