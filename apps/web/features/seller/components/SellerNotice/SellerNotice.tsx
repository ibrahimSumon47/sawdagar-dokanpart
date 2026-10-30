import { cn } from '@sd/ui';

export interface SellerNoticeProps {
  /** Message to show; nothing renders when it is null. */
  message: string | null;
  tone?: 'success' | 'error';
}

/** Inline confirmation or error line above a Seller Center form or table. */
export function SellerNotice({ message, tone = 'success' }: SellerNoticeProps) {
  if (!message) return null;

  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-sm border px-3 py-2 text-sm',
        tone === 'error'
          ? 'border-danger/30 bg-danger/10 text-danger-strong'
          : 'border-success/30 bg-success/10 text-success-strong',
      )}
    >
      {message}
    </p>
  );
}
