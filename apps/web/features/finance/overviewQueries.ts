import { PLATFORM_CASH, PLATFORM_COMMISSION_REVENUE, signedBalance } from '@sd/domain';
import { getPrisma } from '../../lib/prisma';
import { ledgerLines } from './ledgerRows';
import type { PayoutRecord } from './queries';

export interface FinanceOverview {
  cashMinor: number;
  commissionMinor: number;
  sellerPayableMinor: number;
  payouts: PayoutRecord[];
  refundable: {
    id: string;
    orderNumber: string;
    productTitleEn: string;
    productTitleBn: string;
    buyerName: string;
    amountMinor: number;
    approvedAt: Date;
  }[];
  refunds: {
    id: string;
    orderNumber: string;
    amountMinor: number;
    status: string;
    createdAt: Date;
  }[];
}

/** Platform-wide balances, the payout queue and approved returns to refund. */
export async function getFinanceOverview(): Promise<FinanceOverview> {
  const prisma = getPrisma();

  const [entries, payouts, refundable, refunds] = await Promise.all([
    prisma.ledgerEntry.findMany({
      select: { accountCode: true, direction: true, amountMinor: true },
    }),
    prisma.payout.findMany({
      orderBy: [{ status: 'asc' }, { requestedAt: 'asc' }],
      take: 50,
      include: { organization: { select: { name: true } } },
    }),
    prisma.returnRequest.findMany({
      where: { status: 'approved', refund: null },
      orderBy: { updatedAt: 'asc' },
      take: 50,
      include: {
        user: { select: { name: true } },
        orderItem: {
          select: {
            lineTotalMinor: true,
            titleEn: true,
            titleBn: true,
            subOrder: { select: { order: { select: { number: true } } } },
          },
        },
      },
    }),
    prisma.refund.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { order: { select: { number: true } } },
    }),
  ]);

  const sellerPayableMinor = entries
    .filter(
      (entry) => entry.accountCode.startsWith('seller:') && entry.accountCode.endsWith(':payable'),
    )
    .reduce(
      (total, entry) =>
        total - (entry.direction === 'debit' ? entry.amountMinor : -entry.amountMinor),
      0,
    );

  const lines = ledgerLines(entries);

  return {
    cashMinor: signedBalance(lines, PLATFORM_CASH),
    commissionMinor: -signedBalance(lines, PLATFORM_COMMISSION_REVENUE),
    sellerPayableMinor,
    payouts: payouts.map((payout) => ({
      id: payout.id,
      number: payout.number,
      amountMinor: payout.amountMinor,
      status: payout.status,
      requestedAt: payout.requestedAt,
      processedAt: payout.processedAt,
      note: payout.note,
      organizationName: payout.organization.name,
    })),
    refundable: refundable.map((request) => ({
      id: request.id,
      orderNumber: request.orderItem.subOrder.order.number,
      productTitleEn: request.orderItem.titleEn,
      productTitleBn: request.orderItem.titleBn,
      buyerName: request.user.name,
      amountMinor: request.orderItem.lineTotalMinor,
      approvedAt: request.updatedAt,
    })),
    refunds: refunds.map((refund) => ({
      id: refund.id,
      orderNumber: refund.order.number,
      amountMinor: refund.amountMinor,
      status: refund.status,
      createdAt: refund.createdAt,
    })),
  };
}
