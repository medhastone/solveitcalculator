import React from 'react';
import type { Metadata } from 'next';
import LeapYearCalculatorClient from './LeapYearCalculatorClient';
import { FAQ_ITEMS } from './utils';

export const metadata: Metadata = {
  title: 'Leap Year Calculator & Validator | 400-Year Cycle & Range Counter | SolveIt',
  description:
    'Free online Leap Year Calculator & Validator. Check if any year is a leap year, explore the 400-year Gregorian cycle, count leap days between dates, and learn leap year rules with 100% private in-browser precision.',
  keywords: [
    'leap year calculator',
    'leap year validator',
    'leap year counter',
    'is it a leap year',
    'next leap year',
    'gregorian calendar cycle',
    '400 year cycle leap years',
    'february 29 calculator',
    'leap year rules',
    'century leap year rule',
    'proleptic gregorian calendar',
    'count leap years between two dates',
    'leap day calculator',
    'calendar arithmetic',
  ],
  authors: [{ name: 'SolveIt Chronometry & Calendar Computing Group' }],
  creator: 'SolveIt Calculator',
  publisher: 'SolveIt Calculator',
  category: 'Time & Date Calculators',
  alternates: {
    canonical: 'https://solveitcalculator.com/leap-year-calculator/',
  },
  openGraph: {
    title: 'Leap Year Calculator & 400-Year Gregorian Cycle Workbench | SolveIt',
    description:
      'Check any year past, present, or future with mathematical accuracy. Includes interactive 400-year heatmap, date span leap year counter, and historical calendar comparison table.',
    url: 'https://solveitcalculator.com/leap-year-calculator/',
    siteName: 'SolveIt Calculator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://solveitcalculator.com/og-leap-year-calculator.png',
        width: 1200,
        height: 630,
        alt: 'Leap Year Calculator & 400-Year Cycle Workbench – SolveIt Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leap Year Calculator & Validator | SolveIt',
    description:
      'Determine leap years instantly using ISO 8601 Gregorian rules. Explore the 400-year pattern, leap day counters, and solar year drift.',
    creator: '@SolveItCalc',
    images: ['https://solveitcalculator.com/og-leap-year-calculator.png'],
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
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/leap-year-calculator/#app',
      name: 'Leap Year Calculator & 400-Year Gregorian Cycle Workbench',
      url: 'https://solveitcalculator.com/leap-year-calculator/',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires modern JavaScript-enabled browser',
      description:
        'Interactive, client-side astronomical leap year calculator, 400-year cycle validator, and range generator powered by ISO 8601 and proleptic Gregorian standards.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Instant Gregorian 4/100/400-Year Leap Year Validation',
        'Interactive 400-Year Gregorian Cycle Visualizer & Heatmap',
        'Date Span Leap Year Counter & CSV/JSON Export',
        'Step-by-step Visual Decision Tree Walkthrough',
        'Astronomical Solar Year Drift & Calendar Reform Historical Comparison',
        'Developer Pseudocode Reference for Python, JS, C++, Rust, and SQL',
      ],
      creator: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/leap-year-calculator/#breadcrumbs',
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
          name: 'Leap Year Calculator',
          item: 'https://solveitcalculator.com/leap-year-calculator/',
        },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'How to Determine if a Year is a Leap Year in the Gregorian Calendar',
      description:
        'Follow the 3-step Gregorian calendar algorithm to test whether any given year has 366 days and a February 29 leap day.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Step 1: Check 400-Year Century Exception',
          text: 'Check if the year is divisible by 400 without a remainder. If yes (such as 1600, 2000, 2400), it is ALWAYS a leap year.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Step 2: Check 100-Year Century Rule',
          text: 'If not divisible by 400, check if the year ends in "00" (divisible by 100). If divisible by 100 (such as 1700, 1800, 1900, 2100), it is a COMMON year with 365 days.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Step 3: Check Standard 4-Year Divisibility',
          text: 'If not divisible by 100, check if the year is divisible by 4. If divisible by 4 (such as 2024, 2028, 2032), it is a LEAP year with 366 days and 29 days in February.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/leap-year-calculator/#faq',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};

export default function LeapYearCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <LeapYearCalculatorClient />
    </>
  );
}
