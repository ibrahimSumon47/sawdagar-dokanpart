import type { Dictionary } from '../../../../i18n';

export interface MotionCatalogProps {
  copy: Dictionary;
}

interface MotionExample {
  name: string;
  note: string;
  className: string;
}

/**
 * Each example names one motion the storefront uses and plays it on a sample
 * tile. The classes are the same ones the live pages use, so this page shows
 * the real behaviour. Every animation is transform or opacity only.
 */
const examples: readonly MotionExample[] = [
  {
    name: 'Page enter',
    note: 'Fades in and rises 8px on each route change.',
    className: 'page-enter',
  },
  {
    name: 'Scroll reveal',
    note: 'Product cards rise once as they enter the viewport.',
    className: 'reveal-on-scroll',
  },
  {
    name: 'Stat settle',
    note: 'Seller dashboard figures rise into place.',
    className: 'stat-settle',
  },
  {
    name: 'Field shake',
    note: 'An invalid tracking field shakes once.',
    className: 'field-shake',
  },
  {
    name: 'Cart bump',
    note: 'The cart icon bounces when an item is added.',
    className: 'cart-bump',
  },
  {
    name: 'Heart burst',
    note: 'The wishlist heart pops when saved.',
    className: 'heart-burst',
  },
  {
    name: 'Mega menu spring',
    note: 'The category menu springs open.',
    className: 'mega-menu-panel',
  },
];

/**
 * Motion catalog for the design system. Linked from the footer only. The page
 * is static markup; the sample tiles replay their motion when re-rendered.
 */
export function MotionCatalog({ copy }: MotionCatalogProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {copy.design.eyebrow}
        </p>
        <h1 className="mt-3 text-display font-serif leading-tight text-ink">Motion</h1>
        <p className="mt-3 text-lead leading-relaxed text-ink-muted">
          Every animation on the storefront is transform or opacity only, runs at 60fps, and is
          switched off when the reader asks for reduced motion.
        </p>
      </header>

      <ul role="list" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {examples.map((example) => (
          <li key={example.name} className="rounded-sm border border-line bg-surface p-6">
            <div className="grid h-24 place-items-center rounded-sm bg-accent/10">
              <span
                className={`${example.className} block size-10 rounded-sm bg-accent`}
                aria-hidden="true"
              />
            </div>
            <h2 className="mt-4 font-serif text-lg text-ink">{example.name}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{example.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
