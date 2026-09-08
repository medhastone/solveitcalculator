import React from 'react';
import type { Metadata } from 'next';
import TimeCalculatorClient from './TimeCalculatorClient';

export const metadata: Metadata = {
  title: 'Time Calculator | Add, Subtract & Convert HH:MM:SS Time | SolveIt',
  description:
    'Free time duration calculator to add or subtract hours, minutes, and seconds (HH:MM:SS). Convert decimal hours to minutes, calculate timestamps, running pace splits, and cumulative time logs.',
  keywords: [
    'time calculator',
    'add time',
    'subtract time',
    'time duration calculator',
    'hours and minutes calculator',
    'decimal hours to minutes',
    'seconds to hh mm ss',
    'add hours to time',
    'time accumulator',
    'running pace split calculator',
    'unix epoch timestamp converter'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/time-calculator/',
  },
  openGraph: {
    title: 'Time Calculator | Add, Subtract & Convert HH:MM:SS Time | SolveIt',
    description:
      'Free time duration calculator to add or subtract hours, minutes, and seconds (HH:MM:SS). Convert decimal hours to minutes, calculate timestamps, running pace splits, and cumulative time logs.',
    url: 'https://solveitcalculator.com/time-date/time-calculator/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Calculator | Add, Subtract & Convert HH:MM:SS Time | SolveIt',
    description:
      'Free time duration calculator to add or subtract hours, minutes, and seconds (HH:MM:SS). Convert decimal hours to minutes, calculate timestamps, running pace splits, and cumulative time logs.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/time-calculator/#app',
      name: 'Time Calculator - Add & Subtract HH:MM:SS Duration',
      url: 'https://solveitcalculator.com/time-date/time-calculator/',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'A high-precision sexagesimal time arithmetic calculator to add and subtract hours, minutes, and seconds, convert decimal durations, and calculate running splits.',
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
          name: 'Time Calculator',
          item: 'https://solveitcalculator.com/time-date/time-calculator/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do you add hours, minutes, and seconds (sexagesimal base 60)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To add time values in HH:MM:SS format, sum the seconds first. If seconds >= 60, carry the quotient to the minutes column and keep the remainder. Next, sum the minutes, carrying any excess >= 60 to the hours column. Finally, sum the total hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you convert decimal hours (e.g. 4.75 hours) into hours and minutes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Take the integer portion as the whole hours (4 hours). Multiply the fractional decimal by 60: 0.75 * 60 = 45 minutes. Thus, 4.75 hours equals 4 hours and 45 minutes.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is running pace calculated from distance and elapsed time?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pace is calculated by dividing total elapsed time in minutes by total distance in miles or kilometers. For example, running 10 km in 50 minutes yields a pace of 5:00 min/km (or roughly 8:03 min/mile).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a Unix Epoch Timestamp and how does it work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Unix Epoch timestamp is the total number of seconds that have elapsed since 00:00:00 UTC on January 1, 1970 (excluding leap seconds). It is the foundational time measurement standard used in operating systems and databases.',
          },
        },
      ],
    },
  ],
};

export default function TimeCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TimeCalculatorClient />
    </>
  );
}
