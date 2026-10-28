import type { Dictionary } from '../../../../i18n';
import type { ScoreRow } from '../../labData';
import { bodyCell, headCell } from '../../tableStyles';

/** Scores from WebAssembly and the TypeScript port, plus whether they agree. */
export interface ScoreTableProps {
  rows: ScoreRow[];
  copy: Dictionary['csLab'];
}

export function ScoreTable({ rows, copy }: ScoreTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className={headCell}>
              {copy.input}
            </th>
            <th scope="col" className={headCell}>
              {copy.webassembly}
            </th>
            <th scope="col" className={headCell}>
              {copy.typescript}
            </th>
            <th scope="col" className={headCell}>
              {copy.score}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={`${row.query}-${row.doc}`}>
              <td className={bodyCell}>
                “{row.query}” · {row.doc}
              </td>
              <td className="px-3 py-2 tabular-nums text-ink-muted">{row.wasm ?? '—'}</td>
              <td className="px-3 py-2 tabular-nums text-ink-muted">{row.port}</td>
              <td className="px-3 py-2 text-xs text-ink-muted">
                {row.wasm === row.port ? copy.parity : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
