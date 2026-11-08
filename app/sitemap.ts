import type { MetadataRoute } from 'next';
import { UNIFIED_SEARCH_INDEX, CATEGORY_HUB_LINKS } from '@/lib/searchIndex';

const BASE_URL = 'https://solveitcalculator.com';

const CORE_STATIC_ROUTES = [
  '/',
  '/calculation-workspace',
  '/construction-project-calculator',
  '/recipe-converter',
  '/salary-calculator',
  '/salary-tax-calculator',
  '/about',
  '/calculation-methodology',
  '/accessibility',
  '/privacy-policy',
  '/contact',
  '/guides',
  '/articles',
  '/search',
  '/math',
  '/finance',
  '/finance/business',
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
  '/unit-conversion',
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
      path === '/calculation-workspace' ||
      path === '/construction-project-calculator' ||
      path === '/recipe-converter' ||
      path === '/salary-calculator' ||
      CATEGORY_HUB_LINKS.some((h) => h.href === path);

    return {
      url: `${BASE_URL}${path === '/' ? '' : path}`,
      lastModified,
      changeFrequency: isHome ? 'daily' : isFlagshipOrHub ? 'weekly' : 'monthly',
      priority: isHome ? 1.0 : isFlagshipOrHub ? 0.9 : 0.8,
    };
  });
}
