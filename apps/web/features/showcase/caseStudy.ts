/** One headline number on the case study page. */
export interface CaseStudyMetric {
  label: string;
  value: string;
  hint: string;
}

/** One engineering decision and why it was taken. */
export interface CaseStudyDecision {
  title: string;
  body: string;
}

/** One hard problem and the fix that shipped. */
export interface CaseStudyChallenge {
  title: string;
  problem: string;
  solution: string;
}

/** One outbound link from the case study. */
export interface CaseStudyLink {
  label: string;
  href: string;
  note: string;
}

const repository = 'https://github.com/ibrahimSumon47/sawdagar-dokanpart';

export const caseStudyMetrics: readonly CaseStudyMetric[] = [
  {
    label: 'Catalog',
    value: '432 products',
    hint: '12 departments, 84 categories and 24 vendors, in English and Bangla.',
  },
  {
    label: 'Demo roles',
    value: '8',
    hint: 'Buyer, vendor owner, vendor staff, support, moderator, finance, content and super admin.',
  },
  {
    label: 'Unit tests',
    value: '170',
    hint: 'Across the domain, UI, web and CS core packages, on three operating systems.',
  },
  {
    label: 'Lighthouse mobile',
    value: '93–95',
    hint: 'Performance medians for home, catalog and product; 100 for accessibility and SEO.',
  },
  {
    label: 'Layout shift',
    value: '0',
    hint: 'Cumulative layout shift on all three audited routes, with skeletons matching real layout.',
  },
  {
    label: 'CS modules',
    value: '4',
    hint: 'C++ and C WebAssembly, plus Python and Java references, each with a TypeScript port.',
  },
];

export const caseStudyDecisions: readonly CaseStudyDecision[] = [
  {
    title: 'Prices and stock belong to the server',
    body: 'Every cart, checkout, seller and admin mutation is a Server Action that parses input with Zod, resolves the viewer from the session and re-reads the product, variant, coupon and shipping rules. The browser never sends a price, a total, a role or an owner id, so a tampered request changes nothing.',
  },
  {
    title: 'Money is integer poisha and every entry balances',
    body: 'Taka are formatted for display only. Commission, shipping, discounts and refunds are integer arithmetic, and each delivery, payout or refund writes a ledger transaction whose debits equal its credits. A unique kind and reference pair makes a retried write harmless.',
  },
  {
    title: 'The seed is deterministic and idempotent',
    body: 'Twelve departments expand through fixed rules and an FNV-1a hash into the same 432 products and 1,296 variants on every run. Upserts let the seed run after any migration without duplicates, and CI only ever runs it through the manual Database workflow.',
  },
  {
    title: 'Loading states share the layout they replace',
    body: 'A product card and its skeleton import the same aspect ratio and body spacing from one constants file, and the product grid and its skeleton use the same container-query classes. The page does not jump when data arrives because the placeholder already has the final geometry.',
  },
  {
    title: 'Columns follow the space a grid is given',
    body: 'The catalog grid sits beside a filter sidebar, so viewport breakpoints would squeeze four cards into a narrow column. Container queries let the same component show two to five columns based on its own width, whether it is on the home page, the catalog or the wishlist.',
  },
  {
    title: 'Metadata is resolved before the shell is sent',
    body: 'Dynamic product pages streamed their title and description after the opening HTML, which put both in the body where crawlers do not look. Blocking metadata for every user agent keeps them in the head, and the product query behind the metadata is request-cached and shared with the page.',
  },
];

export const caseStudyChallenges: readonly CaseStudyChallenge[] = [
  {
    title: 'Selling the last unit twice',
    problem:
      'Two buyers can pass a stock check at the same moment and both reach payment. A read-then-write check cannot prevent that.',
    solution:
      'Stock changes are conditional updates that fail when the remaining quantity is lower than the request, inside the same transaction as the order line. MockPay holds a 30-minute reservation so the unit is not offered again while the buyer is on the sandbox gateway.',
  },
  {
    title: 'A payment callback that can arrive twice',
    problem:
      'The sandbox gateway can retry its callback after a timeout, and a second callback must not mark an order paid twice or release the reservation again.',
    solution:
      'The callback link carries a signed token with a 30-minute expiry. The payment row moves through explicit states, and the transition is a conditional update, so a repeat callback finds the finished state and returns without writing.',
  },
  {
    title: 'A ledger that explains itself',
    problem:
      'The finance screens must never show a balance that disagrees with its history, and refunds can leave a store owing the platform money.',
    solution:
      'Balances are sums of entries, not stored columns. Commission is taken from discounted goods only, shipping passes to the seller, and refunds reverse both sides. The pure ledger builders are tested for balance, idempotency and negative balances before they touch the database.',
  },
  {
    title: 'Crawlers and a streaming framework',
    problem:
      'Next.js streamed metadata for slow routes after the opening HTML. Lighthouse reported no product description, and the canonical tag inherited from the root layout pointed every page at the home page.',
    solution:
      'Canonicals are declared per public route, descriptions are shortened to snippet length at a word boundary, and metadata is blocking for every user agent. Raw HTML and a Googlebot user agent now show the title and description inside the head.',
  },
];

export const caseStudyLinks: readonly CaseStudyLink[] = [
  {
    label: 'Live demonstration',
    href: 'https://sawdagar-dokanpart.vercel.app/',
    note: 'The deployed storefront, including the Seller Center, admin and design gallery.',
  },
  {
    label: 'Source code',
    href: repository,
    note: 'Every phase, migration and test in one public repository.',
  },
  {
    label: 'Architecture',
    href: `${repository}/blob/main/ARCHITECTURE.md`,
    note: 'Package layout, catalog, cart, checkout, finance and CMS flows.',
  },
  {
    label: 'Feature index',
    href: `${repository}/blob/main/docs/FEATURES.md`,
    note: 'Each capability with the files that implement it.',
  },
  {
    label: 'Testing and performance',
    href: `${repository}/blob/main/docs/TESTING.md`,
    note: 'Unit coverage, production checks and Lighthouse results.',
  },
  {
    label: 'CS fundamentals',
    href: `${repository}/blob/main/docs/CS_FUNDAMENTALS.md`,
    note: 'The WebAssembly ranker, SKU kit and the Python and Java references.',
  },
];
