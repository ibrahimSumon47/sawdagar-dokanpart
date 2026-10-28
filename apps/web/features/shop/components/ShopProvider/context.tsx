'use client';

import type { CouponRule } from '@sd/domain';
import type { Locale } from '../../../../i18n';
import type { CartSummary, ShopCopy } from '../../types';
import { createContext, useContext } from 'react';

export interface ShopToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export type ShowShopToast = (toast: Omit<ShopToastState, 'id'>) => void;

export interface ShopToastState {
  id: number;
  message: string;
  action?: ShopToastAction;
  undoLabel?: string;
  onUndo?: () => void;
}

export interface AddItemResult {
  ok: boolean;
  message?: string;
}

export interface ShopContextValue {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  summary: CartSummary;
  addItem: (variantId: string, quantity: number) => Promise<AddItemResult>;
  setQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  pendingVariants: readonly string[];
  lineErrors: Record<string, string>;
  coupon: CouponRule | null;
  couponPending: boolean;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => Promise<void>;
  signedIn: boolean;
  wishlistIds: readonly string[];
  /** Resolves true when the product ended up saved. */
  toggleWishlist: (productId: string) => Promise<boolean>;
  compareIds: readonly string[];
  toggleCompare: (productId: string) => Promise<void>;
  clearCompare: () => Promise<void>;
  toast: ShopToastState | null;
  dismissToast: () => void;
  locale: Locale;
  copy: ShopCopy;
}

export const ShopContext = createContext<ShopContextValue | null>(null);

/** Reads the shop state; throws when used outside the provider. */
export function useShop(): ShopContextValue {
  const value = useContext(ShopContext);
  if (!value) throw new Error('useShop must be used inside ShopProvider');
  return value;
}
