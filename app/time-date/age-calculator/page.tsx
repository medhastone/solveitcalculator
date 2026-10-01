import React from 'react';
import type { Metadata } from 'next';
import AgeCalculatorClient from './AgeCalculatorClient';

export const metadata: Metadata = {
  title: 'Age Calculator | Years, Months & Days | SolveItCalculator',
  description:
    'Calculate chronological age in years, months, and days, with optional time units and milestone dates. Get a clear, date-based age result online.',
  keywords: [
    'age calculator',
    'exact age calculator',
    'how old am i',
    'calculate age from date of birth',
    'birthday day of week calculator',
    'next birthday countdown',
    'half birthday calculator',
    'calculate age in days',
    'birthday zodiac sign'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/age-calculator',
  },
  openGraph: {
    title: 'Age Calculator | Years, Months & Days | SolveItCalculator',
    description:
      'Calculate chronological age in years, months, and days, with optional time units and milestone dates. Get a clear, date-based age result online.',
    url: 'https://solveitcalculator.com/time-date/age-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator | Years, Months & Days | SolveItCalculator',
    description:
      'Calculate chronological age in years, months, and days, with optional time units and milestone dates. Get a clear, date-based age result online.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/age-calculator/#app',
      name: 'Age Calculator',
      url: 'https://solveitcalculator.com/time-date/age-calculator',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'Calculate chronological age in years, months, and days, with optional time units and milestone dates. Get a clear, date-based age result online.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
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
          item: 'https://solveitcalculator.com/time-date/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Age Calculator',
          item: 'https://solveitcalculator.com/time-date/age-calculator/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does this age calculator work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The calculator compares your birth date with today (or any date you select). It subtracts the years, months, and days accurately, borrowing days from the preceding month whenever needed so leap years and differing month lengths are handled correctly.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do leap years affect my age?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'If you were born on February 29 (a leap day), our calculator counts your exact days lived. In non-leap years, your birthday is celebrated on March 1.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a half-birthday?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A half-birthday falls exactly six months after your birth date. For example, if your birthday is July 15, your half-birthday is on January 15.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is my birth date kept private?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, 100%. All calculations happen instantly right in your browser. No birth dates are saved or sent across the internet.',
          },
        },
      ],
    },
  ],
};

export default function AgeCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgeCalculatorClient />
    </>
  );
}
