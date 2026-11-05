import type { PrismaClient } from '../generated/prisma/client';

interface SeedEntry {
  id: string;
  kind: 'page' | 'help' | 'journal';
  slug: string;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  bodyEn: string;
  bodyBn: string;
  status: 'draft' | 'scheduled' | 'published';
  /** ISO date at 09:00 Dhaka time, used for published and scheduled entries. */
  publishAt?: string;
  seoDescriptionEn: string;
  seoDescriptionBn: string;
}

const entries: SeedEntry[] = [
  {
    id: 'cms_help_how_to_order',
    kind: 'help',
    slug: 'how-to-order',
    titleEn: 'How to order on Sawdagar Dokanpat',
    titleBn: 'সাওদাগর দোকানপাটে অর্ডার করবেন যেভাবে',
    excerptEn:
      'Browse the catalog, add items from one or more stores, and place one order at checkout.',
    excerptBn: 'ক্যাটালগ দেখুন, এক বা একাধিক দোকানের পণ্য কার্টে নিন, তারপর একবারেই অর্ডার করুন।',
    bodyEn: `You can mix stores in one cart: the cart groups the lines by seller, and checkout creates one sub-order for each store.

Choose a variant and quantity on the product page, then open the cart from the header. Enter a delivery address in Bangladesh, choose a payment method, and confirm. Your order number appears on the confirmation page and in your account.`,
    bodyBn: `এক কার্টে একাধিক দোকানের পণ্য রাখা যায়: কার্টে পণ্যগুলো বিক্রেতা অনুযায়ী সাজানো থাকে, আর চেকআউটে প্রতিটি দোকানের জন্য আলাদা সাব-অর্ডার তৈরি হয়।

পণ্যের পাতায় ভ্যারিয়েন্ট ও পরিমাণ বেছে নিন, তারপর হেডার থেকে কার্ট খুলুন। বাংলাদেশের ঠিকানা ও পেমেন্ট পদ্ধতি বেছে নিয়ে নিশ্চিত করুন। অর্ডার নম্বর কনফার্মেশন পাতায় ও আপনার অ্যাকাউন্টে থাকবে।`,
    status: 'published',
    publishAt: '2026-09-12T09:00:00+06:00',
    seoDescriptionEn: 'How cart, checkout and per-store sub-orders work on Sawdagar Dokanpat.',
    seoDescriptionBn: 'সওদাগর দোকানপাটে কার্ট, চেকআউট ও দোকানভিত্তিক সাব-অর্ডার যেভাবে কাজ করে।',
  },
  {
    id: 'cms_help_delivery_times',
    kind: 'help',
    slug: 'delivery-times',
    titleEn: 'Checking your order status',
    titleBn: 'অর্ডারের অবস্থা দেখবেন যেভাবে',
    excerptEn: 'View each store’s order status in your account.',
    excerptBn: 'অ্যাকাউন্টে প্রতিটি দোকানের অর্ডারের অবস্থা দেখুন।',
    bodyEn: `An order with items from more than one store has a separate sub-order for each seller. Open the order in your account to see the status of each one.

Delivery dates and courier tracking are not available.`,
    bodyBn: `একাধিক দোকানের পণ্য নিয়ে অর্ডার করলে প্রতিটি বিক্রেতার জন্য আলাদা সাব-অর্ডার তৈরি হয়। প্রতিটির অবস্থা দেখতে অ্যাকাউন্ট থেকে অর্ডার খুলুন।

ডেলিভারির তারিখ ও কুরিয়ার ট্র্যাকিং তথ্য দেওয়া হয় না।`,
    status: 'published',
    publishAt: '2026-09-18T09:00:00+06:00',
    seoDescriptionEn: 'Where to find the status of each store’s sub-order.',
    seoDescriptionBn: 'প্রতিটি দোকানের সাব-অর্ডারের অবস্থা কোথায় পাবেন।',
  },
  {
    id: 'cms_help_returns',
    kind: 'help',
    slug: 'returns-and-refunds',
    titleEn: 'Returns and refunds',
    titleBn: 'ফেরত ও রিফান্ড',
    excerptEn: 'Ask for a return within seven days of delivery; the seller reviews it first.',
    excerptBn: 'ডেলিভারির সাত দিনের মধ্যে ফেরত চাইতে পারেন; প্রথমে বিক্রেতা দেখেন।',
    bodyEn: `Open Returns in your account and choose a delivered item. You can request a return within seven days of delivery by selecting a reason and adding an optional note.

The seller approves or declines the request. An approved request can be recorded as refunded by the finance team; no payment is sent to an external provider.`,
    bodyBn: `অ্যাকাউন্টের ফেরত পাতায় একটি ডেলিভারি হওয়া পণ্য বেছে নিন। ডেলিভারির সাত দিনের মধ্যে কারণ বেছে ও চাইলে নোট যোগ করে ফেরতের অনুরোধ করা যায়।

বিক্রেতা অনুরোধ অনুমোদন বা প্রত্যাখ্যান করেন। অনুমোদিত অনুরোধ হিসাব দল রিফান্ড হয়েছে বলে নথিভুক্ত করতে পারে; বাইরের কোনো পেমেন্ট সেবায় টাকা পাঠানো হয় না।`,
    status: 'published',
    publishAt: '2026-09-25T09:00:00+06:00',
    seoDescriptionEn: 'The seven-day return window and how requests are reviewed.',
    seoDescriptionBn: 'সাত দিনের ফেরতের সময় ও অনুরোধ পর্যালোচনার নিয়ম।',
  },
  {
    id: 'cms_help_payments',
    kind: 'help',
    slug: 'payments',
    titleEn: 'Payment methods',
    titleBn: 'পেমেন্ট পদ্ধতি',
    excerptEn: 'Payment options and applying coupons at checkout.',
    excerptBn: 'চেকআউটে পেমেন্টের পদ্ধতি ও কুপন ব্যবহারের নিয়ম।',
    bodyEn: `Checkout offers cash on delivery and a card and wallet option. The payment page does not collect card details or connect to a payment provider.

Coupons are applied in the cart before checkout. Only one coupon can be used per order, and a store coupon only covers that store's lines.`,
    bodyBn: `চেকআউটে ক্যাশ অন ডেলিভারি এবং কার্ড ও ওয়ালেটের বিকল্প আছে। পেমেন্ট পাতায় কার্ডের তথ্য নেওয়া হয় না এবং কোনো পেমেন্ট সেবার সাথে সংযোগ করা হয় না।

কুপন চেকআউটের আগে কার্টে প্রয়োগ হয়। এক অর্ডারে একটি কুপন ব্যবহার করা যায়; দোকানের কুপন শুধু ওই দোকানের পণ্যে খাটে।`,
    status: 'published',
    publishAt: '2026-10-02T09:00:00+06:00',
    seoDescriptionEn: 'Payment options at checkout and how coupons apply.',
    seoDescriptionBn: 'চেকআউটে পেমেন্টের পদ্ধতি ও কুপন প্রয়োগের নিয়ম।',
  },
  {
    id: 'cms_journal_tangail_weavers',
    kind: 'journal',
    slug: 'tangail-weavers',
    titleEn: 'A morning with the weavers of Tangail',
    titleBn: 'টাঙ্গাইলের তাঁতিদের এক সকাল',
    excerptEn: 'Six looms, one family courtyard, and a saree that takes eleven days.',
    excerptBn: 'ছয়টি তাঁত, এক পরিবারের উঠান, আর এগারো দিনে তৈরি একটি শাড়ি।',
    bodyEn: `The first loom starts before the fog lifts. In a courtyard in Tangail, three generations of one family work the same pit looms their grandparents used, with a wooden beater and a basket of bobbins beside each frame.

A jamdani saree with a full body motif takes about eleven working days. The weaver draws the motif from memory, lifting individual threads by hand while the shuttle passes underneath. A single mistake means unpicking a row that took an hour.

The store on this marketplace belongs to one such family. They price by the days a piece takes, not by the season, which is why the same saree costs the same in June and in November.`,
    bodyBn: `কুয়াশা কাটার আগেই প্রথম তাঁত শুরু হয়। টাঙ্গাইলের এক উঠানে একই পরিবারের তিন প্রজন্ম দাদা-দাদির ব্যবহৃত পিট-তাঁতে কাজ করেন; পাশে কাঠের বীম আর সুতার নাটাইয়ের ঝুড়ি।

পুরো শরীরে নকশা থাকা একটি জামদানি শাড়ি বুনতে প্রায় এগারো কর্মদিবস লাগে। তাঁতি স্মৃতি থেকে নকশা আঁকেন, মাঝে মাঝে একটি একটি সুতা তুলে ধরেন, আর নিচ দিয়ে চলে মাকু। একটিমাত্র ভুল হলে ঘণ্টাখিক এক সারি খুলে ফেলতে হয়।

এই মার্কেটপ্লেসের দোকানটি এমনই এক পরিবারের। তারা ঋতু নয়, একটি পণ্যে যত দিন লাগে তার ওপর দাম ঠিক করেন; তাই একই শাড়ির দাম জুনে আর নভেম্বরে একই থাকে।`,
    status: 'published',
    publishAt: '2026-10-08T09:00:00+06:00',
    seoDescriptionEn:
      'Inside a Tangail weaving courtyard and the eleven days behind a jamdani saree.',
    seoDescriptionBn: 'টাঙ্গাইলের তাঁতের উঠান আর একটি জামদানি শাড়ির পেছনের এগারো দিন।',
  },
  {
    id: 'cms_journal_choosing_jamdani',
    kind: 'journal',
    slug: 'choosing-jamdani',
    titleEn: 'How to choose a jamdani without holding it',
    titleBn: 'হাতে না নিয়েই জামদানি বাছবেন যেভাবে',
    excerptEn: 'Thread count, motif density and the difference between woven and printed.',
    excerptBn: 'সুতার ঘনত্ব, নকশার বুনন আর তাঁতেরกับ প্রিন্টের পার্থক্য।',
    bodyEn: `A photograph cannot tell you how a saree falls, but it can show whether the motif is woven or printed. In a woven jamdani the pattern has the same texture as the ground cloth and slight irregularities where the weaver lifted threads. A printed motif sits flat and repeats with machine precision.

Ask for the thread count. Cotton jamdani usually runs between 80 and 100 counts; a higher count feels lighter and costs more. Motif density matters too: a full-body design uses several times the work of a border-and-pallu piece.

Finally, ask how the piece should be washed. Most handloom cotton prefers cold water and shade drying. A seller who answers these questions clearly is usually a seller who knows the loom.`,
    bodyBn: `ছবি দেখে শাড়ি কেমন পড়ে তা বোঝা যায় না, তবে নকশা বোনা না ছাপা তা বোঝা যায়। বোনা জামদানিতে নকশার গঠন কাপড়ের সমান, আর তাঁতি সুতা তোলার জায়গায় সামান্য অসমতা থাকে। ছাপা নকশা সমানভাবে বসে এবং মেশিনের নিখুঁত নিয়মে বারবার আসে।

সুতার কাউন্ট জিজ্ঞেস করুন। সুতির জামদানি সাধারণত ৮০ থেকে ১০০ কাউন্টের হয়; বেশি কাউন্ট হালকা লাগে এবং দামও বেশি। নকশার ঘনত্বও গুরুত্বপূর্ণ: পুরো শরীরে নকশার কাজ পাড়-পাল্লার চেয়ে কয়েক গুণ বেশি।

সবশেষে জেনে নিন ধোয়ার নিয়ম। বেশিরভাগ হাতেকরা সুতির কাপড় ঠান্ডা পানিতে ও ছায়ায় শুকানো ভালো। যে বিক্রেতা এসব প্রশ্নের স্পষ্ট উত্তর দেন, তিনি সাধারণত তাঁতও ভালো বোঝেন।`,
    status: 'published',
    publishAt: '2026-10-14T09:00:00+06:00',
    seoDescriptionEn:
      'What to ask about thread count, motif density and washing before buying jamdani online.',
    seoDescriptionBn: 'জামদানি কেনার আগে সুতার কাউন্ট, নকশা ও ধোয়ার ব্যাপারে যা জিজ্ঞেস করবেন।',
  },
  {
    id: 'cms_journal_dhamrai_pottery',
    kind: 'journal',
    slug: 'dhamrai-pottery',
    titleEn: 'The potters of Dhamrai are firing again',
    titleBn: 'ধামরাইয়ের কুমোররা আবার পোড়াচ্ছেন',
    excerptEn: 'A clay shortage, a new kiln, and why the mugs cost what they cost.',
    excerptBn: 'মাটির সংকট, নতুন ভাটা, আর মগের দাম কেন এত।',
    bodyEn: `Dhamrai's pottery workshops sit along a road that floods most monsoons. When the water comes, the drying shelves have to be emptied and the kiln raised on bricks. This year the potters rebuilt with a shared gas kiln, which fires evenly and wastes less than the old wood stacks.

Clay is the harder problem. Good grey clay now arrives by truck from several districts away, and the price changes with the diesel rate. A potter can throw thirty mugs in a morning but only fire once a week, so every batch carries the cost of the wait.

The store's listings show the weight and capacity of each piece. Those numbers came from the workshop's own scale, not a supplier catalogue.`,
    bodyBn: `ধামরাইয়ের মৃৎশিল্পের কারখানাগুলো এমন এক রাস্তার পাশে, যেটি প্রায় প্রতি বর্ষায় পানিতে ডোবে। পানি এলে শুকানোর তাক খালি করতে হয়, ভাটা ইটের ওপর তুলতে হয়। এ বছর কুমোররা একটি শেয়ার করা গ্যাসভাটা বানিয়েছেন, যা সমানভাবে পোড়ায় এবং পুরোনো কাঠের চুলার চেয়ে কম নষ্ট করে।

আসল সমস্যা মাটি। ভালো ধূসর মাটি এখন কয়েক জেলা দূর থেকে ট্রাকে আসে, আর দাম ডিজেলের দরের সাথে বদলায়। একজন কুমোর সকালে ত্রিশটি মগ বানাতে পারেন, কিন্তু সপ্তাহে একবারই পোড়াতে পারেন; তাই প্রতিটি ব্যাচে অপেক্ষার খরচও থাকে।

দোকানের তালিকায় প্রতিটি পণ্যের ওজন ও ধারণক্ষমতা লেখা। সংখ্যাগুলো সরবরাহকারীর তালিকা নয়, কারখানার নিজের দাঁড়িপাল্লা থেকে।`,
    status: 'published',
    publishAt: '2026-10-21T09:00:00+06:00',
    seoDescriptionEn: 'How Dhamrai potters fire their work and what drives the price of a mug.',
    seoDescriptionBn: 'ধামরাইয়ের কুমোররা কীভাবে পোড়ান আর একটি মগের দাম কীসে ঠিক হয়।',
  },
  {
    id: 'cms_journal_winter_market',
    kind: 'journal',
    slug: 'winter-market-preview',
    titleEn: 'What the winter market will carry',
    titleBn: 'শীতের বাজারে কী থাকবে',
    excerptEn: 'A working note on the blankets and shawls arriving in November.',
    excerptBn: 'নভেম্বরে আসা কম্বল ও শাল নিয়ে একটি খসড়া নোট।',
    bodyEn: `This is a working draft for the winter market note. It lists the kantha blankets, wool shawls and cotton quilts that three stores plan to send in November, with the sizes and colours each one can supply.

The draft is here to show how the CMS keeps an unfinished entry out of the storefront. It will be rewritten with photographs and prices before it is scheduled.`,
    bodyBn: `এটি শীতের বাজারের নোটের একটি খসড়া। এতে তিনটি দোকানের নভেম্বরে পাঠানোর পরিকল্পনা করা কাঁথা কম্বল, উলের শাল ও সুতির লেপের তালিকা আছে—সাইজ ও রঙসহ।

খসড়াটি এখানে আছে দেখানোর জন্য যে সিএমএস কীভাবে অসম্পূর্ণ লেখা স্টোরফ্রন্টের বাইরে রাখে। ছবি ও দাম যোগ করে সময় নির্ধারণের আগে এটি আবার লেখা হবে।`,
    status: 'draft',
    seoDescriptionEn: 'Draft preview of the winter market note.',
    seoDescriptionBn: 'শীতের বাজারের নোটের খসড়া।',
  },
  {
    id: 'cms_help_eid_cutoff',
    kind: 'help',
    slug: 'eid-delivery-cutoff',
    titleEn: 'Eid delivery cut-off dates',
    titleBn: 'ঈদের ডেলিভারির শেষ তারিখ',
    excerptEn: 'Order by the date listed for your district to receive a parcel before Eid.',
    excerptBn: 'ঈদের আগে পণ্য পেতে আপনার জেলার তারিখের মধ্যে অর্ডার করুন।',
    bodyEn: `Courier desks take fewer parcels in the week before Eid, and handloom stores finish their last pieces early. The dates below are for the next Eid season and will be confirmed once the courier schedule is published.

Dhaka and Narayanganj orders close five working days before Eid. Chattogram, Sylhet, Khulna and Rajshahi close seven working days before. Other districts close eight working days before.

Orders placed after the cut-off are still accepted. Sellers pack them after the holiday, and delivery resumes on the second working day.`,
    bodyBn: `ঈদের আগের সপ্তাহে কুরিয়ার ডেস্ক কম পার্সেল নেয়, আর তাঁতের দোকানগুলো তাদের শেষ পণ্য আগেই শেষ করে। নিচের তারিখগুলো পরের ঈদের জন্য; কুরিয়ারের সময়সূচি প্রকাশ হলে নিশ্চিত করা হবে।

ঢাকা ও নারায়ণগঞ্জের অর্ডার ঈদের পাঁচ কর্মদিবস আগে বন্ধ হয়। চট্টগ্রাম, সিলেট, খুলনা ও রাজশাহীতে সাত কর্মদিবস আগে। অন্য জেলায় আট কর্মদিবস আগে।

শেষ তারিখের পরেও অর্ডার নেওয়া হয়। বিক্রেতারা ছুটির পরে প্যাক করেন, আর ডেলিভারি শুরু হয় দ্বিতীয় কর্মদিবসে।`,
    status: 'scheduled',
    publishAt: '2027-02-20T09:00:00+06:00',
    seoDescriptionEn: 'Courier cut-off dates for Eid deliveries by district.',
    seoDescriptionBn: 'জেলা অনুযায়ী ঈদের ডেলিভারির শেষ তারিখ।',
  },
  {
    id: 'cms_help_terms',
    kind: 'help',
    slug: 'terms',
    titleEn: 'Terms of use',
    titleBn: 'ব্যবহারের শর্তাবলি',
    excerptEn: 'What an account on this marketplace allows, and what it does not.',
    excerptBn: 'এই মার্কেটপ্লেসে একটি অ্যাকাউন্ট কী করতে পারে, আর কী করতে পারে না।',
    bodyEn: `Sawdagar Dokanpat is a portfolio project. The catalog, sellers, reviews and orders are seeded demo data, and no real money changes hands. Payments run in test mode and no card is ever charged.

One account per person. You are responsible for keeping your password private and for what happens under your account. Give a working phone number, because delivery calls use it. Do not use the marketplace to harass other members, post false reviews, scrape the catalog, or attempt to reach data that belongs to someone else.

Seller applications are reviewed by a moderator before the seller area opens. We may close an account that breaks these terms. Because the data is demo data, it can be reset at any time without notice.`,
    bodyBn: `সাওদাগর দোকানপাট একটি পোর্টফোলিও প্রকল্প। ক্যাটালগ, বিক্রেতা, রিভিউ আর অর্ডারগুলো সাজানো ডেমো ডেটা; এখানে সত্যিকারের টাকা লেনদেন হয় না। পেমেন্ট টেস্ট মোডে চলে, কোনো কার্ড থেকে টাকা কাটা হয় না।

একজন ব্যক্তির জন্য একটি অ্যাকাউন্ট। পাসওয়ার্ড গোপন রাখা এবং নিজের অ্যাকাউন্টে যা হয় তার দায়িত্ব আপনার। চালু মোবাইল নম্বর দিন, কারণ ডেলিভারির ফোন ওই নম্বরেই আসে। অন্য সদস্যকে বিরক্ত করা, মিথ্যা রিভিউ লেখা, ক্যাটালগ স্ক্র্যাপ করা বা অন্যের ডেটা দেখার চেষ্টা করা যাবে না।

বিক্রেতার আবেদন মডারেটর দেখে অনুমোদন করেন, তারপর বিক্রেতার অংশ খোলে। এই শর্ত ভাঙলে অ্যাকাউন্ট বন্ধ করা হতে পারে। ডেটা ডেমো হওয়ায় আগে জানানো ছাড়াই যেকোনো সময় রিসেট হতে পারে।`,
    status: 'published',
    publishAt: '2026-09-12T09:00:00+06:00',
    seoDescriptionEn: 'Terms of use for accounts on the Sawdagar Dokanpat marketplace.',
    seoDescriptionBn: 'সাওদাগর দোকানপাট মার্কেটপ্লেসে অ্যাকাউন্ট ব্যবহারের শর্তাবলি।',
  },
  {
    id: 'cms_help_privacy',
    kind: 'help',
    slug: 'privacy',
    titleEn: 'Privacy notice',
    titleBn: 'গোপনীয়তা নোটিশ',
    excerptEn: 'Which details an account stores, why, and how to have them removed.',
    excerptBn: 'একটি অ্যাকাউন্ট কোন তথ্য রাখে, কেন, আর কীভাবে মুছে ফেলা যায়।',
    bodyEn: `Your account stores the name, email address, phone number and a hashed password that you enter, plus the orders, addresses, reviews and wishlist you create. Passwords are hashed with scrypt and never stored or logged in readable form.

Verification and password reset messages are queued in the site's own mail outbox instead of being sent to an outside provider, so no third party receives your address. The site sets one session cookie and asks nothing else of your browser; there are no advertising or analytics scripts.

You can change your password from Account, then Security. To have the account and its data deleted, open an issue in the public repository; deletion is done by hand because the project has no support desk.`,
    bodyBn: `আপনার অ্যাকাউন্ট আপনার দেওয়া নাম, ইমেইল, মোবাইল নম্বর ও হ্যাশ করা পাসওয়ার্ড রাখে, সাথে আপনার তৈরি অর্ডার, ঠিকানা, রিভিউ ও উইশলিস্ট। পাসওয়ার্ড scrypt দিয়ে হ্যাশ করা হয়; পঠনযোগ্য অবস্থায় কোথাও রাখা বা লগ করা হয় না।

যাচাই ও পাসওয়ার্ড রিসেটের বার্তা বাইরের কোনো সেবায় না গিয়ে সাইটের নিজের মেইল আউটবক্সে জমা থাকে, তাই তৃতীয় পক্ষ আপনার ঠিকানা পায় না। সাইটটি একটি সেশন কুকি রাখে, আর কিছু নয়; বিজ্ঞাপন বা অ্যানালিটিক্স স্ক্রিপ্ট নেই।

অ্যাকাউন্ট থেকে নিরাপত্তা পাতায় পাসওয়ার্ড বদলানো যায়। অ্যাকাউন্ট ও তার ডেটা মুছতে চাইলে পাবলিক রিপোজিটরিতে ইস্যু খুলুন; প্রকল্পে সহায়তা ডেস্ক না থাকায় মুছে ফেলা হাতে করা হয়।`,
    status: 'published',
    publishAt: '2026-09-12T09:00:00+06:00',
    seoDescriptionEn: 'What data a Sawdagar Dokanpat account stores and how to remove it.',
    seoDescriptionBn: 'সাওদাগর দোকানপাট অ্যাকাউন্ট কী তথ্য রাখে এবং কীভাবে মুছবেন।',
  },
  {
    id: 'cms_page_about',
    kind: 'page',
    slug: 'about',
    titleEn: 'About this marketplace',
    titleBn: 'এই মার্কেটপ্লেস সম্পর্কে',
    excerptEn: 'A bilingual marketplace for Bangladeshi sellers and shoppers.',
    excerptBn: 'বাংলাদেশের বিক্রেতা ও ক্রেতাদের জন্য দ্বিভাষিক একটি মার্কেটপ্লেস।',
    bodyEn: `Sawdagar Dokanpat brings handloom, clay, jute and everyday goods together in one marketplace.

The design draws on Bangla storefronts: jamdani motifs, warm paper tones, serif headings and prices in taka. Read more about the build on the About this project page.`,
    bodyBn: `সওদাগর দোকানপাটে তাঁত, মাটি, পাট ও দৈনন্দিন পণ্য এক মার্কেটপ্লেসে পাওয়া যায়।

ডিজাইনে বাংলা দোকানের ছন্দ ধরা হয়েছে: জামদানির নকশা, উষ্ণ কাগজের রঙ, সেরিফ শিরোনাম আর টাকায় দাম। প্রকল্প সম্পর্কে আরও জানতে প্রকল্প পরিচিতি পাতা দেখুন।`,
    status: 'published',
    publishAt: '2026-09-01T09:00:00+06:00',
    seoDescriptionEn: 'About the Sawdagar Dokanpat marketplace.',
    seoDescriptionBn: 'সওদাগর দোকানপাট মার্কেটপ্লেস সম্পর্কে।',
  },
  {
    id: 'cms_page_contact',
    kind: 'page',
    slug: 'contact',
    titleEn: 'Contact the project',
    titleBn: 'প্রকল্পের সাথে যোগাযোগ',
    excerptEn: 'Find the source code and report issues in the public repository.',
    excerptBn: 'পাবলিক রিপোজিটরিতে সোর্স কোড দেখুন ও সমস্যা জানান।',
    bodyEn: `The source code, issue tracker and roadmap are available in the public repository linked from the footer.

There is no support desk or phone number for this project.`,
    bodyBn: `ফুটারে দেওয়া পাবলিক রিপোজিটরিতে সোর্স কোড, সমস্যা জানানোর ব্যবস্থা ও রোডম্যাপ আছে।

এই প্রকল্পের কোনো সহায়তা ডেস্ক বা ফোন নম্বর নেই।`,
    status: 'published',
    publishAt: '2026-09-05T09:00:00+06:00',
    seoDescriptionEn: 'Where to find the repository and report issues.',
    seoDescriptionBn: 'রিপোজিটরি ও সমস্যা জানানোর ঠিকানা।',
  },
];

const flags = [
  {
    key: 'help_center_enabled',
    labelEn: 'Help Center',
    labelBn: 'সহায়তা কেন্দ্র',
    descriptionEn: 'Shows the Help Center index and article pages.',
    descriptionBn: 'সহায়তা কেন্দ্রের তালিকা ও নিবন্ধের পাতা দেখায়।',
    enabled: true,
  },
  {
    key: 'journal_enabled',
    labelEn: 'Journal',
    labelBn: 'জার্নাল',
    descriptionEn: 'Shows the Journal index and posts from the CMS.',
    descriptionBn: 'সিএমএস থেকে জার্নালের তালিকা ও পোস্ট দেখায়।',
    enabled: true,
  },
];

/**
 * Writes the seeded CMS entries, one initial version for each, and the
 * storefront feature flags. Entries are matched on kind and slug so a re-run
 * refreshes the copy without losing later admin edits to other entries.
 */
interface SeedHelpCategory {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  sortOrder: number;
}

const helpCategories: SeedHelpCategory[] = [
  {
    id: 'help_cat_orders',
    slug: 'orders',
    nameEn: 'Orders',
    nameBn: 'অর্ডার',
    descriptionEn: 'Placing an order, the cart and the confirmation email.',
    descriptionBn: 'অর্ডার দেওয়া, কার্ট আর কনফার্মেশন বার্তা।',
    sortOrder: 1,
  },
  {
    id: 'help_cat_delivery',
    slug: 'delivery',
    nameEn: 'Delivery',
    nameBn: 'ডেলিভারি',
    descriptionEn: 'Delivery times, courier updates and holiday cut-off dates.',
    descriptionBn: 'ডেলিভারির সময়, কুরিয়ারের খবর আর ছুটির শেষ তারিখ।',
    sortOrder: 2,
  },
  {
    id: 'help_cat_returns',
    slug: 'returns',
    nameEn: 'Returns and refunds',
    nameBn: 'ফেরত ও রিফান্ড',
    descriptionEn: 'Starting a return and what happens after the seller replies.',
    descriptionBn: 'ফেরত শুরু করা আর বিক্রেতা উত্তর দেওয়ার পরে যা হয়।',
    sortOrder: 3,
  },
  {
    id: 'help_cat_payments',
    slug: 'payments',
    nameEn: 'Payments',
    nameBn: 'পেমেন্ট',
    descriptionEn: 'Payment methods, coupons and how test-mode payments behave.',
    descriptionBn: 'পেমেন্ট পদ্ধতি, কুপন আর টেস্ট মোডে পেমেন্টের ব্যবহার।',
    sortOrder: 4,
  },
  {
    id: 'help_cat_policies',
    slug: 'policies',
    nameEn: 'Terms and privacy',
    nameBn: 'শর্ত ও গোপনীয়তা',
    descriptionEn: 'The terms of use and what an account stores about you.',
    descriptionBn: 'ব্যবহারের শর্ত আর অ্যাকাউন্ট আপনার সম্পর্কে কী রাখে।',
    sortOrder: 5,
  },
];

/** Which category each seeded Help article belongs to. */
const helpCategoryBySlug: Record<string, string> = {
  'how-to-order': 'orders',
  'delivery-times': 'delivery',
  'returns-and-refunds': 'returns',
  payments: 'payments',
  'eid-delivery-cutoff': 'delivery',
  terms: 'policies',
  privacy: 'policies',
};

export async function seedContent(prisma: PrismaClient): Promise<string> {
  const author = await prisma.user.findUnique({
    where: { email: 'editor@demo.sawdagar.test' },
    select: { id: true },
  });

  const categoryIds = new Map<string, string>();
  for (const category of helpCategories) {
    const fields = {
      nameEn: category.nameEn,
      nameBn: category.nameBn,
      descriptionEn: category.descriptionEn,
      descriptionBn: category.descriptionBn,
      sortOrder: category.sortOrder,
    };
    const saved = await prisma.helpCategory.upsert({
      where: { slug: category.slug },
      create: { id: category.id, slug: category.slug, ...fields },
      update: fields,
    });
    categoryIds.set(category.slug, saved.id);

    await prisma.helpCategoryVersion.upsert({
      where: { categoryId_version: { categoryId: saved.id, version: 1 } },
      create: {
        id: `${saved.id}_v1`,
        categoryId: saved.id,
        version: 1,
        snapshot: {
          slug: category.slug,
          nameEn: category.nameEn,
          nameBn: category.nameBn,
          descriptionEn: category.descriptionEn,
          descriptionBn: category.descriptionBn,
        },
        note: 'Seeded category',
        authorUserId: author?.id ?? null,
      },
      update: {},
    });
  }

  for (const entry of entries) {
    const helpCategoryId =
      entry.kind === 'help'
        ? (categoryIds.get(helpCategoryBySlug[entry.slug] ?? '') ?? null)
        : null;
    const publishAt = entry.publishAt ? new Date(entry.publishAt) : null;
    const data = {
      titleEn: entry.titleEn,
      titleBn: entry.titleBn,
      excerptEn: entry.excerptEn,
      excerptBn: entry.excerptBn,
      bodyEn: entry.bodyEn,
      bodyBn: entry.bodyBn,
      status: entry.status,
      publishAt,
      seoTitleEn: entry.titleEn,
      seoTitleBn: entry.titleBn,
      seoDescriptionEn: entry.seoDescriptionEn,
      seoDescriptionBn: entry.seoDescriptionBn,
      helpCategoryId,
    };

    const saved = await prisma.cmsEntry.upsert({
      where: { kind_slug: { kind: entry.kind, slug: entry.slug } },
      create: {
        id: entry.id,
        kind: entry.kind,
        slug: entry.slug,
        ...data,
        authorUserId: author?.id ?? null,
      },
      update: { ...data, authorUserId: author?.id ?? null },
    });

    await prisma.cmsVersion.upsert({
      where: { entryId_version: { entryId: saved.id, version: 1 } },
      create: {
        id: `${saved.id}_v1`,
        entryId: saved.id,
        version: 1,
        snapshot: {
          titleEn: entry.titleEn,
          titleBn: entry.titleBn,
          excerptEn: entry.excerptEn,
          excerptBn: entry.excerptBn,
          bodyEn: entry.bodyEn,
          bodyBn: entry.bodyBn,
          seoTitleEn: entry.titleEn,
          seoTitleBn: entry.titleBn,
          seoDescriptionEn: entry.seoDescriptionEn,
          seoDescriptionBn: entry.seoDescriptionBn,
        },
        note: 'Seeded entry',
        authorUserId: author?.id ?? null,
      },
      update: {},
    });
  }

  // Settings ship with the announcement off and short, real policy copy, so the
  // storefront has a readable policy page before the first editor visits.
  const settings = {
    id: 'site',
    announcementEnabled: false,
    announcementEn: 'Eid orders close on 18 March. Standard delivery resumes on 23 March.',
    announcementBn: 'ঈদের অর্ডার নেওয়া বন্ধ ১৮ মার্চ। স্বাভাবিক ডেলিভারি শুরু ২৩ মার্চ।',
    announcementHref: '/help',
    shippingPolicyEn:
      'Orders are packed within one working day. Inside Dhaka, delivery takes one to two days at ৳60; elsewhere in Bangladesh it takes three to five days at ৳120. Cash on delivery is available for orders up to ৳5,000.',
    shippingPolicyBn:
      'অর্ডার এক কর্মদিবসের মধ্যে প্যাক করা হয়। ঢাকার ভিতরে ডেলিভারি এক থেকে দুই দিনে, খরচ ৬০ টাকা; ঢাকার বাইরে তিন থেকে পাঁচ দিনে, খরচ ১২০ টাকা। ৫,০০০ টাকা পর্যন্ত অর্ডারে ক্যাশ অন ডেলিভারি চালু আছে।',
    returnsPolicyEn:
      'Unused items in their original packaging can be returned within seven days of delivery. Handloom and made-to-order pieces are exchanged only for a defect. Write to us from your order page and we will arrange a pickup in Dhaka or a courier label elsewhere.',
    returnsPolicyBn:
      'ব্যবহার না করা পণ্য আসল প্যাকেজিংসহ ডেলিভারির সাত দিনের মধ্যে ফেরত দেওয়া যায়। তাঁতের ও অর্ডার অনুযায়ী বানানো পণ্য কেবল ত্রুটির ক্ষেত্রে বদলানো হয়। অর্ডার পৃষ্ঠা থেকে আমাদের লিখুন; ঢাকায় আমরা পিকআপ এবং অন্য জায়গায় কুরিয়ার লেবেলের ব্যবস্থা করব।',
    navigation: [],
    footerLinks: [{ labelEn: 'Shipping & returns', labelBn: 'ডেলিভারি ও ফেরত', href: '/policies' }],
  };

  await prisma.siteSettings.upsert({
    where: { id: settings.id },
    create: settings,
    update: {},
  });
  await prisma.siteSettingsVersion.upsert({
    where: { settingsId_version: { settingsId: settings.id, version: 1 } },
    create: {
      id: `${settings.id}_v1`,
      settingsId: settings.id,
      version: 1,
      snapshot: {
        announcementEnabled: settings.announcementEnabled,
        announcementEn: settings.announcementEn,
        announcementBn: settings.announcementBn,
        announcementHref: settings.announcementHref,
        seoTitleEn: null,
        seoTitleBn: null,
        seoDescriptionEn: null,
        seoDescriptionBn: null,
        shippingPolicyEn: settings.shippingPolicyEn,
        shippingPolicyBn: settings.shippingPolicyBn,
        returnsPolicyEn: settings.returnsPolicyEn,
        returnsPolicyBn: settings.returnsPolicyBn,
        navigation: settings.navigation,
        footerLinks: settings.footerLinks,
      },
      note: 'Seeded settings',
      authorUserId: author?.id ?? null,
    },
    update: {},
  });

  // The seeded hero repeats the dictionary copy so the homepage reads the same
  // before and after the first editor opens it.
  const hero = {
    id: 'cms_section_hero',
    kind: 'hero',
    titleEn: 'Every dokan, one marketplace.',
    titleBn: 'প্রতিটি দোকান, এক বাজার।',
    bodyEn:
      'Sawdagar Dokanpat brings independent Bangladeshi sellers into one storefront, from handloom sarees to terracotta tea sets. Browse by department and order from the workshop that made the piece.',
    bodyBn:
      'সওদাগর দোকানপাট বাংলাদেশের স্বাধীন বিক্রেতাদের একই দোকানে মিলিয়ে দেয়—তাঁতের শাড়ি থেকে মাটির চায়ের সেট পর্যন্ত। বিভাগ অনুযায়ী ঘুরে দেখুন এবং যে কারখানা পণ্যটি বানিয়েছে তার কাছ থেকেই অর্ডার করুন।',
    ctaLabelEn: 'Browse the catalog',
    ctaLabelBn: 'ক্যাটালগ দেখুন',
    ctaHref: '/catalog',
    status: 'published',
    publishAt: new Date('2026-10-01T09:00:00+06:00'),
    sortOrder: 0,
  };

  await prisma.cmsSection.upsert({
    where: { id: hero.id },
    create: hero,
    update: {},
  });
  await prisma.cmsSectionVersion.upsert({
    where: { sectionId_version: { sectionId: hero.id, version: 1 } },
    create: {
      id: `${hero.id}_v1`,
      sectionId: hero.id,
      version: 1,
      snapshot: {
        titleEn: hero.titleEn,
        titleBn: hero.titleBn,
        bodyEn: hero.bodyEn,
        bodyBn: hero.bodyBn,
        ctaLabelEn: hero.ctaLabelEn,
        ctaLabelBn: hero.ctaLabelBn,
        ctaHref: hero.ctaHref,
        imageUrl: null,
      },
      note: 'Seeded hero',
      authorUserId: author?.id ?? null,
    },
    update: {},
  });

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      create: flag,
      update: {
        labelEn: flag.labelEn,
        labelBn: flag.labelBn,
        descriptionEn: flag.descriptionEn,
        descriptionBn: flag.descriptionBn,
      },
    });
  }

  return `${entries.length} content entries, site settings, the homepage hero and ${flags.length} feature flags ready.`;
}
