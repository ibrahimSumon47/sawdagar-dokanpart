import { describe, expect, it } from 'vitest';
import { questionSchema } from './inputs';

const base = {
  productId: 'prd_brass-plate-antique',
  body: 'Does the small size work as a serving plate for rice?',
};

describe('questionSchema', () => {
  it('accepts a seeded product id and a normal question', () => {
    expect(questionSchema.safeParse(base).success).toBe(true);
  });

  it('rejects questions outside ten to four hundred characters', () => {
    expect(questionSchema.safeParse({ ...base, body: 'Too short' }).success).toBe(false);
    expect(questionSchema.safeParse({ ...base, body: 'a'.repeat(401) }).success).toBe(false);
  });

  it('requires a product id', () => {
    expect(questionSchema.safeParse({ ...base, productId: '' }).success).toBe(false);
  });
});
