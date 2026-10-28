import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-contrast hover:bg-accent-hover',
  secondary: 'border border-line bg-surface text-ink hover:border-accent hover:text-accent',
  ghost: 'text-ink hover:bg-surface',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-5 text-sm',
};

/** Returns the shared visual classes for buttons and button-styled links. */
export function buttonStyles({
  variant = 'primary',
  size = 'md',
}: ButtonStyleOptions = {}): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-wide transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55',
    variantClass[variant],
    sizeClass[size],
  );
}

export interface ButtonProps extends ComponentProps<'button'>, ButtonStyleOptions {}

/** Renders an action button in one of three visual variants. */
export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonStyles({ variant, size }), className)} {...props} />
  );
}
