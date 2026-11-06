import type { NextConfig } from 'next';
import { SECURITY_HEADERS } from './lib/securityHeaders';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sd/domain', '@sd/ui'],
  /* Security headers apply to every route, including static pages and API routes,
   * so the CSP and framing rules cannot be skipped by a new page. */
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS.map((header) => ({ ...header })) }];
  },
  /* Dynamic routes such as products stream their async metadata after the shell,
   * which places the title and meta description in the body. Matching every user
   * agent makes metadata blocking, so crawlers and Lighthouse find it in the head.
   * The product query behind generateMetadata is request-cached, so the page and
   * its metadata share one database read. */
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
};

export default nextConfig;
