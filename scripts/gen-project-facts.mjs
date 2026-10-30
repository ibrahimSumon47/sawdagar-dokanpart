#!/usr/bin/env node
/**
 * Generates docs/PROJECT_FACTS.json from the repository and a small set of
 * measured constants. Run with `--check` in CI to fail when the committed file
 * no longer matches: versions, model count, test declarations, route count and
 * demo accounts are read from source, while seed volumes and Lighthouse medians
 * are values a test (catalogSeed.test.ts) or a recorded workflow run pins.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'docs', 'PROJECT_FACTS.json');
const check = process.argv.includes('--check');

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function walk(directory, predicate) {
  const results = [];
  const visit = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (['node_modules', '.next', 'generated', '.turbo'].includes(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (predicate(full)) results.push(full);
    }
  };
  visit(path.join(root, directory));
  return results;
}

function packageVersion(manifest, name) {
  const parsed = readJson(manifest);
  const version =
    parsed.dependencies?.[name] ??
    parsed.devDependencies?.[name] ??
    parsed.peerDependencies?.[name];
  if (!version) throw new Error(`${name} is not declared in ${manifest}`);
  return version.replace(/^[^0-9]*/, '');
}

const testGroups = {
  domain: 'packages/domain/src',
  csCore: 'packages/cs-core/src',
  ui: 'packages/ui/src',
  web: 'apps/web',
};

const unitTests = {};
for (const [name, directory] of Object.entries(testGroups)) {
  const files = walk(directory, (file) => /\.test\.tsx?$/.test(file));
  const cases = files.reduce(
    (total, file) => total + (readFileSync(file, 'utf8').match(/^\s*it\(/gm) ?? []).length,
    0,
  );
  unitTests[name] = { files: files.length, cases };
}
unitTests.total = Object.values(unitTests).reduce((total, group) => total + group.cases, 0);

const schema = read('apps/web/prisma/schema.prisma');
const models = (schema.match(/^model\s+\w+\s*\{/gm) ?? []).length;
const migrations = readdirSync(path.join(root, 'apps/web/prisma/migrations'), {
  withFileTypes: true,
}).filter((entry) => entry.isDirectory()).length;
const pages = walk('apps/web/app', (file) => file.endsWith(`${path.sep}page.tsx`)).length;
const apiRoutes = walk('apps/web/app/api', (file) => file.endsWith('route.ts')).length;

const demoSource = read('packages/domain/src/auth/demoAccounts.ts');
const demoAccounts = [...demoSource.matchAll(/email: '([^']+)',\s*\n\s*name: '([^']+)',\s*\n\s*role: '([^']+)'/g)].map(
  ([, email, name, role]) => ({ email, name, role }),
);

const facts = {
  name: 'Sawdagar Dokanpat',
  pitch: 'A non-commercial, bilingual multi-vendor marketplace demonstration for Bangladesh.',
  demoUrl: 'https://sawdagar-dokanpart.vercel.app',
  repositoryUrl: 'https://github.com/ibrahimSumon47/sawdagar-dokanpart',
  license: 'MIT',
  updated: '2026-10-30',
  stack: {
    node: '24 LTS',
    pnpm: readJson('package.json').packageManager.replace('pnpm@', ''),
    next: packageVersion('apps/web/package.json', 'next'),
    react: packageVersion('apps/web/package.json', 'react'),
    typescript: packageVersion('apps/web/package.json', 'typescript'),
    prisma: packageVersion('apps/web/package.json', 'prisma'),
    betterAuth: packageVersion('apps/web/package.json', 'better-auth'),
    tailwind: packageVersion('apps/web/package.json', 'tailwindcss'),
    zod: packageVersion('apps/web/package.json', 'zod'),
  },
  counts: {
    departments: 12,
    categories: 84,
    vendors: 24,
    products: 432,
    variants: 1296,
    seededReviews: 1755,
    demoRoles: demoAccounts.length,
    models,
    migrations,
    pages,
    apiRoutes,
    unitTests: unitTests.total,
  },
  unitTests,
  lighthouses: {
    run: 41067055369,
    strategy: 'mobile, median of three runs',
    home: { performance: 93, accessibility: 100, bestPractices: 100, seo: 100, cls: 0 },
    catalog: { performance: 95, accessibility: 100, bestPractices: 100, seo: 100, cls: 0 },
    product: { performance: 93, accessibility: 100, bestPractices: 100, seo: 100, cls: 0 },
  },
  demoAccounts,
  links: {
    caseStudy: 'https://sawdagar-dokanpart.vercel.app/case-study',
    llms: 'https://sawdagar-dokanpart.vercel.app/llms.txt',
    architecture: 'https://github.com/ibrahimSumon47/sawdagar-dokanpart/blob/main/ARCHITECTURE.md',
    features: 'https://github.com/ibrahimSumon47/sawdagar-dokanpart/blob/main/docs/FEATURES.md',
    testing: 'https://github.com/ibrahimSumon47/sawdagar-dokanpart/blob/main/docs/TESTING.md',
  },
};

const serialised = `${JSON.stringify(facts, null, 2)}\n`;

if (check) {
  const committed = read('docs/PROJECT_FACTS.json').replace(/\r\n/g, '\n');
  if (committed !== serialised) {
    console.error('docs/PROJECT_FACTS.json is stale. Run `pnpm facts:generate`.');
    process.exitCode = 1;
  } else {
    console.log('docs/PROJECT_FACTS.json matches the repository.');
  }
} else {
  writeFileSync(outputPath, serialised);
  console.log(`Wrote ${path.relative(root, outputPath)} (${unitTests.total} tests, ${models} models).`);
}
