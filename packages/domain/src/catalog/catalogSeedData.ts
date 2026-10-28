import type { LocalisedName } from './categories';
import type { ProductTone, SeedVendor } from './seedTypes';

/** One selectable variant, priced as a multiple of the product base. */
export interface VariantSpec {
  name: LocalisedName;
  priceFactor: number;
}

/** One leaf category with a starting price in taka. */
export interface SubcategorySpec {
  slug: string;
  name: LocalisedName;
  priceTaka: number;
}

/** Curated inputs for one top-level category. */
export interface TopCategorySpec {
  slug: string;
  name: LocalisedName;
  description: LocalisedName;
  craftNote: LocalisedName;
  tone: ProductTone;
  styles: LocalisedName[];
  colours: LocalisedName[];
  variants: VariantSpec[];
  subcategories: SubcategorySpec[];
  vendorSlugs: [string, string];
}

const textileVariants: VariantSpec[] = [
  { name: { en: 'Free size', bn: 'ফ্রি সাইজ' }, priceFactor: 1 },
  { name: { en: 'With blouse piece', bn: 'ব্লাউজ পিসসহ' }, priceFactor: 1.12 },
  { name: { en: 'With stitched blouse', bn: 'সেলাই করা ব্লাউজসহ' }, priceFactor: 1.28 },
];

const sizeVariants: VariantSpec[] = [
  { name: { en: 'Small', bn: 'ছোট' }, priceFactor: 1 },
  { name: { en: 'Medium', bn: 'মাঝারি' }, priceFactor: 1.35 },
  { name: { en: 'Large', bn: 'বড়' }, priceFactor: 1.7 },
];

const garmentVariants: VariantSpec[] = [
  { name: { en: 'M', bn: 'এম' }, priceFactor: 1 },
  { name: { en: 'L', bn: 'এল' }, priceFactor: 1.05 },
  { name: { en: 'XL', bn: 'এক্সএল' }, priceFactor: 1.1 },
];

const curatedVendors: Omit<SeedVendor, 'id' | 'description'>[] = [
  {
    slug: 'rupsha-tangail-weavers',
    name: 'Rupsha Tangail Weavers',
    district: 'Tangail',
    verified: true,
    rating: 4.8,
    reviewCount: 214,
    followers: 1240,
  },
  {
    slug: 'padma-jamdani-studio',
    name: 'Padma Jamdani Studio',
    district: 'Narayanganj',
    verified: true,
    rating: 4.9,
    reviewCount: 186,
    followers: 980,
  },
  {
    slug: 'dhanmondi-tailors',
    name: 'Dhanmondi Tailors',
    district: 'Dhaka',
    verified: true,
    rating: 4.6,
    reviewCount: 302,
    followers: 2140,
  },
  {
    slug: 'eid-bazaar-atelier',
    name: 'Eid Bazaar Atelier',
    district: 'Dhaka',
    verified: false,
    rating: 4.5,
    reviewCount: 118,
    followers: 760,
  },
  {
    slug: 'buriganga-looms',
    name: 'Buriganga Looms',
    district: 'Narayanganj',
    verified: true,
    rating: 4.7,
    reviewCount: 144,
    followers: 870,
  },
  {
    slug: 'sylhet-handloom-house',
    name: 'Sylhet Handloom House',
    district: 'Sylhet',
    verified: false,
    rating: 4.4,
    reviewCount: 96,
    followers: 540,
  },
  {
    slug: 'jamalpur-kantha-collective',
    name: 'Jamalpur Kantha Collective',
    district: 'Jamalpur',
    verified: true,
    rating: 4.9,
    reviewCount: 168,
    followers: 1320,
  },
  {
    slug: 'rajshahi-kantha-kuthir',
    name: 'Rajshahi Kantha Kuthir',
    district: 'Rajshahi',
    verified: true,
    rating: 4.7,
    reviewCount: 122,
    followers: 690,
  },
  {
    slug: 'khulna-jute-works',
    name: 'Khulna Jute Works',
    district: 'Khulna',
    verified: true,
    rating: 4.6,
    reviewCount: 208,
    followers: 1580,
  },
  {
    slug: 'golden-fibre-studio',
    name: 'Golden Fibre Studio',
    district: 'Jashore',
    verified: false,
    rating: 4.5,
    reviewCount: 84,
    followers: 420,
  },
  {
    slug: 'barishal-cane-crafts',
    name: 'Barishal Cane Crafts',
    district: 'Barishal',
    verified: true,
    rating: 4.7,
    reviewCount: 132,
    followers: 610,
  },
  {
    slug: 'sylhet-bamboo-workshop',
    name: 'Sylhet Bamboo Workshop',
    district: 'Sylhet',
    verified: false,
    rating: 4.4,
    reviewCount: 72,
    followers: 360,
  },
  {
    slug: 'paharpur-clay-studio',
    name: 'Paharpur Clay Studio',
    district: 'Naogaon',
    verified: true,
    rating: 4.7,
    reviewCount: 96,
    followers: 684,
  },
  {
    slug: 'dhamrai-pottery-house',
    name: 'Dhamrai Pottery House',
    district: 'Dhaka',
    verified: true,
    rating: 4.8,
    reviewCount: 154,
    followers: 910,
  },
  {
    slug: 'dhamrai-brass-works',
    name: 'Dhamrai Brass Works',
    district: 'Dhaka',
    verified: true,
    rating: 4.8,
    reviewCount: 176,
    followers: 1180,
  },
  {
    slug: 'mirzapur-brass-house',
    name: 'Mirzapur Brass House',
    district: 'Tangail',
    verified: false,
    rating: 4.5,
    reviewCount: 88,
    followers: 470,
  },
  {
    slug: 'hazaribagh-leather-atelier',
    name: 'Hazaribagh Leather Atelier',
    district: 'Dhaka',
    verified: true,
    rating: 4.6,
    reviewCount: 242,
    followers: 1760,
  },
  {
    slug: 'bhairab-leather-works',
    name: 'Bhairab Leather Works',
    district: 'Kishoreganj',
    verified: false,
    rating: 4.4,
    reviewCount: 104,
    followers: 530,
  },
  {
    slug: 'nababganj-home-store',
    name: 'Nababganj Home Store',
    district: 'Dhaka',
    verified: true,
    rating: 4.5,
    reviewCount: 138,
    followers: 820,
  },
  {
    slug: 'chattogram-kitchen-company',
    name: 'Chattogram Kitchen Company',
    district: 'Chattogram',
    verified: false,
    rating: 4.4,
    reviewCount: 92,
    followers: 610,
  },
  {
    slug: 'sundarban-soap-house',
    name: 'Sundarban Soap House',
    district: 'Khulna',
    verified: true,
    rating: 4.6,
    reviewCount: 164,
    followers: 960,
  },
  {
    slug: 'herbal-bengal',
    name: 'Herbal Bengal',
    district: 'Rajshahi',
    verified: false,
    rating: 4.3,
    reviewCount: 78,
    followers: 410,
  },
  {
    slug: 'bangla-boi-ghor',
    name: 'Bangla Boi Ghor',
    district: 'Dhaka',
    verified: true,
    rating: 4.8,
    reviewCount: 312,
    followers: 2280,
  },
  {
    slug: 'chittagong-stationery-mart',
    name: 'Chittagong Stationery Mart',
    district: 'Chattogram',
    verified: false,
    rating: 4.3,
    reviewCount: 114,
    followers: 680,
  },
];

/** Vendors are written as organizations; IDs are assigned by the builder. */
export const seedVendors: SeedVendor[] = curatedVendors.map((vendor) => ({
  ...vendor,
  id: `org_${vendor.slug}`,
  description: {
    en: `${vendor.name} is an independent workshop in ${vendor.district}.`,
    bn: `${vendor.name} ${vendor.district}-এর একটি স্বাধীন কারখানা।`,
  },
}));

/** Twelve top-level categories with six leaf categories each. */
export const catalogSpec: TopCategorySpec[] = [
  {
    slug: 'sarees',
    name: { en: 'Sarees', bn: 'শাড়ি' },
    description: {
      en: 'Sarees from weavers in Tangail, Narayanganj and Rajshahi, chosen for an even weave and a comfortable drape.',
      bn: 'টাঙ্গাইল, নারায়ণগঞ্জ ও রাজশাহীর তাঁতিদের শাড়ি—সমান বুনন ও আরামদায়ক ড্রেপের জন্য বাছাই করা।',
    },
    craftNote: {
      en: 'The weavers work on pit looms and finish each saree by hand.',
      bn: 'তাঁতিরা পিট লুমে বুনে প্রতিটি শাড়ি হাতে শেষ করেন।',
    },
    tone: 'accent',
    styles: [
      { en: 'Handwoven', bn: 'হাতে বোনা' },
      { en: 'Soft-drape', bn: 'নরম ড্রেপ' },
      { en: 'Festive', bn: 'উৎসবের' },
    ],
    colours: [
      { en: 'indigo', bn: 'নীল' },
      { en: 'madder red', bn: 'মাদার লাল' },
    ],
    variants: textileVariants,
    vendorSlugs: ['rupsha-tangail-weavers', 'padma-jamdani-studio'],
    subcategories: [
      {
        slug: 'jamdani-saree',
        name: { en: 'Jamdani saree', bn: 'জামদানি শাড়ি' },
        priceTaka: 9500,
      },
      {
        slug: 'tangail-saree',
        name: { en: 'Tangail saree', bn: 'টাঙ্গাইল শাড়ি' },
        priceTaka: 5200,
      },
      {
        slug: 'katan-silk-saree',
        name: { en: 'Katan silk saree', bn: 'কাতান সিল্ক শাড়ি' },
        priceTaka: 7800,
      },
      {
        slug: 'rajshahi-silk-saree',
        name: { en: 'Rajshahi silk saree', bn: 'রাজশাহী সিল্ক শাড়ি' },
        priceTaka: 6800,
      },
      {
        slug: 'cotton-saree',
        name: { en: 'Cotton handloom saree', bn: 'সুতি তাঁতের শাড়ি' },
        priceTaka: 2600,
      },
      {
        slug: 'muslin-saree',
        name: { en: 'Dhakai muslin saree', bn: 'ঢাকাই মসলিন শাড়ি' },
        priceTaka: 12500,
      },
    ],
  },
  {
    slug: 'panjabi',
    name: { en: 'Panjabi and kurta', bn: 'পাঞ্জাবি ও কুর্তা' },
    description: {
      en: 'Panjabi and kurta for Eid, weddings and everyday wear, cut in comfortable cotton and silk.',
      bn: 'ঈদ, বিয়ে ও প্রতিদিনের জন্য পাঞ্জাবি ও কুর্তা—আরামদায়ক সুতি ও সিল্কে।',
    },
    craftNote: {
      en: 'Cut and stitched in small tailoring units.',
      bn: 'ছোট টেইলারিং ইউনিটে কাটা ও সেলাই করা হয়।',
    },
    tone: 'highlight',
    styles: [
      { en: 'Classic', bn: 'ক্লাসিক' },
      { en: 'Festive', bn: 'উৎসবের' },
      { en: 'Embroidered', bn: 'এমব্রয়ডারি' },
    ],
    colours: [
      { en: 'ivory', bn: 'আইভরি' },
      { en: 'deep blue', bn: 'গাঢ় নীল' },
    ],
    variants: garmentVariants,
    vendorSlugs: ['dhanmondi-tailors', 'eid-bazaar-atelier'],
    subcategories: [
      {
        slug: 'cotton-panjabi',
        name: { en: 'Cotton panjabi', bn: 'সুতি পাঞ্জাবি' },
        priceTaka: 2200,
      },
      { slug: 'silk-panjabi', name: { en: 'Silk panjabi', bn: 'সিল্ক পাঞ্জাবি' }, priceTaka: 4800 },
      {
        slug: 'karchupi-panjabi',
        name: { en: 'Karchupi panjabi', bn: 'কারচুপি পাঞ্জাবি' },
        priceTaka: 3600,
      },
      { slug: 'short-kurta', name: { en: 'Short kurta', bn: 'শর্ট কুর্তা' }, priceTaka: 1800 },
      {
        slug: 'pathani-kurta',
        name: { en: 'Pathani kurta', bn: 'পাঠানি কুর্তা' },
        priceTaka: 2400,
      },
      {
        slug: 'boys-panjabi',
        name: { en: "Boys' panjabi", bn: 'বালকদের পাঞ্জাবি' },
        priceTaka: 1400,
      },
    ],
  },
  {
    slug: 'handloom',
    name: { en: 'Handloom textiles', bn: 'তাঁতের কাপড়' },
    description: {
      en: 'Everyday handloom cloth for the home, from lungi and gamcha to bedcovers and table linen.',
      bn: 'ঘরের প্রতিদিনের তাঁতের কাপড়—লুঙ্গি, গামছা থেকে চাদর ও টেবিল লিনেন।',
    },
    craftNote: {
      en: 'Woven on wooden handlooms, one length at a time.',
      bn: 'কাঠের তাঁতে এক এক করে বোনা হয়।',
    },
    tone: 'secondary',
    styles: [
      { en: 'Traditional', bn: 'ঐতিহ্যবাহী' },
      { en: 'Soft-wash', bn: 'নরম ধোয়া' },
      { en: 'Heavyweight', bn: 'ভারী' },
    ],
    colours: [
      { en: 'natural', bn: 'ন্যাচারাল' },
      { en: 'indigo', bn: 'নীল' },
    ],
    variants: [
      { name: { en: 'Single', bn: 'একক' }, priceFactor: 1 },
      { name: { en: 'Pair', bn: 'জোড়া' }, priceFactor: 1.8 },
      { name: { en: 'Set of four', bn: 'চারটির সেট' }, priceFactor: 3.2 },
    ],
    vendorSlugs: ['buriganga-looms', 'sylhet-handloom-house'],
    subcategories: [
      { slug: 'lungi', name: { en: 'Lungi', bn: 'লুঙ্গি' }, priceTaka: 850 },
      { slug: 'gamcha', name: { en: 'Gamcha', bn: 'গামছা' }, priceTaka: 450 },
      { slug: 'handloom-shawl', name: { en: 'Handloom shawl', bn: 'তাঁতের শাল' }, priceTaka: 2200 },
      {
        slug: 'handloom-bedcover',
        name: { en: 'Handloom bedcover', bn: 'তাঁতের চাদর' },
        priceTaka: 3800,
      },
      {
        slug: 'handloom-table-runner',
        name: { en: 'Table runner', bn: 'টেবিল রানার' },
        priceTaka: 950,
      },
      {
        slug: 'fabric-by-metre',
        name: { en: 'Fabric by the metre', bn: 'গজ হিসেবে কাপড়' },
        priceTaka: 650,
      },
    ],
  },
  {
    slug: 'nakshi-kantha',
    name: { en: 'Nakshi kantha', bn: 'নকশি কাঁথা' },
    description: {
      en: 'Kantha and running-stitch textiles from Jamalpur and Rajshahi, stitched layer by layer.',
      bn: 'জামালপুর ও রাজশাহীর কাঁথা ও রানিং-স্টিচ টেক্সটাইল, স্তরে স্তরে সেলাই করা।',
    },
    craftNote: {
      en: 'Each kantha is stitched by hand, often over several weeks.',
      bn: 'প্রতিটি কাঁথা হাতে সেলাই করা হয়, প্রায়ই কয়েক সপ্তাহ ধরে।',
    },
    tone: 'accent',
    styles: [
      { en: 'Hand-stitched', bn: 'হাতে সেলাই' },
      { en: 'Heritage', bn: 'ঐতিহ্যবাহী' },
      { en: 'Everyday', bn: 'প্রতিদিনের' },
    ],
    colours: [
      { en: 'red border', bn: 'লাল পাড়' },
      { en: 'indigo border', bn: 'নীল পাড়' },
    ],
    variants: sizeVariants,
    vendorSlugs: ['jamalpur-kantha-collective', 'rajshahi-kantha-kuthir'],
    subcategories: [
      {
        slug: 'kantha-bedcover',
        name: { en: 'Kantha bedcover', bn: 'কাঁথা চাদর' },
        priceTaka: 6800,
      },
      {
        slug: 'kantha-cushion',
        name: { en: 'Kantha cushion cover', bn: 'কাঁথা কুশন কভার' },
        priceTaka: 1200,
      },
      {
        slug: 'kantha-wall-hanging',
        name: { en: 'Kantha wall hanging', bn: 'কাঁথা দেয়ালচিত্র' },
        priceTaka: 3200,
      },
      { slug: 'baby-quilt', name: { en: 'Baby quilt', bn: 'শিশুর কাঁথা' }, priceTaka: 2800 },
      {
        slug: 'kantha-runner',
        name: { en: 'Kantha table runner', bn: 'কাঁথা টেবিল রানার' },
        priceTaka: 1600,
      },
      {
        slug: 'kantha-jacket',
        name: { en: 'Kantha jacket', bn: 'কাঁথা জ্যাকেট' },
        priceTaka: 4200,
      },
    ],
  },
  {
    slug: 'jute',
    name: { en: 'Jute crafts', bn: 'পাটজাত পণ্য' },
    description: {
      en: 'Bags, rugs and mats woven from golden fibre in Khulna and Jashore.',
      bn: 'খুলনা ও যশোরের সোনালি আঁশ থেকে বোনা ব্যাগ, মাদুর ও ম্যাট।',
    },
    craftNote: {
      en: 'Woven from locally grown jute and finished by hand.',
      bn: 'স্থানীয়ভাবে জন্মানো পাট থেকে বোনা ও হাতে শেষ করা।',
    },
    tone: 'highlight',
    styles: [
      { en: 'Everyday', bn: 'প্রতিদিনের' },
      { en: 'Reinforced', bn: 'মজবুত' },
      { en: 'Fine-weave', bn: 'মসৃণ বুনন' },
    ],
    colours: [
      { en: 'natural', bn: 'ন্যাচারাল' },
      { en: 'burnt sienna', bn: 'পোড়া সিয়েনা' },
    ],
    variants: sizeVariants,
    vendorSlugs: ['khulna-jute-works', 'golden-fibre-studio'],
    subcategories: [
      { slug: 'jute-tote', name: { en: 'Jute tote bag', bn: 'পাটের টোট ব্যাগ' }, priceTaka: 1450 },
      {
        slug: 'jute-shopping-bag',
        name: { en: 'Jute shopping bag', bn: 'পাটের শপিং ব্যাগ' },
        priceTaka: 650,
      },
      { slug: 'jute-rug', name: { en: 'Jute rug', bn: 'পাটের মাদুর' }, priceTaka: 3200 },
      {
        slug: 'jute-storage-basket',
        name: { en: 'Jute storage basket', bn: 'পাটের ঝুড়ি' },
        priceTaka: 1250,
      },
      {
        slug: 'jute-table-mat',
        name: { en: 'Jute table mat', bn: 'পাটের টেবিল ম্যাট' },
        priceTaka: 780,
      },
      {
        slug: 'jute-wall-art',
        name: { en: 'Jute wall art', bn: 'পাটের দেয়ালশিল্প' },
        priceTaka: 2200,
      },
    ],
  },
  {
    slug: 'cane-bamboo',
    name: { en: 'Cane and bamboo', bn: 'বেত ও বাঁশ' },
    description: {
      en: 'Baskets, lamps and furniture shaped from cane and bamboo in Barishal and Sylhet.',
      bn: 'বরিশাল ও সিলেটের বেত ও বাঁশে গড়া ঝুড়ি, ল্যাম্প ও আসবাব।',
    },
    craftNote: {
      en: 'Shaped from cane and bamboo grown in the delta.',
      bn: 'ডেল্টায় জন্মানো বেত ও বাঁশ থেকে গড়া।',
    },
    tone: 'secondary',
    styles: [
      { en: 'Everyday', bn: 'প্রতিদিনের' },
      { en: 'Smoked', bn: 'ধোঁয়াশোভিত' },
      { en: 'Polished', bn: 'পালিশ করা' },
    ],
    colours: [
      { en: 'natural', bn: 'ন্যাচারাল' },
      { en: 'honey', bn: 'মধু' },
    ],
    variants: sizeVariants,
    vendorSlugs: ['barishal-cane-crafts', 'sylhet-bamboo-workshop'],
    subcategories: [
      {
        slug: 'cane-basket',
        name: { en: 'Cane storage basket', bn: 'বেতের ঝুড়ি' },
        priceTaka: 1450,
      },
      { slug: 'cane-tray', name: { en: 'Cane serving tray', bn: 'বেতের ট্রে' }, priceTaka: 1750 },
      {
        slug: 'cane-lamp',
        name: { en: 'Cane pendant lamp', bn: 'বেতের ঝুলন্ত ল্যাম্প' },
        priceTaka: 3600,
      },
      { slug: 'cane-stool', name: { en: 'Cane stool', bn: 'বেতের স্টুল' }, priceTaka: 4200 },
      { slug: 'bamboo-mat', name: { en: 'Bamboo floor mat', bn: 'বাঁশের মাদুর' }, priceTaka: 1200 },
      {
        slug: 'kitchen-basket',
        name: { en: 'Kitchen basket', bn: 'রান্নাঘরের ঝুড়ি' },
        priceTaka: 950,
      },
    ],
  },
  {
    slug: 'pottery',
    name: { en: 'Pottery and terracotta', bn: 'মাটির পণ্য' },
    description: {
      en: 'Terracotta and glazed clay for the table and the garden, fired in Naogaon and Dhamrai.',
      bn: 'নওগাঁ ও ধামরাইয়ের ভাটায় পোড়া টেরাকোটা ও গ্লেজড মাটি—টেবিল ও বাগানের জন্য।',
    },
    craftNote: {
      en: 'Thrown and fired in traditional clay kilns.',
      bn: 'ঐতিহ্যবাহী মাটির ভাটায় তৈরি ও পোড়ানো।',
    },
    tone: 'accent',
    styles: [
      { en: 'Wheel-thrown', bn: 'চাকায় গড়া' },
      { en: 'Glazed', bn: 'গ্লেজড' },
      { en: 'Matte', bn: 'ম্যাট' },
    ],
    colours: [
      { en: 'ochre', bn: 'গেরুয়া' },
      { en: 'charcoal', bn: 'কয়লা' },
    ],
    variants: [
      { name: { en: 'Set of 4', bn: '৪টির সেট' }, priceFactor: 1 },
      { name: { en: 'Set of 6', bn: '৬টির সেট' }, priceFactor: 1.45 },
      { name: { en: 'Set of 8', bn: '৮টির সেট' }, priceFactor: 1.85 },
    ],
    vendorSlugs: ['paharpur-clay-studio', 'dhamrai-pottery-house'],
    subcategories: [
      {
        slug: 'terracotta-tea-set',
        name: { en: 'Terracotta tea set', bn: 'মাটির চায়ের সেট' },
        priceTaka: 2400,
      },
      {
        slug: 'pottery-dinner-set',
        name: { en: 'Pottery dinner set', bn: 'মাটির ডিনার সেট' },
        priceTaka: 5600,
      },
      { slug: 'flower-vase', name: { en: 'Flower vase', bn: 'ফুলদানি' }, priceTaka: 1350 },
      { slug: 'planter', name: { en: 'Garden planter', bn: 'বাগানের টব' }, priceTaka: 950 },
      {
        slug: 'terracotta-jewellery',
        name: { en: 'Terracotta jewellery', bn: 'মাটির গয়না' },
        priceTaka: 850,
      },
      {
        slug: 'clay-cooking-pot',
        name: { en: 'Clay cooking pot', bn: 'মাটির রান্নার হাঁড়ি' },
        priceTaka: 1150,
      },
    ],
  },
  {
    slug: 'brassware',
    name: { en: 'Brassware', bn: 'পিতলের পণ্য' },
    description: {
      en: 'Bowls, lamps and kitchenware in brass, cast and finished by hand.',
      bn: 'পিতলের বাটি, ল্যাম্প ও রান্নাঘরের পাত্র—হাতে ঢালাই ও ফিনিশ করা।',
    },
    craftNote: {
      en: 'Cast and polished by metalworkers in Dhamrai and Mirzapur.',
      bn: 'ধামরাই ও মির্জাপুরের কারিগরদের হাতে ঢালাই ও পালিশ।',
    },
    tone: 'highlight',
    styles: [
      { en: 'Polished', bn: 'পালিশ করা' },
      { en: 'Antique', bn: 'অ্যান্টিক' },
      { en: 'Hammered', bn: 'হাতুড়ির কাজ' },
    ],
    colours: [
      { en: 'bright finish', bn: 'উজ্জ্বল ফিনিশ' },
      { en: 'antique finish', bn: 'অ্যান্টিক ফিনিশ' },
    ],
    variants: sizeVariants,
    vendorSlugs: ['dhamrai-brass-works', 'mirzapur-brass-house'],
    subcategories: [
      {
        slug: 'brass-bowl',
        name: { en: 'Brass serving bowl', bn: 'পিতলের বাটি' },
        priceTaka: 1850,
      },
      {
        slug: 'brass-plate',
        name: { en: 'Brass dinner plate', bn: 'পিতলের থালা' },
        priceTaka: 2650,
      },
      {
        slug: 'brass-lamp',
        name: { en: 'Brass table lamp', bn: 'পিতলের টেবিল ল্যাম্প' },
        priceTaka: 4200,
      },
      { slug: 'brass-jug', name: { en: 'Brass water jug', bn: 'পিতলের জগ' }, priceTaka: 2450 },
      {
        slug: 'brass-wall-decor',
        name: { en: 'Brass wall decor', bn: 'পিতলের দেয়ালসজ্জা' },
        priceTaka: 3200,
      },
      {
        slug: 'brass-spice-box',
        name: { en: 'Brass spice box', bn: 'পিতলের মসলা বাক্স' },
        priceTaka: 1750,
      },
    ],
  },
  {
    slug: 'leather',
    name: { en: 'Leather goods', bn: 'চামড়াজাত পণ্য' },
    description: {
      en: 'Bags, wallets and sandals cut from leather in Hazaribagh and Bhairab.',
      bn: 'হাজারীবাগ ও ভৈরবের চামড়া থেকে কাটা ব্যাগ, মানিব্যাগ ও স্যান্ডেল।',
    },
    craftNote: {
      en: 'Cut and stitched from full-grain leather.',
      bn: 'ফুল-গ্রেইন চামড়া কেটে সেলাই করা।',
    },
    tone: 'ink',
    styles: [
      { en: 'Full-grain', bn: 'ফুল-গ্রেইন' },
      { en: 'Pebbled', bn: 'পেবলড' },
      { en: 'Vegetable-tanned', bn: 'ভেজিটেবল-ট্যানড' },
    ],
    colours: [
      { en: 'tan', bn: 'ট্যান' },
      { en: 'black', bn: 'কালো' },
    ],
    variants: sizeVariants,
    vendorSlugs: ['hazaribagh-leather-atelier', 'bhairab-leather-works'],
    subcategories: [
      {
        slug: 'leather-tote',
        name: { en: 'Leather tote bag', bn: 'চামড়ার টোট ব্যাগ' },
        priceTaka: 5200,
      },
      {
        slug: 'leather-wallet',
        name: { en: 'Leather wallet', bn: 'চামড়ার মানিব্যাগ' },
        priceTaka: 1850,
      },
      {
        slug: 'leather-sandal',
        name: { en: 'Leather sandal', bn: 'চামড়ার স্যান্ডেল' },
        priceTaka: 2600,
      },
      { slug: 'leather-belt', name: { en: 'Leather belt', bn: 'চামড়ার বেল্ট' }, priceTaka: 1450 },
      {
        slug: 'leather-journal',
        name: { en: 'Leather journal cover', bn: 'চামড়ার জার্নাল কভার' },
        priceTaka: 1650,
      },
      {
        slug: 'leather-travel-bag',
        name: { en: 'Leather travel bag', bn: 'চামড়ার ট্রাভেল ব্যাগ' },
        priceTaka: 7800,
      },
    ],
  },
  {
    slug: 'home-kitchen',
    name: { en: 'Home and kitchen', bn: 'ঘর ও রান্নাঘর' },
    description: {
      en: 'Practical kitchen and table pieces chosen to last beyond the season.',
      bn: 'মৌসুমের বাইরেও টিকে থাকার মতো ব্যবহারিক রান্নাঘর ও টেবিলের পণ্য।',
    },
    craftNote: {
      en: 'Made for daily use with materials that age well.',
      bn: 'প্রতিদিনের ব্যবহারের জন্য, টেকসই উপকরণে।',
    },
    tone: 'secondary',
    styles: [
      { en: 'Everyday', bn: 'প্রতিদিনের' },
      { en: 'Classic', bn: 'ক্লাসিক' },
      { en: 'Gift', bn: 'উপহার' },
    ],
    colours: [
      { en: 'clay', bn: 'মাটি' },
      { en: 'charcoal', bn: 'কয়লা' },
    ],
    variants: [
      { name: { en: 'Single', bn: 'একক' }, priceFactor: 1 },
      { name: { en: 'Set of 2', bn: '২টির সেট' }, priceFactor: 1.85 },
      { name: { en: 'Set of 4', bn: '৪টির সেট' }, priceFactor: 3.4 },
    ],
    vendorSlugs: ['nababganj-home-store', 'chattogram-kitchen-company'],
    subcategories: [
      {
        slug: 'cookware-set',
        name: { en: 'Cookware set', bn: 'রান্নার পাত্রের সেট' },
        priceTaka: 4600,
      },
      { slug: 'storage-jar', name: { en: 'Storage jar', bn: 'স্টোরেজ জার' }, priceTaka: 950 },
      { slug: 'bedding-set', name: { en: 'Bedding set', bn: 'বিছানার চাদর সেট' }, priceTaka: 3800 },
      { slug: 'table-linen', name: { en: 'Table linen', bn: 'টেবিল লিনেন' }, priceTaka: 1450 },
      {
        slug: 'kitchen-tools',
        name: { en: 'Kitchen tools', bn: 'রান্নাঘরের সরঞ্জাম' },
        priceTaka: 850,
      },
      { slug: 'serveware', name: { en: 'Serveware', bn: 'পরিবেশনের বাসন' }, priceTaka: 1850 },
    ],
  },
  {
    slug: 'beauty-care',
    name: { en: 'Beauty and care', bn: 'সৌন্দর্য ও যত্ন' },
    description: {
      en: 'Soap, oil and attar made with local ingredients in small batches.',
      bn: 'স্থানীয় উপকরণে ছোট ব্যাচে তৈরি সাবান, তেল ও আতর।',
    },
    craftNote: {
      en: 'Blended in small batches with locally sourced ingredients.',
      bn: 'স্থানীয় উপকরণে ছোট ব্যাচে মিশ্রিত।',
    },
    tone: 'highlight',
    styles: [
      { en: 'Handmade', bn: 'হাতে তৈরি' },
      { en: 'Herbal', bn: 'ভেষজ' },
      { en: 'Gift', bn: 'উপহার' },
    ],
    colours: [
      { en: 'lemongrass', bn: 'লেমনগ্রাস' },
      { en: 'rose', bn: 'গোলাপ' },
    ],
    variants: [
      { name: { en: 'Small', bn: 'ছোট' }, priceFactor: 1 },
      { name: { en: 'Regular', bn: 'নিয়মিত' }, priceFactor: 1.8 },
      { name: { en: 'Large', bn: 'বড়' }, priceFactor: 2.8 },
    ],
    vendorSlugs: ['sundarban-soap-house', 'herbal-bengal'],
    subcategories: [
      { slug: 'handmade-soap', name: { en: 'Soap bar', bn: 'সাবানের বার' }, priceTaka: 320 },
      { slug: 'massage-oil', name: { en: 'Massage oil', bn: 'মালিশের তেল' }, priceTaka: 650 },
      { slug: 'hair-oil', name: { en: 'Hair oil', bn: 'চুলের তেল' }, priceTaka: 480 },
      { slug: 'face-pack', name: { en: 'Face pack', bn: 'ফেস প্যাক' }, priceTaka: 420 },
      { slug: 'attar', name: { en: 'Attar', bn: 'আতর' }, priceTaka: 950 },
      {
        slug: 'beauty-gift-set',
        name: { en: 'Beauty gift set', bn: 'বিউটি গিফট সেট' },
        priceTaka: 1450,
      },
    ],
  },
  {
    slug: 'books-stationery',
    name: { en: 'Books and stationery', bn: 'বই ও স্টেশনারি' },
    description: {
      en: "Notebooks, planners and children's books printed on paper that takes ink well.",
      bn: 'কালি ভালো ধরে এমন কাগজে ছাপা নোটবুক, প্ল্যানার ও শিশুতোষ বই।',
    },
    craftNote: {
      en: 'Printed and bound in Dhaka on locally sourced paper.',
      bn: 'ঢাকায় স্থানীয় কাগজে ছাপা ও বাঁধাই।',
    },
    tone: 'ink',
    styles: [
      { en: 'Standard', bn: 'সাধারণ' },
      { en: 'Art-paper', bn: 'আর্ট পেপার' },
      { en: 'Gift', bn: 'উপহার' },
    ],
    colours: [
      { en: 'cream', bn: 'ক্রিম' },
      { en: 'navy', bn: 'নেভি' },
    ],
    variants: [
      { name: { en: 'Single', bn: 'একক' }, priceFactor: 1 },
      { name: { en: 'Set of 3', bn: '৩টির সেট' }, priceFactor: 2.7 },
      { name: { en: 'Gift set', bn: 'গিফট সেট' }, priceFactor: 3.2 },
    ],
    vendorSlugs: ['bangla-boi-ghor', 'chittagong-stationery-mart'],
    subcategories: [
      { slug: 'notebook', name: { en: 'Notebook', bn: 'নোটবুক' }, priceTaka: 380 },
      { slug: 'pen', name: { en: 'Pen', bn: 'কলম' }, priceTaka: 250 },
      { slug: 'sketchbook', name: { en: 'Sketchbook', bn: 'স্কেচবুক' }, priceTaka: 550 },
      {
        slug: 'childrens-book',
        name: { en: "Children's storybook", bn: 'শিশুতোষ গল্পের বই' },
        priceTaka: 450,
      },
      { slug: 'planner', name: { en: 'Planner', bn: 'প্ল্যানার' }, priceTaka: 650 },
      { slug: 'wrapping-paper', name: { en: 'Wrapping paper', bn: 'মোড়ক কাগজ' }, priceTaka: 180 },
    ],
  },
];
