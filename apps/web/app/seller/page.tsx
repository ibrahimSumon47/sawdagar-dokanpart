import type { Metadata } from 'next';
import { requireArea } from '../../features/auth/session';
import { SellerEmpty } from '../../features/seller/components/SellerEmpty';
import { SellerPanel } from '../../features/seller/components/SellerPanel';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';
import { getPrisma } from '../../lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.title, description: copy.seller.description };
}

/** Vendor store summary, guarded to vendor owners and staff. */
export default async function SellerPage() {
  const { viewer } = await requireArea('seller', '/seller');
  const locale = await getLocale();
  const copy = getDictionary(locale);

  const membership = await getPrisma().member.findFirst({
    where: { userId: viewer.id },
    include: {
      organization: {
        include: {
          members: { include: { user: true }, orderBy: { createdAt: 'asc' } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (!membership) return <SellerEmpty copy={copy.seller} />;

  return (
    <SellerPanel
      membership={{
        organization: {
          name: membership.organization.name,
          slug: membership.organization.slug,
        },
        memberRole: membership.role,
        joinedAt: membership.createdAt,
        members: membership.organization.members.map((member) => ({
          id: member.id,
          name: member.user.name,
          email: member.user.email,
          role: member.role,
          createdAt: member.createdAt,
        })),
      }}
      copy={copy}
      locale={locale}
    />
  );
}
