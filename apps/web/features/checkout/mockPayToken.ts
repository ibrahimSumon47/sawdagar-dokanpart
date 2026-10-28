import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_TTL_MS = 30 * 60 * 1000;

/** Raised when the deployment has no secret to sign a demo payment token. */
export class PaymentConfigurationError extends Error {
  constructor() {
    super('BETTER_AUTH_SECRET is required to sign MockPay tokens.');
    this.name = 'PaymentConfigurationError';
  }
}

function paymentSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new PaymentConfigurationError();
  return secret;
}

function sign(paymentId: string, expiresAt: number): string {
  return createHmac('sha256', paymentSecret())
    .update(`${paymentId}.${expiresAt}`)
    .digest('base64url');
}

/** Creates a short-lived, signed token for the MockPay demo gateway. */
export function createMockPayToken(paymentId: string, now: number = Date.now()): string {
  const expiresAt = now + TOKEN_TTL_MS;
  return `${expiresAt}.${sign(paymentId, expiresAt)}`;
}

/**
 * Checks a MockPay token for the payment it names. The expiry is inside the
 * signed payload, so the gateway cannot extend a token by editing the URL.
 */
export function verifyMockPayToken(
  paymentId: string,
  token: string,
  now: number = Date.now(),
): boolean {
  const [expiresPart, signature] = token.split('.');
  if (!expiresPart || !signature) return false;

  const expiresAt = Number(expiresPart);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;

  const expected = Buffer.from(sign(paymentId, expiresAt));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
