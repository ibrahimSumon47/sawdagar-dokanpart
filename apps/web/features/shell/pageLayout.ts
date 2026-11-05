/**
 * Container widths and vertical rhythm shared by a route and the skeleton that stands in
 * for it while data loads. Both sides import these strings, so a padding or max-width
 * change moves the placeholder and the real layout together instead of letting them drift.
 */
export const pageLayout = {
  /** Home hero, with its larger top spacing. */
  home: 'mx-auto w-full max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8',
  /** Sections inside the home page. */
  section: 'mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8',
  /** Follow-up home section with less space above it. */
  sectionTight: 'mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8',
  /** Standard wide page such as checkout or admin. */
  wide: 'mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8',
  /** Catalog listing, which adds a little more room above the grid. */
  catalog: 'mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8',
  /** Product lists and account sub-pages. */
  standard: 'mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8',
  /** Account overview, which has taller heading spacing. */
  account: 'mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8',
  /** Account sub-pages, one step narrower than the overview. */
  accountSection: 'mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8',
  /** Seller Center, one step narrower than the admin pages. */
  seller: 'mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8',
  /** Help Center and Journal indexes. */
  content: 'mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8',
  /** A single Help article, Journal post or CMS page. */
  article: 'mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8',
} as const;
