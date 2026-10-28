import type { ReactNode } from 'react';

export interface CompareRowProps {
  label: string;
  /** One cell per compared product, keyed by product id. */
  values: readonly { id: string; value: ReactNode }[];
}

/** One labelled attribute across every compared product. */
export function CompareRow({ label, values }: CompareRowProps) {
  return (
    <tr className="border-t border-line even:bg-surface/60">
      <th
        scope="row"
        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted"
      >
        {label}
      </th>
      {values.map((cell) => (
        <td key={cell.id} className="border-l border-line px-4 py-3 align-top text-ink">
          {cell.value}
        </td>
      ))}
    </tr>
  );
}
