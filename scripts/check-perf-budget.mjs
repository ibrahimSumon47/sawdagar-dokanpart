#!/usr/bin/env node
/**
 * Checks the client asset budget after a production build.
 *
 * The budgets are deliberately modest because the demo must stay quick on a
 * 3G-class connection: all client JavaScript, all CSS, the largest single
 * chunk, the catalog photography and the largest photograph. Run it after
 * `pnpm build`; it reads only build output and never starts a server.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const web = path.join(root, 'apps', 'web');
const chunksDir = path.join(web, '.next', 'static', 'chunks');
const mediaDir = path.join(web, 'public', 'media', 'departments');

/** Maximum gzipped size of every client chunk, in bytes. */
const budgets = {
  js: 400 * 1024,
  css: 100 * 1024,
  chunk: 120 * 1024,
  media: 1_500 * 1024,
  image: 200 * 1024,
};

function gzipSize(file) {
  return gzipSync(readFileSync(file)).length;
}

function kilobytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

if (!existsSync(chunksDir)) {
  console.error('No build output found. Run `pnpm build` before the budget check.');
  process.exit(1);
}

let js = 0;
let css = 0;
let largestChunk = 0;
let largestChunkName = '';

for (const name of readdirSync(chunksDir)) {
  if (!name.endsWith('.js') && !name.endsWith('.css')) continue;
  const size = gzipSize(path.join(chunksDir, name));
  if (name.endsWith('.js')) {
    js += size;
    if (size > largestChunk) {
      largestChunk = size;
      largestChunkName = name;
    }
  } else {
    css += size;
  }
}

let media = 0;
let largestImage = 0;
let largestImageName = '';
for (const name of readdirSync(mediaDir)) {
  if (!/\.(jpe?g|png|webp|avif)$/i.test(name)) continue;
  const size = statSync(path.join(mediaDir, name)).size;
  media += size;
  if (size > largestImage) {
    largestImage = size;
    largestImageName = name;
  }
}

const checks = [
  { label: 'Client JavaScript', actual: js, budget: budgets.js },
  { label: 'CSS', actual: css, budget: budgets.css },
  { label: `Largest chunk (${largestChunkName})`, actual: largestChunk, budget: budgets.chunk },
  { label: 'Catalog photography', actual: media, budget: budgets.media },
  { label: `Largest photograph (${largestImageName})`, actual: largestImage, budget: budgets.image },
];

let failed = false;
for (const check of checks) {
  const over = check.actual > check.budget;
  failed ||= over;
  console.log(
    `${over ? 'OVER ' : 'ok   '} ${check.label}: ${kilobytes(check.actual)} of ${kilobytes(check.budget)}`,
  );
}

if (failed) {
  console.error('Asset budget exceeded. Shrink the asset or raise the budget deliberately.');
  process.exit(1);
}
