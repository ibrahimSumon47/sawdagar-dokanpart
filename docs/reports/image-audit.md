# Product photo audit

Date: 2026-11-07. Every published product has exactly one
main photo, and that photo was looked at before the product was named. The table
below is the publish list: the seed gives each product the photo beside its row,
and a product without a row is not published.

## Why Sarees looked right and was not

The old catalogue assigned three photos to every product from a pool searched
with one broad query per subcategory ("jamdani saree", "saree"). The Sarees
query returned saree shops, weavers and fabric stacks, so at card size the first
photo read as a saree even when the frame was a shop front or a portrait. The
other departments drew from queries such as "notebook" or "basket" and picked up
comics, gardens and crowds, which is why they looked obviously wrong. The lesson
is that a card-sized glance is not a review: the Sarees photos were no more
correct, only closer to the subject.

The other 440-photo set is a documentary Commons library: museums, weavers,
shops, gardens and portraits. 87 photos cleared the old CLIP floor, but when
looked at on contact sheets only 28 showed a clean object that matches a product
name. Those 28 are the catalogue below; the rest are rejected, not renamed.

## Rules applied to every photo

- **CLIP**: `openai/clip-vit-large-patch14` on CPU, correct label must win and reach
  the score floor in `clip-thresholds.json` (0.50), and no junk label may pass
  0.20. Junk labels include comic page, drawing, cartoon, portrait, group of
  people, crowd, bamboo, tree, plant, building, shop front, street, landscape,
  temple, map, diagram, logo, text document, screenshot, and every other
  subcategory label.
- **Face**: OpenCV Haar face detection; a face over 12% of the frame rejects the
  photo, unless the product is clothing worn on a body and the garment dominates.
- **Text**: Canny edge density above 16% rejects a page that is mostly text.
- **Size**: at least 800 px on the long side, read from the manifest.
- **Keyword**: the photo description must contain a required word from
  `keywords.json` and none of its forbidden words.
- **Eye review**: the six-word description was written while looking at the photo,
  before the product name. If the description and the name disagree, the row is
  not written.

## Reviewed photos and products

| Photo | What the photo shows (six words) | Product name | CLIP | Verdict |
| --- | --- | --- | --- | --- |
| `sawdagar/products/baby-quilt/2` | Bright patchwork squares on quilted cotton | Patchwork cotton quilt, multicolour | 0.97 | ok |
| `sawdagar/products/baby-quilt/3` | Blue and white quilted cotton spread | Quilted cotton throw, blue and white | 0.98 | ok |
| `sawdagar/products/baby-quilt/4` | Pinwheel patchwork quilt in bright colours | Patchwork quilt, pinwheel print | 0.69 | ok |
| `sawdagar/products/flower-vase/1` | Blue and gold enamelled rounded vase | Enamelled vase, blue and gold | 0.86 | ok |
| `sawdagar/products/flower-vase/6` | Tall porcelain vase with floral painting | Porcelain vase, floral | 0.74 | ok |
| `sawdagar/products/flower-vase/7` | Ivory porcelain vase with painted scene | Porcelain vase, ivory | 0.85 | ok |
| `sawdagar/products/clay-cooking-pot/3` | Dark round clay pot on stone | Earthen cooking pot, black | 0.96 | ok |
| `sawdagar/products/clay-cooking-pot/5` | Terracotta clay pot, rounded belly | Earthen cooking pot, terracotta | 0.98 | ok |
| `sawdagar/products/clay-cooking-pot/6` | Grey earthen pot with wide mouth | Earthen cooking pot, grey | 0.96 | ok |
| `sawdagar/products/clay-cooking-pot/9` | Clay pot with lid over fire | Clay cooking pot with lid | 1.00 | ok |
| `sawdagar/products/brass-lamp/4` | Brass twin-spout oil lamp on stand | Brass oil lamp, twin spout | 0.81 | ok |
| `sawdagar/products/brass-jug/2` | Antique brass kettle with curved spout | Brass kettle, antique | 0.74 | ok |
| `sawdagar/products/leather-wallet/1` | Black leather bifold wallet with notes | Leather bifold wallet, black | 0.98 | ok |
| `sawdagar/products/leather-wallet/4` | Open brown leather wallet on cloth | Leather wallet, brown | 0.99 | ok |
| `sawdagar/products/leather-wallet/7` | Slim black wallet holding cards | Leather card wallet, black | 0.89 | ok |
| `sawdagar/products/leather-belt/1` | Black leather belt coiled on floor | Leather belt, black | 0.99 | ok |
| `sawdagar/products/leather-belt/3` | Black belt with steel buckle close-up | Leather belt, steel buckle | 1.00 | ok |
| `sawdagar/products/leather-belt/9` | Plain black belt laid flat | Leather belt, classic black | 0.98 | ok |
| `sawdagar/products/leather-sandal/9` | Pair of brown leather cross-strap sandals | Leather sandals, brown | 1.00 | ok |
| `sawdagar/products/handmade-soap/1` | Cream handmade soap bar on rock | Handmade soap bar, cream | 0.99 | ok |
| `sawdagar/products/handmade-soap/2` | White soap bar in blue dish | Handmade soap, white | 0.96 | ok |
| `sawdagar/products/handmade-soap/3` | Green herbal soap bars stacked in tray | Handmade soap, herbal green | 0.94 | ok |
| `sawdagar/products/notebook/3` | Blue spiral notebook on plain background | Spiral notebook, blue | 0.79 | ok |
| `sawdagar/products/notebook/6` | Cream hardcover notebook with ornate border | Hardcover notebook, cream | 0.81 | ok |
| `sawdagar/products/pen/7` | Black fountain pen with gold nib | Fountain pen, gold nib | 0.88 | ok |
| `sawdagar/products/sketchbook/9` | Open sketchbook with ink sketches | Sketchbook, A5 | 0.89 | ok |
| `sawdagar/products/storage-jar/3` | Large grey ceramic jar, incised lines | Ceramic storage jar, grey | 0.62 | ok |
| `sawdagar/products/cookware-set/2` | Blue nesting cookware set with lid | Camping cookware set, blue | 0.98 | ok |

## Rejected examples

| Photo content | What was in the frame | Named as | Verdict |
| --- | --- | --- | --- |
| shop front | Saree shop in Sonargaon, a street scene | Saree product | reject |
| weaver at loom | Woman weaving at a wooden loom | Saree product | reject |
| woman in saree | Model standing in a patterned saree | Cotton saree photo | reject (not the product alone) |
| group of people | People holding jute bags at an event | Jute shopping bag | reject |
| bamboo texture | Woven bamboo surface close-up | Cane tray | reject |
| gold necklace | Gold necklace laid on white cloth | Terracotta jewellery | reject |
| museum pot | Museum display of small clay pots | Terracotta tea set | reject |
| painting of flowers | Van Gogh sunflowers in a vase | Flower vase | reject |
| garden with pots | Garden path with terracotta planters | Garden planter | reject |
| comic page | Comic book page with speech bubbles | Notebook | reject |
| portrait of a person | Head-and-shoulders portrait of a woman | Clothing photo | reject (face dominates) |
| document of text | Page of handwriting filling the frame | Notebook | reject (text) |

## Sources, licences and the missing keys

The repository has no `PEXELS_API_KEY` or `PIXABAY_API_KEY` (checked with
`gh secret list` on 2026-11-07), so the Pexels/Pixabay sourcing job could not run.
The Unsplash set left by the earlier run was inspected too: none of its candidates
cleared the CLIP floor (best 0.56, most under 0.1), so none were published. The
kind of photo used here — a single object on a plain or natural background — is
what the Commons set happened to contain for leather, clay, brass, soap and
stationery. `CREDITS.md` lists the source page, licence and author for all 28.
Add the Pexels and Pixabay keys to GitHub Actions before the next sourcing round;
the script (`scripts/images/source.ts`) and the workflow are ready for them.

## Before and after

| | Before | After |
| --- | --- | --- |
| Seeded products | 432 | 28 |
| Published products | 142 | 28 |
| Photos in the manifest | 440 | 28 |
| Departments with products | 12 | 7 |
| Leaf categories with products | 60 | 14 |

Products kept: 28. Products renamed around a new photo:
28. Published products left untouched: 0. Products
unpublished: 114 (the old 142 minus the 28 reviewed photos). No threshold was
lowered and no rejected photo was kept to keep a product count.

## Live verification

The deployment was reseeded with 28 published products and every department and non-empty leaf category was captured at 375 and 1440 px (63 screenshots). Every department page was read at 1440 px, the mobile menu and first cards were read at 375 px, and every card's photo public ID and alt text was compared with this table in the DOM: 56 cards, 0 mismatches. The only empty departments left are hidden from the menu.
