import { cn } from '../../lib/cn';

export interface BrandMarkProps {
  className?: string;
}

/**
 * Original jamdani-inspired wordmark glyph: a woven diamond inside a square,
 * drawn with the current text colour so it follows the active theme.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className={cn('size-8', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="1" width="30" height="30" rx="2" />
      <path d="M16 5 27 16 16 27 5 16Z" />
      <path d="M16 10.5 21.5 16 16 21.5 10.5 16Z" />
      <path d="M16 14v4M14 16h4" />
    </svg>
  );
}
