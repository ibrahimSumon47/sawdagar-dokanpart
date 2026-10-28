import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { QuantityStepper } from './QuantityStepper';

const labels = { decrease: 'Decrease quantity', increase: 'Increase quantity' };

function buttons(html: string): string[] {
  return [...html.matchAll(/<button[^>]*>/g)].map((match) => match[0]);
}

/** Matches the disabled attribute without matching the `disabled:` classes. */
function isDisabled(tag: string): boolean {
  return /\sdisabled(=""|(?=[\s>]))/.test(tag);
}

describe('QuantityStepper', () => {
  it('labels the control and both buttons', () => {
    const html = renderToStaticMarkup(
      <QuantityStepper value={2} onChange={() => {}} label="Quantity" labels={labels} />,
    );

    expect(html).toContain('aria-label="Quantity"');
    expect(html).toContain('aria-label="Decrease quantity"');
    expect(html).toContain('aria-label="Increase quantity"');
    expect(html).toContain('>2</output>');
  });

  it('disables decreasing at the minimum and increasing at the maximum', () => {
    const atMinimum = renderToStaticMarkup(
      <QuantityStepper value={1} onChange={() => {}} label="Quantity" labels={labels} />,
    );
    const atMaximum = renderToStaticMarkup(
      <QuantityStepper value={99} onChange={() => {}} label="Quantity" labels={labels} />,
    );

    const minimumButtons = buttons(atMinimum);
    const maximumButtons = buttons(atMaximum);

    expect(isDisabled(minimumButtons[0]!)).toBe(true);
    expect(isDisabled(minimumButtons[1]!)).toBe(false);
    expect(isDisabled(maximumButtons[0]!)).toBe(false);
    expect(isDisabled(maximumButtons[1]!)).toBe(true);
  });
});
