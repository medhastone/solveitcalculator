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
      {
        source: '/math/mean-median-mode-calculator',
        destination: '/math/average-calculator',
        permanent: true,
      },
      {
        source: '/math/proportion-calculator',
        destination: '/math/ratio-calculator',
        permanent: true,
      },
      {
        source: '/math/lcm-gcd-calculator',
        destination: '/math/gcd-and-lcm-calculator',
        permanent: true,
      },
      {
        source: '/math/linear-equation-solver',
        destination: '/math/equation-solver',
        permanent: true,
      },
      {
        source: '/math/rounding-calculator',
        destination: '/math/average-calculator',
        permanent: true,
      },
      {
        source: '/math/decimal-to-fraction-calculator',
        destination: '/math/fraction-to-decimal-calculator',
        permanent: true,
      },
      // Old Site Version -> New Canonical URLs (301/308 Permanent, Zero Redirect Chains)
      {
        source: '/time-date',
        destination: '/date-time',
        permanent: true,
      },
      {
        source: '/time-date/age-calculator',
        destination: '/age-calculator',
        permanent: true,
      },
      {
        source: '/time-date/pet-age-converter',
        destination: '/age-calculator',
        permanent: true,
      },
      {
        source: '/time-date/date-difference',
        destination: '/date-difference-calculator',
        permanent: true,
      },
      {
        source: '/time-date/days-between-dates',
        destination: '/date-difference-calculator',
        permanent: true,
      },
      {
        source: '/time-date/days-from-today',
        destination: '/days-from-today-calculator',
        permanent: true,
      },
      {
        source: '/time-date/add-subtract-days',
        destination: '/days-from-today-calculator',
        permanent: true,
      },
      {
        source: '/time-date/business-days',
        destination: '/business-days-calculator',
        permanent: true,
      },
      {
        source: '/time-date/business-days-calculator',
        destination: '/business-days-calculator',
        permanent: true,
      },
      {
        source: '/time-date/leap-year-calculator',
        destination: '/date-difference-calculator',
        permanent: true,
      },
      {
        source: '/time-date/julian-day-calculator',
        destination: '/date-difference-calculator',
        permanent: true,
      },
      {
        source: '/time-date/countdown-timer',
        destination: '/countdown-calculator',
        permanent: true,
      },
      {
        source: '/time-date/event-countdown',
        destination: '/countdown-calculator',
        permanent: true,
      },
      {
        source: '/time-date/retirement-countdown',
        destination: '/countdown-calculator',
        permanent: true,
      },
      {
        source: '/time-date/work-hours',
        destination: '/work-hours-calculator',
        permanent: true,
      },
      {
        source: '/time-date/add-subtract-time',
        destination: '/time-duration-calculator',
        permanent: true,
      },
      {
        source: '/time-date/add-subtract-time-calculator',
        destination: '/time-duration-calculator',
        permanent: true,
      },
      {
        source: '/time-date/focus-and-break-timers',
        destination: '/timer-stopwatch',
        permanent: true,
      },
      {
        source: '/time-date/timer',
        destination: '/timer-stopwatch',
        permanent: true,
      },
      {
        source: '/time-date/stopwatch',
        destination: '/timer-stopwatch',
        permanent: true,
      },
      {
        source: '/time-date/90-minute-ultradian-rhythm-planner',
        destination: '/timer-stopwatch',
        permanent: true,
      },
      {
        source: '/time-date/running-pace-calculator',
        destination: '/time-duration-calculator',
        permanent: true,
      },
      {
        source: '/time-date/military-time-converter',
        destination: '/military-time-converter',
        permanent: true,
      },
      {
        source: '/time-date/time-converter',
        destination: '/time-unit-converter',
        permanent: true,
      },
      {
        source: '/time-date/unix-timestamp-converter',
        destination: '/date-time',
        permanent: true,
      },
      {
        source: '/time-date/time-zone-converter',
        destination: '/date-time',
        permanent: true,
      },
      {
        source: '/time-date/world-clock-grid',
        destination: '/date-time',
        permanent: true,
      },
      {
        source: '/time-date/:slug*',
        destination: '/date-time',
        permanent: true,
      },
      {
        source: '/health-fitness-calculators',
        destination: '/health-fitness',
        permanent: true,
      },
      {
        source: '/health-fitness/bmi-calculator',
        destination: '/bmi-calculator',
        permanent: true,
      },
      {
        source: '/health-fitness/tdee',
        destination: '/tdee-calculator',
        permanent: true,
      },
      {
        source: '/health-fitness-calculators/tdee-calculator',
        destination: '/tdee-calculator',
        permanent: true,
      },
      {
        source: '/health-fitness/bmr',
        destination: '/bmr-calculator',
        permanent: true,
      },
      {
        source: '/health-fitness-calculators/bmr-calculator',
        destination: '/bmr-calculator',
        permanent: true,
      },
      {
        source: '/health-fitness/body-fat',
        destination: '/body-fat-calculator',
        permanent: true,
      },
      {
        source: '/health-fitness-calculators/body-fat-calculator',
        destination: '/body-fat-calculator',
        permanent: true,
      },
      {
        source: '/health-fitness/ideal-body-weight',
        destination: '/ideal-weight-calculator',
        permanent: true,
      },
      {
        source: '/health-fitness-calculators/ideal-weight-calculator',
        destination: '/ideal-weight-calculator',
        permanent: true,
      },
      {
        source: '/health-fitness/target-heart-rate',
        destination: '/tdee-calculator',
        permanent: true,
      },
      {
        source: '/health-fitness-calculators/:slug*',
        destination: '/bmi-calculator',
        permanent: true,
      },
      {
        source: '/conversions/mass',
        destination: '/conversions/weight',
        permanent: true,
      },
      {
        source: '/conversions/fuel_economy',
        destination: '/conversions/fuel-economy',
        permanent: true,
      },
      {
        source: '/conversions/data-storage',
        destination: '/conversions/digital',
        permanent: true,
      },
      {
        source: '/conversions/grams-to-tablespoons',
        destination: '/conversions/cooking',
        permanent: true,
      },
      {
        source: '/conversions/pressure',
        destination: '/conversions',
        permanent: true,
      },
      {
        source: '/conversions/power',
        destination: '/conversions/energy',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms-of-use',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/finance/hourly-to-salary-calculator',
        destination: '/finance/salary-to-hourly-calculator',
        permanent: true,
      },
      {
        source: '/finance/overtime-calculator',
        destination: '/finance/overtime-pay-calculator',
        permanent: true,
      },
      {
        source: '/finance/uk-salary-tax-calculator',
        destination: '/finance/uk-paye-calculator',
        permanent: true,
      },
      {
        source: '/finance/canada-salary-tax-calculator',
        destination: '/finance/canada-income-tax-calculator',
        permanent: true,
      },
      {
        source: '/finance/australia-salary-tax-calculator',
        destination: '/salary-calculator',
        permanent: true,
      },
      {
        source: '/finance/salary-After-Tax-Comparison-Calculator',
        destination: '/salary-calculator',
        permanent: true,
      },
      {
        source: '/finance/fire-calculator',
        destination: '/fire-forecaster',
        permanent: true,
      },
      {
        source: '/finance/fire-forecaster',
        destination: '/fire-forecaster',
        permanent: true,
      },
      {
        source: '/finance/npv-calculator',
        destination: '/finance/investment-growth-calculator',
        permanent: true,
      },
      {
        source: '/finance/discount-calculator',
        destination: '/math/discount-calculator',
        permanent: true,
      },
      {
        source: '/science/kinematics-calculator',
        destination: '/science/force-calculator',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
