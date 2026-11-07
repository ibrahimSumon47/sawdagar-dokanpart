/**
 * Sources product photographs from Pixabay and Openverse for the leaves that
 * stock photography can actually fill.
 *
 * This is a candidate run: nothing it finds is published. It uploads the
 * deduplicated candidates to Cloudinary under `sawdagar/catalog/...`, writes a
 * candidate manifest and leaves the scoring and the eye review to later steps.
 * A candidate is kept only when the provider returns a photograph (not an
 * illustration), the decoded image is at least 800 px on the long side, and its
 * perceptual hash is not close to a photo already kept.
 *
 * Runs inside GitHub Actions only: it needs PIXABAY_API_KEY and the three
 * CLOUDINARY_* variables. Never point it at the committed manifest.
 */

import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const requireWeb = createRequire(path.join(root, 'apps', 'web', 'package.json'));
const sharp = requireWeb('sharp') as typeof import('sharp');

const HASH_DISTANCE_MIN = 8;
const PHOTOS_PER_SUBCATEGORY = 8;
const MIN_LONG_SIDE = 800;
const DATASET = 'sawdagar/catalog';

export interface Candidate {
  provider: 'pixabay' | 'openverse';
  providerId: string;
  title: string;
  sourceUrl: string;
  license: string;
  author: string;
  width: number;
  height: number;
  downloadUrl: string;
}

export interface CandidateAsset {
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

/**
 * Leaf categories worth sourcing, with product-focused queries.
 *
 * Each query asks for the object, not the craft story, and leans on words that
 * stock photographers use for a clean product shot: "white background",
 * "flat lay", "product photo". A leaf that is not listed is not sourced.
 */
const targets: Record<string, string[]> = {
  'jute-tote': ['jute bag', 'jute tote bag', 'burlap tote bag'],
  'jute-shopping-bag': ['jute shopping bag', 'burlap bag', 'jute handbag'],
  'jute-storage-basket': ['jute basket', 'rope basket', 'woven storage basket'],
  'jute-table-mat': ['jute placemat', 'woven table mat', 'burlap placemat'],
  'cane-basket': ['wicker basket', 'cane basket', 'woven basket white background'],
  'cane-tray': ['wicker tray', 'cane tray', 'serving tray woven'],
  'cane-lamp': ['wicker lamp', 'rattan lamp shade', 'bamboo lamp'],
  'cane-stool': ['cane stool', 'rattan stool', 'wicker chair'],
  'bamboo-mat': ['bamboo mat', 'woven straw mat', 'bamboo placemat'],
  'terracotta-tea-set': ['clay teapot', 'terracotta tea set', 'ceramic tea set'],
  'pottery-dinner-set': ['ceramic dinner plates', 'pottery bowl set', 'stoneware plates'],
  'flower-vase': ['ceramic vase', 'flower vase white background', 'pottery vase'],
  planter: ['terracotta pot', 'ceramic planter', 'plant pot white background'],
  'clay-cooking-pot': ['clay pot', 'earthen pot', 'cooking pot clay'],
  'brass-bowl': ['brass bowl', 'copper bowl', 'metal bowl'],
  'brass-plate': ['brass plate', 'copper plate', 'metal tray'],
  'brass-lamp': ['brass lamp', 'oil lamp brass', 'brass candle holder'],
  'brass-jug': ['brass jug', 'copper pitcher', 'metal jug'],
  'brass-spice-box': ['spice box', 'masala dabba', 'spice container'],
  'leather-tote': ['leather tote bag', 'leather handbag', 'leather bag product'],
  'leather-wallet': ['leather wallet', 'wallet product photo', 'leather purse'],
  'leather-belt': ['leather belt', 'belt product photo', 'leather belt flat lay'],
  'leather-sandal': ['leather sandals', 'leather sandal product', 'brown sandals'],
  'leather-journal': ['leather journal', 'leather notebook cover', 'leather diary'],
  'cookware-set': ['cookware set', 'steel pots', 'cooking pots set'],
  'storage-jar': ['storage jar', 'ceramic jar with lid', 'glass storage jar'],
  'kitchen-tools': ['wooden spoons', 'kitchen utensils wood', 'wooden spatula set'],
  serveware: ['serving bowl', 'ceramic serving dish', 'wooden serving board'],
  'table-linen': ['table cloth', 'linen table runner', 'table linen'],
  'bedding-set': ['bed sheets', 'bedding set', 'linen bedding'],
  'handmade-soap': ['handmade soap', 'soap bar', 'natural soap bars'],
  'massage-oil': ['massage oil bottle', 'massage oil', 'essential oil bottle'],
  'hair-oil': ['hair oil bottle', 'oil bottle', 'argan oil bottle'],
  'face-pack': ['face mask cream', 'clay face mask', 'cosmetic jar'],
  attar: ['perfume bottle', 'attar bottle', 'fragrance bottle'],
  notebook: ['notebook', 'notebook flat lay', 'paper notebook white background'],
  pen: ['fountain pen', 'pen product photo', 'fountain pen nib'],
  sketchbook: ['sketchbook', 'drawing book', 'blank sketchbook'],
  planner: ['planner notebook', 'diary notebook', 'journal planner'],
  'wrapping-paper': ['wrapping paper', 'gift wrap', 'wrapping paper rolls'],
  'childrens-book': ['childrens book', 'picture book', 'storybook'],
  'baby-quilt': ['baby quilt', 'patchwork quilt', 'quilted blanket'],
  'kantha-cushion': ['cushion cover', 'throw pillow woven', 'quilted cushion'],
  'kantha-runner': ['table runner quilted', 'kantha runner', 'fabric table runner'],
  'handloom-table-runner': ['woven table runner', 'handloom table runner', 'linen runner'],
  gamcha: ['cotton towel', 'hand towel woven', 'cotton scarf'],
  'handloom-shawl': ['wool shawl', 'woven shawl', 'cotton shawl'],
  'fabric-by-metre': ['cotton fabric', 'fabric roll', 'woven fabric texture'],
  'short-kurta': ['cotton kurta', 'kurta shirt', 'tunic shirt men'],
  'cotton-panjabi': ['panjabi', 'mens kurta', 'cotton tunic'],
  'cotton-saree': ['saree fabric', 'saree textile', 'cotton saree'],
};

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
      title: hit.tags.split(',').slice(0, 4).join(', ').trim() || query,
      sourceUrl: hit.pageURL,
      license: 'Pixabay Content License',
      author: hit.user,
      width: hit.imageWidth,
      height: hit.imageHeight,
      downloadUrl: hit.largeImageURL,
    }));
}

/** Licences that allow commercial use without a share-alike surprise. */
const openverseLicence = /^(cc0|by|by-sa)$/i;

async function searchOpenverse(query: string): Promise<Candidate[]> {
  const url = new URL('https://api.openverse.org/v1/images/');
  url.search = new URLSearchParams({
    q: query,
    license_type: 'commercial',
    category: 'photograph',
    // Anonymous requests are capped at 20 results; a larger page returns 401.
    page_size: '20',
    mature: 'false',
  }).toString();
  const response = await fetch(url, {
    headers: { 'User-Agent': 'SawdagarDokanpat/1.0 (portfolio project)' },
  });
  if (!response.ok) throw new Error(`Openverse ${response.status}`);
  const body = (await response.json()) as {
    results?: Array<{
      id: string;
      title: string;
      url: string;
      foreign_landing_url: string;
      creator: string | null;
      license: string;
      width: number | null;
      height: number | null;
    }>;
  };
  return (body.results ?? [])
    .filter(
      (item) =>
        item.url &&
        Math.max(item.width ?? 0, item.height ?? 0) >= MIN_LONG_SIDE &&
        openverseLicence.test(item.license),
    )
    .map((item) => ({
      provider: 'openverse' as const,
      providerId: item.id,
      title: item.title?.slice(0, 120) || query,
      sourceUrl: item.foreign_landing_url,
      license: `CC ${item.license.toUpperCase()} 4.0`,
      author: item.creator || 'Unknown author',
      width: item.width ?? 0,
      height: item.height ?? 0,
      downloadUrl: item.url,
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

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signed = { public_id: publicId, timestamp, overwrite: 'true' };
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
  const response = await fetch(url, { headers: { 'User-Agent': 'SawdagarDokanpat/1.0' } });
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main(): Promise<void> {
  const pixabay = process.env.PIXABAY_API_KEY;
  if (!pixabay) throw new Error('PIXABAY_API_KEY is not set');

  const bySubcategory: Record<string, CandidateAsset[]> = {};
  const metadata: Record<string, Candidate> = {};
  const usedHashes: string[] = [];
  const counts = { pixabay: 0, openverse: 0 };
  let warnedOpenverse = false;

  for (const [slug, queries] of Object.entries(targets)) {
    const kept: CandidateAsset[] = [];
    for (const query of queries) {
      if (kept.length >= PHOTOS_PER_SUBCATEGORY) break;
      let openverse: Candidate[] = [];
      try {
        openverse = await searchOpenverse(query);
      } catch (error) {
        // Pixabay alone still has to finish; the run reports what Openverse did.
        if (!warnedOpenverse) {
          console.warn(`Openverse unavailable: ${(error as Error).message}`);
          warnedOpenverse = true;
        }
      }
      const found = [...(await searchPixabay(query, pixabay)), ...openverse];
      for (const candidate of found) {
        if (kept.length >= PHOTOS_PER_SUBCATEGORY) break;
        let buffer: Buffer;
        try {
          buffer = await download(candidate.downloadUrl);
        } catch {
          continue;
        }
        const decoded = await sharp(buffer).metadata();
        const width = decoded.width ?? 0;
        const height = decoded.height ?? 0;
        if (Math.max(width, height) < MIN_LONG_SIDE) continue;
        const phash = await averageHash(buffer);
        if (
          [...usedHashes, ...kept.map((asset) => asset.phash)].some(
            (other) => hashDistance(phash, other) < HASH_DISTANCE_MIN,
          )
        ) {
          continue;
        }
        const index = kept.length + 1;
        const publicId = `${DATASET}/${slug}/${index}`;
        try {
          await uploadToCloudinary(buffer, publicId);
        } catch (error) {
          console.warn(`${publicId}: ${(error as Error).message}`);
          continue;
        }
        counts[candidate.provider] += 1;
        kept.push({
          publicId,
          sourceUrl: candidate.sourceUrl,
          license: candidate.license,
          author: candidate.author,
          provider: candidate.provider,
          width,
          height,
          phash,
          alt: candidate.title.slice(0, 120),
        });
        metadata[publicId] = candidate;
      }
      // Openverse is rate limited harder than Pixabay; a short pause keeps the
      // run inside the anonymous allowance without wasting the whole batch.
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    console.log(`${slug}: ${kept.length}`);
    if (kept.length > 0) bySubcategory[slug] = kept;
    usedHashes.push(...kept.map((asset) => asset.phash));
  }

  const candidatesPath = path.join(root, 'packages', 'seed', 'images', 'candidates.json');
  mkdirSync(path.dirname(candidatesPath), { recursive: true });
  writeFileSync(
    candidatesPath,
    `${JSON.stringify(
      {
        version: 1,
        enforced: false,
        sourcedAt: new Date().toISOString().slice(0, 10),
        subcategories: bySubcategory,
      },
      null,
      2,
    )}\n`,
  );
  const metadataPath = path.join(root, 'docs', 'reports', 'data', 'candidate-sources.json');
  mkdirSync(path.dirname(metadataPath), { recursive: true });
  writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  console.log(
    `Wrote ${Object.values(bySubcategory).flat().length} candidates ` +
      `(${counts.pixabay} Pixabay, ${counts.openverse} Openverse) across ${Object.keys(bySubcategory).length} leaves`,
  );
}

if (process.argv[1]?.endsWith('source.ts')) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
