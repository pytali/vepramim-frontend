import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/onu/:path*',
        destination: '/:path*',
      },
    ]
  },
}

export default nextConfig
