import type { LocalisedName, ProductTone } from '@sd/domain';

/** One variant in the cart, with the product and vendor details the drawer needs. */
export interface CartLine {
  variantId: string;
  productId: string;
  productSlug: string;
  title: LocalisedName;
  variantName: LocalisedName;
  priceMinor: number;
  compareAtMinor?: number;
  quantity: number;
  stock: number;
  tone: ProductTone;
  vendor: {
    name: string;
    slug: string;
    district: string | null;
  };
}

/** Cart rows for one store, so the drawer can show a vendor heading. */
export interface CartGroup {
  vendor: CartLine['vendor'];
  items: CartLine[];
  subtotalMinor: number;
}

/** Everything the drawer derives from the cart rows. */
export interface CartSummary {
  items: CartLine[];
  groups: CartGroup[];
  count: number;
  subtotalMinor: number;
  deliveryMinor: number;
  totalMinor: number;
  freeDeliveryRemainingMinor: number;
}

export type ShopErrorCode =
  'stock-limit' | 'out-of-stock' | 'unavailable' | 'limit-reached' | 'unauthenticated' | 'failed';

export interface ShopError {
  ok: false;
  code: ShopErrorCode;
  /** Present for stock errors, so the row can say how many are left. */
  available?: number;
}

export type CartResult = { ok: true; items: CartLine[] } | ShopError;

export type IdsResult = { ok: true; ids: string[] } | ShopError;

/** Product fields used by the comparison table. */
export interface CompareProduct {
  id: string;
  slug: string;
  title: LocalisedName;
  vendorName: string;
  priceMinor: number;
  compareAtMinor?: number;
  rating: number;
  reviewCount: number;
  totalStock: number;
  tone: ProductTone;
  categoryName: LocalisedName;
  variantCount: number;
}

/** Plain strings passed to the client shop provider; functions cannot cross the boundary. */
export interface ShopCopy {
  cart: string;
  cartTitle: string;
  openCart: string;
  closeCart: string;
  dismiss: string;
  cartItemOne: string;
  cartItemMany: string;
  emptyTitle: string;
  emptyBody: string;
  emptyAction: string;
  addToCart: string;
  adding: string;
  added: string;
  addedToast: string;
  viewCart: string;
  undo: string;
  remove: string;
  saveForLater: string;
  savedForLater: string;
  saveToWishlist: string;
  removeFromWishlist: string;
  quantity: string;
  decreaseQuantity: string;
  increaseQuantity: string;
  subtotal: string;
  delivery: string;
  freeDelivery: string;
  total: string;
  freeDeliveryProgress: string;
  freeDeliveryUnlocked: string;
  checkout: string;
  checkoutNote: string;
  stockLimit: string;
  outOfStock: string;
  unavailable: string;
  saveFailed: string;
  removeFailed: string;
  shipsFrom: string;
  shipsFromBangladesh: string;
  wishlist: string;
  wishlistTitle: string;
  wishlistDescription: string;
  wishlistEmptyTitle: string;
  wishlistEmptyBody: string;
  wishlistEmptyAction: string;
  wishlistSignIn: string;
  wishlistSignInAction: string;
  wishlistSaved: string;
  wishlistRemoved: string;
  wishlistFailed: string;
  wishlistLimit: string;
  compare: string;
  compareAdded: string;
  compareRemove: string;
  compareView: string;
  compareLimit: string;
  compareTitle: string;
  compareDescription: string;
  compareEmptyTitle: string;
  compareEmptyBody: string;
  compareEmptyAction: string;
  compareCategory: string;
  comparePrice: string;
  compareVendor: string;
  compareRating: string;
  compareStock: string;
  compareOptions: string;
  compareClear: string;
  compareNotEnough: string;
  compareFailed: string;
}
