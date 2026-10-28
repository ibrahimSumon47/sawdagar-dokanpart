import { cn } from '../../lib/cn';

export interface AnnouncementBarProps {
  message: string;
  className?: string;
}

/** Thin notice strip at the top of the storefront, announced once. */
export function AnnouncementBar({ message, className }: AnnouncementBarProps) {
  return (
    <div className={cn('border-b border-line bg-ink text-background', className)}>
      <p className="mx-auto w-full max-w-7xl px-4 py-1.5 text-center text-xs tracking-wide sm:px-6 lg:px-8">
        {message}
      </p>
    </div>
  );
}
