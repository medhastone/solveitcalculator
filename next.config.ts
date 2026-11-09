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
      // Duplicate Static Route Consolidations (301/308 Permanent Redirects)
      {
        source: '/percentage-calculator',
        destination: '/math/percentage-calculator',
        permanent: true,
      },
      {
        source: '/flooring-calculator',
        destination: '/home-construction/flooring-calculator',
        permanent: true,
      },
      {
        source: '/all-calculators',
        destination: '/calculators',
        permanent: true,
      },
      {
        source: '/unit-conversion',
        destination: '/conversions',
        permanent: true,
      },
      {
        source: '/unit-converter',
        destination: '/conversions/length',
        permanent: true,
      },
      {
        source: '/recipe-converters',
        destination: '/recipe-converter',
        permanent: true,
      },
      {
        source: '/privacy-and-accessibility',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/math-guides/percentages',
        destination: '/guides/how-to-calculate-a-percentage',
        permanent: true,
      },
      {
        source: '/salary-tax-calculator',
        destination: '/finance/take-home-pay-calculator',
        permanent: true,
      },
      {
        source: '/articles',
        destination: '/guides',
        permanent: true,
      },
      // Duplicate Dynamic Slug Consolidations
      {
        source: '/math/gcf-lcm-calculator',
        destination: '/math/gcd-and-lcm-calculator',
        permanent: true,
      },
      {
        source: '/math/exponent-root-calculator',
        destination: '/math/exponent-calculator',
        permanent: true,
      },
      {
        source: '/math/quadratic-equation-solver',
        destination: '/math/quadratic-equation-calculator',
        permanent: true,
      },
      {
        source: '/finance/margin-and-markup-calculator',
        destination: '/finance/margin-calculator',
        permanent: true,
      },
      // Legacy & Alias Route Redirects
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
      {
        source: '/finance/mortgage-calculator',
        destination: '/mortgage-calculator',
        permanent: true,
      },
      {
        source: '/finance/compound-interest',
        destination: '/compound-interest-calculator',
        permanent: true,
      },
      {
        source: '/finance/sip-calculator',
        destination: '/compound-interest-calculator',
        permanent: true,
      },
      {
        source: '/finance/roi-calculator',
        destination: '/finance/investment-growth-calculator',
        permanent: true,
      },
      {
        source: '/finance/cagr-calculator',
        destination: '/finance/investment-growth-calculator',
        permanent: true,
      },
      {
        source: '/finance/savings-goal-calculator',
        destination: '/compound-interest-calculator',
        permanent: true,
      },
      {
        source: '/finance/inflation-calculator',
        destination: '/finance/real-rate-of-return-calculator',
        permanent: true,
      },
      {
        source: '/freelance-hourly-rate-calculator',
        destination: '/finance/salary-to-hourly-calculator',
        permanent: true,
      },
      {
        source: '/work-hours-payroll-calculator',
        destination: '/time-duration-calculator',
        permanent: true,
      },
      {
        source: '/math/order-of-operations-calculator',
        destination: '/math/scientific-calculator',
        permanent: true,
      },
      {
        source: '/math/percentage-difference-calculator',
        destination: '/math/percentage-change-calculator',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
