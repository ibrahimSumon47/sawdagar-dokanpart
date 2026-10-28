import type { Dictionary } from '../../i18n';

export interface SellerNoticeResult {
  message: string;
  tone: 'success' | 'error';
}

/** Maps the saved and error query flags used by Seller Center pages to copy. */
export function sellerNotice(
  copy: Dictionary['seller'],
  params: {
    saved?: string;
    created?: string;
    error?: string;
    kyc?: string;
    requested?: string;
  },
): SellerNoticeResult | null {
  if (params.error) {
    const message =
      params.error === 'conflict'
        ? copy.conflict
        : params.error === 'kyc'
          ? copy.kycRequired
          : params.error === 'tracking'
            ? copy.trackingRequired
            : params.error === 'below_minimum'
              ? copy.errorBelowMinimum
              : params.error === 'above_available'
                ? copy.errorAboveAvailable
                : params.error === 'failed'
                  ? copy.failed
                  : copy.invalid;
    return { message, tone: 'error' };
  }
  if (params.requested) return { message: copy.payoutRequestedNotice, tone: 'success' };
  if (params.created) return { message: copy.productCreated, tone: 'success' };
  if (params.kyc) return { message: copy.saved, tone: 'success' };
  if (params.saved) return { message: copy.saved, tone: 'success' };
  return null;
}
