import type { Dictionary } from '../../i18n';
import type { SellerNoticeResult } from '../seller/notice';

/** Maps the saved, restored and error flags used by CMS pages to copy. */
export function contentNotice(
  copy: Dictionary['admin'],
  params: { saved?: string; restored?: string; error?: string },
): SellerNoticeResult | null {
  if (params.error) {
    const message =
      params.error === 'conflict'
        ? copy.contentConflict
        : params.error === 'invalid'
          ? copy.contentInvalid
          : copy.contentFailed;
    return { message, tone: 'error' };
  }
  if (params.restored) return { message: copy.versionRestored, tone: 'success' };
  if (params.saved) return { message: copy.contentSaved, tone: 'success' };
  return null;
}
