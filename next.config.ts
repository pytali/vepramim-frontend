/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/onu',
  async rewrites() {
    return [
      {
        source: '/onu/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
