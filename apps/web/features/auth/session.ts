import { hasArea, normalizeRole, type PlatformArea, type PlatformRole } from '@sd/domain';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth } from '../../lib/auth';

export type Viewer = {
  id: string;
  name: string;
  email: string;
  isDemo: boolean;
  role: PlatformRole;
  createdAt: Date;
};

/** True when both secrets needed to open a session are present. */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET);
}

/**
 * Returns the signed-in user or null. When the deployment has no database or
 * auth secret, pages render signed-out instead of failing at build or on load.
 */
export async function getViewer(): Promise<Viewer | null> {
  if (!isAuthConfigured()) return null;

  const result = await getAuth().api.getSession({ headers: await headers() });
  if (!result) return null;

  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    isDemo: Boolean(result.user.isDemo),
    role: normalizeRole(result.user.role),
    createdAt: result.user.createdAt,
  };
}

/** Redirects guests to sign in, preserving the page they asked for. */
export async function requireViewer(nextPath: string): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  return viewer;
}

/** Enforces one top-level area and returns the viewer with its parsed role. */
export async function requireArea(
  area: PlatformArea,
  nextPath: string,
): Promise<{ viewer: Viewer; role: PlatformRole }> {
  const viewer = await requireViewer(nextPath);
  if (!hasArea(viewer.role, area)) redirect('/forbidden');
  return { viewer, role: viewer.role };
}
