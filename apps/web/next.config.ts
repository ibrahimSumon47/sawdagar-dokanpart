import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sd/domain', '@sd/ui'],
};

export default nextConfig;
