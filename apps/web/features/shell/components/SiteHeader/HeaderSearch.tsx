interface HeaderSearchProps {
  id: string;
  label: string;
  placeholder: string;
  className: string;
}

/** Search form shared by the desktop and compact storefront headers. */
export function HeaderSearch({ id, label, placeholder, className }: HeaderSearchProps) {
  return (
    <form action="/catalog" role="search" className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder={placeholder}
        className="min-h-11 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
      />
    </form>
  );
}
