import { cn } from '../../lib/cn';

export interface JamdaniPatternProps {
  className?: string;
}

const columns = 5;
const rows = 6;

/**
 * Decorative handloom motif used where product photography will later sit.
 * It is drawn from repeated diamond paths instead of an image so the sample
 * cards stay crisp and free of licensed material.
 */
export function JamdaniPattern({ className }: JamdaniPatternProps) {
  const diamonds = Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = 20 + column * 40;
    const y = 22 + row * 42;
    return (
      <g key={index} transform={`translate(${x} ${y})`} opacity={row % 2 === 0 ? 0.9 : 0.55}>
        <path d="M0 -13 13 0 0 13 -13 0Z" />
        <path d="M0 -5 5 0 0 5 -5 0Z" />
      </g>
    );
  });

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 260"
      preserveAspectRatio="xMidYMid slice"
      className={cn('size-full', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {diamonds}
    </svg>
  );
}
