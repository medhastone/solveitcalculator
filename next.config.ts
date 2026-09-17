import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|ttf|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/health',
        destination: '/health-fitness-calculators',
        permanent: true,
      },
      {
        source: '/health/:slug*',
        destination: '/health-fitness-calculators/:slug*',
        permanent: true,
      },
      {
        source: '/electrical',
        destination: '/electrical-calculators-sizing-tools',
        permanent: true,
      },
      {
        source: '/electrical/:slug*',
        destination: '/electrical-calculators-sizing-tools/:slug*',
        permanent: true,
      },
      {
        source: '/electrical-tools',
        destination: '/electrical-calculators-sizing-tools',
        permanent: true,
      },
      {
        source: '/electrical-tools/:slug*',
        destination: '/electrical-calculators-sizing-tools/:slug*',
        permanent: true,
      },
      {
        source: '/automotive',
        destination: '/automotive-calculators-estimators',
        permanent: true,
      },
      {
        source: '/automotive/:slug*',
        destination: '/automotive-calculators-estimators/:slug*',
        permanent: true,
      },
      {
        source: '/automotive-tools',
        destination: '/automotive-calculators-estimators',
        permanent: true,
      },
      {
        source: '/automotive-tools/:slug*',
        destination: '/automotive-calculators-estimators/:slug*',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
