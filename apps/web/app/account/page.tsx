import type { Metadata } from 'next';
import { AccountPanel } from '../../features/account/components/AccountPanel';
import { requireArea } from '../../features/auth/session';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';
import { getPrisma } from '../../lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.account.title, description: copy.account.description };
}

/** Signed-in profile, role and store membership. */
export default async function AccountPage() {
  const { viewer } = await requireArea('account', '/account');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const prisma = getPrisma();

  const [profile, memberships] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: viewer.id } }),
    prisma.member.findMany({
      where: { userId: viewer.id },
      include: { organization: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  return (
    <AccountPanel
      viewer={viewer}
      profile={profile}
      memberships={memberships.map((membership) => ({
        name: membership.organization.name,
        slug: membership.organization.slug,
        memberRole: membership.role,
        joinedAt: membership.createdAt,
      }))}
      copy={copy}
      locale={locale}
    />
  );
}
