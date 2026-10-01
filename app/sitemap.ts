import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://solveitcalculator.com';
  const lastModified = new Date();

  // Core Category Hubs (Priority: 0.95 - 0.9)
  const categoryHubs = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: 'finance', priority: 0.95, changeFrequency: 'daily' as const },
    { path: 'conversions', priority: 0.95, changeFrequency: 'daily' as const },
    { path: 'conversion-center', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'math', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'health-fitness', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'science', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'technology', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'automotive', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'electrical', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'home-construction', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'education', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'time-date', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'date-time', priority: 0.85, changeFrequency: 'weekly' as const },
  ];

  // Financial, Tax, Mortgage & Business Tools (Priority: 0.85)
  const financialTools = [
    'tax-calculator',
    'global-tax-calculator',
    'tax-engines-global',
    'mortgage-calculators',
    'mortgages-and-real-estate',
    'mortgages-and-real-estate-debt',
    'banking',
    'banking-and-cash-accounts',
    'banking-calculators',
    'savings',
    'savings-and-liquidity',
    'savings-calculators',
    'loans-and-amortization',
    'loans-and-amortization-calculators',
    'credit-cards',
    'credit-cards-and-revolving',
    'credit-cards-and-revolving-credit',
    'credit-card-calculators',
    'investing-and-growth',
    'retirement',
    'retirement-and-super',
    'salary-and-payroll',
    'daily-wage-calculator',
    'work-hours-payroll-calculator',
    'fire-forecaster',
    'business-tools',
    'business-tools-calculators',
    'plan-a-project-calculator',
  ];

  // Scientific, Math, Health, Automotive & Technical Calculators (Priority: 0.85)
  const scientificAndHealthTools = [
    'scientific-calculator',
    'percentage-calculator',
    'bmi-calculator',
    'running-pace-calculator',
    'running-pace-and-lap-split-calculator',
    'science-calculators',
    'science-calculators-scientific-tools',
    'technology-calculators',
    'automotive-calculators-estimators',
    'engine-rpm-calculator',
    'gear-ratio-calculator',
    'gear-ratio-speed-at-rpm',
    'electrical-calculators-sizing-tools',
    'electrical-tools',
    'home-construction-calculators',
    'education-calculators-academic-planning-tools',
    'health-fitness-calculators',
  ];

  // Date, Time & Timer Calculators (Priority: 0.8)
  const timeAndDateTools = [
    'time-date-calculators',
    'countdown-timer',
    'event-countdown',
    'event-countdown-calculator',
    'event-countdowns',
    'focus-and-break-timer',
    'focus-and-break-timers',
    'retirement-countdown',
    'retirement-countdown-in-workdays',
    'date-difference-calculator',
    'add-subtract-time',
    'add-subtract-time-calculator',
    'military-time-converter',
    'unix-timestamp-converter',
    'julian-day-calculator',
    'julian-day-number-calculator',
    'leap-year-calculator',
    'leap-year-validator-and-counter',
  ];

  // Universal Unit Converters (Priority: 0.8)
  const unitConverters = [
    'length-converter',
    'weight-converter',
    'weight-mass-converter',
    'volume-converter',
    'capacity-converter',
    'volume-and-capacity-converter',
    'temperature-converter',
    'area-converter',
    'speed-converter',
    'speed-velocity-converter',
    'time-converter',
    'pressure-converter',
    'energy-converter',
    'energy-work-converter',
    'power-converter',
    'data-storage-converter',
    'data-transfer-converter',
    'data-transfer-rate-converter',
    'fuel-economy-converter',
    'cooking-converter',
    'frequency-converter',
    'electrical-converter',
    'engineering-converter',
    'torque-converter',
    'number-systems-converter',
    'scientific-converter',
    'pet-age-converter',
    'unit-converters',
    'unit-converter-conversion-tools',
  ];

  // Informational, Editorial & Legal Pages (Priority: 0.6)
  const infoPages = [
    { path: 'about-us', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: 'privacy', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: 'terms-of-use', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: 'article', priority: 0.7, changeFrequency: 'weekly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [
    // Hubs
    ...categoryHubs.map((hub) => ({
      url: hub.path ? `${baseUrl}/${hub.path}` : baseUrl,
      lastModified,
      changeFrequency: hub.changeFrequency,
      priority: hub.priority,
    })),
    // Financial tools
    ...financialTools.map((path) => ({
      url: `${baseUrl}/${path}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    // Scientific & Health tools
    ...scientificAndHealthTools.map((path) => ({
      url: `${baseUrl}/${path}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    // Time & Date tools
    ...timeAndDateTools.map((path) => ({
      url: `${baseUrl}/${path}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Unit Converters
    ...unitConverters.map((path) => ({
      url: `${baseUrl}/${path}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Info & Editorial
    ...infoPages.map((page) => ({
      url: `${baseUrl}/${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
  ];

  return sitemapEntries;
}
