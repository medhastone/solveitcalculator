import React from 'react';
import type { Metadata } from 'next';
import SunriseSunsetClient from './SunriseSunsetClient';

export const metadata: Metadata = {
  title: 'Sunrise, Sunset & Golden Hour | Solar Times | SolveItCalculator',
  description:
    'Calculate sunrise, sunset, dawn, dusk, and golden hour times for any location and date. View day length, solar noon, and twilight phases.',
  keywords: [
    'sunrise sunset calculator',
    'golden hour calculator',
    'twilight calculator',
    'solar noon calculator',
    'day length calculator',
    'dawn and dusk times',
    'blue hour calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/sunrise-sunset-calculator',
  },
  openGraph: {
    title: 'Sunrise, Sunset & Golden Hour | Solar Times | SolveItCalculator',
    description:
      'Calculate sunrise, sunset, dawn, dusk, and golden hour times for any location and date. View day length, solar noon, and twilight phases.',
    url: 'https://solveitcalculator.com/time-date/sunrise-sunset-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunrise, Sunset & Golden Hour | Solar Times | SolveItCalculator',
    description:
      'Calculate sunrise, sunset, dawn, dusk, and golden hour times for any location and date. View day length, solar noon, and twilight phases.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/sunrise-sunset-calculator/#app',
      name: 'Sunrise, Sunset & Golden Hour Calculator',
      url: 'https://solveitcalculator.com/time-date/sunrise-sunset-calculator',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'Calculate sunrise, sunset, dawn, dusk, and golden hour times for any location and date. View day length, solar noon, and twilight phases.',
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
          name: 'Sunrise, Sunset & Golden Hour Calculator',
          item: 'https://solveitcalculator.com/time-date/sunrise-sunset-calculator',
        },
      ],
    },
  ],
};

export default function SunriseSunsetPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SunriseSunsetClient />
    </>
  );
}
