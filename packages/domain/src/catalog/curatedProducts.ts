/**
 * Products written around photographs that were looked at, one by one.
 *
 * Every entry names the exact Cloudinary photo it is sold with. The photo was
 * checked first (CLIP score above the floor and an eye review), then the title,
 * description and Bangla copy were written from what the photo shows. Products
 * that had no photo matching their name are not in this list; their categories
 * are hidden rather than filled with a borrowed picture.
 */
export interface CuratedProduct {
  /** Stable URL slug, derived from the English title. */
  slug: string;
  /** Leaf category the product is filed under. */
  subcategory: string;
  /** Organization slug of the seller. */
  vendorSlug: string;
  title: { en: string; bn: string };
  description: { en: string; bn: string };
  /** Price in whole taka before the variant factors. */
  priceTaka: number;
  /** Cloudinary public ID of the reviewed main photo. */
  photo: string;
  /** CLIP probability for the correct label, recorded at review time. */
  clipScore: number;
  /** What the photograph shows, in six words, written before naming the product. */
  shows: string;
}

export const curatedProducts: readonly CuratedProduct[] = [
  {
    slug: 'patchwork-cotton-quilt-multicolour',
    subcategory: 'baby-quilt',
    vendorSlug: 'jamalpur-kantha-collective',
    title: { en: 'Patchwork cotton quilt, multicolour', bn: 'প্যাচওয়ার্ক সুতি কুইল্ট, রঙিন' },
    description: {
      en: 'A light cotton quilt pieced from bright squares and finished with hand stitching. Sized for a cot or a single bed.',
      bn: 'উজ্জ্বল রঙের চৌকো টুকরো জোড়া হালকা সুতি কুইল্ট, হাতের সেলাইয়ে শেষ করা। খাট বা একক বিছানার মাপে।',
    },
    priceTaka: 4200,
    photo: 'sawdagar/products/baby-quilt/2',
    clipScore: 0.97,
    shows: 'Bright patchwork squares on quilted cotton',
  },
  {
    slug: 'quilted-cotton-throw-blue-white',
    subcategory: 'baby-quilt',
    vendorSlug: 'rajshahi-kantha-kuthir',
    title: { en: 'Quilted cotton throw, blue and white', bn: 'সুতি কুইল্ট, নীল ও সাদা' },
    description: {
      en: 'Blue and white cotton throw with an all-over quilted pattern and a soft, worn finish. Light enough to fold over a chair.',
      bn: 'নীল ও সাদা সুতির কুইল্ট, সর্বত্র কুইল্টিং নকশা আর নরম ফিনিশ। চেয়ারের উপর ভাঁজ করে রাখার মতো হালকা।',
    },
    priceTaka: 3800,
    photo: 'sawdagar/products/baby-quilt/3',
    clipScore: 0.98,
    shows: 'Blue and white quilted cotton spread',
  },
  {
    slug: 'pinwheel-patchwork-quilt',
    subcategory: 'baby-quilt',
    vendorSlug: 'jamalpur-kantha-collective',
    title: { en: 'Patchwork quilt, pinwheel print', bn: 'প্যাচওয়ার্ক কুইল্ট, পিনহুইল নকশা' },
    description: {
      en: 'A cotton quilt of pinwheel blocks in red, green and yellow, backed in a plain cream cloth. Each block is joined by hand.',
      bn: 'লাল, সবুজ ও হলুদ পিনহুইল ব্লকের সুতি কুইল্ট, পিছনে সাদামাটা ক্রিম কাপড়। প্রতিটি ব্লক হাতে জোড়া।',
    },
    priceTaka: 4600,
    photo: 'sawdagar/products/baby-quilt/4',
    clipScore: 0.69,
    shows: 'Pinwheel patchwork quilt in bright colours',
  },
  {
    slug: 'enamelled-vase-blue-gold',
    subcategory: 'flower-vase',
    vendorSlug: 'paharpur-clay-studio',
    title: { en: 'Enamelled vase, blue and gold', bn: 'এনামেল ফুলদানি, নীল ও সোনালি' },
    description: {
      en: 'A rounded vase with a narrow neck, decorated in blue, green and gold enamel over a pale ground. It holds a single stem well.',
      bn: 'সরু গলার গোল ফুলদানি, হালকা পটভূমিতে নীল, সবুজ ও সোনালি এনামেলের কাজ। একটি ডাঁটার ফুলের জন্য ভালো।',
    },
    priceTaka: 3200,
    photo: 'sawdagar/products/flower-vase/1',
    clipScore: 0.86,
    shows: 'Blue and gold enamelled rounded vase',
  },
  {
    slug: 'porcelain-vase-floral',
    subcategory: 'flower-vase',
    vendorSlug: 'paharpur-clay-studio',
    title: { en: 'Porcelain vase, floral', bn: 'চীনামাটির ফুলদানি, ফুলের নকশা' },
    description: {
      en: 'A tall porcelain vase painted with flowering branches and finished with a fine gold rim. The glaze is glossy and even.',
      bn: 'লম্বা চীনামাটির ফুলদানি, ফুলের ডালের নকশা আর সোনালি রিম। গ্লেজ মসৃণ ও সমান।',
    },
    priceTaka: 3600,
    photo: 'sawdagar/products/flower-vase/6',
    clipScore: 0.74,
    shows: 'Tall porcelain vase with floral painting',
  },
  {
    slug: 'porcelain-vase-ivory',
    subcategory: 'flower-vase',
    vendorSlug: 'dhamrai-pottery-house',
    title: { en: 'Porcelain vase, ivory', bn: 'চীনামাটির ফুলদানি, আইভরি' },
    description: {
      en: 'An ivory porcelain vase with a subtle painted landscape and a gently swelling body. Best for dried stems or a few cut flowers.',
      bn: 'আইভরি রঙের চীনামাটির ফুলদানি, হালকা আঁকা দৃশ্য আর গোলাকার গড়ন। শুকনো ডাঁটা বা কয়েকটি ফুলের জন্য ভালো।',
    },
    priceTaka: 3400,
    photo: 'sawdagar/products/flower-vase/7',
    clipScore: 0.85,
    shows: 'Ivory porcelain vase with painted scene',
  },
  {
    slug: 'earthen-cooking-pot-black',
    subcategory: 'clay-cooking-pot',
    vendorSlug: 'paharpur-clay-studio',
    title: { en: 'Earthen cooking pot, black', bn: 'মাটির রান্নার হাঁড়ি, কালো' },
    description: {
      en: 'A round clay pot fired to a dark finish, with a wide mouth and a thick body. It is made for slow cooking on a low flame.',
      bn: 'কালো ফিনিশে পোড়া গোল মাটির হাঁড়ি, চওড়া মুখ আর মোটা গা। কম আঁচে ধীরে রান্নার জন্য তৈরি।',
    },
    priceTaka: 950,
    photo: 'sawdagar/products/clay-cooking-pot/3',
    clipScore: 0.96,
    shows: 'Dark round clay pot on stone',
  },
  {
    slug: 'earthen-cooking-pot-terracotta',
    subcategory: 'clay-cooking-pot',
    vendorSlug: 'dhamrai-pottery-house',
    title: { en: 'Earthen cooking pot, terracotta', bn: 'মাটির রান্নার হাঁড়ি, টেরাকোটা' },
    description: {
      en: 'A terracotta pot with a rounded belly and a plain rim, fired without glaze. Season it before the first cook.',
      bn: 'টেরাকোটা রঙের গোল পেটের মাটির হাঁড়ি, সাদামাটা মুখ, গ্লেজ ছাড়া পোড়া। প্রথম রান্নার আগে ভিজিয়ে নিন।',
    },
    priceTaka: 1050,
    photo: 'sawdagar/products/clay-cooking-pot/5',
    clipScore: 0.98,
    shows: 'Terracotta clay pot, rounded belly',
  },
  {
    slug: 'earthen-cooking-pot-grey',
    subcategory: 'clay-cooking-pot',
    vendorSlug: 'dhamrai-pottery-house',
    title: { en: 'Earthen cooking pot, grey', bn: 'মাটির রান্নার হাঁড়ি, ধূসর' },
    description: {
      en: 'A grey clay pot with a wide opening and a matte surface. It suits dal, rice and slow-cooked meat.',
      bn: 'চওড়া মুখের ধূসর মাটির হাঁড়ি, ম্যাট ফিনিশ। ডাল, ভাত ও ধীরে রান্না করা মাংসের জন্য উপযুক্ত।',
    },
    priceTaka: 900,
    photo: 'sawdagar/products/clay-cooking-pot/6',
    clipScore: 0.96,
    shows: 'Grey earthen pot with wide mouth',
  },
  {
    slug: 'clay-cooking-pot-with-lid',
    subcategory: 'clay-cooking-pot',
    vendorSlug: 'paharpur-clay-studio',
    title: { en: 'Clay cooking pot with lid', bn: 'ঢাকনাসহ মাটির হাঁড়ি' },
    description: {
      en: 'A clay pot and its fitted lid, shown over an open fire. The lid keeps steam in, so the pot works for rice and braises.',
      bn: 'মাটির হাঁড়ি ও তার ঢাকনা, খোলা আগুনে বসানো। ঢাকনা বাষ্প ধরে রাখে, তাই ভাত ও ঝোল রান্নায় ভালো।',
    },
    priceTaka: 1250,
    photo: 'sawdagar/products/clay-cooking-pot/9',
    clipScore: 1,
    shows: 'Clay pot with lid over fire',
  },
  {
    slug: 'brass-oil-lamp-twin-spout',
    subcategory: 'brass-lamp',
    vendorSlug: 'dhamrai-brass-works',
    title: { en: 'Brass oil lamp, twin spout', bn: 'পিতলের প্রদীপ, দুই মুখ' },
    description: {
      en: 'A cast brass lamp on a stepped stand with two hanging spouts and a small bird finial. It is polished but not lacquered.',
      bn: 'সিঁড়ি আকৃতির ভিত্তির উপর ঢালাই করা পিতলের প্রদীপ, দুটি ঝোলানো মুখ আর পাখির নকশা। পালিশ করা, ল্যাকার নেই।',
    },
    priceTaka: 3800,
    photo: 'sawdagar/products/brass-lamp/4',
    clipScore: 0.81,
    shows: 'Brass twin-spout oil lamp on stand',
  },
  {
    slug: 'brass-kettle-antique',
    subcategory: 'brass-jug',
    vendorSlug: 'mirzapur-brass-house',
    title: { en: 'Brass kettle, antique', bn: 'পিতলের কেটলি, অ্যান্টিক' },
    description: {
      en: 'A brass kettle with a curved spout and a side handle, patinated rather than polished. The body is hammered and shows its age.',
      bn: 'বাঁকা মুখ আর পাশের হাতলের পিতলের কেটলি, পালিশ নয়—পুরনো পিতিন। গায়ে হাতুড়ির চিহ্ন ও সময়ের দাগ।',
    },
    priceTaka: 2900,
    photo: 'sawdagar/products/brass-jug/2',
    clipScore: 0.74,
    shows: 'Antique brass kettle with curved spout',
  },
  {
    slug: 'leather-bifold-wallet-black',
    subcategory: 'leather-wallet',
    vendorSlug: 'hazaribagh-leather-atelier',
    title: { en: 'Leather bifold wallet, black', bn: 'চামড়ার বাইফোল্ড মানিব্যাগ, কালো' },
    description: {
      en: 'A black leather bifold with two note pockets and a full-width card slot. The leather has a soft, slightly grained surface.',
      bn: 'কালো চামড়ার বাইফোল্ড, দুটি নোট পকেট আর চওড়া কার্ড স্লট। চামড়ার গা নরম, হালকা দানাদার।',
    },
    priceTaka: 1450,
    photo: 'sawdagar/products/leather-wallet/1',
    clipScore: 0.98,
    shows: 'Black leather bifold wallet with notes',
  },
  {
    slug: 'leather-wallet-brown',
    subcategory: 'leather-wallet',
    vendorSlug: 'bhairab-leather-works',
    title: { en: 'Leather wallet, brown', bn: 'চামড়ার মানিব্যাগ, বাদামি' },
    description: {
      en: 'A brown leather wallet opened flat, with a card window and two slip pockets. The edges are stitched in a matching thread.',
      bn: 'খোলা বাদামি চামড়ার মানিব্যাগ, কার্ড উইন্ডো আর দুটি স্লিপ পকেট। কিনারা মিলিয়ে সেলাই করা।',
    },
    priceTaka: 1350,
    photo: 'sawdagar/products/leather-wallet/4',
    clipScore: 0.99,
    shows: 'Open brown leather wallet on cloth',
  },
  {
    slug: 'leather-card-wallet-black',
    subcategory: 'leather-wallet',
    vendorSlug: 'hazaribagh-leather-atelier',
    title: { en: 'Leather card wallet, black', bn: 'চামড়ার কার্ড ওয়ালেট, কালো' },
    description: {
      en: 'A slim black card wallet holding a few notes and cards. It is cut from a single piece and folded rather than stitched.',
      bn: 'কয়েকটি নোট ও কার্ড ধরার সরু কালো ওয়ালেট। এক টুকরো চামড়া কেটে সেলাই ছাড়া ভাঁজ করা।',
    },
    priceTaka: 850,
    photo: 'sawdagar/products/leather-wallet/7',
    clipScore: 0.89,
    shows: 'Slim black wallet holding cards',
  },
  {
    slug: 'leather-belt-black',
    subcategory: 'leather-belt',
    vendorSlug: 'bhairab-leather-works',
    title: { en: 'Leather belt, black', bn: 'চামড়ার বেল্ট, কালো' },
    description: {
      en: 'A black leather belt with a plain silver buckle and a single keeper. It is cut straight and punched at regular intervals.',
      bn: 'সাদামাটা রুপালি বাকল আর একটি কিপারের কালো চামড়ার বেল্ট। সোজা কাটা, সমান দূরত্বে ছিদ্র।',
    },
    priceTaka: 1150,
    photo: 'sawdagar/products/leather-belt/1',
    clipScore: 0.99,
    shows: 'Black leather belt coiled on floor',
  },
  {
    slug: 'leather-belt-steel-buckle',
    subcategory: 'leather-belt',
    vendorSlug: 'hazaribagh-leather-atelier',
    title: { en: 'Leather belt, steel buckle', bn: 'চামড়ার বেল্ট, স্টিল বাকল' },
    description: {
      en: 'A black belt with a brushed steel buckle and a stitched edge. The leather is stiff at first and softens with wear.',
      bn: 'ব্রাশড স্টিল বাকল আর সেলাই করা কিনারার কালো বেল্ট। চামড়া প্রথমে শক্ত, ব্যবহারে নরম হয়।',
    },
    priceTaka: 1250,
    photo: 'sawdagar/products/leather-belt/3',
    clipScore: 1,
    shows: 'Black belt with steel buckle close-up',
  },
  {
    slug: 'leather-belt-classic-black',
    subcategory: 'leather-belt',
    vendorSlug: 'bhairab-leather-works',
    title: { en: 'Leather belt, classic black', bn: 'চামড়ার বেল্ট, ক্লাসিক কালো' },
    description: {
      en: 'A plain black belt photographed flat, with a square buckle and seven holes. A everyday strap for trousers or jeans.',
      bn: 'সমতলে রাখা সাদামাটা কালো বেল্ট, চৌকো বাকল আর সাতটি ছিদ্র। প্যান্ট বা জিন্সের নিত্যদিনের বেল্ট।',
    },
    priceTaka: 1050,
    photo: 'sawdagar/products/leather-belt/9',
    clipScore: 0.98,
    shows: 'Plain black belt laid flat',
  },
  {
    slug: 'leather-sandals-brown',
    subcategory: 'leather-sandal',
    vendorSlug: 'hazaribagh-leather-atelier',
    title: { en: 'Leather sandals, brown', bn: 'চামড়ার স্যান্ডেল, বাদামি' },
    description: {
      en: 'A pair of brown leather sandals with wide cross straps and a buckled ankle strap. The footbed is flat and lightly cushioned.',
      bn: 'চওড়া ক্রস স্ট্র্যাপ আর বাকলযুক্ত গোড়ালির বেল্টসহ বাদামি চামড়ার স্যান্ডেল। ফুটবেড সমতল, হালকা নরম।',
    },
    priceTaka: 2200,
    photo: 'sawdagar/products/leather-sandal/9',
    clipScore: 1,
    shows: 'Pair of brown leather cross-strap sandals',
  },
  {
    slug: 'handmade-soap-cream',
    subcategory: 'handmade-soap',
    vendorSlug: 'sundarban-soap-house',
    title: { en: 'Handmade soap bar, cream', bn: 'হাতে তৈরি সাবান, ক্রিম' },
    description: {
      en: 'A cream-coloured soap bar with a soft, uneven surface and a faint herbal scent. Cut by hand, so the edges are not sharp.',
      bn: 'নরম, অসমতল গায়ের ক্রিম রঙের সাবান, হালকা ভেষজ গন্ধ। হাতে কাটা, তাই কিনারা ধারালো নয়।',
    },
    priceTaka: 320,
    photo: 'sawdagar/products/handmade-soap/1',
    clipScore: 0.99,
    shows: 'Cream handmade soap bar on rock',
  },
  {
    slug: 'handmade-soap-white',
    subcategory: 'handmade-soap',
    vendorSlug: 'herbal-bengal',
    title: { en: 'Handmade soap, white', bn: 'হাতে তৈরি সাবান, সাদা' },
    description: {
      en: 'A smooth white soap bar resting in a pale blue dish. It lathers lightly and is sized for a guest bathroom.',
      bn: 'হালকা নীল বাটিতে রাখা মসৃণ সাদা সাবান। হালকা ফেনা হয়, অতিথির বাথরুমের মাপে।',
    },
    priceTaka: 280,
    photo: 'sawdagar/products/handmade-soap/2',
    clipScore: 0.96,
    shows: 'White soap bar in blue dish',
  },
  {
    slug: 'handmade-soap-herbal-green',
    subcategory: 'handmade-soap',
    vendorSlug: 'sundarban-soap-house',
    title: { en: 'Handmade soap, herbal green', bn: 'হাতে তৈরি সাবান, হারবাল সবুজ' },
    description: {
      en: 'Green soap bars stamped with a leaf mark and stacked in a tray. The colour comes from the herbs mixed into the batch.',
      bn: 'পাতার ছাপ দেওয়া সবুজ সাবানের বার, ট্রেতে সাজানো। রং ব্যাচে মেশানো ভেষজ থেকে আসে।',
    },
    priceTaka: 300,
    photo: 'sawdagar/products/handmade-soap/3',
    clipScore: 0.94,
    shows: 'Green herbal soap bars stacked in tray',
  },
  {
    slug: 'spiral-notebook-blue',
    subcategory: 'notebook',
    vendorSlug: 'bangla-boi-ghor',
    title: { en: 'Spiral notebook, blue', bn: 'স্পাইরাল নোটবুক, নীল' },
    description: {
      en: 'A blue spiral notebook with ruled pages and a stiff cover. It opens flat, which makes it useful for class notes.',
      bn: 'নীল স্পাইরাল নোটবুক, রুল টানা পাতা আর শক্ত মলাট। সমতল খোলে, ক্লাসের নোটের জন্য সুবিধাজনক।',
    },
    priceTaka: 240,
    photo: 'sawdagar/products/notebook/3',
    clipScore: 0.79,
    shows: 'Blue spiral notebook on plain background',
  },
  {
    slug: 'hardcover-notebook-cream',
    subcategory: 'notebook',
    vendorSlug: 'chittagong-stationery-mart',
    title: { en: 'Hardcover notebook, cream', bn: 'হার্ডকভার নোটবুক, ক্রিম' },
    description: {
      en: 'A cream hardcover notebook with a decorative border and blank pages. The binding is sewn, so it lies open without cracking.',
      bn: 'নকশাদার বর্ডার আর ফাঁকা পাতার ক্রিম হার্ডকভার নোটবুক। সেলাই বাঁধাই, খুললে ভাঙে না।',
    },
    priceTaka: 380,
    photo: 'sawdagar/products/notebook/6',
    clipScore: 0.81,
    shows: 'Cream hardcover notebook with ornate border',
  },
  {
    slug: 'fountain-pen-gold-nib',
    subcategory: 'pen',
    vendorSlug: 'chittagong-stationery-mart',
    title: { en: 'Fountain pen, gold nib', bn: 'ফাউন্টেন পেন, সোনালি নিব' },
    description: {
      en: 'A black fountain pen with a gold-coloured nib, shown writing on paper. It takes standard ink cartridges.',
      bn: 'সোনালি রঙের নিবের কালো ফাউন্টেন পেন, কাগজে লিখতে দেখা যাচ্ছে। সাধারণ কালির কার্ট্রিজ লাগে।',
    },
    priceTaka: 950,
    photo: 'sawdagar/products/pen/7',
    clipScore: 0.88,
    shows: 'Black fountain pen with gold nib',
  },
  {
    slug: 'sketchbook-a5',
    subcategory: 'sketchbook',
    vendorSlug: 'bangla-boi-ghor',
    title: { en: 'Sketchbook, A5', bn: 'স্কেচবুক, এ৫' },
    description: {
      en: 'An open A5 sketchbook with thick, slightly textured pages. The spread shown holds ink drawings without bleed-through.',
      bn: 'খোলা এ৫ স্কেচবুক, মোটা ও হালকা দানাদার পাতা। দেখানো দুই পাতায় কালির আঁকা ছড়ায়নি।',
    },
    priceTaka: 420,
    photo: 'sawdagar/products/sketchbook/9',
    clipScore: 0.89,
    shows: 'Open sketchbook with ink sketches',
  },
  {
    slug: 'ceramic-storage-jar-grey',
    subcategory: 'storage-jar',
    vendorSlug: 'nababganj-home-store',
    title: { en: 'Ceramic storage jar, grey', bn: 'সিরামিক স্টোরেজ জার, ধূসর' },
    description: {
      en: 'A large ceramic jar with incised lines around the body and a narrow neck. It is heavy enough to stand on the floor.',
      bn: 'গায়ে খোদাই করা রেখা আর সরু গলার বড় সিরামিক জার। মেঝেতে রাখার মতো ভারী।',
    },
    priceTaka: 3200,
    photo: 'sawdagar/products/storage-jar/3',
    clipScore: 0.62,
    shows: 'Large grey ceramic jar, incised lines',
  },
  {
    slug: 'camping-cookware-set-blue',
    subcategory: 'cookware-set',
    vendorSlug: 'chattogram-kitchen-company',
    title: { en: 'Camping cookware set, blue', bn: 'ক্যাম্পিং কুকওয়্যার সেট, নীল' },
    description: {
      en: 'A nesting cookware set in blue: a lidded pot, a smaller pot and a folding handle. It packs into one stack for travel.',
      bn: 'নীল রঙের নেস্টিং কুকওয়্যার সেট: ঢাকনাসহ হাঁড়ি, ছোট হাঁড়ি আর ভাঁজ করা হাতল। ভ্রমণে একসাথে আটকে রাখা যায়।',
    },
    priceTaka: 2600,
    photo: 'sawdagar/products/cookware-set/2',
    clipScore: 0.98,
    shows: 'Blue nesting cookware set with lid',
  },
];
