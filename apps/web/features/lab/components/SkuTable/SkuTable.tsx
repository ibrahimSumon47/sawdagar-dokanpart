import type { Dictionary } from '../../../../i18n';
import type { SkuRow } from '../../labData';
import { bodyCell, headCell } from '../../tableStyles';

/** Normalization, validity and check character for sample SKUs. */
export interface SkuTableProps {
  rows: SkuRow[];
  copy: Dictionary['csLab'];
}

export function SkuTable({ rows, copy }: SkuTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className={headCell}>
              {copy.input}
            </th>
            <th scope="col" className={headCell}>
              {copy.output}
            </th>
            <th scope="col" className={headCell}>
              {copy.valid}
            </th>
            <th scope="col" className={headCell}>
              {copy.check}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.input}>
              <td className={`${bodyCell} font-mono text-xs`}>{row.input}</td>
              <td className={`${bodyCell} font-mono text-xs`}>{row.normalized || '—'}</td>
              <td className="px-3 py-2 text-ink-muted">{row.valid ? copy.valid : copy.invalid}</td>
              <td className="px-3 py-2 font-mono text-xs text-ink-muted">{row.check || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
