/**
 * Sources product photographs from Pexels and Pixabay for every leaf
 * subcategory, uploads the usable ones to Cloudinary and writes the manifest.
 *
 * The query is the product, not the craft story: "brass bowl", "leather wallet",
 * "handmade soap". Products are renamed afterwards to match what the photograph
 * actually shows, so a query only has to find a clean, single-object photo.
 *
 * A candidate is kept when it is at least 800 px on the long side, is not a
 * near-duplicate of a photo already kept, and the provider reports a photo
 * (not an illustration). Licences are Pexels and Pixabay, both free for
 * commercial use with attribution in CREDITS.md.
 *
 * Run locally in CI only: needs PEXELS_API_KEY, PIXABAY_API_KEY and the three
 * CLOUDINARY_* variables. Writes packages/seed/images/manifest.json.
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

const manifestPath = path.join(root, 'packages', 'seed', 'images', 'manifest.json');
const HASH_DISTANCE_MIN = 8;
const PHOTOS_PER_SUBCATEGORY = 12;
const MIN_LONG_SIDE = 800;

interface Candidate {
  provider: 'pexels' | 'pixabay' | 'unsplash';
  providerId: string;
  title: string;
  sourceUrl: string;
  license: string;
  author: string;
  width: number;
  height: number;
  downloadUrl: string;
}

export interface SourcedAsset {
  publicId: string;
  sourceUrl: string;
  license: string;
  author: string;
  provider: string;
  width: number;
  height: number;
  phash: string;
  alt: string;
}

/** Product-focused queries per subcategory; two or three each keeps within the free quotas. */
const queryOverrides: Record<string, string[]> = {
  'jamdani-saree': ['saree', 'saree fabric'],
  'cotton-saree': ['cotton saree', 'saree'],
  'short-kurta': ['kurta', 'tunic shirt'],
  'boys-panjabi': ['kids kurta', 'boys shirt'],
  lungi: ['lungi', 'checked fabric'],
  gamcha: ['towel cotton', 'hand towel'],
  'handloom-shawl': ['shawl', 'wool scarf'],
  'handloom-table-runner': ['table runner', 'linen table'],
  'fabric-by-metre': ['fabric roll', 'cotton fabric'],
  'jute-shopping-bag': ['jute bag', 'tote bag'],
  'jute-rug': ['jute rug', 'woven mat'],
  'jute-wall-art': ['wall hanging', 'macrame wall'],
  'cane-basket': ['wicker basket', 'basket'],
  'cane-stool': ['wicker stool', 'rattan chair'],
  'bamboo-mat': ['bamboo mat', 'woven mat'],
  'kitchen-basket': ['storage basket', 'wicker basket'],
  'terracotta-tea-set': ['tea set', 'clay teapot'],
  'pottery-dinner-set': ['ceramic plates', 'dinner set'],
  'flower-vase': ['ceramic vase', 'flower vase'],
  planter: ['plant pot', 'terracotta pot'],
  'terracotta-jewellery': ['clay jewellery', 'ceramic necklace'],
  'clay-cooking-pot': ['clay pot', 'cooking pot'],
  'brass-bowl': ['brass bowl', 'metal bowl'],
  'brass-plate': ['brass plate', 'metal tray'],
  'brass-lamp': ['brass lamp', 'table lamp'],
  'brass-jug': ['brass jug', 'metal pitcher'],
  'brass-wall-decor': ['wall decor metal', 'brass wall'],
  'brass-spice-box': ['spice box', 'masala box'],
  'leather-tote': ['leather tote bag', 'leather handbag'],
  'leather-wallet': ['leather wallet', 'wallet'],
  'leather-sandal': ['leather sandals', 'sandals'],
  'leather-belt': ['leather belt', 'belt'],
  'leather-journal': ['leather journal', 'notebook leather'],
  'leather-travel-bag': ['leather duffel bag', 'travel bag'],
  'cookware-set': ['cooking pot set', 'steel cookware'],
  'storage-jar': ['storage jar', 'glass jar'],
  'bedding-set': ['bed sheets', 'bedding'],
  'table-linen': ['table cloth', 'table linen'],
  'kitchen-tools': ['wooden spoons', 'kitchen utensils'],
  serveware: ['serving bowl', 'ceramic bowl'],
  'handmade-soap': ['handmade soap', 'soap bar'],
  'massage-oil': ['massage oil bottle', 'oil bottle'],
  'hair-oil': ['hair oil bottle', 'oil bottle'],
  'face-pack': ['face mask cream', 'cosmetic jar'],
  attar: ['perfume bottle', 'attar'],
  'beauty-gift-set': ['cosmetic gift set', 'skincare set'],
  notebook: ['notebook', 'paper notebook'],
  pen: ['fountain pen', 'pen'],
  sketchbook: ['sketchbook', 'drawing book'],
  'childrens-book': ['childrens book', 'picture book'],
  planner: ['planner notebook', 'diary'],
  'wrapping-paper': ['wrapping paper', 'gift wrap'],
  'kantha-wall-hanging': ['quilted wall hanging', 'textile wall art'],
  'baby-quilt': ['baby quilt', 'quilt'],
};

function queriesFor(slug: string, label: string): string[] {
  const override = queryOverrides[slug];
  if (override) return override;
  return [label, `${label} product`];
}

async function searchPexels(query: string, key: string): Promise<Candidate[]> {
  const url = new URL('https://api.pexels.com/v1/search');
  url.search = new URLSearchParams({ query, per_page: '30', orientation: 'square' }).toString();
  const response = await fetch(url, { headers: { Authorization: key } });
  if (!response.ok) throw new Error(`Pexels ${response.status}`);
  const body = (await response.json()) as {
    photos?: Array<{
      id: number;
      width: number;
      height: number;
      url: string;
      photographer: string;
      alt?: string;
      src?: { large2x?: string };
    }>;
  };
  return (body.photos ?? [])
    .filter((photo) => Math.max(photo.width, photo.height) >= MIN_LONG_SIDE && photo.src?.large2x)
    .map((photo) => ({
      provider: 'pexels' as const,
      providerId: String(photo.id),
      title: photo.alt?.trim() || query,
      sourceUrl: photo.url,
      license: 'Pexels License',
      author: photo.photographer,
      width: photo.width,
      height: photo.height,
      downloadUrl: photo.src?.large2x as string,
    }));
}

let unsplashLimited = false;

async function searchUnsplash(query: string, key: string): Promise<Candidate[]> {
  if (unsplashLimited) return [];
  const url = new URL('https://api.unsplash.com/search/photos');
  url.search = new URLSearchParams({ query, per_page: '30', orientation: 'squarish' }).toString();
  const response = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } });
  if (response.status === 403 || response.status === 429) {
    // The demo app allows 50 requests an hour; stop asking instead of burning the rest.
    unsplashLimited = true;
    console.warn(`Unsplash rate limit reached (${response.status}); keeping what was found`);
    return [];
  }
  if (!response.ok) throw new Error(`Unsplash ${response.status}`);
  const body = (await response.json()) as {
    results?: Array<{
      id: string;
      width: number;
      height: number;
      alt_description?: string | null;
      description?: string | null;
      links?: { html?: string };
      urls?: { regular?: string; full?: string };
      user?: { name?: string };
    }>;
  };
  return (body.results ?? [])
    .filter((photo) => Math.max(photo.width, photo.height) >= MIN_LONG_SIDE && photo.urls?.regular)
    .map((photo) => ({
      provider: 'unsplash' as const,
      providerId: photo.id,
      title: photo.alt_description ?? photo.description ?? query,
      sourceUrl: photo.links?.html ?? `https://unsplash.com/photos/${photo.id}`,
      license: 'Unsplash License',
      author: photo.user?.name ?? 'Unsplash contributor',
      width: photo.width,
      height: photo.height,
      downloadUrl: photo.urls?.regular as string,
    }));
}

async function searchPixabay(query: string, key: string): Promise<Candidate[]> {
  const url = new URL('https://pixabay.com/api/');
  url.search = new URLSearchParams({
    key,
    q: query,
    image_type: 'photo',
    per_page: '50',
    safesearch: 'true',
  }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Pixabay ${response.status}`);
  const body = (await response.json()) as {
    hits?: Array<{
      id: number;
      pageURL: string;
      tags: string;
      previewURL: string;
      webformatURL: string;
      largeImageURL: string;
      imageWidth: number;
      imageHeight: number;
      user: string;
    }>;
  };
  return (body.hits ?? [])
    .filter((hit) => Math.max(hit.imageWidth, hit.imageHeight) >= MIN_LONG_SIDE)
    .map((hit) => ({
      provider: 'pixabay' as const,
      providerId: String(hit.id),
      title: hit.tags.split(',').slice(0, 3).join(', ').trim() || query,
      sourceUrl: hit.pageURL,
      license: 'Pixabay Content License',
      author: hit.user,
      width: hit.imageWidth,
      height: hit.imageHeight,
      downloadUrl: hit.largeImageURL,
    }));
}

/** 64-bit average hash as 16 hex characters. */
export async function averageHash(buffer: Buffer): Promise<string> {
  const pixels = await sharp(buffer).resize(8, 8, { fit: 'fill' }).greyscale().raw().toBuffer();
  const mean = pixels.reduce((sum, value) => sum + value, 0) / pixels.length;
  let bits = '';
  for (const value of pixels) bits += value >= mean ? '1' : '0';
  return BigInt(`0b${bits}`).toString(16).padStart(16, '0');
}

export function hashDistance(left: string, right: string): number {
  let diff = BigInt(`0x${left}`) ^ BigInt(`0x${right}`);
  let distance = 0;
  while (diff > 0n) {
    distance += Number(diff & 1n);
    diff >>= 1n;
  }
  return distance;
}

function cloudinarySignature(params: Record<string, string>, secret: string): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return createHash('sha1').update(`${payload}${secret}`).digest('hex');
}

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
    for (const [name, value] of Object.entries(signed)) form.append(name, value);
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
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
  }
  throw new Error(`Cloudinary upload failed for ${publicId} after retries`);
}

async function download(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main(): Promise<void> {
  const pexels = process.env.PEXELS_API_KEY;
  const pixabay = process.env.PIXABAY_API_KEY;
  const unsplash = process.env.UNSPLASH_ACCESS_KEY;
  if (!pexels && !pixabay && !unsplash) throw new Error('No photo provider key is set');

  const labels = JSON.parse(
    await (
      await import('node:fs/promises')
    ).readFile(path.join(root, 'packages', 'seed', 'images', 'keywords.json'), 'utf8'),
  ) as Record<string, { label: string }>;

  const categories = buildCatalogSeed().categories.filter((category) => category.depth === 1);
  const bySubcategory: Record<string, SourcedAsset[]> = {};
  const usedHashes: string[] = [];

  for (const category of categories) {
    const kept: SourcedAsset[] = [];
    const queries = queriesFor(category.slug, labels[category.slug]?.label ?? category.name.en);
    for (const query of queries) {
      if (kept.length >= PHOTOS_PER_SUBCATEGORY) break;
      const found = [
        ...(pexels ? await searchPexels(query, pexels) : []),
        ...(pixabay ? await searchPixabay(query, pixabay) : []),
        ...(unsplash ? await searchUnsplash(query, unsplash) : []),
      ];
      for (const candidate of found) {
        if (kept.length >= PHOTOS_PER_SUBCATEGORY) break;
        let buffer: Buffer;
        try {
          buffer = await download(candidate.downloadUrl);
        } catch {
          continue;
        }
        const phash = await averageHash(buffer);
        if (
          [...usedHashes, ...kept.map((asset) => asset.phash)].some(
            (other) => hashDistance(phash, other) < HASH_DISTANCE_MIN,
          )
        ) {
          continue;
        }
        const publicId = `sawdagar/hardening/${category.slug}/${kept.length + 1}`;
        await uploadToCloudinary(buffer, publicId);
        kept.push({
          publicId,
          sourceUrl: candidate.sourceUrl,
          license: candidate.license,
          author: candidate.author,
          provider: candidate.provider,
          width: candidate.width,
          height: candidate.height,
          phash,
          alt: candidate.title.slice(0, 120),
        });
      }
    }
    console.log(`${category.slug}: ${kept.length}`);
    if (kept.length > 0) bySubcategory[category.slug] = kept;
    usedHashes.push(...kept.map((asset) => asset.phash));
  }

  mkdirSync(path.dirname(manifestPath), { recursive: true });
  writeFileSync(
    manifestPath,
    `${JSON.stringify({ version: 2, enforced: true, subcategories: bySubcategory }, null, 2)}\n`,
  );
  console.log(`Wrote ${manifestPath}`);
}

if (process.argv[1]?.endsWith('source.ts')) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
