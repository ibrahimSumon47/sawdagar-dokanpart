import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';
import { buttonStyles, type ButtonStyleOptions } from './Button';

export interface ButtonLinkProps extends ComponentProps<'a'>, ButtonStyleOptions {}

/** Renders a link that uses the same visual treatment as a button. */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <a className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}
