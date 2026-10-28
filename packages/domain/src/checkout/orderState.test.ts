import { describe, expect, it } from 'vitest';
import {
  canTransitionOrder,
  canTransitionPayment,
  canTransitionSubOrder,
  orderStatusForPayment,
} from './orderState';

describe('order state machines', () => {
  it('allows only the documented order transitions', () => {
    expect(canTransitionOrder('pending_payment', 'confirmed')).toBe(true);
    expect(canTransitionOrder('pending_payment', 'cancelled')).toBe(true);
    expect(canTransitionOrder('confirmed', 'cancelled')).toBe(true);
    expect(canTransitionOrder('completed', 'cancelled')).toBe(false);
    expect(canTransitionOrder('cancelled', 'confirmed')).toBe(false);
  });

  it('moves a sub-order forward but never back from delivered', () => {
    expect(canTransitionSubOrder('pending', 'confirmed')).toBe(true);
    expect(canTransitionSubOrder('confirmed', 'packed')).toBe(true);
    expect(canTransitionSubOrder('packed', 'shipped')).toBe(true);
    expect(canTransitionSubOrder('shipped', 'delivered')).toBe(true);
    expect(canTransitionSubOrder('delivered', 'shipped')).toBe(false);
    expect(canTransitionSubOrder('cancelled', 'pending')).toBe(false);
  });

  it('retries a failed payment but does not reopen a refunded one', () => {
    expect(canTransitionPayment('pending', 'failed')).toBe(true);
    expect(canTransitionPayment('failed', 'paid')).toBe(true);
    expect(canTransitionPayment('paid', 'refunded')).toBe(true);
    expect(canTransitionPayment('refunded', 'paid')).toBe(false);
  });

  it('derives an idempotent order status from the payment result', () => {
    expect(orderStatusForPayment('paid', 'pending_payment')).toBe('confirmed');
    expect(orderStatusForPayment('paid', 'confirmed')).toBe('confirmed');
    expect(orderStatusForPayment('failed', 'pending_payment')).toBe('pending_payment');
    expect(orderStatusForPayment('refunded', 'confirmed')).toBe('cancelled');
    expect(orderStatusForPayment('refunded', 'cancelled')).toBe('cancelled');
  });
});
