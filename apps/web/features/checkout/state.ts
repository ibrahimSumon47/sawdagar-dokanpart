/** The result a checkout form can show without a page reload. */
export interface CheckoutState {
  status: 'idle' | 'invalid' | 'empty' | 'stock' | 'failed' | 'config';
  /** Field name when validation failed; the client maps it to its label. */
  field?: string;
  /** English product title for a stock failure. */
  productTitle?: string;
}

export const initialCheckoutState: CheckoutState = { status: 'idle' };
