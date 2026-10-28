import { availableForPayout, sellerNetFor, sellerPayableAccount, signedBalance } from '@sd/domain';
import { getPrisma } from '../../lib/prisma';
import { ledgerLines } from './ledgerRows';

export interface PayoutRecord {
  id: string;
  number: string;
  amountMinor: number;
  status: string;
  requestedAt: Date;
  processedAt: Date | null;
  note: string | null;
  organizationName?: string;
}

export interface StatementRow {
  id: string;
  number: string;
  orderNumber: string;
  deliveredAt: Date | null;
  goodsMinor: number;
  shippingMinor: number;
  commissionMinor: number;
  netMinor: number;
}

export interface RefundRecord {
  id: string;
  orderNumber: string;
  amountMinor: number;
  commissionMinor: number;
  createdAt: Date;
}

export interface SellerFinance {
  commissionRateBps: number;
  availableMinor: number;
  outstandingMinor: number;
  paidOutMinor: number;
  statement: StatementRow[];
  payouts: PayoutRecord[];
  refunds: RefundRecord[];
}

/** A store's payable balance, pending withdrawals and recent delivered lines. */
export async function getSellerFinance(organizationId: string): Promise<SellerFinance> {
  const prisma = getPrisma();
  const payable = sellerPayableAccount(organizationId);

  const [organization, entries, payouts, delivered, refunds] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { commissionRateBps: true },
    }),
    prisma.ledgerEntry.findMany({
      where: { accountCode: payable },
      select: { accountCode: true, direction: true, amountMinor: true },
    }),
    prisma.payout.findMany({
      where: { organizationId },
      orderBy: { requestedAt: 'desc' },
      take: 50,
    }),
    prisma.subOrder.findMany({
      where: { organizationId, status: 'delivered' },
      orderBy: { deliveredAt: 'desc' },
      take: 25,
      include: { order: { select: { number: true } } },
    }),
    prisma.refund.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { order: { select: { number: true } } },
    }),
  ]);

  const rateBps = organization?.commissionRateBps ?? 800;
  const outstandingMinor = payouts
    .filter((payout) => payout.status === 'requested' || payout.status === 'approved')
    .reduce((total, payout) => total + payout.amountMinor, 0);
  const availableMinor = availableForPayout(
    signedBalance(ledgerLines(entries), payable),
    outstandingMinor,
  );
  const paidOutMinor = payouts
    .filter((payout) => payout.status === 'paid')
    .reduce((total, payout) => total + payout.amountMinor, 0);

  return {
    commissionRateBps: rateBps,
    availableMinor,
    outstandingMinor,
    paidOutMinor,
    statement: delivered.map((subOrder) => {
      const goodsMinor = Math.max(0, subOrder.subtotalMinor - subOrder.discountMinor);
      const { commissionMinor, netMinor } = sellerNetFor(
        subOrder.subtotalMinor,
        subOrder.discountMinor,
        subOrder.shippingMinor,
        rateBps,
      );
      return {
        id: subOrder.id,
        number: subOrder.number,
        orderNumber: subOrder.order.number,
        deliveredAt: subOrder.deliveredAt,
        goodsMinor,
        shippingMinor: subOrder.shippingMinor,
        commissionMinor,
        netMinor,
      };
    }),
    payouts: payouts.map((payout) => ({
      id: payout.id,
      number: payout.number,
      amountMinor: payout.amountMinor,
      status: payout.status,
      requestedAt: payout.requestedAt,
      processedAt: payout.processedAt,
      note: payout.note,
    })),
    refunds: refunds.map((refund) => ({
      id: refund.id,
      orderNumber: refund.order.number,
      amountMinor: refund.amountMinor,
      commissionMinor: refund.commissionMinor,
      createdAt: refund.createdAt,
    })),
  };
}
