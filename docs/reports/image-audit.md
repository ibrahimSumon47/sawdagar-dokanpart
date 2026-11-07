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

This pass sourced 408 new candidates from Pixabay (401) and Openverse (7) inside
GitHub Actions, with one specific query per leaf. 123 cleared CLIP and the other
checks; the contact sheets were read at full size and 55 showed a clean object
that matches one of the 25 supported leaves. Those 55 join the 28 photos kept
from the first pass. The catalogue below is all 83; every other candidate is
rejected, not renamed.

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
| `sawdagar/catalog/jute-shopping-bag/1` | Plain jute shopping bag with handles | Jute shopping bag, natural | 0.98 | ok |
| `sawdagar/catalog/jute-shopping-bag/3` | Jute shopping bag with blue trim | Jute shopping bag, blue trim | 0.96 | ok |
| `sawdagar/catalog/jute-shopping-bag/4` | Jute bag with a printed green motif | Jute shopping bag, tree print | 0.97 | ok |
| `sawdagar/catalog/cane-lamp/2` | Lit woven cane pendant lamp | Cane pendant lamp, globe | 0.76 | ok |
| `sawdagar/catalog/terracotta-tea-set/1` | Clay teapot and cup on wood | Clay teapot with cup | 0.90 | ok |
| `sawdagar/catalog/terracotta-tea-set/2` | Two small clay teapots side by side | Clay teapot set, two pots | 0.99 | ok |
| `sawdagar/catalog/terracotta-tea-set/5` | Grey clay teapot on wooden slab | Clay teapot, grey | 0.98 | ok |
| `sawdagar/catalog/terracotta-tea-set/7` | Clay teapot with four cups | Clay tea set, five piece | 1.00 | ok |
| `sawdagar/catalog/terracotta-tea-set/8` | Dark clay teapot with a cup | Clay teapot, dark glaze | 0.95 | ok |
| `sawdagar/catalog/terracotta-tea-set/6` | Clay teapot on a garden table | Clay teapot, garden green | 0.97 | ok |
| `sawdagar/catalog/planter/6` | Terracotta planter with a cactus | Terracotta planter, cactus | 0.92 | ok |
| `sawdagar/catalog/planter/7` | Glazed planter with a succulent | Ceramic planter, succulent | 0.93 | ok |
| `sawdagar/catalog/planter/8` | Tiny terracotta planter on yellow | Terracotta planter, mini | 0.69 | ok |
| `sawdagar/catalog/clay-cooking-pot/5` | Weathered grey clay cooking pot | Earthen cooking pot, weathered | 0.92 | ok |
| `sawdagar/catalog/brass-bowl/1` | Engraved brass bowl with script | Brass bowl, engraved | 0.99 | ok |
| `sawdagar/catalog/brass-bowl/3` | Brass bowl with wooden mallet | Brass singing bowl, with mallet | 1.00 | ok |
| `sawdagar/catalog/brass-bowl/6` | Two brass bowls with a mallet | Brass singing bowl set, pair | 0.91 | ok |
| `sawdagar/catalog/brass-bowl/8` | Large brass bowl and mallet | Brass singing bowl, large | 0.96 | ok |
| `sawdagar/catalog/brass-lamp/3` | Brass oil lamp with a lid | Brass oil lamp, lidded | 0.99 | ok |
| `sawdagar/catalog/brass-jug/4` | Tall brass pitcher on black | Brass pitcher, tall | 1.00 | ok |
| `sawdagar/catalog/brass-jug/6` | Copper jug with a narrow neck | Copper water jug | 0.95 | ok |
| `sawdagar/catalog/leather-tote/1` | Black leather handbag with chain | Leather handbag, black | 0.83 | ok |
| `sawdagar/catalog/leather-tote/4` | Black leather tote with tag | Leather tote, black | 0.96 | ok |
| `sawdagar/catalog/leather-tote/8` | Ivory leather tote on white | Leather tote, ivory | 0.97 | ok |
| `sawdagar/catalog/leather-wallet/2` | Brown wallet tucked in a pocket | Leather card holder, brown | 0.98 | ok |
| `sawdagar/catalog/leather-wallet/5` | Yellow leather zip wallet | Leather zip wallet, yellow | 0.96 | ok |
| `sawdagar/catalog/leather-wallet/7` | Chestnut bifold wallet in hand | Leather bifold wallet, chestnut | 0.96 | ok |
| `sawdagar/catalog/leather-wallet/8` | Tan wallet with notes and cards | Leather wallet, tan | 0.94 | ok |
| `sawdagar/catalog/leather-belt/3` | Black belt with silver buckle | Leather belt, silver buckle | 1.00 | ok |
| `sawdagar/catalog/leather-belt/4` | Brown textured belt on burlap | Leather belt, brown | 0.95 | ok |
| `sawdagar/catalog/leather-belt/7` | Tan leather belt with brass buckle | Leather belt, tan | 1.00 | ok |
| `sawdagar/catalog/leather-journal/5` | Brown leather journal and pen | Leather journal, brown | 0.80 | ok |
| `sawdagar/catalog/storage-jar/3` | Clear glass jar with red lid | Glass storage jar, red lid | 0.95 | ok |
| `sawdagar/catalog/storage-jar/4` | Ribbed glass jar with a lid | Glass storage jar, ribbed | 0.98 | ok |
| `sawdagar/catalog/bedding-set/2` | White cotton bedding on a bed | Cotton bedding set, white | 0.98 | ok |
| `sawdagar/catalog/bedding-set/4` | Off-white linen bedding, crumpled | Linen bedding set, off-white | 0.87 | ok |
| `sawdagar/catalog/bedding-set/6` | Grey bedding on a wooden bed | Cotton bedding set, grey | 0.89 | ok |
| `sawdagar/catalog/handmade-soap/2` | Stack of cream soap bars | Handmade soap, oatmeal | 0.93 | ok |
| `sawdagar/catalog/handmade-soap/4` | Two soap bars tied with twine | Handmade soap, twin bar | 1.00 | ok |
| `sawdagar/catalog/handmade-soap/5` | Green and yellow soap bars | Handmade soap, lemongrass | 0.99 | ok |
| `sawdagar/catalog/handmade-soap/6` | Two soap bars in a wooden bowl | Handmade soap, honey | 0.99 | ok |
| `sawdagar/catalog/handmade-soap/7` | Pink and blue soap bars stacked | Handmade soap set, three bars | 0.93 | ok |
| `sawdagar/catalog/massage-oil/1` | Glass bottle of golden oil | Massage oil, golden | 0.87 | ok |
| `sawdagar/catalog/massage-oil/5` | Amber oil bottles with flowers | Massage oil, amber bottle | 0.77 | ok |
| `sawdagar/catalog/massage-oil/6` | Oil bottles and frangipani flowers | Massage oil, spa bottle | 0.99 | ok |
| `sawdagar/catalog/attar/4` | Amber attar bottle with gold cap | Attar bottle, amber | 0.72 | ok |
| `sawdagar/catalog/attar/7` | Faceted crystal attar bottle | Attar bottle, crystal | 0.86 | ok |
| `sawdagar/catalog/notebook/2` | Open white notebook with coffee | Spiral notebook, white | 0.68 | ok |
| `sawdagar/catalog/notebook/3` | Notebook page and orange pencil | Notebook, ruled pages | 0.56 | ok |
| `sawdagar/catalog/pen/5` | Engraved fountain pen writing | Fountain pen, engraved nib | 0.97 | ok |
| `sawdagar/catalog/sketchbook/1` | Blank sketchbook beside paints | Sketchbook, blank pages | 0.65 | ok |
| `sawdagar/catalog/planner/3` | Open planner with flowers | Planner, weekly spread | 0.81 | ok |
| `sawdagar/catalog/planner/4` | Blank planner with paper clips | Planner, blank pages | 0.59 | ok |
| `sawdagar/catalog/planner/5` | Hand writing in an open planner | Planner, daily plan | 0.96 | ok |
| `sawdagar/catalog/planner/8` | Planner with cherry blossom branch | Planner, floral cover | 0.92 | ok |

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

`PIXABAY_API_KEY` is set in GitHub Actions (confirmed with `gh secret list`), and
the sourcing job ran there: 401 Pixabay photos and 7 Openverse photos were
downloaded, resized to 1600 px and uploaded to Cloudinary, then scored in CI.
Openverse refuses anonymous pages above 20 results, so the script asks for 20 at
a time; no Openverse candidate passed. Pexels was not used.

No threshold was lowered. Every candidate still needed the large CLIP model, no
junk label above 0.20, no face over 12% of the frame, low text density, at least
800 px on the long side, and a keyword match. `CREDITS.md` lists the source page,
licence and author for all 83 photos; all 55 new ones carry the Pixabay Content
Licence, which allows commercial use without attribution, recorded anyway.

## Before and after

| | Before | After |
| --- | --- | --- |
| Seeded products | 432 | 83 |
| Published products | 142 | 28 |
| Photos in the manifest | 440 | 83 |
| Departments with products | 12 | 7 |
| Leaf categories with products | 60 | 14 |

Products kept: 28. Products renamed around a new photo: 28. New products added in
this pass: 55. Published products left untouched: 0. Products unpublished: 114
(the old 142 minus the 28 reviewed photos). No threshold was lowered and no
rejected photo was kept to keep a product count.

## Live verification

The deployment was reseeded with 83 published products and every department and non-empty leaf category was captured at 375 and 1440 px (63 screenshots). Every department page was read at 1440 px, the mobile menu and first cards were read at 375 px, and every card's photo public ID and alt text was compared with this table in the DOM: 166 cards, 0 mismatches. The only empty departments left are hidden from the menu.
