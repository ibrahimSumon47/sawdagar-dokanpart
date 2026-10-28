import { describe, expect, it } from 'vitest';
import {
  INVENTORY_ADJUSTMENT_LIMIT,
  applyInventoryAdjustment,
  canSell,
  isSellerProductStatus,
  summariseSellerSales,
} from './sellerRules';

describe('seller rules', () => {
  it('requires both store and KYC approval before selling', () => {
    expect(canSell('approved', 'approved')).toBe(true);
    expect(canSell('pending', 'approved')).toBe(false);
    expect(canSell('approved', 'pending')).toBe(false);
    expect(canSell('suspended', 'approved')).toBe(false);
  });

  it('applies signed stock changes and keeps stock non-negative', () => {
    expect(applyInventoryAdjustment(10, 5)).toEqual({ ok: true, stock: 15 });
    expect(applyInventoryAdjustment(10, -4)).toEqual({ ok: true, stock: 6 });
    expect(applyInventoryAdjustment(2, -3)).toEqual({ ok: false, code: 'negative' });
  });

  it('rejects zero, fractional and oversized changes', () => {
    expect(applyInventoryAdjustment(10, 0)).toEqual({ ok: false, code: 'limit' });
    expect(applyInventoryAdjustment(10, 1.5)).toEqual({ ok: false, code: 'invalid' });
    expect(applyInventoryAdjustment(10, INVENTORY_ADJUSTMENT_LIMIT + 1)).toEqual({
      ok: false,
      code: 'limit',
    });
    expect(applyInventoryAdjustment(-1, 2)).toEqual({ ok: false, code: 'invalid' });
  });

  it('narrows product statuses from form values', () => {
    expect(isSellerProductStatus('draft')).toBe(true);
    expect(isSellerProductStatus('active')).toBe(true);
    expect(isSellerProductStatus('deleted')).toBe(false);
  });

  it('summarises delivered, pipeline and cancelled sub-orders', () => {
    const summary = summariseSellerSales([
      { status: 'delivered', totalMinor: 12000, quantity: 2 },
      { status: 'shipped', totalMinor: 5000, quantity: 1 },
      { status: 'packed', totalMinor: 3000, quantity: 1 },
      { status: 'cancelled', totalMinor: 9000, quantity: 3 },
    ]);

    expect(summary).toEqual({
      orders: 3,
      units: 4,
      deliveredMinor: 12000,
      pipelineMinor: 8000,
    });
  });
});
