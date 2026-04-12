import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://backend:80/uploads/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://backend:80/api/:path*',
      },
    ];
  },
};

export default nextConfig;
