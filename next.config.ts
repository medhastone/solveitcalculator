import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  async redirects() {
    return [
      {
        source: '/length-converter',
        destination: '/conversions/length',
        permanent: true,
      },
      {
        source: '/weight-converter',
        destination: '/conversions/weight',
        permanent: true,
      },
      {
        source: '/temperature-converter',
        destination: '/conversions/temperature',
        permanent: true,
      },
      {
        source: '/volume-converter',
        destination: '/conversions/volume',
        permanent: true,
      },
      {
        source: '/cooking-converter',
        destination: '/conversions/cooking',
        permanent: true,
      },
      {
        source: '/area-converter',
        destination: '/conversions/area',
        permanent: true,
      },
      {
        source: '/speed-converter',
        destination: '/conversions/speed',
        permanent: true,
      },
      {
        source: '/conversions/weight-mass',
        destination: '/conversions/weight',
        permanent: true,
      },
      {
        source: '/conversions/volume-capacity',
        destination: '/conversions/volume',
        permanent: true,
      },
      {
        source: '/conversions/data',
        destination: '/conversions/digital',
        permanent: true,
      },
      {
        source: '/cooking/ingredient-converter',
        destination: '/recipe-converter',
        permanent: true,
      },
      {
        source: '/conversions/mass-volume/milk-weight-calculator',
        destination: '/recipe-converter',
        permanent: true,
      },
      {
        source: '/conversions/area/linear-feet-to-square-feet',
        destination: '/conversions/area',
        permanent: true,
      },
      {
        source: '/construction/concrete-calculator',
        destination: '/construction-project-calculator',
        permanent: true,
      },
      {
        source: '/construction/flooring-calculator',
        destination: '/home-construction/flooring-calculator',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
