/** One CS core module on the lab page: heading, explanation and its table. */
export interface CsModuleSectionProps {
  title: string;
  body: string;
  meta: string;
  children: React.ReactNode;
}

export function CsModuleSection({ title, body, meta, children }: CsModuleSectionProps) {
  return (
    <section className="rounded-sm border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-mono text-lg text-ink">{title}</h2>
        <p className="text-xs uppercase tracking-wider text-ink-muted">{meta}</p>
      </div>
      <p className="mt-2 max-w-3xl text-sm text-ink-muted">{body}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}
