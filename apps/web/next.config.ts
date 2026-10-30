import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sd/domain', '@sd/ui'],
  /* Dynamic routes such as products stream their async metadata after the shell,
   * which places the title and meta description in the body. Matching every user
   * agent makes metadata blocking, so crawlers and Lighthouse find it in the head.
   * The product query behind generateMetadata is request-cached, so the page and
   * its metadata share one database read. */
  htmlLimitedBots: /.*/,
};

export default nextConfig;
