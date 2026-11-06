import { describe, expect, it } from 'vitest';
import { formatOrderCode, isOrderCode, orderCodeAlphabet } from './orderCode';

describe('guest order codes', () => {
  it('formats the UTC day as YYMMDD followed by four characters', () => {
    const code = formatOrderCode(new Date('2026-11-05T23:30:00.000Z'), () => 'K');
    expect(code).toBe('SD-261105-KKKK');
  });

  it('draws each random character from the unambiguous alphabet', () => {
    const drawn: string[] = [];
    const code = formatOrderCode(new Date('2026-01-02T00:00:00.000Z'), () => {
      const char = orderCodeAlphabet.charAt(drawn.length);
      drawn.push(char);
      return char;
    });
    expect(code).toBe(`SD-260102-${orderCodeAlphabet.slice(0, 4)}`);
    expect(drawn).toHaveLength(4);
  });

  it('never uses a look-alike character', () => {
    for (const char of ['0', 'O', '1', 'I', 'L']) {
      expect(orderCodeAlphabet).not.toContain(char);
    }
  });

  it('accepts a generated code and rejects anything else', () => {
    expect(isOrderCode('SD-261105-K7QM')).toBe(true);
    expect(isOrderCode('SD-261105-K7Q0')).toBe(false);
    expect(isOrderCode('SD-20261105-K7QM')).toBe(false);
    expect(isOrderCode('sd-261105-K7QM')).toBe(false);
  });
});
