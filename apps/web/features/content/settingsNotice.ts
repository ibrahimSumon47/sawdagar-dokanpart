import type { Dictionary } from '../../i18n';
import type { SellerNoticeResult } from '../seller/notice';

/** Maps the saved, restored and error flags used by the settings page to copy. */
export function settingsNotice(
  copy: Dictionary['admin'],
  params: { saved?: string; restored?: string; error?: string },
): SellerNoticeResult | null {
  if (params.error) {
    const message =
      params.error === 'invalid'
        ? copy.settingsInvalid
        : params.error === 'failed'
          ? copy.settingsFailed
          : copy.contentFailed;
    return { message, tone: 'error' };
  }
  if (params.restored) return { message: copy.settingsRestored, tone: 'success' };
  if (params.saved) return { message: copy.settingsSaved, tone: 'success' };
  return null;
}
