import React from 'react';
import type { Metadata } from 'next';
import AgeCalculatorClient from './AgeCalculatorClient';

export const metadata: Metadata = {
  title: 'Exact Age Calculator | Chronological Age by Date of Birth & Pet Age | SolveIt',
  description:
    'Calculate your exact chronological age in years, months, weeks, days, hours, minutes, and seconds. Includes next birthday countdown, half-birthdays, dog & cat biological age, and milestone timelines.',
  keywords: [
    'age calculator',
    'chronological age calculator',
    'exact age calculator',
    'how old am i',
    'calculate age from date of birth',
    'birthday day of week calculator',
    'next birthday countdown',
    'half birthday finder',
    'dog age calculator human years',
    'cat age calculator',
    'gestational age calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/age-calculator/',
  },
  openGraph: {
    title: 'Exact Age Calculator | Chronological Age by Date of Birth | SolveIt',
    description:
      'Calculate your exact chronological age in years, months, days, hours, and seconds. Discover half-birthdays, age milestones, and time elapsed since your date of birth.',
    url: 'https://solveitcalculator.com/time-date/age-calculator/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exact Age Calculator | Chronological Age by Date of Birth | SolveIt',
    description:
      'Calculate your exact chronological age in years, months, days, hours, and seconds. Discover half-birthdays, age milestones, and time elapsed since your date of birth.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/age-calculator/#app',
      name: 'Exact Chronological Age Calculator',
      url: 'https://solveitcalculator.com/time-date/age-calculator/',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'A high-precision chronological age calculator to determine exact age from date of birth in years, months, weeks, days, hours, and seconds with biological pet age curves and milestone forecasting.',
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
          name: 'Exact Age Calculator',
          item: 'https://solveitcalculator.com/time-date/age-calculator/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does the exact chronological age calculation algorithm work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The exact chronological age algorithm aligns the calendar day of birth with the target evaluation date across Gregorian calendar boundaries. It calculates discrete differences for years, months, and days. If the target day is smaller than the birth day, it borrows the exact number of days in the preceding month (accounting for 28, 29, 30, or 31 days) to prevent rounding inaccuracies.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do leap years affect chronological age calculations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'If you were born on a leap day (February 29), common years do not contain that calendar date. In non-leap years, legal milestones and calendar anniversaries are observed either on February 28 or March 1 depending on jurisdiction. Our engine evaluates leap days dynamically according to the astronomical 400-year Gregorian cycle.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is pet biological age calculated for dogs and cats?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Rather than the outdated "multiply by 7" rule, modern veterinary science uses non-linear epigenetic aging curves. For dogs, Year 1 equals roughly 15 human years, Year 2 adds 9 years, and subsequent years add between 4 to 8 years depending on canine weight class (small, medium, large, giant). For cats, Year 1 equals 15 years, Year 2 equals 9 years, and each subsequent feline year equals 4 human years.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a half-birthday and how is it determined?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A half-birthday occurs exactly 6 calendar months (approximately 182.62 days) after your date of birth. For instance, if you were born on July 15, your half-birthday falls on January 15.',
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
