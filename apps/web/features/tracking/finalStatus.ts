/** Order states that cannot move again. */
const FINAL_ORDER_STATUSES = new Set(['completed', 'cancelled']);

/** Package states that cannot move again. */
const FINAL_SUB_ORDER_STATUSES = new Set(['delivered', 'cancelled']);

/**
 * True when the timeline has no further update to show. An order is final when
 * it is completed or cancelled, or when every seller package is delivered or
 * cancelled even if the order row has not been closed yet. Tracking clients use
 * this to stop polling instead of watching a finished order forever.
 */
export function isFinalOrder(orderStatus: string, subOrderStatuses: readonly string[]): boolean {
  if (FINAL_ORDER_STATUSES.has(orderStatus)) return true;
  return (
    subOrderStatuses.length > 0 &&
    subOrderStatuses.every((status) => FINAL_SUB_ORDER_STATUSES.has(status))
  );
}
