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
    bodyEn: `Every item on Sawdagar Dokanpat comes from an independent store. You can mix stores in one cart: the cart groups the lines by seller, and checkout creates one sub-order for each store so each seller packs and ships their own part.

Choose a variant and quantity on the product page, then open the cart from the header. Enter a delivery address in Bangladesh, pick cash on delivery, and confirm. You will receive an order number such as SD-20261028-410004 on the confirmation page and in your account.

This is a demonstration store. Payments are sandboxed, no courier is booked, and the order flow is there to show how the marketplace works.`,
    bodyBn: `সাওদাগর দোকানপাটের প্রতিটি পণ্য আলাদা দোকান থেকে আসে। এক কার্টে একাধিক দোকানের পণ্য রাখা যায়: কার্টে পণ্যগুলো বিক্রেতা অনুযায়ী সাজানো থাকে, আর চেকআউটে প্রতিটি দোকানের জন্য আলাদা সাব-অর্ডার তৈরি হয়, যাতে প্রত্যেকে নিজের অংশ প্যাক করে পাঠাতে পারে।

পণ্যের পাতায় ভ্যারিয়েন্ট ও পরিমাণ বেছে নিন, তারপর হেডার থেকে কার্ট খুলুন। বাংলাদেশের ঠিকানা দিন, ক্যাশ অন ডেলিভারি বেছে নিন এবং নিশ্চিত করুন। কনফার্মেশন পাতায় SD-20261028-410004 ধাঁচের একটি অর্ডার নম্বর পাবেন, যা আপনার অ্যাকাউন্টেও থাকবে।

এটি একটি ডেমো দোকান। পেমেন্ট স্যান্ডবক্সে হয়, কোনো কুরিয়ার বুকিং হয় না; অর্ডার প্রবাহটি শুধু মার্কেটপ্লেসের কাজ দেখানোর জন্য।`,
    status: 'published',
    publishAt: '2026-09-12T09:00:00+06:00',
    seoDescriptionEn: 'How cart, checkout and per-store sub-orders work in the marketplace demo.',
    seoDescriptionBn: 'মার্কেটপ্লেস ডেমোতে কার্ট, চেকআউট ও দোকানভিত্তিক সাব-অর্ডার যেভাবে কাজ করে।',
  },
  {
    id: 'cms_help_delivery_times',
    kind: 'help',
    slug: 'delivery-times',
    titleEn: 'Delivery times across Bangladesh',
    titleBn: 'সারা বাংলাদেশে ডেলিভারির সময়',
    excerptEn: 'Most stores pack within two working days. Dhaka usually arrives first.',
    excerptBn: 'বেশিরভাগ দোকান দুই কর্মদিবসে প্যাক করে। ঢাকায় সাধারণত আগে পৌঁছায়।',
    bodyEn: `Sellers pack orders within two working days of confirmation. From there, a courier needs one to two days inside Dhaka and two to five days for other districts, depending on the route and the weather.

Each sub-order travels separately, so a cart with three stores can arrive on three different days. The order page lists a tracking number for each seller as soon as they hand the parcel to the courier.

During Eid and the winter wedding season, handloom stores often need an extra day to finish weaving. Their store page carries any announcement about current lead times.`,
    bodyBn: `নিশ্চিত করার দুই কর্মদিবসের মধ্যে বিক্রেতারা অর্ডার প্যাক করেন। এরপর ঢাকার ভেতরে কুরিয়ারে এক থেকে দুই দিন, অন্য জেলায় দুই থেকে পাঁচ দিন লাগে; রুট ও আবহাওয়ার ওপর নির্ভর করে।

প্রতিটি সাব-অর্ডার আলাদা যায়, তাই তিনটি দোকানের একটি কার্ট তিনটি ভিন্ন দিনে পৌঁছাতে পারে। বিক্রেতা পার্সেল কুরিয়ারে দেওয়ার সাথে সাথে অর্ডার পাতায় ট্র্যাকিং নম্বর দেখা যায়।

ঈদ ও শীতের বিয়ের মরশুমে তাঁতের দোকানে এক দিন বেশি লাগতে পারে। চলতি সময়ের ঘোষণা ওই দোকানের পাতায় থাকে।`,
    status: 'published',
    publishAt: '2026-09-18T09:00:00+06:00',
    seoDescriptionEn: 'Packing and courier timelines for Dhaka and other districts.',
    seoDescriptionBn: 'ঢাকা ও অন্য জেলার জন্য প্যাকিং ও কুরিয়ারের সময়সূচি।',
  },
  {
    id: 'cms_help_returns',
    kind: 'help',
    slug: 'returns-and-refunds',
    titleEn: 'Returns and refunds',
    titleBn: 'ফেরত ও রিফান্ড',
    excerptEn: 'Ask for a return within seven days of delivery; the seller reviews it first.',
    excerptBn: 'ডেলিভারির সাত দিনের মধ্যে ফেরত চাইতে পারেন; প্রথমে বিক্রেতা দেখেন।',
    bodyEn: `Open the order from your account and choose Return next to a delivered line. You have seven days from delivery. Say what is wrong, and add a photo if the item arrived damaged.

The seller approves or declines the request. If approved, the platform finance team issues the refund to the original payment method. Cash-on-delivery orders are refunded to the payout number you provide.

Items that were used, washed or altered cannot be returned. Made-to-order pieces are only returnable when they arrive damaged or different from the description.`,
    bodyBn: `অ্যাকাউন্ট থেকে অর্ডার খুলে ডেলিভারি হওয়া লাইনের পাশে ফেরত চাপুন। ডেলিভারির দিন থেকে সাত দিন সময় আছে। সমস্যাটি লিখুন; পণ্য ভাঙা এলে ছবিও যোগ করতে পারেন।

বিক্রেতা অনুরোধটি অনুমোদন বা প্রত্যাখ্যান করেন। অনুমোদিত হলে প্ল্যাটফর্মের হিসাব দল মূল পেমেন্ট পদ্ধতিতে রিফান্ড দেয়। ক্যাশ অন ডেলিভারির ক্ষেত্রে আপনি দেওয়া পেআউট নম্বরে টাকা ফেরত যায়।

ব্যবহৃত, ধোয়া বা পরিবর্তিত পণ্য ফেরত নেওয়া হয় না। অর্ডার অনুযায়ী বানানো পণ্য কেবল ভাঙা অবস্থায় বা বিবরণের সাথে না মিললে ফেরতযোগ্য।`,
    status: 'published',
    publishAt: '2026-09-25T09:00:00+06:00',
    seoDescriptionEn: 'The seven-day return window, seller review and refund timing.',
    seoDescriptionBn: 'সাত দিনের ফেরতের সময়, বিক্রেতার পর্যালোচনা ও রিফান্ডের সময়।',
  },
  {
    id: 'cms_help_payments',
    kind: 'help',
    slug: 'payments',
    titleEn: 'Payment methods in the demo',
    titleBn: 'ডেমোতে পেমেন্টের পদ্ধতি',
    excerptEn: 'Cash on delivery and two sandbox wallet options; no real money moves.',
    excerptBn: 'ক্যাশ অন ডেলিভারি ও দুটি স্যান্ডবক্স ওয়ালেট; আসল টাকা চলে না।',
    bodyEn: `Checkout offers cash on delivery and two sandbox wallets, bKash and Nagad. The wallets open a mock confirmation screen: it records the payment against the demo order but never contacts a real provider.

Coupons are applied in the cart before checkout. Only one coupon can be used per order, and a store coupon only covers that store's lines.

Because this is a portfolio demonstration, no card details are collected and no money changes hands. The ledger behind the admin finance screen uses the same sandbox payments.`,
    bodyBn: `চেকআউটে ক্যাশ অন ডেলিভারি এবং বিকাশ ও নগদ—দুটি স্যান্ডবক্স ওয়ালেট আছে। ওয়ালেট খুললে একটি নকল কনফার্মেশন স্ক্রিন আসে: এটি ডেমো অর্ডারের বিপরীতে পেমেন্ট লিখে রাখে, কিন্তু কোনো আসল প্রতিষ্ঠানের সাথে যোগাযোগ করে না।

কুপন চেকআউটের আগে কার্টে প্রয়োগ হয়। এক অর্ডারে একটি কুপন; দোকানের কুপন শুধু ওই দোকানের পণ্যে খাটে।

যেহেতু এটি পোর্টফোলিও ডেমো, কোনো কার্ডের তথ্য নেওয়া হয় না এবং টাকা আদান-প্রদান হয় না। অ্যাডমিনের হিসাব পাতার লেজারও একই স্যান্ডবক্স পেমেন্ট ব্যবহার করে।`,
    status: 'published',
    publishAt: '2026-10-02T09:00:00+06:00',
    seoDescriptionEn: 'Cash on delivery and sandbox wallet payments, and how coupons apply.',
    seoDescriptionBn: 'ক্যাশ অন ডেলিভারি ও স্যান্ডবক্স ওয়ালেট, এবং কুপন প্রয়োগের নিয়ম।',
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
    id: 'cms_page_about',
    kind: 'page',
    slug: 'about',
    titleEn: 'About this marketplace',
    titleBn: 'এই মার্কেটপ্লেস সম্পর্কে',
    excerptEn:
      'A multi-vendor store built as a portfolio project, with sandbox payments and demo data.',
    excerptBn:
      'পোর্টফোলিও প্রকল্প হিসেবে তৈরি বহু-বিক্রেতার দোকান; স্যান্ডবক্স পেমেন্ট ও ডেমো ডেটা।',
    bodyEn: `Sawdagar Dokanpat is a demonstration of a multi-vendor marketplace for Bangladesh. It is built in public as a portfolio project by one developer, using free hosting and a sandbox payment flow.

The catalog, stores and reviews are sample data. No order is fulfilled, no courier is booked and no money changes hands. Demo accounts exist so that each part of the product can be opened and reviewed from the right role.

The design borrows from the rhythm of a Bangla storefront: jamdani motifs, warm paper tones, serif headings and prices in taka. The journal and Help Center are managed through the same admin area as the catalog.`,
    bodyBn: `সাওদাগর দোকানপাট বাংলাদেশের একটি বহু-বিক্রেতার মার্কেটপ্লেসের ডেমো। একজন ডেভেলপার পোর্টফোলিও হিসেবে এটি প্রকাশ্যে তৈরি করছেন, বিনামূল্যের হোস্টিং ও স্যান্ডবক্স পেমেন্ট ব্যবহার করে।

ক্যাটালগ, দোকান ও রিভিউ নমুনা ডেটা। কোনো অর্ডার পূরণ হয় না, কুরিয়ার বুক হয় না, টাকা আদান-প্রদানও হয় না। ডেমো অ্যাকাউন্টগুলো আছে যাতে প্রতিটি অংশ সঠিক ভূমিকা থেকে খুলে দেখা যায়।

ডিজাইনে বাংলা দোকানের ছন্দ ধরা হয়েছে: জামদানির নকশা, উষ্ণ কাগজের রঙ, সেরিফ শিরোনাম আর টাকায় দাম। জার্নাল ও সহায়তা কেন্দ্র ক্যাটালগের মতোই একই অ্যাডমিন এলাকা থেকে চালানো হয়।`,
    status: 'published',
    publishAt: '2026-09-01T09:00:00+06:00',
    seoDescriptionEn:
      'What this marketplace demo is, how it is built and what the data represents.',
    seoDescriptionBn: 'এই মার্কেটপ্লেস ডেমো কী, কীভাবে তৈরি এবং ডেটা কী বোঝায়।',
  },
  {
    id: 'cms_page_contact',
    kind: 'page',
    slug: 'contact',
    titleEn: 'Contact the project',
    titleBn: 'প্রকল্পের সাথে যোগাযোগ',
    excerptEn: 'Bug reports and questions about the demo belong in the public repository.',
    excerptBn: 'ডেমোর ত্রুটি বা প্রশ্নের জন্য পাবলিক রিপোজিটরি ব্যবহার করুন।',
    bodyEn: `This is a demo, so there is no support desk and no phone number. The source code, open issues and the roadmap live in the public repository linked from the footer.

If you are reviewing the project for a role, the sign-in page lists one account per platform role. Start with the buyer to place an order, then sign in as the vendor to fulfil it, and as finance to pay out the seller.

Messages sent through any store's contact details in the demo are not delivered.`,
    bodyBn: `এটি ডেমো, তাই কোনো সহায়তা ডেস্ক বা ফোন নম্বর নেই। সোর্স কোড, খোলা সমস্যা ও রোডম্যাপ ফুটারের লিংক করা পাবলিক রিপোজিটরিতে আছে।

কোনো পদে পর্যালোচনার জন্য প্রকল্পটি দেখলে, সাইন-ইন পাতায় প্রতিটি ভূমিকার একটি অ্যাকাউন্ট আছে। ক্রেতা দিয়ে অর্ডার দিন, তারপর বিক্রেতা দিয়ে পূরণ করুন, আর হিসাব দল দিয়ে বিক্রেতাকে পেমেন্ট দিন।

ডেমোর কোনো দোকানের যোগাযোগের ঠিকানায় পাঠানো বার্তা পৌঁছায় না।`,
    status: 'published',
    publishAt: '2026-09-05T09:00:00+06:00',
    seoDescriptionEn: 'How to review the demo, and where to report issues.',
    seoDescriptionBn: 'ডেমো কীভাবে দেখবেন এবং সমস্যা কোথায় জানাবেন।',
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
export async function seedContent(prisma: PrismaClient): Promise<string> {
  const author = await prisma.user.findUnique({
    where: { email: 'editor@demo.sawdagar.test' },
    select: { id: true },
  });

  for (const entry of entries) {
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

  return `${entries.length} content entries and ${flags.length} feature flags ready.`;
}
