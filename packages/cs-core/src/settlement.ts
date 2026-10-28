/**
 * TypeScript port of `java/Settlement.java`.
 *
 * A settlement run pays every seller payout at or above the minimum in whole
 * taka and carries the rounded-away poisha plus sub-minimum balances into the
 * next run. The Java class is the reference implementation with the same rules;
 * the admin finance page previews the next run with this port.
 */

/** Minimum transferable balance in poisha, matching the payout form minimum. */
export const SETTLEMENT_MINIMUM_POISHA = 100_000;

/** One payout request as the settlement run sees it. */
export interface SettlementRequest {
  id: string;
  amountPoisha: number;
}

/** Result of a dry run over the current queue. */
export interface SettlementRun {
  count: number;
  paidPoisha: number;
  carriedPoisha: number;
  paidIds: string[];
}

/** Rounds down to whole taka; poisha are never paid out by bank transfer. */
export function wholeTaka(amountPoisha: number): number {
  return amountPoisha - (amountPoisha % 100);
}

/** Groups the queue into one payment batch without changing any balances. */
export function planSettlement(
  requests: readonly SettlementRequest[],
  minimumPoisha: number = SETTLEMENT_MINIMUM_POISHA,
): SettlementRun {
  let count = 0;
  let paidPoisha = 0;
  let carriedPoisha = 0;
  const paidIds: string[] = [];

  for (const request of requests) {
    const amount = Math.max(0, Math.trunc(request.amountPoisha));
    if (amount < minimumPoisha) {
      carriedPoisha += amount;
      continue;
    }
    const whole = wholeTaka(amount);
    paidPoisha += whole;
    carriedPoisha += amount - whole;
    paidIds.push(request.id);
    count += 1;
  }

  return { count, paidPoisha, carriedPoisha, paidIds };
}
