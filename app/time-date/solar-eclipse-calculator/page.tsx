import React from 'react';
import type { Metadata } from 'next';
import SolarEclipseClient from './SolarEclipseClient';

export const metadata: Metadata = {
  title: 'Solar Eclipse Countdown & Tracker | Next Eclipses | SolveItCalculator',
  description:
    'Countdown to upcoming total, annular, and partial solar eclipses. Explore eclipse dates, paths of totality, durations, and viewing locations.',
  keywords: [
    'solar eclipse countdown',
    'next solar eclipse',
    'path of totality calculator',
    'total solar eclipse tracker',
    'annular solar eclipse',
    'solar eclipse dates',
    'eclipse timer'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/solar-eclipse-calculator',
  },
  openGraph: {
    title: 'Solar Eclipse Countdown & Tracker | Next Eclipses | SolveItCalculator',
    description:
      'Countdown to upcoming total, annular, and partial solar eclipses. Explore eclipse dates, paths of totality, durations, and viewing locations.',
    url: 'https://solveitcalculator.com/time-date/solar-eclipse-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Eclipse Countdown & Tracker | Next Eclipses | SolveItCalculator',
    description:
      'Countdown to upcoming total, annular, and partial solar eclipses. Explore eclipse dates, paths of totality, durations, and viewing locations.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/solar-eclipse-calculator/#app',
      name: 'Solar Eclipse Countdown & Path Planner',
      url: 'https://solveitcalculator.com/time-date/solar-eclipse-calculator',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'Countdown to upcoming total, annular, and partial solar eclipses. Explore eclipse dates, paths of totality, durations, and viewing locations.',
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
          name: 'Solar Eclipse Countdown & Path Planner',
          item: 'https://solveitcalculator.com/time-date/solar-eclipse-calculator',
        },
      ],
    },
  ],
};

export default function SolarEclipsePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SolarEclipseClient />
    </>
  );
}
