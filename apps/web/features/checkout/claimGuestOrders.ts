import { normalizeBdPhone } from '@sd/domain';
import { getPrisma } from '../../lib/prisma';

/** The verified identity of a newly verified account, as Better Auth reports it. */
export interface VerifiedIdentity {
  id: string;
  email: string;
  phone?: string | null;
}

/**
 * Attaches earlier guest orders to an account once its email is verified.
 *
 * A guest order matches when its guest email equals the account email, or its
 * guest phone equals the account phone. Phones are compared in normalized
 * (+880...) form because checkout stores whatever the buyer typed. Only orders
 * with no user are touched, so an order already owned by someone else is never
 * reassigned. Returns the number of orders claimed.
 */
export async function claimGuestOrders(identity: VerifiedIdentity): Promise<number> {
  const phone = identity.phone ? normalizeBdPhone(identity.phone) : null;
  const phoneVariants = phone ? [phone, phone.replace(/^\+880/, '0')] : [];
  const email = identity.email.trim().toLowerCase();

  const result = await getPrisma().order.updateMany({
    where: {
      userId: null,
      OR: [
        { guestEmail: email },
        ...(phoneVariants.length > 0 ? [{ guestPhone: { in: phoneVariants } }] : []),
      ],
    },
    data: { userId: identity.id },
  });

  return result.count;
}
