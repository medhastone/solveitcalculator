import React from 'react';
import type { Metadata } from 'next';
import CountdownTimerClient from './CountdownTimerClient';

export const metadata: Metadata = {
  title: 'Event Countdown Timer & Days Until Calculator | Live Ticker | SolveIt',
  description:
    'Live countdown timer and days until calculator for major holidays, birthdays, weddings, retirement, and custom events. Real-time tick down in days, hours, minutes, and seconds.',
  keywords: [
    'countdown timer',
    'days until calculator',
    'event countdown',
    'days until christmas',
    'days until new year',
    'retirement countdown calculator',
    'birthday countdown',
    'wedding countdown',
    'live countdown clock',
    'how many days until'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/countdown-timer/',
  },
  openGraph: {
    title: 'Event Countdown Timer & Days Until Calculator | Live Ticker | SolveIt',
    description:
      'Live countdown timer and days until calculator for major holidays, birthdays, weddings, retirement, and custom events. Real-time tick down in days, hours, minutes, and seconds.',
    url: 'https://solveitcalculator.com/time-date/countdown-timer/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Event Countdown Timer & Days Until Calculator | Live Ticker | SolveIt',
    description:
      'Live countdown timer and days until calculator for major holidays, birthdays, weddings, retirement, and custom events. Real-time tick down in days, hours, minutes, and seconds.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/countdown-timer/#app',
      name: 'Live Event Countdown Timer & Days Until Calculator',
      url: 'https://solveitcalculator.com/time-date/countdown-timer/',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'A real-time countdown chronometer and days until calculator featuring holiday presets, retirement day tracking, and shareable event links.',
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
          name: 'Countdown Timer',
          item: 'https://solveitcalculator.com/time-date/countdown-timer/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How many days until Christmas or New Year?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our live countdown chronometer updates every second to show the exact remaining days, hours, minutes, and seconds until upcoming federal and global holidays including Christmas Day, New Year\'s Eve, Thanksgiving, and Halloween.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the retirement countdown calculator estimate remaining working days?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'By configuring your planned retirement date, the engine calculates not only the gross remaining calendar days, but also deducts weekends and expected statutory holidays to provide an exact count of actual remaining work shifts and business hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does time zone synchronization work for live countdown timers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our countdown calculates the difference against the target event timestamp in Universal Coordinated Time (UTC) or your browser\'s local time zone, ensuring millisecond-level precision without drift.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I share a live event countdown link with friends or colleagues?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, you can configure any custom event title and date/time and use the "Copy Shareable Event" button to generate a clean summary and link to share across chat, email, or social media.',
          },
        },
      ],
    },
  ],
};

export default function CountdownTimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CountdownTimerClient />
    </>
  );
}
