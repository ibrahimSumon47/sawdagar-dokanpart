import { Badge, ButtonLink } from '@sd/ui';

/**
 * Opening block of the case study: what the project is, the demo notice and the
 * two actions a reader is most likely to want. Used once at the top of
 * `/case-study`.
 */
export function CaseStudyHero() {
  return (
    <header className="max-w-4xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Case study</p>
      <h1 className="mt-4 text-hero font-serif leading-[1.02] tracking-tight text-ink">
        A marketplace built end to end.
      </h1>
      <p className="mt-6 max-w-2xl text-lead leading-relaxed text-ink-muted">
        Sawdagar Dokanpat is a multi-vendor marketplace for Bangladesh, built as a portfolio
        project. It follows the whole path a marketplace needs: a bilingual catalog, guest and user
        carts, checkout with two sandbox payment methods, seller fulfillment, a double-entry ledger,
        and an admin content system with approvals and audit history.
      </p>
      <p className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
        <Badge tone="warning">Test mode</Badge>
        Payments run in test mode. No real money is charged, and the catalog, sellers, reviews and
        orders are seeded data.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="https://sawdagar-dokanpart.vercel.app/">Open the storefront</ButtonLink>
        <ButtonLink href="https://github.com/ibrahimSumon47/sawdagar-dokanpart" variant="secondary">
          Read the source
        </ButtonLink>
      </div>
    </header>
  );
}
