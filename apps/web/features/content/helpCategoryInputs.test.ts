import { describe, expect, it } from 'vitest';
import {
  helpCategoryMoveSchema,
  helpCategorySchema,
  helpCategorySnapshotSchema,
} from './helpCategoryInputs';
import { helpVoteSchema } from './helpVoteInputs';

const validCategory = {
  slug: 'delivery',
  nameEn: 'Delivery',
  nameBn: 'ডেলিভারি',
  descriptionEn: 'When parcels arrive and what to do when one is late.',
  descriptionBn: 'পার্সেল কখন পৌঁছায় এবং দেরি হলে কী করবেন।',
};

describe('helpCategorySchema', () => {
  it('accepts a category with descriptions', () => {
    expect(helpCategorySchema.safeParse(validCategory).success).toBe(true);
  });

  it('turns blank optional text into null', () => {
    const result = helpCategorySchema.parse({
      ...validCategory,
      descriptionEn: '  ',
      descriptionBn: null,
    });
    expect(result.descriptionEn).toBeNull();
    expect(result.descriptionBn).toBeNull();
  });

  it('rejects a slug with capitals or spaces', () => {
    expect(helpCategorySchema.safeParse({ ...validCategory, slug: 'My Category' }).success).toBe(
      false,
    );
  });

  it('rejects a slug shorter than two characters', () => {
    expect(helpCategorySchema.safeParse({ ...validCategory, slug: 'a' }).success).toBe(false);
  });

  it('requires an English name of at least two characters', () => {
    expect(helpCategorySchema.safeParse({ ...validCategory, nameEn: 'D' }).success).toBe(false);
  });

  it('rejects a description over 240 characters', () => {
    const long = 'a'.repeat(241);
    expect(helpCategorySchema.safeParse({ ...validCategory, descriptionEn: long }).success).toBe(
      false,
    );
  });
});

describe('helpCategoryMoveSchema', () => {
  it('accepts both directions', () => {
    expect(helpCategoryMoveSchema.safeParse({ id: 'cat-1', direction: 'up' }).success).toBe(true);
    expect(helpCategoryMoveSchema.safeParse({ id: 'cat-1', direction: 'down' }).success).toBe(true);
  });

  it('rejects an unknown direction', () => {
    expect(helpCategoryMoveSchema.safeParse({ id: 'cat-1', direction: 'left' }).success).toBe(
      false,
    );
  });
});

describe('helpCategorySnapshotSchema', () => {
  it('accepts a stored snapshot with null descriptions', () => {
    const result = helpCategorySnapshotSchema.safeParse({
      ...validCategory,
      descriptionEn: null,
      descriptionBn: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a snapshot missing the Bangla name', () => {
    const result = helpCategorySnapshotSchema.safeParse({
      ...validCategory,
      nameBn: undefined,
    });
    expect(result.success).toBe(false);
  });
});

describe('helpVoteSchema', () => {
  it('maps yes to a helpful vote', () => {
    const result = helpVoteSchema.parse({ entryId: 'entry-1', helpful: 'yes' });
    expect(result.helpful).toBe(true);
  });

  it('maps no to a not-helpful vote', () => {
    const result = helpVoteSchema.parse({ entryId: 'entry-1', helpful: 'no' });
    expect(result.helpful).toBe(false);
  });

  it('rejects an unknown answer', () => {
    expect(helpVoteSchema.safeParse({ entryId: 'entry-1', helpful: 'maybe' }).success).toBe(false);
  });

  it('rejects an empty entry id', () => {
    expect(helpVoteSchema.safeParse({ entryId: '  ', helpful: 'yes' }).success).toBe(false);
  });
});
