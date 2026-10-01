import React from 'react';
import type { Metadata } from 'next';
import MeetingCostClient from './MeetingCostClient';

export const metadata: Metadata = {
  title: 'Meeting Cost Calculator | Meeting Time & Cost | SolveItCalculator',
  description:
    'Estimate meeting costs from attendee count, compensation, and duration. Compare one-time or recurring meeting scenarios before scheduling.',
  keywords: [
    'meeting cost calculator',
    'calculate meeting cost',
    'hourly meeting cost',
    'employee meeting expense calculator',
    'recurring meeting cost',
    'team sync cost calculator',
    'standup cost calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/meeting-cost-calculator',
  },
  openGraph: {
    title: 'Meeting Cost Calculator | Meeting Time & Cost | SolveItCalculator',
    description:
      'Estimate meeting costs from attendee count, compensation, and duration. Compare one-time or recurring meeting scenarios before scheduling.',
    url: 'https://solveitcalculator.com/meeting-cost-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meeting Cost Calculator | Meeting Time & Cost | SolveItCalculator',
    description:
      'Estimate meeting costs from attendee count, compensation, and duration. Compare one-time or recurring meeting scenarios before scheduling.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/meeting-cost-calculator/#app',
      name: 'Meeting Cost Calculator',
      url: 'https://solveitcalculator.com/meeting-cost-calculator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description:
        'Estimate meeting costs from attendee count, compensation, and duration. Compare one-time or recurring meeting scenarios before scheduling.',
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
          name: 'Meeting Cost Calculator',
          item: 'https://solveitcalculator.com/meeting-cost-calculator',
        },
      ],
    },
  ],
};

export default function MeetingCostCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MeetingCostClient />
    </>
  );
}
