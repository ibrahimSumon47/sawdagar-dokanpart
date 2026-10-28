import type { Dictionary } from '../../../../i18n';
import type { InsightRow } from '../../labData';
import { bodyCell, headCell } from '../../tableStyles';

/** Demand signal for four stock and sales combinations. */
export interface InsightTableProps {
  rows: InsightRow[];
  copy: Dictionary['csLab'];
}

export function InsightTable({ rows, copy }: InsightTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className={headCell}>
              {copy.input}
            </th>
            <th scope="col" className={headCell}>
              {copy.signal}
            </th>
            <th scope="col" className={headCell}>
              {copy.cover}
            </th>
            <th scope="col" className={headCell}>
              {copy.restock}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={`${row.units30}-${row.units90}-${row.stock}`}>
              <td className={`${bodyCell} tabular-nums`}>
                {row.units30} / {row.units90} · {row.stock}
              </td>
              <td className={bodyCell}>{row.signal}</td>
              <td className="px-3 py-2 tabular-nums text-ink-muted">{row.daysOfCover}</td>
              <td className="px-3 py-2 tabular-nums text-ink-muted">{row.restockUnits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
