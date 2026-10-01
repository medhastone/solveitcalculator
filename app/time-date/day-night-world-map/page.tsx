import React from 'react';
import type { Metadata } from 'next';
import DayNightMapClient from './DayNightMapClient';

export const metadata: Metadata = {
  title: 'Day and Night World Map | Sun Position | SolveItCalculator',
  description:
    'Visualise the live solar terminator, real-time day/night boundaries across Earth, current sun zenith position, and global daylight distribution.',
  keywords: [
    'day and night world map',
    'solar terminator map',
    'sun position world map',
    'live daylight map',
    'earth day night boundary',
    'subsolar point tracker',
    'global daylight visualizer'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/day-night-world-map',
  },
  openGraph: {
    title: 'Day and Night World Map | Sun Position | SolveItCalculator',
    description:
      'Visualise the live solar terminator, real-time day/night boundaries across Earth, current sun zenith position, and global daylight distribution.',
    url: 'https://solveitcalculator.com/time-date/day-night-world-map',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Day and Night World Map | Sun Position | SolveItCalculator',
    description:
      'Visualise the live solar terminator, real-time day/night boundaries across Earth, current sun zenith position, and global daylight distribution.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/day-night-world-map/#app',
      name: 'Day and Night World Map',
      url: 'https://solveitcalculator.com/time-date/day-night-world-map',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'Visualise the live solar terminator, real-time day/night boundaries across Earth, current sun zenith position, and global daylight distribution.',
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
          name: 'Day and Night World Map',
          item: 'https://solveitcalculator.com/time-date/day-night-world-map',
        },
      ],
    },
  ],
};

export default function DayNightMapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DayNightMapClient />
    </>
  );
}
