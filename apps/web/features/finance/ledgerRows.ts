import type { LedgerDirection } from '@sd/domain';

export interface LedgerLine {
  accountCode: string;
  direction: LedgerDirection;
  amountMinor: number;
}

/**
 * The `direction` column is plain text, so rows from the database are narrowed
 * before the domain balance helpers accept them.
 */
export function ledgerLines(
  entries: readonly { accountCode: string; direction: string; amountMinor: number }[],
): LedgerLine[] {
  return entries.map((entry) => ({
    accountCode: entry.accountCode,
    direction: entry.direction === 'debit' ? 'debit' : 'credit',
    amountMinor: entry.amountMinor,
  }));
}
