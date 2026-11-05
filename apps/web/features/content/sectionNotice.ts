import type { Dictionary } from '../../i18n';
import type { SellerNoticeResult } from '../seller/notice';

/** Maps the saved, restored and error flags used by section pages to copy. */
export function sectionNotice(
  copy: Dictionary['admin'],
  params: { saved?: string; restored?: string; error?: string },
): SellerNoticeResult | null {
  if (params.error) {
    return {
      message: params.error === 'invalid' ? copy.sectionInvalid : copy.sectionFailed,
      tone: 'error',
    };
  }
  if (params.restored) return { message: copy.sectionRestored, tone: 'success' };
  if (params.saved) return { message: copy.sectionSaved, tone: 'success' };
  return null;
}
