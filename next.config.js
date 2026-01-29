/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build identifier to force new chunk hashes when CDN caches stale 404s
  generateBuildId: async () => `build-${Date.now()}`,
  images: {
    domains: ['leanscale.team'],
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
