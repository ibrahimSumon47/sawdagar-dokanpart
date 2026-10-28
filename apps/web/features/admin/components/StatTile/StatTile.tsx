export interface StatTileProps {
  label: string;
  value: string;
}

/** Compact count tile used at the top of the admin overview. */
export function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-sm border border-line bg-surface p-4">
      <p className="text-xs uppercase tracking-widest text-ink-muted">{label}</p>
      <p className="mt-1 font-serif text-2xl tabular-nums text-ink">{value}</p>
    </div>
  );
}
