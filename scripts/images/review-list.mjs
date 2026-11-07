/**
 * Prints the passing candidates grouped by leaf, so a contact sheet can be
 * matched to exact Cloudinary IDs and source titles while reviewing by eye.
 */
import { readFileSync } from 'node:fs';

const candidates = JSON.parse(readFileSync('packages/seed/images/candidates.json', 'utf8'));
const scores = JSON.parse(readFileSync('candidate-scores.json', 'utf8'));
const sources = JSON.parse(readFileSync('docs/reports/data/candidate-sources.json', 'utf8'));
const byId = new Map(scores.images.map((entry) => [entry.publicId, entry]));

for (const [leaf, photos] of Object.entries(candidates.subcategories)) {
  console.log(`\n## ${leaf}`);
  photos.forEach((photo, index) => {
    const score = byId.get(photo.publicId);
    if (!score?.pass) return;
    const source = sources[photo.publicId] ?? {};
    console.log(
      `${index + 1}\t${photo.publicId}\t${score.correctProb}\t${source.title ?? photo.alt}\t${source.author ?? photo.author}`,
    );
  });
}
