import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd()),
      '@/components': path.resolve(process.cwd(), 'components'),
      '@/lib': path.resolve(process.cwd(), 'lib'),
    };
    return config;
  },
};

export default nextConfig;
