import { describe, expect, it } from 'vitest';
import { isFinalOrder } from './finalStatus';

describe('final tracking status', () => {
  it('stops a completed or cancelled order', () => {
    expect(isFinalOrder('completed', ['delivered'])).toBe(true);
    expect(isFinalOrder('cancelled', ['cancelled'])).toBe(true);
  });

  it('stops once every package is delivered or cancelled', () => {
    expect(isFinalOrder('confirmed', ['delivered', 'cancelled'])).toBe(true);
    expect(isFinalOrder('confirmed', ['delivered', 'shipped'])).toBe(false);
  });

  it('keeps polling while a package can still move', () => {
    expect(isFinalOrder('confirmed', ['packed'])).toBe(false);
    expect(isFinalOrder('pending_payment', ['pending'])).toBe(false);
  });
});
