import type { NextConfig } from 'next';

// Base path is set when deploying to GitHub Pages under a project repo
// (https://<user>.github.io/<repo>/). Set NEXT_PUBLIC_BASE_PATH='/arm-hub' in
// CI for that mode. Leave unset for custom-domain deployments such as
// https://armhub.dev/, where the site is served from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { typedRoutes: false },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  poweredByHeader: false,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
