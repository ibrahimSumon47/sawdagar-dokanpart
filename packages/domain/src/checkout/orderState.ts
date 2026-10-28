/** Lifecycle of the buyer-facing order that groups one or more sub-orders. */
export const orderStatuses = ['pending_payment', 'confirmed', 'completed', 'cancelled'] as const;

export type OrderStatus = (typeof orderStatuses)[number];

/** Lifecycle of the part of an order that belongs to one seller. */
export const subOrderStatuses = [
  'pending',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export type SubOrderStatus = (typeof subOrderStatuses)[number];

/** Payment states kept on the payment row and mirrored on the order summary. */
export const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

const orderTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  pending_payment: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const subOrderTransitions: Record<SubOrderStatus, readonly SubOrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const paymentTransitions: Record<PaymentStatus, readonly PaymentStatus[]> = {
  pending: ['paid', 'failed'],
  failed: ['paid'],
  paid: ['refunded'],
  refunded: [],
};

/** True when an order may move from one status to the next. */
export function canTransitionOrder(from: OrderStatus, to: OrderStatus): boolean {
  return orderTransitions[from].includes(to);
}

/** True when a seller sub-order may move from one status to the next. */
export function canTransitionSubOrder(from: SubOrderStatus, to: SubOrderStatus): boolean {
  return subOrderTransitions[from].includes(to);
}

/** True when a payment may move from one status to the next. */
export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus): boolean {
  return paymentTransitions[from].includes(to);
}

/**
 * Returns the order status that follows a payment result. A paid payment
 * confirms the order; a failed one leaves it waiting for another attempt. The
 * function is deliberately idempotent so a repeated callback cannot move a
 * confirmed order backwards.
 */
export function orderStatusForPayment(status: PaymentStatus, current: OrderStatus): OrderStatus {
  if (status === 'paid' && current === 'pending_payment') return 'confirmed';
  if (status === 'refunded' && current !== 'cancelled') return 'cancelled';
  return current;
}
