import React from 'react';
import type { Metadata } from 'next';
import EquinoxSolsticeClient from './EquinoxSolsticeClient';

export const metadata: Metadata = {
  title: 'Equinox & Solstice Calculator | Astronomical Seasons | SolveItCalculator',
  description:
    'Calculate exact UTC dates and times for vernal equinox, summer solstice, autumnal equinox, and winter solstice across multiple years.',
  keywords: [
    'equinox solstice calculator',
    'vernal equinox dates',
    'summer solstice time',
    'autumnal equinox calculator',
    'winter solstice dates',
    'astronomical seasons calculator',
    'equinox time calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/equinox-solstice-calculator',
  },
  openGraph: {
    title: 'Equinox & Solstice Calculator | Astronomical Seasons | SolveItCalculator',
    description:
      'Calculate exact UTC dates and times for vernal equinox, summer solstice, autumnal equinox, and winter solstice across multiple years.',
    url: 'https://solveitcalculator.com/time-date/equinox-solstice-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Equinox & Solstice Calculator | Astronomical Seasons | SolveItCalculator',
    description:
      'Calculate exact UTC dates and times for vernal equinox, summer solstice, autumnal equinox, and winter solstice across multiple years.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/equinox-solstice-calculator/#app',
      name: 'Equinox & Solstice Calculator',
      url: 'https://solveitcalculator.com/time-date/equinox-solstice-calculator',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'Calculate exact UTC dates and times for vernal equinox, summer solstice, autumnal equinox, and winter solstice across multiple years.',
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
          name: 'Equinox & Solstice Calculator',
          item: 'https://solveitcalculator.com/time-date/equinox-solstice-calculator',
        },
      ],
    },
  ],
};

export default function EquinoxSolsticePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EquinoxSolsticeClient />
    </>
  );
}
