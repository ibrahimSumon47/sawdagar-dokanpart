import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button, buttonStyles } from './Button';

describe('Button', () => {
  it('defaults to a primary button with a non-submitting type', () => {
    const html = renderToStaticMarkup(<Button>Add to cart</Button>);

    expect(html).toContain('type="button"');
    expect(html).toContain('Add to cart');
    expect(html).toContain('bg-accent');
  });

  it('exposes the same classes to button-styled links', () => {
    expect(buttonStyles({ variant: 'secondary', size: 'sm' })).toContain('text-ink');
    expect(buttonStyles({ variant: 'secondary', size: 'sm' })).toContain('min-h-9');
  });
});
