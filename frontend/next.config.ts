import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://backend:8080/uploads/:path*',
      },
      {
        source: '/defaults/:path*',
        destination: 'http://backend:8080/defaults/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://backend:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
