import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { AuditPage } from '../../auditQueries';

export interface AuditLogTableProps {
  audit: AuditPage;
  copy: Dictionary['admin'];
  locale: Locale;
}

/** One page of the append-only audit log as a readable table. */
export function AuditLogTable({ audit, copy, locale }: AuditLogTableProps) {
  if (audit.rows.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
        {copy.noEntries}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-line bg-surface">
      <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
        <thead className="bg-background text-xs uppercase tracking-wider text-ink-muted">
          <tr>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.actionColumn}
            </th>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.actorColumn}
            </th>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.auditTarget}
            </th>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.whenColumn}
            </th>
          </tr>
        </thead>
        <tbody>
          {audit.rows.map((row) => (
            <tr key={row.id} className="border-t border-line">
              <td className="px-4 py-2">
                <code className="rounded-sm bg-background px-1.5 py-0.5 text-xs text-ink">
                  {row.action}
                </code>
              </td>
              <td className="px-4 py-2 text-ink-muted">{row.actorEmail}</td>
              <td className="px-4 py-2 text-xs text-ink-muted">
                {row.targetType ? `${row.targetType} · ${row.targetId}` : '—'}
              </td>
              <td className="px-4 py-2 text-xs tabular-nums text-ink-muted">
                {formatDate(row.createdAt, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
