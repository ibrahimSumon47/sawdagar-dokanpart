import type { MetadataRoute } from 'next';
import { site } from '../lib/site';

/** Keep private, transactional and account routes out of search indexes. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account',
        '/admin',
        '/seller',
        '/checkout',
        '/orders',
        '/wishlist',
        '/compare',
        '/sign-in',
        '/api/',
      ],
    },
    sitemap: `${site.demoUrl}/sitemap.xml`,
    host: site.demoUrl,
  };
}
