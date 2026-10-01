import React from 'react';
import type { Metadata } from 'next';
import JulianDayCalculatorClient from '@/app/julian-day-calculator/JulianDayCalculatorClient';

export const metadata: Metadata = {
  title: 'Julian Day Number Calculator | JDN, Astronomical JD & MJD Converter | SolveIt',
  description:
    'Calculate Julian Day Numbers (JDN), continuous Julian Dates (JD), and Modified Julian Dates (MJD) from any calendar date. Free, private, astronomical accuracy tool.',
  keywords: [
    'julian day number calculator',
    'jdn calculator',
    'julian day converter',
    'julian date to calendar',
    'modified julian date',
    'mjd calculator',
    'astronomy julian days',
    'fliegel van flandern',
  ],
  authors: [{ name: 'SolveIt Scientific Computing & Astronomy Chronometry Group' }],
  creator: 'SolveIt Calculator',
  publisher: 'SolveIt Calculator',
  category: 'Astronomy & Chronometry Tools',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/julian-day-number-calculator/',
  },
  openGraph: {
    title: 'Julian Day Number Calculator | JDN, Astronomical JD & MJD Converter | SolveIt',
    description:
      'High-precision Julian Day Number (JDN), Modified Julian Date (MJD), and calendar date conversion. Instant, 100% private in-browser calculation.',
    url: 'https://solveitcalculator.com/time-date/julian-day-number-calculator/',
    siteName: 'SolveIt Calculator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://solveitcalculator.com/og-julian-day-calculator.png',
        width: 1200,
        height: 630,
        alt: 'Julian Day Number Calculator – SolveIt Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Julian Day Number Calculator | JDN & Astronomical Converter',
    description:
      'High-precision Julian Day Number (JDN), MJD, and calendar conversion based on IAU astronomical standards.',
    creator: '@SolveItCalc',
    images: ['https://solveitcalculator.com/og-julian-day-calculator.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      '@id': 'https://solveitcalculator.com/time-date/julian-day-number-calculator/#software',
      name: 'Julian Day Number Calculator',
      alternateName: 'JDN & Astronomical Date Converter',
      url: 'https://solveitcalculator.com/time-date/julian-day-number-calculator/',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All (Web Browser, iOS, Android, Windows, macOS, Linux)',
      isAccessibleForFree: true,
      description:
        'Astronomical calculation tool for continuous Julian Day Numbers (JDN), Modified Julian Dates (MJD), and Gregorian/Julian calendar conversions.',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/time-date/julian-day-number-calculator/#breadcrumbs',
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
          name: 'Time & Date Calculators',
          item: 'https://solveitcalculator.com/time-date/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Julian Day Number Calculator',
          item: 'https://solveitcalculator.com/time-date/julian-day-number-calculator/',
        },
      ],
    },
  ],
};

export default function JulianDayNumberCalculatorTimeDatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <JulianDayCalculatorClient />
    </>
  );
}

