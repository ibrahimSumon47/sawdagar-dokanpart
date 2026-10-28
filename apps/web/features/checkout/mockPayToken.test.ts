import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createMockPayToken, verifyMockPayToken } from './mockPayToken';

const previousSecret = process.env.BETTER_AUTH_SECRET;

beforeAll(() => {
  process.env.BETTER_AUTH_SECRET = 'test-secret-for-mockpay-only';
});

afterAll(() => {
  if (previousSecret === undefined) delete process.env.BETTER_AUTH_SECRET;
  else process.env.BETTER_AUTH_SECRET = previousSecret;
});

describe('MockPay tokens', () => {
  const paymentId = 'payment-7f3a9c';
  const issuedAt = 1_700_000_000_000;

  it('accepts a fresh token for the same payment', () => {
    const token = createMockPayToken(paymentId, issuedAt);
    expect(verifyMockPayToken(paymentId, token, issuedAt + 1_000)).toBe(true);
  });

  it('rejects a token for another payment, a tampered signature and an expiry', () => {
    const token = createMockPayToken(paymentId, issuedAt);
    expect(verifyMockPayToken('payment-other', token, issuedAt + 1_000)).toBe(false);
    expect(verifyMockPayToken(paymentId, `${token}x`, issuedAt + 1_000)).toBe(false);
    expect(verifyMockPayToken(paymentId, token, issuedAt + 31 * 60 * 1000)).toBe(false);
  });

  it('rejects malformed tokens without throwing', () => {
    expect(verifyMockPayToken(paymentId, 'not-a-token', issuedAt)).toBe(false);
    expect(verifyMockPayToken(paymentId, '', issuedAt)).toBe(false);
  });
});
