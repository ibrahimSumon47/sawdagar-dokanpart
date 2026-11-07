/**
 * Builds one contact sheet per leaf subcategory so every photograph can be
 * judged against the product it will be shown for.
 *
 * Each sheet lists every product that owns a photo set, the three photo alts and
 * the photographs themselves at 320 px, labelled with the Cloudinary public ID.
 * The sheets are plain HTML; `audit-sheets.mjs` screenshots them with Playwright
 * and the PNGs land in docs/screenshots/image-audit.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCatalogSeed, productImageSetsBySlug, type ProductImageManifest } from '@sd/domain';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const manifest = JSON.parse(
  readFileSync(join(root, 'packages/seed/images/manifest.json'), 'utf8'),
) as ProductImageManifest;
const seed = buildCatalogSeed();
const sets = productImageSetsBySlug(seed, manifest);
const outputDir = join(root, 'docs/screenshots/image-audit/src');
mkdirSync(outputDir, { recursive: true });

const cloud = 'uapiw50d';
const bySubcategory = new Map<string, string[]>();
for (const [slug, set] of sets) {
  const product = seed.products.find((entry) => entry.slug === slug);
  if (!product) continue;
  const list = bySubcategory.get(product.categorySlug) ?? [];
  list.push(slug);
  bySubcategory.set(product.categorySlug, list);
}

for (const [subcategory, slugs] of bySubcategory) {
  const cards = slugs
    .map((slug) => {
      const product = seed.products.find((entry) => entry.slug === slug);
      const set = sets.get(slug);
      if (!product || !set) return '';
      const photos = set.images
        .map(
          (image) => `<figure>
        <img src="https://res.cloudinary.com/${cloud}/image/upload/c_limit,f_auto,q_auto,w_320/${image.publicId}" width="320" height="240" alt="">
        <figcaption>${image.alt}<br><code>${image.publicId.split('/').pop()}</code></figcaption>
      </figure>`,
        )
        .join('');
      return `<article class="card">
      <h2>${product.title.en}</h2>
      <p class="slug">${slug}</p>
      <div class="photos">${photos}</div>
    </article>`;
    })
    .join('');

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${subcategory}</title>
  <style>
    body{font:14px/1.4 system-ui,sans-serif;margin:16px;background:#faf8f4;color:#222}
    h1{font-size:18px;margin:0 0 12px}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .card{background:#fff;border:1px solid #ddd;border-radius:8px;padding:10px}
    h2{font-size:14px;margin:0 0 2px}
    .slug{color:#666;font-size:11px;margin:0 0 8px}
    .photos{display:flex;gap:6px}
    figure{margin:0;width:100%}
    img{width:100%;height:auto;border-radius:4px;display:block;background:#eee}
    figcaption{font-size:10px;color:#555;margin-top:3px}
  </style></head><body><h1>${subcategory}</h1><div class="grid">${cards}</div></body></html>`;

  writeFileSync(join(outputDir, `${subcategory}.html`), html);
}

process.stdout.write(`${bySubcategory.size} sheets in ${outputDir}\n`);
