import React from 'react';
import type { Metadata } from 'next';
import LeapYearCalculatorClient from '@/app/leap-year-calculator/LeapYearCalculatorClient';
import { FAQ_ITEMS } from '@/app/leap-year-calculator/utils';

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
    canonical: 'https://solveitcalculator.com/time-date/leap-year-calculator',
  },
  openGraph: {
    title: 'Leap Year Calculator & 400-Year Gregorian Cycle Workbench | SolveIt',
    description:
      'Check any year past, present, or future with mathematical accuracy. Includes interactive 400-year heatmap, date span leap year counter, and historical calendar comparison table.',
    url: 'https://solveitcalculator.com/time-date/leap-year-calculator',
    siteName: 'SolveIt Calculator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leap Year Calculator & Validator | SolveIt',
    description:
      'Interactive 400-year Gregorian leap year cycle visualizer, date range calculator, and algorithm guide.',
    creator: '@SolveItCalc',
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

export default function LeapYearCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Leap Year Calculator & 400-Year Gregorian Cycle Workbench',
        url: 'https://solveitcalculator.com/time-date/leap-year-calculator',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas.',
        description:
          'High-precision calendar validation workbench for leap years, 400-year Gregorian cycles, century exclusions, and date-range leap day accumulation.',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
        },
        featureList: [
          'Instant Gregorian leap year validation with mathematical modulus checks',
          'Interactive 400-year cycle heat map grid (97 leap years vs 303 common years)',
          'Two-date range leap day accumulator and list exporter',
          'Interactive Julian vs. Gregorian historical drift timeline comparison',
          'Upcoming and historical leap year tables with leap day days of the week',
          'Shareable URL calculation states',
          'Printable and exportable calendar summaries',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://solveitcalculator.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Time & Date Calculators',
            item: 'https://solveitcalculator.com/time-date',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Leap Year Calculator',
            item: 'https://solveitcalculator.com/time-date/leap-year-calculator',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
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
      <main className="relative pt-0 bg-surface min-h-screen w-full">
        <LeapYearCalculatorClient />
      </main>
    </>
  );
}
