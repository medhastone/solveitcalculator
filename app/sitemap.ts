import type { MetadataRoute } from 'next';
import { UNIFIED_SEARCH_INDEX, CATEGORY_HUB_LINKS } from '@/lib/searchIndex';
import { MATH_CALCULATORS } from '@/lib/mathCalculatorsData';
import { GUIDES_DATA } from '@/lib/guidesData';

const BASE_URL = 'https://solveitcalculator.com';

const CORE_STATIC_ROUTES = [
  '/',
  '/calculators',
  '/calculation-workspace',
  '/construction-project-calculator',
  '/home-construction/flooring-calculator',
  '/recipe-converter',
  '/salary-calculator',
  '/fire-forecaster',
  '/mortgage-calculator',
  '/loan-calculator',
  '/compound-interest-calculator',
  '/bmi-calculator',
  '/age-calculator',
  '/date-difference-calculator',
  '/time-duration-calculator',
  '/about',
  '/calculation-methodology',
  '/accessibility',
  '/privacy-policy',
  '/terms-of-service',
  '/contact',
  '/guides',
  '/math',
  '/finance',
  '/finance/business',
  '/finance/take-home-pay-calculator',
  '/finance/hourly-to-salary-calculator',
  '/finance/overtime-calculator',
  '/finance/pay-raise-calculator',
  '/finance/salary-After-Tax-Comparison-Calculator',
  '/finance/us-federal-income-tax-calculator',
  '/finance/us-state-take-home-calculator',
  '/finance/self-employment-tax-calculator',
  '/finance/capital-gains-tax-calculator',
  '/finance/bonus-tax-calculator',
  '/finance/uk-salary-tax-calculator',
  '/finance/canada-salary-tax-calculator',
  '/finance/australia-salary-tax-calculator',
  '/finance/india-income-tax-calculator',
  '/finance/india-capital-gains-tax-calculator',
  '/finance/401k-calculator',
  '/finance/roth-vs-traditional-calculator',
  '/finance/fire-calculator',
  '/finance/margin-calculator',
  '/finance/markup-calculator',
  '/finance/break-even-calculator',
  '/finance/roi-calculator',
  '/finance/cagr-calculator',
  '/finance/npv-calculator',
  '/finance/safe-withdrawal-rate-calculator',
  '/finance/investment-growth-calculator',
  '/finance/real-rate-of-return-calculator',
  '/finance/home-affordability-calculator',
  '/finance/refinance-calculator',
  '/finance/rent-vs-buy-calculator',
  '/retirement-and-super',
  '/conversions',
  '/conversions/length',
  '/conversions/weight',
  '/conversions/temperature',
  '/conversions/cooking',
  '/conversions/volume',
  '/conversions/area',
  '/conversions/speed',
  '/conversions/digital',
  '/conversions/energy',
  '/conversions/fuel-economy',
  '/conversions/torque',
  '/date-time',
  '/home-construction',
  '/health-fitness',
  '/science',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const uniquePaths = new Set<string>(CORE_STATIC_ROUTES);

  for (const hub of CATEGORY_HUB_LINKS) {
    if (hub.href && hub.href.startsWith('/')) {
      uniquePaths.add(hub.href.split('?')[0]);
    }
  }

  for (const tool of MATH_CALCULATORS) {
    uniquePaths.add(`/math/${tool.slug}`);
  }

  for (const guide of GUIDES_DATA) {
    uniquePaths.add(`/guides/${guide.slug}`);
  }

  for (const entry of UNIFIED_SEARCH_INDEX) {
    if (entry.href && entry.href.startsWith('/')) {
      const cleanPath = entry.href.split('?')[0].split('#')[0];
      uniquePaths.add(cleanPath);
    }
  }

  const lastModified = new Date('2026-04-01T00:00:00.000Z');

  return Array.from(uniquePaths).map((path) => {
    const isHome = path === '/';
    const isFlagshipOrHub =
      path === '/calculators' ||
      path === '/calculation-workspace' ||
      path === '/construction-project-calculator' ||
      path === '/home-construction/flooring-calculator' ||
      path === '/recipe-converter' ||
      path === '/salary-calculator' ||
      path === '/fire-forecaster' ||
      CATEGORY_HUB_LINKS.some((h) => h.href === path);

    return {
      url: `${BASE_URL}${path === '/' ? '' : path}`,
      lastModified,
      changeFrequency: isHome ? 'daily' : isFlagshipOrHub ? 'weekly' : 'monthly',
      priority: isHome ? 1.0 : isFlagshipOrHub ? 0.9 : 0.8,
    };
  });
}
