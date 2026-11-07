/**
 * Merges the CLIP scores and the keyword rules into the image manifest and
 * writes the audit table.
 *
 * A photo is `productMatch: true` only when CLIP put its subcategory label on
 * top and cleared both thresholds, and its source title carries a required word
 * for that subcategory without a forbidden one. The report lists every photo
 * with the source title, both scores and the verdict, so a reader can see why a
 * product was unpublished instead of taking a count on trust.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('packages/seed/images/manifest.json', 'utf8'));
const scores = JSON.parse(readFileSync('clip-scores.json', 'utf8'));
const keywords = JSON.parse(readFileSync('packages/seed/images/keywords.json', 'utf8'));

const scoreByPublicId = new Map(scores.images.map((image) => [image.publicId, image]));

function keywordVerdict(subcategory, asset) {
  const rules = keywords[subcategory];
  if (!rules) return { ok: false, reason: 'no keyword rules' };
  const text = `${asset.alt} ${asset.sourceUrl}`.toLowerCase();
  const missing = !rules.requiredAny.some((word) => text.includes(word.toLowerCase()));
  if (missing) return { ok: false, reason: 'title names no product word' };
  const forbidden = rules.forbiddenAny.find((word) => text.includes(word.toLowerCase()));
  if (forbidden) return { ok: false, reason: `forbidden word "${forbidden}"` };
  return { ok: true, reason: 'keywords pass' };
}

const rows = [];
let publishedSubcategories = 0;

for (const [subcategory, photos] of Object.entries(manifest.subcategories)) {
  for (const asset of photos) {
    const clip = scoreByPublicId.get(asset.publicId);
    const keyword = keywordVerdict(subcategory, asset);
    const clipPass = Boolean(clip?.pass);
    asset.productMatch = clipPass && keyword.ok;
    asset.audit = {
      clipScore: clip?.correctProb ?? null,
      clipVerdict: clipPass ? 'pass' : 'fail',
      keywordVerdict: keyword.ok ? 'pass' : keyword.reason,
    };
    rows.push({
      subcategory,
      publicId: asset.publicId,
      alt: asset.alt,
      sourceUrl: asset.sourceUrl,
      clipScore: clip?.correctProb ?? 0,
      clipTop: clip?.topLabel ?? '',
      junkMax: clip?.junkMax ?? 0,
      keyword: keyword.ok ? 'pass' : keyword.reason,
      verdict: asset.productMatch ? 'keep' : 'fail',
    });
  }
  const passed = photos.filter((photo) => photo.productMatch).length;
  if (passed / 3 >= 1) publishedSubcategories += 1;
}

const passed = rows.filter((row) => row.verdict === 'keep').length;
manifest.version += 1;
manifest.auditedAt = new Date().toISOString().slice(0, 10);
writeFileSync('packages/seed/images/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);

const wrong = rows.length - passed;
const lines = [
  '# Image audit',
  '',
  `Audited on ${manifest.auditedAt} against the deployed catalogue. Every photograph was scored by CLIP`,
  `(${scores.model}) against its subcategory label and the junk labels, then filtered by the keyword`,
  'rules in `packages/seed/images/keywords.json`. A photo is kept only when both agree.',
  '',
  '## Summary',
  '',
  '| Measure | Count |',
  '| ------- | ----- |',
  `| Photos audited | ${rows.length} |`,
  `| Photos kept | ${passed} |`,
  `| Photos wrong or unusable | ${wrong} |`,
  `| Subcategories that still fill at least one product | ${publishedSubcategories} |`,
  '',
  '## Verdicts',
  '',
  '| Subcategory | Photo | Source title | CLIP | Keyword | Verdict |',
  '| ----------- | ----- | ------------ | ---- | ------- | ------- |',
  ...rows.map(
    (row) =>
      `| \`${row.subcategory}\` | \`${row.publicId.split('/').pop()}\` | ${row.alt.replace(/\|/g, '/')} | ${row.clipScore.toFixed(3)} → ${row.clipTop.replace(/\|/g, '/')} | ${row.keyword} | ${row.verdict} |`,
  ),
  '',
];
writeFileSync('docs/reports/image-audit.md', `${lines.join('\n')}\n`);

process.stdout.write(
  `${passed}/${rows.length} photos kept; ${publishedSubcategories} subcategories can still publish,\n`,
);
