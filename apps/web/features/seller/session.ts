import { hasPermission } from '@sd/domain';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import { requireArea, type Viewer } from '../auth/session';

/** The store a seller account belongs to, with the permissions of its role. */
export interface SellerAccess {
  viewer: Viewer;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  memberRole: string;
  /** Vendor owners can change the store; staff can only read it. */
  canManage: boolean;
}

async function findAccess(viewer: Viewer): Promise<SellerAccess | null> {
  const membership = await getPrisma().member.findFirst({
    where: { userId: viewer.id },
    include: { organization: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: 'asc' },
  });

  if (!membership) return null;

  return {
    viewer,
    organizationId: membership.organization.id,
    organizationName: membership.organization.name,
    organizationSlug: membership.organization.slug,
    memberRole: membership.role,
    canManage: hasPermission(viewer.role, 'seller:manage') && membership.role === 'owner',
  };
}

/**
 * Guards a Seller Center page. Returns the access record, or null when the
 * signed-in seller account has no store yet; the page then shows the empty
 * state instead of failing.
 */
export async function requireSellerPage(
  nextPath: string,
): Promise<{ viewer: Viewer; access: SellerAccess | null }> {
  const { viewer } = await requireArea('seller', nextPath);
  return { viewer, access: await findAccess(viewer) };
}

/**
 * Guards a Seller Center write. Only a vendor owner with the manage permission
 * may continue; staff and visitors are redirected rather than silently ignored.
 */
export async function requireSellerAction(nextPath: string): Promise<SellerAccess> {
  const { viewer } = await requireArea('seller', nextPath);
  const access = await findAccess(viewer);
  if (!access || !access.canManage) redirect('/forbidden');
  return access;
}
