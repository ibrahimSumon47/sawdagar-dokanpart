import Link from 'next/link';

/** One CMS module card: what it holds, where it opens and how many items exist. */
export interface CmsModule {
  key: string;
  title: string;
  body: string;
  href: string;
  /** Items in the module, or undefined when a count says nothing useful. */
  count?: number;
  countLabel?: string;
}

export interface CmsModuleLinksProps {
  modules: readonly CmsModule[];
  /** Text of the link inside each card, such as "Open". */
  linkLabel: string;
}

/** Entry points to the CMS modules, shown on the admin CMS home. */
export function CmsModuleLinks({ modules, linkLabel }: CmsModuleLinksProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <li key={module.key}>
          <Link
            href={module.href}
            className="flex h-full flex-col rounded-sm border border-line bg-surface p-4 transition-colors hover:border-accent"
          >
            <h2 className="font-serif text-lg text-ink">{module.title}</h2>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-muted">{module.body}</p>
            {module.count !== undefined ? (
              <p className="mt-3 text-xs tabular-nums text-ink-muted">
                {module.count} {module.countLabel}
              </p>
            ) : null}
            <span className="mt-1 text-sm font-semibold text-accent underline-offset-4 group-hover:underline">
              {linkLabel}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
