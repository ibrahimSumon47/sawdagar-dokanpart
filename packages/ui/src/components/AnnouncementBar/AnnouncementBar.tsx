import { cn } from '../../lib/cn';

export interface AnnouncementBarProps {
  message: string;
  className?: string;
}

/**
 * Thin marquee at the top of the storefront. The moving copy is hidden from
 * assistive technology and a static copy is announced once instead.
 */
export function AnnouncementBar({ message, className }: AnnouncementBarProps) {
  return (
    <div className={cn('overflow-hidden border-b border-line bg-ink text-background', className)}>
      <span className="sr-only">{message}</span>
      <div aria-hidden="true" className="sd-marquee py-1.5">
        <span className="px-6 text-xs tracking-wide">{message}</span>
        <span className="px-6 text-xs tracking-wide">{message}</span>
        <span className="px-6 text-xs tracking-wide">{message}</span>
        <span className="px-6 text-xs tracking-wide">{message}</span>
      </div>
    </div>
  );
}
