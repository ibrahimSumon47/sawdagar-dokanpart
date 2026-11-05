import Link from 'next/link';

export interface SiteAnnouncementProps {
  /** Announcement text, already in the visitor's language. */
  text: string;
  /** Optional destination for the whole line. */
  href: string | null;
  /** Accessible name for the region, such as "Store announcement". */
  label: string;
}

/**
 * One-line notice above the header. Editors switch it on in site settings and
 * it is off by default, so the storefront opens without a banner.
 */
export function SiteAnnouncement({ text, href, label }: SiteAnnouncementProps) {
  const line = 'text-sm font-medium text-background';
  const shell =
    'block bg-ink px-4 py-2 text-center transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-[-4px]';

  return (
    <aside aria-label={label} className="bg-ink text-background">
      {href ? (
        <Link href={href} className={`${shell} ${line}`}>
          {text}
        </Link>
      ) : (
        <p className={`px-4 py-2 text-center ${line}`}>{text}</p>
      )}
    </aside>
  );
}
