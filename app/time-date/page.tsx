import React from 'react';
import type { Metadata } from 'next';
import TimeDateHubClient from './TimeDateHubClient';
import { TIME_DATE_CATEGORIES, TIME_DATE_FAQS } from './timeDateCategoryData';

export const metadata: Metadata = {
  title: 'Time & Date Calculators & Interactive World Clock Workbench | SolveItCalculator',
  description:
    'Free time and date calculators for chronological age, timesheets, FLSA overtime, business days between dates, multi-timezone meeting overlap, and Pomodoro focus timers. Calibrated to ISO 8601 precision.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date',
  },
  openGraph: {
    title: 'Time & Date Calculators & World Clock Workbench | SolveItCalculator',
    description:
      'Chronological engines, payroll timesheets, astronomical solar/lunar ephemeris, Unix epoch converters, and productivity countdowns.',
    url: 'https://solveitcalculator.com/time-date',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time & Date Calculators & World Clock Workbench | SolveItCalculator',
    description: 'Calculate age, timesheets, days between dates, timezones, and countdowns with ISO 8601 precision.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function TimeDatePage() {
  // Flatten all tools across all 10 categories for Schema.org ItemList
  const allTools = TIME_DATE_CATEGORIES.flatMap((c) => c.tools);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/time-date#collection',
        url: 'https://solveitcalculator.com/time-date',
        name: 'Time & Date Calculators',
        description:
          'ISO 8601 calibrated time and date calculation tools, payroll timesheets, multi-city world clock grid, astronomical solar/lunar ephemeris, and Unix timestamp epoch converters.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://solveitcalculator.com/#website',
          url: 'https://solveitcalculator.com/',
          name: 'SolveItCalculator',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
          { '@type': 'ListItem', position: 2, name: 'Time & Date Calculators', item: 'https://solveitcalculator.com/time-date' },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Time & Date Calculators Catalog',
        numberOfItems: allTools.length,
        itemListElement: allTools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.name,
          description: tool.desc,
          url: tool.path.startsWith('http')
            ? tool.path
            : `https://solveitcalculator.com${tool.path.startsWith('/') ? tool.path : `/${tool.path}`}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: TIME_DATE_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TimeDateHubClient />
    </>
  );
}
