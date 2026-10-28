import { PLATFORM_COMMISSION_REVENUE, signedBalance } from '@sd/domain';
import { getPrisma } from '../../lib/prisma';
import { ledgerLines } from '../finance/ledgerRows';

export interface PlatformAnalytics {
  gmvMinor: number;
  deliveredMinor: number;
  commissionMinor: number;
  refundedMinor: number;
  orderCount: number;
  activeVendors: number;
  pendingVendors: number;
  buyerCount: number;
  activeProducts: number;
  publishedReviews: number;
  openReturns: number;
}

/** Marketplace totals computed from orders, ledger entries and queues. */
export async function getPlatformAnalytics(): Promise<PlatformAnalytics> {
  const prisma = getPrisma();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    gmv,
    delivered,
    commissionEntries,
    refunded,
    orderCount,
    activeVendors,
    pendingVendors,
    buyerCount,
    activeProducts,
    publishedReviews,
    openReturns,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { status: { not: 'cancelled' } }, _sum: { totalMinor: true } }),
    prisma.subOrder.aggregate({
      where: { status: 'delivered', deliveredAt: { gte: since } },
      _sum: { totalMinor: true },
    }),
    prisma.ledgerEntry.findMany({
      where: { accountCode: PLATFORM_COMMISSION_REVENUE },
      select: { accountCode: true, direction: true, amountMinor: true },
    }),
    prisma.refund.aggregate({ _sum: { amountMinor: true } }),
    prisma.order.count({ where: { status: { not: 'cancelled' } } }),
    prisma.organization.count({ where: { status: 'approved' } }),
    prisma.organization.count({
      where: { OR: [{ status: 'pending' }, { kycStatus: 'pending' }] },
    }),
    prisma.user.count({ where: { role: 'buyer' } }),
    prisma.product.count({ where: { status: 'active' } }),
    prisma.review.count({ where: { status: 'published' } }),
    prisma.returnRequest.count({ where: { status: { in: ['requested', 'approved'] } } }),
  ]);

  return {
    gmvMinor: gmv._sum.totalMinor ?? 0,
    deliveredMinor: delivered._sum.totalMinor ?? 0,
    commissionMinor: -signedBalance(ledgerLines(commissionEntries), PLATFORM_COMMISSION_REVENUE),
    refundedMinor: refunded._sum.amountMinor ?? 0,
    orderCount,
    activeVendors,
    pendingVendors,
    buyerCount,
    activeProducts,
    publishedReviews,
    openReturns,
  };
}
