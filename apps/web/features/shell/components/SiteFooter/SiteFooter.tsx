import Link from 'next/link';
import { BrandMark } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import { site } from '../../../../lib/site';

export interface SiteFooterProps {
  copy: Dictionary;
}

/** Site footer with the project notice, explore links and demo disclaimer. */
export function SiteFooter({ copy }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="flex items-center gap-2 font-serif text-lg text-ink">
            <BrandMark className="size-6 text-accent" />
            {copy.common.brand}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            {copy.footer.blurb}
          </p>
        </div>
        <nav aria-label={copy.footer.exploreTitle}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            {copy.footer.exploreTitle}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/catalog" className="text-ink-muted transition-colors hover:text-accent">
                {copy.footer.catalog}
              </Link>
            </li>
            <li>
              <Link href="/help" className="text-ink-muted transition-colors hover:text-accent">
                {copy.footer.help}
              </Link>
            </li>
            <li>
              <Link href="/journal" className="text-ink-muted transition-colors hover:text-accent">
                {copy.footer.journal}
              </Link>
            </li>
            <li>
              <Link href="/design" className="text-ink-muted transition-colors hover:text-accent">
                {copy.footer.design}
              </Link>
            </li>
            <li>
              <a
                href={site.repositoryUrl}
                className="text-ink-muted transition-colors hover:text-accent"
              >
                {copy.footer.repository}
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            {copy.footer.demoTitle}
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            {copy.footer.demoBody}
          </p>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-xs text-ink-muted">
        <span className="tabular-nums">© {year}</span> {copy.common.brand} · {copy.footer.legal}
      </div>
    </footer>
  );
}
