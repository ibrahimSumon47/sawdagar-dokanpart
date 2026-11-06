import { SectionHeading } from '@sd/ui';

/** One diagram shown on the case study: its image path, alt text and caption. */
interface DiagramEntry {
  src: string;
  alt: string;
  caption: string;
}

/** The four diagrams from docs/diagrams, served as static SVG files from public/diagrams. */
const DIAGRAMS: readonly DiagramEntry[] = [
  {
    src: '/diagrams/architecture.svg',
    alt: 'System architecture: browser, Next.js on Vercel, Neon Postgres, Cloudinary and the mail outbox.',
    caption: 'System architecture',
  },
  {
    src: '/diagrams/checkout-sequence.svg',
    alt: 'Checkout sequence: form submit, server re-pricing and stock check, transactional insert, mock payment and order status.',
    caption: 'Checkout sequence',
  },
  {
    src: '/diagrams/order-status.svg',
    alt: 'Order status state machine from pending payment through paid, fulfilment and delivery, with cancel and refund paths.',
    caption: 'Order status state machine',
  },
  {
    src: '/diagrams/er.svg',
    alt: 'Entity relationship diagram of users, addresses, carts, orders, sub-orders, payments, products and variants.',
    caption: 'Entity relationship diagram',
  },
];

/**
 * The four architecture diagrams from docs/diagrams, shown on the case study so
 * a reader can follow the system without opening the repository. Images are
 * plain SVG with alt text, and the captions are in English because the case
 * study itself is written in English.
 */
export function CaseStudyDiagrams() {
  return (
    <section className="mt-14 border-t border-line pt-10">
      <SectionHeading
        title="How the system fits together"
        description="The diagrams are hand-drawn SVG and live in docs/diagrams."
      />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {DIAGRAMS.map((diagram) => (
          <figure key={diagram.src} className="rounded-sm border border-line bg-surface p-4">
            {/* Plain img keeps the SVG as a static file, not an optimised raster. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={diagram.src} alt={diagram.alt} className="h-auto w-full" loading="lazy" />
            <figcaption className="mt-3 text-sm text-ink-muted">{diagram.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
