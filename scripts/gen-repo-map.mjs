#!/usr/bin/env node
/**
 * Generates docs/repo-map.md: the folder tree with one line of purpose each,
 * plus the root files a reviewer is most likely to open. Run with `--check` in
 * CI so the map cannot drift from the folders that exist.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'docs', 'repo-map.md');
const check = process.argv.includes('--check');

const purposes = {
  apps: 'The deployable web application',
  packages: 'Reusable packages shared by the app',
  'packages/domain/src/auth': 'Roles, permissions and the demo allowlist',
  'packages/domain/src/catalog': 'Category tree and deterministic catalog seed',
  'packages/domain/src/checkout': 'Address data, order numbers and checkout totals',
  'packages/domain/src/finance': 'Balanced ledger transactions and payout rules',
  'packages/domain/src/money': 'Taka parsing and formatting',
  'packages/domain/src/reviews': 'Review, question and return-window rules',
  'packages/domain/src/seller': 'Store approval, stock and product-status rules',
  'packages/domain/src/shop': 'Coupon rules',
  'apps/web': 'Next.js App Router application, feature code, Prisma schema and seeds',
  'apps/web/app': 'Routes: storefront, account, seller, admin, content, CS lab, case study',
  'apps/web/app/account': 'Buyer profile, orders, reviews, questions, returns and mail outbox',
  'apps/web/app/admin': 'Role-filtered approvals, content, finance, flags, analytics and audit',
  'apps/web/app/api': 'Auth and MockPay callback route handlers',
  'apps/web/app/case-study': 'Public project write-up with SoftwareSourceCode JSON-LD',
  'apps/web/app/catalog': 'Listing with URL-driven search, filters and pagination',
  'apps/web/app/checkout': 'Address and payment selection, then order placement',
  'apps/web/app/compare': 'Four-product comparison table',
  'apps/web/app/credits': 'Photography attribution',
  'apps/web/app/cs-lab': 'Browser runner for the CS core modules',
  'apps/web/app/design': 'Component, token and theme gallery',
  'apps/web/app/forbidden': '403 page for a role without access',
  'apps/web/app/help': 'Help Center index and articles',
  'apps/web/app/journal': 'Journal index and posts',
  'apps/web/app/llms.txt': 'Plain-text route serving the root llms.txt',
  'apps/web/app/orders': 'Order receipt and printable invoice',
  'apps/web/app/pages': 'Static CMS pages',
  'apps/web/app/product': 'Product detail with variants, reviews and questions',
  'apps/web/app/seller': 'Seller Center pages',
  'apps/web/app/sign-in': 'Demo sign-in',
  'apps/web/app/store': 'Public vendor storefront',
  'apps/web/app/wishlist': 'Saved products',
  'apps/web/features': 'One folder per capability, each with components, actions and queries',
  'apps/web/features/account': 'Profile editing and buyer account tabs',
  'apps/web/features/admin': 'Approvals, moderation, analytics, audit and role navigation',
  'apps/web/features/auth': 'Session lookup, sign-in actions, audit writes and role badges',
  'apps/web/features/catalog': 'Catalog queries, filters, product detail and department photography',
  'apps/web/features/checkout': 'Addresses, order placement, MockPay, receipts and invoices',
  'apps/web/features/content': 'Storefront, Help and Journal CMS with versions and flags',
  'apps/web/features/design': 'Section components for the /design gallery',
  'apps/web/features/finance': 'Ledger posting, seller balances, payouts and refunds',
  'apps/web/features/home': 'Home page introduction and trust strip',
  'apps/web/features/lab': 'Components for the /cs-lab runner',
  'apps/web/features/preferences': 'Theme and language cookies with their controls',
  'apps/web/features/questions': 'Product questions and seller answers',
  'apps/web/features/returns': 'Return-request rules and views',
  'apps/web/features/reviews': 'Reviews, product questions and return requests',
  'apps/web/features/seller': 'Seller Center, store settings, KYC and public store pages',
  'apps/web/features/shell': 'Header, mobile menu, footer and trust strip',
  'apps/web/features/shop': 'Cart, wishlist, comparison, coupons and the shop provider',
  'apps/web/features/showcase': 'Public case study content and components',
  'apps/web/i18n': 'English and Bangla dictionaries, localised places and locale lookup',
  'apps/web/i18n/messages': 'The two message catalogs',
  'apps/web/lib': 'Prisma client, site constants, metadata helpers and auth plumbing',
  'apps/web/prisma': 'Schema, nine SQL migrations and migration configuration',
  'apps/web/prisma/migrations': 'One dated SQL migration per schema change',
  'apps/web/public': 'Locally stored department photographs, icons and static assets',
  'apps/web/public/media': 'Licensed department photographs',
  'apps/web/scripts': 'Idempotent seeds for demo accounts, catalog, orders, reviews and coupons',
  'packages/ui': 'Design tokens, brand mark, shared components and skeleton pairs',
  'packages/ui/src': 'Token stylesheet, component sources and tests',
  'packages/ui/src/components': 'One folder per component with styles and tests',
  'packages/domain': 'Pure TypeScript rules for money, seed data, roles, orders, seller and ledger',
  'packages/domain/src': 'Rule modules with their tests',
  'packages/cs-core': 'C++/C WebAssembly modules, TypeScript ports, Python and Java references',
  'packages/cs-core/src': 'WebAssembly loaders, TypeScript ports and parity tests',
  'packages/cs-core/native': 'Freestanding C and C++ sources compiled with clang',
  'packages/cs-core/generated': 'Committed base64 WebAssembly modules',
  'packages/cs-core/fixtures': 'Shared inputs and expected outputs for every implementation',
  'packages/cs-core/java': 'Java settlement reference implementation',
  'packages/cs-core/python': 'Python demand-insights reference implementation',
  docs: 'Product, design, architecture, data, security, testing and deployment documentation',
  'docs/adr': 'Ten architecture decision records with alternatives and consequences',
  'docs/spec': 'Product, design system, architecture, data and roadmap specifications',
  'docs/screenshots': 'Light, dark and mobile screenshots used in the README and case study',
  scripts: 'Node automation for wasm builds, budgets, facts, repository map and reference modules',
  '.github': 'GitHub Actions workflows and repository configuration',
  '.github/workflows': 'CI, Database and Lighthouse workflows',
};

const rootFiles = {
  'README.md': 'Project overview, screenshots, demo roles, stack and limitations',
  'ARCHITECTURE.md': 'Request flow, each business flow and the deployment model',
  'CHANGELOG.md': 'Dated change log, grouped by area rather than by commit',
  'AGENTS.md': 'Working agreement for human and AI contributors',
  LICENSE: 'MIT licence',
  'llms.txt': 'Plain-text repository summary for assistants and crawlers',
  '.lighthouserc.json': 'Lighthouse URLs and assertions for the deployment',
};

const skip = new Set(['node_modules', '.next', '.turbo', 'generated', '.git', '.vercel']);

function childDirectories(relativePath) {
  return readdirSync(path.join(root, relativePath), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !skip.has(entry.name) && !entry.name.startsWith('.'))
    .map((entry) => `${relativePath}/${entry.name}`)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

const lines = [];
function render(relativePath, depth) {
  for (const directory of childDirectories(relativePath)) {
    const name = directory.split('/').at(-1);
    const purpose = purposes[directory] ?? 'Related code and tests.';
    lines.push(`${'  '.repeat(depth)}${name}/  ${purpose}`);
    if (depth < 3) render(directory, depth + 1);
  }
}

for (const top of ['apps', 'packages', 'docs', 'scripts', '.github']) {
  lines.push(`${top}/  ${purposes[top] ?? 'Repository automation.'}`);
  render(top, 1);
  lines.push('');
}
lines.pop();

const rootFileRows = Object.entries(rootFiles)
  .filter(([file]) => {
    try {
      readFileSync(path.join(root, file));
      return true;
    } catch {
      return false;
    }
  })
  .map(([file, purpose]) => `| \`${file}\` | ${purpose} |`);

const markdown = `# Repository map

Generated by \`node scripts/gen-repo-map.mjs\`; run \`pnpm repo-map:check\` in CI. Do not edit by hand.

\`\`\`text
${lines.join('\n')}
\`\`\`

## Root files

| File | Purpose |
|---|---|
${rootFileRows.join('\n')}
`;

if (check) {
  const committed = readFileSync(outputPath, 'utf8').replace(/\r\n/g, '\n');
  if (committed !== markdown) {
    console.error('docs/repo-map.md is stale. Run `pnpm repo-map:generate`.');
    process.exitCode = 1;
  } else {
    console.log('docs/repo-map.md matches the repository folders.');
  }
} else {
  writeFileSync(outputPath, markdown);
  console.log(`Wrote docs/repo-map.md (${lines.filter(Boolean).length} folders).`);
}
