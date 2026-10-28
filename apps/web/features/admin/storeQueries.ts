import { getPrisma } from '../../lib/prisma';

export interface AdminStoreRecord {
  id: string;
  name: string;
  slug: string;
  status: string;
  kycStatus: string;
  kycNote: string | null;
  kycSubmittedAt: Date | null;
  district: string | null;
  legalName: string | null;
  businessType: string | null;
  tradeLicense: string | null;
  payoutPhone: string | null;
  productCount: number;
  ownerName: string | null;
  createdAt: Date;
}

const statusOrder: Record<string, number> = { pending: 0, rejected: 1, approved: 2, suspended: 3 };

/** Every store with its KYC record, pending reviews first. */
export async function getAdminStores(): Promise<AdminStoreRecord[]> {
  const rows = await getPrisma().organization.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      kycStatus: true,
      kycNote: true,
      kycSubmittedAt: true,
      district: true,
      legalName: true,
      businessType: true,
      tradeLicense: true,
      payoutPhone: true,
      createdAt: true,
      _count: { select: { products: true } },
      members: {
        where: { role: 'owner' },
        take: 1,
        select: { user: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return rows
    .map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      status: row.status,
      kycStatus: row.kycStatus,
      kycNote: row.kycNote,
      kycSubmittedAt: row.kycSubmittedAt,
      district: row.district,
      legalName: row.legalName,
      businessType: row.businessType,
      tradeLicense: row.tradeLicense,
      payoutPhone: row.payoutPhone,
      productCount: row._count.products,
      ownerName: row.members[0]?.user.name ?? null,
      createdAt: row.createdAt,
    }))
    .sort((left, right) => {
      const byStatus = (statusOrder[left.status] ?? 9) - (statusOrder[right.status] ?? 9);
      return byStatus !== 0 ? byStatus : left.createdAt.getTime() - right.createdAt.getTime();
    });
}
