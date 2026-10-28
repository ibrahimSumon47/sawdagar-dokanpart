import type { Dictionary } from '../../i18n';

type CheckoutCopy = Dictionary['checkout'];

/** Human label for an order status stored as a string in the database. */
export function orderStatusLabel(copy: CheckoutCopy, status: string): string {
  switch (status) {
    case 'pending_payment':
      return copy.orderStatusPendingPayment;
    case 'confirmed':
      return copy.orderStatusConfirmed;
    case 'completed':
      return copy.orderStatusCompleted;
    case 'cancelled':
      return copy.orderStatusCancelled;
    default:
      return status;
  }
}

/** Human label for a seller sub-order status. */
export function subOrderStatusLabel(copy: CheckoutCopy, status: string): string {
  switch (status) {
    case 'pending':
      return copy.subOrderPending;
    case 'confirmed':
      return copy.subOrderConfirmed;
    case 'packed':
      return copy.subOrderPacked;
    case 'shipped':
      return copy.subOrderShipped;
    case 'delivered':
      return copy.subOrderDelivered;
    case 'cancelled':
      return copy.subOrderCancelled;
    default:
      return status;
  }
}

/** Human label for a payment status. */
export function paymentStatusLabel(copy: CheckoutCopy, status: string): string {
  switch (status) {
    case 'pending':
      return copy.paymentPendingStatus;
    case 'paid':
      return copy.paymentPaidStatus;
    case 'failed':
      return copy.paymentFailedStatus;
    case 'refunded':
      return copy.paymentRefundedStatus;
    default:
      return status;
  }
}

/** Tone used by the shared badge for each order or payment status. */
export function statusTone(
  status: string,
): 'neutral' | 'accent' | 'success' | 'warning' | 'danger' {
  if (status === 'paid' || status === 'delivered' || status === 'completed') return 'success';
  if (status === 'cancelled' || status === 'failed') return 'danger';
  if (status === 'pending' || status === 'pending_payment' || status === 'packed') return 'warning';
  return 'neutral';
}
