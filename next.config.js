/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build identifier to force new chunk hashes when CDN caches stale 404s
  generateBuildId: async () => `build-${Date.now()}`,
  images: {
    domains: ['leanscale.team'],
  },
  async redirects() {
    return [
      // Section renames: why-leanscale → about
      { source: '/why-leanscale/:path*', destination: '/about/:path*', permanent: true },
      // Section renames: try-leanscale → diagnostic (specific routes first)
      { source: '/try-leanscale/diagnostic', destination: '/diagnostic/gtm', permanent: true },
      { source: '/try-leanscale/clay-diagnostic', destination: '/diagnostic/clay', permanent: true },
      { source: '/try-leanscale/cpq-diagnostic', destination: '/diagnostic/cpq', permanent: true },
      { source: '/try-leanscale/:path*', destination: '/diagnostic/:path*', permanent: true },
      // Section renames: buy-leanscale → getting-started (specific routes first)
      { source: '/buy-leanscale/availability', destination: '/getting-started/availability', permanent: true },
      { source: '/buy-leanscale/one-time-projects', destination: '/getting-started/one-time-projects', permanent: true },
      { source: '/buy-leanscale/investor-perks', destination: '/getting-started/investor-perks', permanent: true },
      { source: '/buy-leanscale/security', destination: '/getting-started/security', permanent: true },
      { source: '/buy-leanscale/team', destination: '/getting-started/team', permanent: true },
      { source: '/buy-leanscale/clay-intake', destination: '/getting-started/clay-intake', permanent: true },
      { source: '/buy-leanscale/clay', destination: '/getting-started/clay', permanent: true },
      // Removed pages → homepage
      { source: '/buy-leanscale/:path*', destination: '/', permanent: true },
      { source: '/dashboard', destination: '/', permanent: true },
      { source: '/sow/:path*', destination: '/', permanent: true },
      { source: '/sow', destination: '/', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
