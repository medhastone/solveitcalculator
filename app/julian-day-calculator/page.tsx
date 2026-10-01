import React from 'react';
import type { Metadata } from 'next';
import JulianDayCalculatorClient from './JulianDayCalculatorClient';

export const metadata: Metadata = {
  title: 'Julian Day Calculator | Astronomical JD, JDN, MJD & Date Converter | SolveIt',
  description:
    'Free online Julian Day Calculator. Convert calendar dates to Julian Day Numbers (JDN), Modified Julian Date (MJD), and Day of the Year (DOY) with instant astronomical accuracy. 100% private in-browser tool.',
  keywords: [
    'julian day calculator',
    'julian date converter',
    'modified julian date calculator',
    'mjd calculator',
    'astronomical julian day',
    'jdn calculator',
    'julian day number to date',
    'fliegel van flandern formula',
    'day of year calculator',
    'doy calculator',
    'greenwich sidereal time calculator',
    'julian calendar to gregorian',
    'astronomy time calculator',
    'nasa julian date converter',
    'iau calendar chronometry',
  ],
  authors: [{ name: 'SolveIt Scientific Computing & Astronomy Chronometry Group' }],
  creator: 'SolveIt Calculator',
  publisher: 'SolveIt Calculator',
  category: 'Astronomy & Chronometry Tools',
  alternates: {
    canonical: 'https://solveitcalculator.com/julian-day-calculator/',
  },
  openGraph: {
    title: 'Julian Day Calculator | Astronomical JD, JDN & MJD Converter | SolveIt',
    description:
      'High-precision Julian Day, Modified Julian Date (MJD), and calendar date conversion based on IAU & NASA astronomical chronometric standards. Instant, 100% private in-browser calculation.',
    url: 'https://solveitcalculator.com/julian-day-calculator/',
    siteName: 'SolveIt Calculator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://solveitcalculator.com/og-julian-day-calculator.png',
        width: 1200,
        height: 630,
        alt: 'Julian Day Calculator – SolveIt Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Julian Day Calculator | Astronomical JD & MJD Converter',
    description:
      'High-precision Julian Day, MJD, and calendar conversion based on IAU & NASA astronomical chronometric standards.',
    creator: '@SolveItCalc',
    images: ['https://solveitcalculator.com/og-julian-day-calculator.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      '@id': 'https://solveitcalculator.com/julian-day-calculator/#software',
      name: 'Julian Day Calculator',
      alternateName: 'Astronomical Julian Date & MJD Converter',
      headline: 'Free High-Precision Julian Day (JD), JDN & Modified Julian Date (MJD) Converter',
      url: 'https://solveitcalculator.com/julian-day-calculator/',
      applicationCategory: 'UtilityApplication',
      applicationSubCategory: 'Astronomy & Scientific Chronometry Tools',
      operatingSystem: 'All (Web Browser, iOS, Android, Windows, macOS, Linux)',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      description:
        'Professional astronomical chronometry application to convert between standard calendar dates, continuous Julian Day Numbers (JDN), Modified Julian Dates (MJD), Truncated Julian Dates (TJD), and Day of the Year (DOY) with sub-second accuracy.',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      featureList: [
        'Live continuous Julian Date (JD) and Modified Julian Date (MJD) clock with microsecond updates',
        'Bidirectional conversion between calendar dates and Julian Days (JD/JDN/MJD/TJD)',
        'Day of the Year (DOY) progress tracker with percentage of year elapsed',
        'Greenwich Mean Sidereal Time (GMST) and Local Sidereal Time calculation',
        'Historical calendar transition support (October 1582 Gregorian papal cutover)',
        'Delta elapsed days, hours, and astronomical intervals between two reference epochs',
        'One-click JSON and summary clipboard export',
      ],
      author: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com/',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/julian-day-calculator/#breadcrumbs',
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
          name: 'Julian Day Calculator',
          item: 'https://solveitcalculator.com/julian-day-calculator/',
        },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://solveitcalculator.com/julian-day-calculator/#howto',
      name: 'How to Convert Calendar Dates to Julian Days and MJD',
      description:
        'Step-by-step tutorial on calculating Julian Day Numbers (JDN), continuous Julian Dates (JD), and Modified Julian Dates (MJD) using astronomical algorithms.',
      totalTime: 'PT1M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Select Conversion Mode',
          text: 'Choose whether you want to convert from a standard calendar date to Julian Day, or convert an existing Julian Day number (JD/MJD) back into a calendar date.',
          url: 'https://solveitcalculator.com/julian-day-calculator/#step1',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Enter Date and Time Parameters',
          text: 'Input the target year, month, day, and exact Universal Time (UTC) hour, minute, and second. Alternatively, click "Use Current Time" to load the live astronomical clock.',
          url: 'https://solveitcalculator.com/julian-day-calculator/#step2',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Configure Chronometric Precision',
          text: 'Select your preferred decimal precision (up to 8 decimal places) and review the automatic handling of the October 1582 Gregorian calendar reform.',
          url: 'https://solveitcalculator.com/julian-day-calculator/#step3',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Analyze and Copy Results',
          text: 'Read the calculated Julian Day Number (JDN), continuous JD, Modified Julian Date (MJD), Truncated Julian Date (TJD), Day of Year (DOY), and Greenwich Mean Sidereal Time (GMST). Copy single values or full JSON records.',
          url: 'https://solveitcalculator.com/julian-day-calculator/#step4',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/julian-day-calculator/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a Julian Day (JD) and Julian Day Number (JDN)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Julian Day is a continuous count of days that has elapsed since the beginning of the Julian Period on January 1, 4713 BCE (proleptic Julian calendar) at 12:00 Universal Time (noon). The Julian Day Number (JDN) is the integer part of this count, while the Julian Date (JD) includes decimal fractions representing the time of day.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why does a Julian Day start at noon instead of midnight?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Astronomers instituted the noon epoch (12:00 UTC) so that a full night of stargazing and celestial observations remains on the exact same Julian date without changing mid-session at midnight.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Modified Julian Date (MJD) and how is it calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Modified Julian Date (MJD) is defined as MJD = JD - 2400000.5. Introduced by the Smithsonian Astrophysical Observatory in 1957 for space tracking, it reduces the number of digits and shifts the day start to civil midnight (00:00 UTC).',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the Fliegel-Van Flandern algorithm work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Fliegel-Van Flandern algorithm is a compact, exact integer arithmetic formula published in 1968 that converts Gregorian calendar dates directly into Julian Day Numbers without looping through monthly day counts.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the Julian Day named after Julius Caesar?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The Julian Day system was formulated in 1583 by classical scholar and chronologist Joseph Justus Scaliger, who named the system in honor of his father, Julius Caesar Scaliger. It combines the 28-year solar cycle, 19-year Metonic lunar cycle, and 15-year Roman indiction cycle into a 7,980-year epoch.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Day of the Year (DOY) and how does it relate to Julian Dates?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Day of the Year (DOY) is an ordinal date from 1 to 365 (or 366 in leap years) counting days starting on January 1. Although often casually called "Julian dates" in military, agriculture, and supply chain contexts, true astronomical Julian Dates count continuous days across millennia rather than resetting each year.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Greenwich Mean Sidereal Time (GMST)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Greenwich Mean Sidereal Time (GMST) is the hour angle of the vernal equinox at the Greenwich meridian. It measures the Earth rotation relative to distant celestial stars rather than the Sun, making a sidereal day approximately 23 hours, 56 minutes, and 4.09 seconds.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are my date calculations private and secure?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, 100%. All astronomical, chronometrical, and date calculations run locally inside your browser engine. No timestamps, dates, or calculations are ever transmitted or saved on external servers.',
          },
        },
      ],
    },
    {
      '@type': 'Article',
      '@id': 'https://solveitcalculator.com/julian-day-calculator/#article',
      headline: 'The Complete Guide to Julian Days, MJD, and Astronomical Chronometry',
      description:
        'Comprehensive guide explaining the history, mathematical formulas, and scientific applications of Julian Day Numbers (JDN), Modified Julian Date (MJD), and calendar transitions.',
      author: {
        '@type': 'Organization',
        name: 'SolveIt Scientific Computing',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        logo: {
          '@type': 'ImageObject',
          url: 'https://solveitcalculator.com/icon-512.png',
        },
      },
      datePublished: '2025-01-01T00:00:00Z',
      dateModified: '2026-09-20T00:00:00Z',
      mainEntityOfPage: 'https://solveitcalculator.com/julian-day-calculator/',
    },
  ],
};

export default function JulianDayCalculatorPage() {
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

