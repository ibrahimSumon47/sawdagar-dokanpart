import type { Dictionary } from '../../i18n';
import type { SellerNoticeResult } from '../seller/notice';

/** Maps the saved, restored and error flags on Help category pages to copy. */
export function helpCategoryNotice(
  copy: Dictionary['admin'],
  params: { saved?: string; restored?: string; error?: string },
): SellerNoticeResult | null {
  if (params.error) {
    return {
      message: params.error === 'conflict' ? copy.helpCategoryConflict : copy.helpCategoryInvalid,
      tone: 'error',
    };
  }
  if (params.restored) return { message: copy.helpCategoryRestored, tone: 'success' };
  if (params.saved) return { message: copy.helpCategorySaved, tone: 'success' };
  return null;
}
