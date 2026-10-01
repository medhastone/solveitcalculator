import React from 'react';
import { Metadata } from 'next';
import AddSubtractTimeCalculator from '@/components/AddSubtractTimeCalculator';

export const metadata: Metadata = {
  title: 'Add & Subtract Time Calculator | Date & Time | SolveItCalculator',
  description:
    'Add or subtract years, months, weeks, days, hours, minutes, and seconds from a date and time. Use optional business-day and time-zone settings.',
  keywords: [
    'add and subtract time calculator',
    'time calculator',
    'add time to date',
    'subtract time from date',
    'date and time calculator',
    'business days calculator',
    'add days to date',
    'subtract days from date',
    'hours and minutes calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/add-subtract-time',
  },
  openGraph: {
    title: 'Add & Subtract Time Calculator | Date & Time | SolveItCalculator',
    description:
      'Add or subtract years, months, weeks, days, hours, minutes, and seconds from a date and time. Use optional business-day and time-zone settings.',
    url: 'https://solveitcalculator.com/time-date/add-subtract-time',
    siteName: 'SolveIt Calculator',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add & Subtract Time Calculator | Date & Time | SolveItCalculator',
    description:
      'Add or subtract years, months, weeks, days, hours, minutes, and seconds from a date and time. Use optional business-day and time-zone settings.',
  },
};

export default function AddSubtractTimePage() {
  return <AddSubtractTimeCalculator />;
}
