import React from 'react';
import type { Metadata } from 'next';
import MoonPhaseClient from './MoonPhaseClient';

export const metadata: Metadata = {
  title: 'Moon Phase & Lunar Calendar | Illumination & Phases | SolveItCalculator',
  description:
    'Calculate current moon phase, illumination percentage, lunar age, and upcoming full/new moon dates with high astronomical precision.',
  keywords: [
    'moon phase calculator',
    'lunar calendar calculator',
    'moon illumination calculator',
    'lunar phase today',
    'next full moon calculator',
    'next new moon date',
    'moon age calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/moon-phase-calculator',
  },
  openGraph: {
    title: 'Moon Phase & Lunar Calendar | Illumination & Phases | SolveItCalculator',
    description:
      'Calculate current moon phase, illumination percentage, lunar age, and upcoming full/new moon dates with high astronomical precision.',
    url: 'https://solveitcalculator.com/time-date/moon-phase-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moon Phase & Lunar Calendar | Illumination & Phases | SolveItCalculator',
    description:
      'Calculate current moon phase, illumination percentage, lunar age, and upcoming full/new moon dates with high astronomical precision.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/moon-phase-calculator/#app',
      name: 'Moon Phase & Lunar Calendar Calculator',
      url: 'https://solveitcalculator.com/time-date/moon-phase-calculator',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'Calculate current moon phase, illumination percentage, lunar age, and upcoming full/new moon dates with high astronomical precision.',
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
          name: 'Moon Phase & Lunar Calendar Calculator',
          item: 'https://solveitcalculator.com/time-date/moon-phase-calculator',
        },
      ],
    },
  ],
};

export default function MoonPhasePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MoonPhaseClient />
    </>
  );
}
