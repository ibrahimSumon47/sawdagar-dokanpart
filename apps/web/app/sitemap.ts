import type { MetadataRoute } from 'next';
import { getPrisma } from '../lib/prisma';
import { site } from '../lib/site';

export const dynamic = 'force-dynamic';

/** Public routes that do not depend on a database row. */
const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${site.demoUrl}/`, changeFrequency: 'weekly', priority: 1 },
  { url: `${site.demoUrl}/catalog`, changeFrequency: 'daily', priority: 0.9 },
  { url: `${site.demoUrl}/help`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${site.demoUrl}/journal`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${site.demoUrl}/design`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${site.demoUrl}/cs-lab`, changeFrequency: 'monthly', priority: 0.4 },
  { url: `${site.demoUrl}/credits`, changeFrequency: 'yearly', priority: 0.2 },
];

/**
 * Every public page that search engines may index: the seeded catalog, active
 * stores, published Help and Journal entries and static pages. Private routes
 * are listed in `robots.ts` instead. A deployment without a database still
 * serves the static routes so the sitemap never fails the request.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.DATABASE_URL) return staticRoutes;

  const prisma = getPrisma();
  const [products, stores, entries] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'active' },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
      select: { slug: true, updatedAt: true },
    }),
    prisma.organization.findMany({
      where: { status: 'active' },
      orderBy: { updatedAt: 'desc' },
      take: 500,
      select: { slug: true, updatedAt: true },
    }),
    prisma.cmsEntry.findMany({
      where: {
        OR: [{ status: 'published' }, { status: 'scheduled', publishAt: { lte: new Date() } }],
      },
      orderBy: { publishAt: 'desc' },
      take: 500,
      select: { kind: true, slug: true, updatedAt: true },
    }),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${site.demoUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const storeRoutes: MetadataRoute.Sitemap = stores.map((store) => ({
    url: `${site.demoUrl}/store/${store.slug}`,
    lastModified: store.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  const contentRoutes: MetadataRoute.Sitemap = entries.flatMap((entry) => {
    if (entry.kind === 'journal') {
      return [
        {
          url: `${site.demoUrl}/journal/${entry.slug}`,
          lastModified: entry.updatedAt,
          priority: 0.5,
        },
      ];
    }
    if (entry.kind === 'help') {
      return [
        { url: `${site.demoUrl}/help/${entry.slug}`, lastModified: entry.updatedAt, priority: 0.5 },
      ];
    }
    if (entry.kind === 'page') {
      return [
        {
          url: `${site.demoUrl}/pages/${entry.slug}`,
          lastModified: entry.updatedAt,
          priority: 0.3,
        },
      ];
    }
    return [];
  });

  return [...staticRoutes, ...productRoutes, ...storeRoutes, ...contentRoutes];
}
