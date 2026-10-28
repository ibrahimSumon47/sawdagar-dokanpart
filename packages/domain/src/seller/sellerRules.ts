/**
 * Seller Center rules shared by the seller pages, server actions and tests.
 *
 * The storefront database stores statuses as strings. This module narrows them
 * and owns the conditions that decide whether a store may sell, how stock may
 * change and which sub-order states a vendor can reach.
 */

export const vendorStatuses = ['pending', 'approved', 'rejected', 'suspended'] as const;

export type VendorStatus = (typeof vendorStatuses)[number];

export const kycStatuses = ['not_started', 'pending', 'approved', 'rejected'] as const;

export type KycStatus = (typeof kycStatuses)[number];

export const businessTypes = ['sole_proprietor', 'partnership', 'company'] as const;

export type BusinessType = (typeof businessTypes)[number];

/** True only when both platform approval and KYC approval are in place. */
export function canSell(status: unknown, kycStatus: unknown): boolean {
  return status === 'approved' && kycStatus === 'approved';
}

/** Reasons a vendor can give when changing stock by hand. */
export const inventoryReasons = ['restock', 'correction', 'damage', 'return'] as const;

export type InventoryReason = (typeof inventoryReasons)[number];

/** Largest single manual stock change; bulk imports have their own limit. */
export const INVENTORY_ADJUSTMENT_LIMIT = 1000;

/** A stock change the database is safe to apply, with the resulting count. */
export type InventoryAdjustmentResult =
  { ok: true; stock: number } | { ok: false; code: 'invalid' | 'negative' | 'limit' };

/**
 * Applies one signed stock change. Counts are integers, a change may not be
 * zero or larger than the manual limit, and stock can never go negative. This
 * is pure so the server action can reject a bad change before writing.
 */
export function applyInventoryAdjustment(stock: number, delta: number): InventoryAdjustmentResult {
  if (!Number.isInteger(stock) || stock < 0 || !Number.isInteger(delta)) {
    return { ok: false, code: 'invalid' };
  }
  if (delta === 0 || Math.abs(delta) > INVENTORY_ADJUSTMENT_LIMIT) {
    return { ok: false, code: 'limit' };
  }

  const next = stock + delta;
  if (next < 0) return { ok: false, code: 'negative' };
  return { ok: true, stock: next };
}

export const sellerProductStatuses = ['draft', 'active', 'archived'] as const;

export type SellerProductStatus = (typeof sellerProductStatuses)[number];

/** Narrowing helper for product status values read from a form. */
export function isSellerProductStatus(value: unknown): value is SellerProductStatus {
  return typeof value === 'string' && (sellerProductStatuses as readonly string[]).includes(value);
}

/** One sub-order line used by the seller dashboard and analytics page. */
export interface SellerSaleLine {
  status: string;
  totalMinor: number;
  quantity: number;
}

/** Revenue, units and pipeline totals for one seller. */
export interface SellerSalesSummary {
  /** Sub-orders that are not cancelled. */
  orders: number;
  units: number;
  /** Money from delivered sub-orders, the only revenue a seller has earned. */
  deliveredMinor: number;
  /** Money still moving through confirmed, packed or shipped sub-orders. */
  pipelineMinor: number;
}

/** Totals for the seller dashboard; cancelled sub-orders are left out. */
export function summariseSellerSales(lines: readonly SellerSaleLine[]): SellerSalesSummary {
  let orders = 0;
  let units = 0;
  let deliveredMinor = 0;
  let pipelineMinor = 0;

  for (const line of lines) {
    if (line.status === 'cancelled') continue;
    orders += 1;
    units += line.quantity;
    if (line.status === 'delivered') deliveredMinor += line.totalMinor;
    if (line.status === 'confirmed' || line.status === 'packed' || line.status === 'shipped') {
      pipelineMinor += line.totalMinor;
    }
  }

  return { orders, units, deliveredMinor, pipelineMinor };
}
