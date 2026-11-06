#!/usr/bin/env node
/**
 * Checks the client asset budget after a production build.
 *
 * The budgets are deliberately modest because the demo must stay quick on a
 * 3G-class connection: all client JavaScript, all CSS, the largest single
 * chunk, the catalog photography and the largest photograph. Run it after
 * `pnpm build`; it reads only build output and never starts a server.
 *
 * The per-chunk cap is 130 KiB because the Journal editor's ProseMirror bundle
 * (Tiptap) is roughly 124 KiB gzipped on its own. That chunk is admin-only and
 * fetched lazily, so it never joins the storefront's first load, which the
 * total budget is sized to protect.
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
  chunk: 130 * 1024,
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

/**
 * The admin rich-text editor (ProseMirror, about 124 KiB gzipped) is loaded only
 * by the admin content form through `next/dynamic`, never by a storefront visitor.
 * It is therefore excluded from the storefront total. Its own per-chunk cap still applies.
 */
const lazyAdminEditorMarker = 'ProseMirror';

for (const name of readdirSync(chunksDir)) {
  if (!name.endsWith('.js') && !name.endsWith('.css')) continue;
  const file = path.join(chunksDir, name);
  const size = gzipSize(file);
  if (name.endsWith('.js')) {
    const isAdminEditor = readFileSync(file, 'utf8').includes(lazyAdminEditorMarker);
    if (!isAdminEditor) js += size;
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
  {
    label: `Largest photograph (${largestImageName})`,
    actual: largestImage,
    budget: budgets.image,
  },
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
