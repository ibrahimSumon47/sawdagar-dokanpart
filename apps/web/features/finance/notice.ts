import type { Dictionary } from '../../i18n';
import type { SellerNoticeResult } from '../seller/notice';

/** Maps the saved and error query flags of the finance queue to copy. */
export function financeNotice(
  copy: Dictionary['admin'],
  params: { saved?: string; refunded?: string; error?: string },
): SellerNoticeResult | null {
  if (params.error) {
    return {
      message: params.error === 'invalid' ? copy.financeInvalid : copy.financeError,
      tone: 'error',
    };
  }
  if (params.saved || params.refunded) return { message: copy.financeSaved, tone: 'success' };
  return null;
}
