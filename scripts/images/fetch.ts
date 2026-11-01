/**
 * Sourcing run for product photographs. For each leaf subcategory it searches
 * Wikimedia Commons, keeps only files with a reuse-friendly licence, drops
 * near-duplicates by perceptual hash, uploads the kept files to Cloudinary and
 * writes packages/seed/images/manifest.json. Products that cannot get three
 * distinct photos are left out of the manifest, so they are not published.
 *
 * Dry run (no upload, no manifest write):  pnpm tsx scripts/images/fetch.ts --dry-run
 * Real run needs CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.
 */

import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildCatalogSeed } from '../../packages/domain/src/catalog/catalogSeed';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const requireWeb = createRequire(path.join(root, 'apps', 'web', 'package.json'));
const sharp = requireWeb('sharp') as typeof import('sharp');

const userAgent = 'SawdagarDokanpatDemo/1.0 (portfolio project; ibrahimsumon005@gmail.com)';
const manifestPath = path.join(root, 'packages', 'seed', 'images', 'manifest.json');

/** Hamming distance below which two photographs count as the same picture. */
const HASH_DISTANCE_MIN = 8;
/** Main photo plus two gallery photos per product. */
const IMAGES_PER_PRODUCT = 3;
/** Licence names accepted for reuse. Anything else is rejected. */
const allowedLicence = /^(CC0|Public domain|CC BY(-SA)? \d\.\d)$/i;

export interface CommonsCandidate {
  title: string;
  sourceUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
  licence: string;
  author: string;
}

export interface ManifestAsset {
  publicId: string;
  sourceUrl: string;
  license: string;
  author: string;
  width: number;
  height: number;
  phash: string;
  alt: string;
}

/** Strips HTML tags from Commons metadata values. */
function plain(value: string | undefined): string {
  return (value ?? '').replace(/<[^>]+>/g, '').trim();
}

/** Pauses between Commons requests so the run stays polite. */
function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Searches Commons for one query and returns the files with an allowed licence. */
export async function searchCommons(query: string, limit = 30): Promise<CommonsCandidate[]> {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrlimit: String(limit),
    gsrnamespace: '6',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: '960',
    format: 'json',
  }).toString();

  const response = await fetch(url, { headers: { 'User-Agent': userAgent } });
  if (!response.ok) throw new Error(`Commons search failed: ${response.status}`);
  const body = (await response.json()) as {
    query?: { pages?: Record<string, { title: string; imageinfo?: Array<Record<string, unknown>> }> };
  };

  const candidates: CommonsCandidate[] = [];
  for (const page of Object.values(body.query?.pages ?? {})) {
    const info = page.imageinfo?.[0] as
      | {
          descriptionurl: string;
          thumburl?: string;
          width: number;
          height: number;
          extmetadata?: Record<string, { value: string }>;
        }
      | undefined;
    if (!info?.thumburl) continue;
    const meta = info.extmetadata ?? {};
    const licence = plain(meta.LicenseShortName?.value);
    if (!allowedLicence.test(licence)) continue;
    candidates.push({
      title: page.title,
      sourceUrl: info.descriptionurl,
      thumbUrl: info.thumburl,
      width: info.width,
      height: info.height,
      licence,
      author: plain(meta.Artist?.value) || 'Unknown author',
    });
  }
  return candidates;
}

/** 64-bit average hash as 16 hex characters: an 8x8 greyscale grid compared with its mean. */
export async function averageHash(buffer: Buffer): Promise<string> {
  const pixels = await sharp(buffer).resize(8, 8, { fit: 'fill' }).greyscale().raw().toBuffer();
  const mean = pixels.reduce((sum, value) => sum + value, 0) / pixels.length;
  let bits = '';
  for (const value of pixels) bits += value >= mean ? '1' : '0';
  return BigInt(`0b${bits}`).toString(16).padStart(16, '0');
}

/** Number of differing bits between two 16-character hex hashes. */
export function hashDistance(left: string, right: string): number {
  let diff = BigInt(`0x${left}`) ^ BigInt(`0x${right}`);
  let distance = 0;
  while (diff > 0n) {
    distance += Number(diff & 1n);
    diff >>= 1n;
  }
  return distance;
}

/** One search query per leaf subcategory, read from the seed spec. */
export function subcategoryQueries(): Array<{ slug: string; query: string }> {
  return buildCatalogSeed()
    .categories.filter((category) => category.depth === 1)
    .map((category) => ({ slug: category.slug, query: category.name.en.toLowerCase() }));
}

/** Turns a Commons file title into readable words for alt text. */
export function describeFile(title: string): string {
  return title
    .replace(/^File:/, '')
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();
}

/** Signs a Cloudinary upload request: SHA-1 of the sorted params plus the API secret. */
function cloudinarySignature(params: Record<string, string>, secret: string): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return createHash('sha1').update(`${payload}${secret}`).digest('hex');
}

/** Uploads image bytes to Cloudinary under a fixed public ID, retrying when Commons or Cloudinary rate-limits. */
async function uploadToCloudinary(image: Buffer, publicId: string): Promise<void> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) throw new Error('Cloudinary credentials are not set');

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signed = { public_id: publicId, timestamp, overwrite: 'false' };
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(image)]), 'photo.jpg');
    form.append('public_id', publicId);
    form.append('timestamp', timestamp);
    form.append('overwrite', 'false');
    form.append('api_key', key);
    form.append('signature', cloudinarySignature(signed, secret));

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: 'POST',
      body: form,
    });
    if (response.ok) return;
    const reason = await response.text();
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Cloudinary upload failed for ${publicId}: ${response.status} ${reason}`);
    }
    await pause(2000 * attempt);
  }
  throw new Error(`Cloudinary upload failed for ${publicId} after retries`);
}

/** Downloads a Commons thumbnail (960px wide) and returns its bytes. */
async function download(url: string): Promise<Buffer> {
  const response = await fetch(url, { headers: { 'User-Agent': userAgent } });
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

/** Keeps the photos for one subcategory that are distinct from each other and from earlier kept photos. */
async function collectDistinct(
  query: string,
  slug: string,
  usedHashes: string[],
  dryRun: boolean,
): Promise<ManifestAsset[]> {
  const kept: ManifestAsset[] = [];
  for (const candidate of await searchCommons(query)) {
    if (kept.length >= IMAGES_PER_PRODUCT) break;
    const buffer = await download(candidate.thumbUrl);
    const phash = await averageHash(buffer);
    const clashes = [...usedHashes, ...kept.map((asset) => asset.phash)].some(
      (other) => hashDistance(phash, other) < HASH_DISTANCE_MIN,
    );
    if (clashes) continue;

    const index = kept.length + 1;
    const publicId = `sawdagar/products/${slug}/${index}`;
    if (!dryRun) await uploadToCloudinary(buffer, publicId);
    kept.push({
      publicId,
      sourceUrl: candidate.sourceUrl,
      license: candidate.licence,
      author: candidate.author,
      width: candidate.width,
      height: candidate.height,
      phash,
      alt: describeFile(candidate.title),
    });
    await pause(300);
  }
  return kept;
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const queries = subcategoryQueries();
  const usedHashes: string[] = [];
  const bySubcategory: Record<string, ManifestAsset[]> = {};

  for (const { slug, query } of queries) {
    const photos = await collectDistinct(query, slug, usedHashes, dryRun);
    console.log(`${slug}: ${photos.length} distinct photos`);
    bySubcategory[slug] = photos;
    usedHashes.push(...photos.map((photo) => photo.phash));
  }

  if (dryRun) return;
  mkdirSync(path.dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, `${JSON.stringify({ version: 1, enforced: false, subcategories: bySubcategory }, null, 2)}\n`);
  console.log(`Wrote ${manifestPath}`);
}

if (process.argv[1]?.endsWith('fetch.ts')) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
