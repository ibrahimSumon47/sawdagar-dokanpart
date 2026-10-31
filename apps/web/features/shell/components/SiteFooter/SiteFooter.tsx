import Link from 'next/link';
import { BrandMark } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import { site } from '../../../../lib/site';

export interface SiteFooterProps {
  copy: Dictionary;
}

interface FooterLink {
  label: string;
  href: string;
  /** Opens the public repository in a new tab. */
  external?: boolean;
}

/**
 * Site footer: the store blurb, shopping links, the project links that used to
 * sit in the header, and the one permitted test-payment disclosure line.
 */
export function SiteFooter({ copy }: SiteFooterProps) {
  const year = new Date().getFullYear();

  const shopLinks: FooterLink[] = [
    { label: copy.footer.catalog, href: '/catalog' },
    { label: copy.footer.wishlist, href: '/wishlist' },
    { label: copy.footer.help, href: '/help' },
    { label: copy.footer.journal, href: '/journal' },
  ];

  const projectLinks: FooterLink[] = [
    { label: copy.footer.aboutProject, href: '/about/project' },
    { label: copy.footer.design, href: '/design' },
    { label: copy.footer.csLab, href: '/cs-lab' },
    { label: copy.footer.caseStudy, href: '/case-study' },
    { label: copy.footer.credits, href: '/credits' },
    { label: copy.footer.repository, href: site.repositoryUrl, external: true },
  ];

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

        <nav aria-label={copy.footer.shopTitle}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            {copy.footer.shopTitle}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={copy.footer.projectTitle}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            {copy.footer.projectTitle}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {projectLinks.map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a
                    href={link.href}
                    className="text-ink-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-ink-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line px-4 py-4 text-center text-xs text-ink-muted">
        <p>{copy.common.testMode}</p>
        <p className="mt-1">
          <span className="tabular-nums">© {year}</span> {copy.common.brand} · {copy.footer.legal}
        </p>
      </div>
    </footer>
  );
}
