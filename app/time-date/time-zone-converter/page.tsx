import React from 'react';
import type { Metadata } from 'next';
import WorldclockgridClient from '@/app/time-date/world-clock-grid/WorldclockgridClient';

export const metadata: Metadata = {
  title: 'Time Zone Converter | Compare Cities & Offsets | SolveItCalculator',
  description:
    'Convert times across global time zones, compare daylight saving offsets, and find overlapping hours. Plan international calls and meetings with ease.',
  keywords: [
    'time zone converter',
    'world clock converter',
    'convert time zones',
    'utc offset converter',
    'international meeting planner',
    'dst converter'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/time-zone-converter',
  },
  openGraph: {
    title: 'Time Zone Converter | Compare Cities & Offsets | SolveItCalculator',
    description:
      'Convert times across global time zones, compare daylight saving offsets, and find overlapping hours. Plan international calls and meetings with ease.',
    url: 'https://solveitcalculator.com/time-date/time-zone-converter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Zone Converter | Compare Cities & Offsets | SolveItCalculator',
    description:
      'Convert times across global time zones, compare daylight saving offsets, and find overlapping hours. Plan international calls and meetings with ease.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/time-zone-converter/#app',
      name: 'Time Zone Converter',
      url: 'https://solveitcalculator.com/time-date/time-zone-converter',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'Convert times across global time zones, compare daylight saving offsets, and find overlapping hours. Plan international calls and meetings with ease.',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://solveitcalculator.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Time & Date',
          item: 'https://solveitcalculator.com/time-date',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Time Zone Converter',
          item: 'https://solveitcalculator.com/time-date/time-zone-converter',
        },
      ],
    },
  ],
};

export default function TimeZoneConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
        <main className="w-full pt-0 bg-background flex-grow">
          <WorldclockgridClient />
        </main>
      </div>
    </>
  );
}
