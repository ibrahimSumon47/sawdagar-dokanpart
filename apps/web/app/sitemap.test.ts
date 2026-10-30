import { afterEach, describe, expect, it, vi } from 'vitest';
import sitemap from './sitemap';

const queries = vi.hoisted(() => ({
  product: vi.fn(),
  organization: vi.fn(),
  cmsEntry: vi.fn(),
}));

vi.mock('../lib/prisma', () => ({
  getPrisma: () => ({
    product: { findMany: queries.product },
    organization: { findMany: queries.organization },
    cmsEntry: { findMany: queries.cmsEntry },
  }),
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('sitemap', () => {
  it('lists only stores that meet the public store approval and KYC criteria', async () => {
    vi.stubEnv('DATABASE_URL', 'configured');
    queries.product.mockResolvedValue([]);
    queries.organization.mockResolvedValue([{ slug: 'approved-store', updatedAt: new Date(0) }]);
    queries.cmsEntry.mockResolvedValue([]);

    const routes = await sitemap();

    expect(queries.organization).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'approved', kycStatus: 'approved' } }),
    );
    expect(routes.some((route) => route.url.endsWith('/store/approved-store'))).toBe(true);
  });

  it('returns static routes without querying when the database is not configured', async () => {
    vi.stubEnv('DATABASE_URL', '');

    const routes = await sitemap();

    expect(routes.some((route) => route.url.endsWith('/catalog'))).toBe(true);
    expect(queries.organization).not.toHaveBeenCalled();
  });
});
