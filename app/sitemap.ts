import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://solveitcalculator.com';
  const currentDate = new Date();

  // All individual conversion tool pages
  const converterSlugs = [
    'volume-converter',
    'capacity-converter',
    'volume-and-capacity-converter',
    'unit-converters/volume',
    'length-converter',
    'weight-converter',
    'weight-mass-converter',
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
    'fuel-economy-converter',
    'cooking-converter',
    'frequency-converter',
    'electrical-converter',
    'engineering-converter',
    'torque-converter',
    'number-systems-converter',
    'conversions',
    'conversion-center'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/conversions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95
    },
    ...converterSlugs.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9
    }))
  ];

  return sitemapEntries;
}
