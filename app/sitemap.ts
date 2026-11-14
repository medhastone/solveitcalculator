import type { MetadataRoute } from 'next';
import { MATH_CALCULATORS } from '@/lib/mathCalculatorsData';
import { GUIDES_DATA } from '@/lib/guidesData';

export const dynamic = 'force-static';

const BASE_URL = 'https://solveitcalculator.com';

interface SitemapPageEntry {
  path: string;
  lastmod: string;
}

/**
 * Authoritative list of all final, indexable, 200-status canonical pages
 * with their actual content last-modified dates (YYYY-MM-DD).
 * Priority and changefreq are intentionally omitted per Google Search Central guidelines.
 */
const STATIC_INDEXABLE_PAGES: SitemapPageEntry[] = [
  // Core Platform & Directory Hubs
  { path: '/', lastmod: '2026-11-12' },
  { path: '/calculators', lastmod: '2026-11-12' },
  { path: '/calculation-workspace', lastmod: '2026-11-08' },

  // Category Hubs
  { path: '/math', lastmod: '2026-11-12' },
  { path: '/finance', lastmod: '2026-11-12' },
  { path: '/finance/business', lastmod: '2026-11-12' },
  { path: '/retirement-and-super', lastmod: '2026-11-09' },
  { path: '/conversions', lastmod: '2026-11-12' },
  { path: '/date-time', lastmod: '2026-11-12' },
  { path: '/home-construction', lastmod: '2026-11-12' },
  { path: '/health-fitness', lastmod: '2026-11-12' },
  { path: '/science', lastmod: '2026-11-12' },
  { path: '/guides', lastmod: '2026-11-12' },

  // Flagship & Top-Level Tools
  { path: '/mortgage-calculator', lastmod: '2026-11-10' },
  { path: '/loan-calculator', lastmod: '2026-11-05' },
  { path: '/compound-interest-calculator', lastmod: '2026-11-07' },
  { path: '/salary-calculator', lastmod: '2026-11-11' },
  { path: '/fire-forecaster', lastmod: '2026-11-09' },
  { path: '/construction-project-calculator', lastmod: '2026-11-04' },
  { path: '/home-construction/flooring-calculator', lastmod: '2026-11-06' },
  { path: '/recipe-converter', lastmod: '2026-11-03' },

  // Health & Fitness Standalone Tools
  { path: '/bmi-calculator', lastmod: '2026-11-12' },
  { path: '/tdee-calculator', lastmod: '2026-11-12' },
  { path: '/bmr-calculator', lastmod: '2026-11-12' },
  { path: '/body-fat-calculator', lastmod: '2026-11-12' },
  { path: '/ideal-weight-calculator', lastmod: '2026-11-12' },

  // Date & Time Standalone Tools
  { path: '/date-difference-calculator', lastmod: '2026-11-08' },
  { path: '/days-from-today-calculator', lastmod: '2026-11-12' },
  { path: '/business-days-calculator', lastmod: '2026-11-12' },
  { path: '/age-calculator', lastmod: '2026-11-10' },
  { path: '/countdown-calculator', lastmod: '2026-11-12' },
  { path: '/time-duration-calculator', lastmod: '2026-11-08' },
  { path: '/work-hours-calculator', lastmod: '2026-11-12' },
  { path: '/timer-stopwatch', lastmod: '2026-11-12' },
  { path: '/military-time-converter', lastmod: '2026-11-12' },
  { path: '/time-unit-converter', lastmod: '2026-11-12' },

  // Finance, Payroll, Tax, Retirement & Business Tools
  { path: '/finance/take-home-pay-calculator', lastmod: '2026-10-28' },
  { path: '/finance/salary-to-hourly-calculator', lastmod: '2026-10-28' },
  { path: '/finance/overtime-pay-calculator', lastmod: '2026-10-29' },
  { path: '/finance/pay-raise-calculator', lastmod: '2026-10-29' },
  { path: '/finance/bonus-tax-calculator', lastmod: '2026-10-30' },
  { path: '/finance/1099-vs-w2-calculator', lastmod: '2026-10-30' },
  { path: '/finance/us-federal-income-tax-calculator', lastmod: '2026-11-02' },
  { path: '/finance/us-state-take-home-calculator', lastmod: '2026-11-02' },
  { path: '/finance/self-employment-tax-calculator', lastmod: '2026-11-01' },
  { path: '/finance/capital-gains-tax-calculator', lastmod: '2026-11-01' },
  { path: '/finance/uk-paye-calculator', lastmod: '2026-11-03' },
  { path: '/finance/canada-income-tax-calculator', lastmod: '2026-11-03' },
  { path: '/finance/india-income-tax-calculator', lastmod: '2026-11-04' },
  { path: '/finance/in-hand-salary-calculator', lastmod: '2026-11-04' },
  { path: '/finance/hra-exemption-calculator', lastmod: '2026-11-04' },
  { path: '/finance/india-capital-gains-tax-calculator', lastmod: '2026-11-04' },
  { path: '/finance/germany-income-tax-calculator', lastmod: '2026-11-03' },
  { path: '/finance/france-income-tax-calculator', lastmod: '2026-11-03' },
  { path: '/finance/singapore-income-tax-calculator', lastmod: '2026-11-03' },
  { path: '/finance/uae-income-tax-calculator', lastmod: '2026-11-03' },
  { path: '/finance/401k-calculator', lastmod: '2026-10-26' },
  { path: '/finance/roth-vs-traditional-calculator', lastmod: '2026-10-26' },
  { path: '/finance/rmd-calculator', lastmod: '2026-10-27' },
  { path: '/finance/safe-withdrawal-rate-calculator', lastmod: '2026-10-27' },
  { path: '/finance/investment-growth-calculator', lastmod: '2026-11-05' },
  { path: '/finance/real-rate-of-return-calculator', lastmod: '2026-10-25' },
  { path: '/finance/home-affordability-calculator', lastmod: '2026-10-24' },
  { path: '/finance/refinance-calculator', lastmod: '2026-10-24' },
  { path: '/finance/rent-vs-buy-calculator', lastmod: '2026-10-25' },
  { path: '/finance/profit-margin-calculator', lastmod: '2026-10-22' },
  { path: '/finance/margin-calculator', lastmod: '2026-10-22' },
  { path: '/finance/markup-calculator', lastmod: '2026-10-22' },
  { path: '/finance/break-even-calculator', lastmod: '2026-10-23' },

  // Universal Unit Conversion Calculators
  { path: '/conversions/length', lastmod: '2026-10-19' },
  { path: '/conversions/weight', lastmod: '2026-11-11' },
  { path: '/conversions/temperature', lastmod: '2026-10-19' },
  { path: '/conversions/cooking', lastmod: '2026-10-20' },
  { path: '/conversions/volume', lastmod: '2026-10-20' },
  { path: '/conversions/area', lastmod: '2026-10-20' },
  { path: '/conversions/speed', lastmod: '2026-10-21' },
  { path: '/conversions/digital', lastmod: '2026-10-21' },
  { path: '/conversions/energy', lastmod: '2026-10-21' },
  { path: '/conversions/fuel-economy', lastmod: '2026-11-11' },
  { path: '/conversions/torque', lastmod: '2026-10-21' },

  // Science Calculators
  { path: '/science/force-calculator', lastmod: '2026-10-16' },
  { path: '/science/ohms-law-calculator', lastmod: '2026-10-16' },
  { path: '/science/molarity-calculator', lastmod: '2026-10-17' },
  { path: '/science/density-calculator', lastmod: '2026-10-17' },

  // Editorial, Trust & Legal Pages
  { path: '/about', lastmod: '2026-11-12' },
  { path: '/calculation-methodology', lastmod: '2026-11-12' },
  { path: '/privacy-policy', lastmod: '2026-11-12' },
  { path: '/terms-of-service', lastmod: '2026-11-12' },
  { path: '/accessibility', lastmod: '2026-11-12' },
  { path: '/contact', lastmod: '2026-11-12' },
];

const MATH_LASTMOD_BY_SLUG: Record<string, string> = {
  'percentage-calculator': '2026-11-10',
  'percentage-change-calculator': '2026-10-27',
  'discount-calculator': '2026-10-28',
  'percent-error-calculator': '2026-10-16',
  'percentage-to-decimal-calculator': '2026-10-18',
  'percentage-to-fraction-calculator': '2026-10-18',
  'fraction-calculator': '2026-10-18',
  'fraction-to-decimal-calculator': '2026-10-18',
  'ratio-calculator': '2026-11-11',
  'average-calculator': '2026-11-11',
  'scientific-calculator': '2026-10-25',
  'square-root-calculator': '2026-10-15',
  'exponent-calculator': '2026-10-15',
  'log-calculator': '2026-10-15',
  'absolute-value-calculator': '2026-10-16',
  'gcd-and-lcm-calculator': '2026-10-17',
  'equation-solver': '2026-10-16',
  'quadratic-equation-calculator': '2026-10-16',
  'matrix-calculator': '2026-10-17',
};

const GUIDE_LASTMOD_BY_SLUG: Record<string, string> = {
  'how-to-calculate-a-percentage': '2026-11-10',
  'how-to-calculate-percentage-change': '2026-10-27',
  'how-to-simplify-and-calculate-fractions': '2026-10-22',
  'how-to-calculate-ratios-and-averages': '2026-10-23',
  'how-to-calculate-compound-interest': '2026-11-01',
  'how-to-calculate-loan-and-mortgage-payments': '2026-11-02',
  'how-to-calculate-discounts-and-profit-margin': '2026-10-28',
  'how-to-measure-room-area-and-flooring': '2026-11-06',
  'how-to-convert-metric-and-imperial-units': '2026-11-05',
  'how-to-calculate-bmi-and-daily-calories': '2026-11-12',
  'how-to-calculate-exact-age-and-date-difference': '2026-11-03',
  'how-to-estimate-401k-and-retirement-growth': '2026-10-26',
  'how-to-calculate-net-salary-and-sales-tax': '2026-10-29',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entriesMap = new Map<string, string>();

  for (const item of STATIC_INDEXABLE_PAGES) {
    entriesMap.set(item.path, item.lastmod);
  }

  for (const tool of MATH_CALCULATORS) {
    const path = `/math/${tool.slug}`;
    const lastmod = MATH_LASTMOD_BY_SLUG[tool.slug] || '2026-10-18';
    entriesMap.set(path, lastmod);
  }

  for (const guide of GUIDES_DATA) {
    const path = `/guides/${guide.slug}`;
    const lastmod = GUIDE_LASTMOD_BY_SLUG[guide.slug] || '2026-10-30';
    entriesMap.set(path, lastmod);
  }

  return Array.from(entriesMap.entries()).map(([path, lastmod]) => ({
    url: `${BASE_URL}${path === '/' ? '' : path}`,
    lastModified: new Date(`${lastmod}T00:00:00.000Z`),
  }));
}
