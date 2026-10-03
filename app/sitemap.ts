import { MetadataRoute } from 'next';
import { CANONICAL_CATEGORIES, CANONICAL_TOOLS } from '@/lib/registry';
import { CONVERSION_CATEGORIES } from '@/lib/conversions';
import { HEALTH_TOOL_CONFIGS } from './health-fitness-calculators/healthToolConfig';
import { ALL_TIME_TOOLS, TIME_CATEGORIES } from '@/lib/time-date/data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://solveitcalculator.com';
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // 1. Homepage
  entries.push({
    url: baseUrl,
    lastModified,
    changeFrequency: 'daily',
    priority: 1.0,
  });

  // 2. Canonical Category Hubs
  for (const cat of CANONICAL_CATEGORIES) {
    entries.push({
      url: `${baseUrl}${cat.path}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.95,
    });

    // Subcategories
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        entries.push({
          url: `${baseUrl}${sub.path}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      }
    }
  }

  // 3. Canonical Calculators
  for (const tool of CANONICAL_TOOLS) {
    entries.push({
      url: `${baseUrl}${tool.canonicalPath}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // 3b. Time & Date Ecosystem Hubs & Tools
  for (const cat of TIME_CATEGORIES) {
    entries.push({
      url: `${baseUrl}${cat.path}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }
  for (const tool of ALL_TIME_TOOLS) {
    entries.push({
      url: `${baseUrl}${tool.canonicalPath}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // 4. Universal Conversion Categories
  for (const convCat of CONVERSION_CATEGORIES) {
    entries.push({
      url: `${baseUrl}/conversions/${convCat.id}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // 5. Popular Unit Conversion Pairs
  const popularPairs = [
    'grams-to-tablespoons',
    'gram-to-milligram',
    'gram-to-ounce',
    'gram-to-pound',
    'gram-to-kilogram',
    'milligram-to-gram',
    'liter-to-gram',
    'gram-to-cup',
    'gram-to-teaspoon',
    'grams-to-milligrams',
    'grams-to-ounces',
    'grams-to-pounds',
    'grams-to-kilograms',
    'grams-to-liters',
    'grams-to-milliliters',
    'grams-to-teaspoons',
  ];
  for (const pair of popularPairs) {
    entries.push({
      url: `${baseUrl}/conversions/${pair}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // 6. Health & Physiology Suite
  entries.push({
    url: `${baseUrl}/health-fitness-calculators/bmi`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.85,
  });
  for (const slug of Object.keys(HEALTH_TOOL_CONFIGS)) {
    entries.push({
      url: `${baseUrl}/health-fitness-calculators/${slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // 7. Guides & Articles
  const articles = [
    'computational-physiology-guide',
    'fallacy-of-bmi-vs-ffmi',
    'how-emi-works',
    'how-to-calculate-bmi',
    'investment-planning-basics',
    'science-of-90-minute-sleep-cycles',
    'understanding-gst',
    'zone-2-cardio-training',
  ];
  entries.push({
    url: `${baseUrl}/article`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  });
  for (const art of articles) {
    entries.push({
      url: `${baseUrl}/article/${art}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  }

  // 8. Editorial & Legal Pages
  const staticPages = [
    { path: '/about-us', priority: 0.6 },
    { path: '/privacy', priority: 0.5 },
    { path: '/terms-of-use', priority: 0.5 },
    { path: '/contact', priority: 0.5 },
  ];
  for (const p of staticPages) {
    entries.push({
      url: `${baseUrl}${p.path}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: p.priority,
    });
  }

  // Deduplicate by URL to ensure pristine XML
  const seen = new Set<string>();
  return entries.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}
