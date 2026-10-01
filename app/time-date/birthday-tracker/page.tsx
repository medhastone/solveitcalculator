import React from 'react';
import { Metadata } from 'next';
import BirthdayTrackerClient from './BirthdayTrackerClient';

export const metadata: Metadata = {
  title: 'Birthday Countdown | Days Until Birthday | SolveItCalculator',
  description:
    'Count down to your next birthday, see days and weeks remaining, calculate days lived, and explore milestone dates such as half and golden birthdays.',
  keywords: [
    'birthday countdown',
    'days until birthday',
    'how many days until my birthday',
    'birthday tracker',
    'birthday calculator',
    'half birthday calculator',
    'solar orbit countdown'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/birthday-tracker',
  },
  openGraph: {
    title: 'Birthday Countdown | Days Until Birthday | SolveItCalculator',
    description:
      'Count down to your next birthday, see days and weeks remaining, calculate days lived, and explore milestone dates such as half and golden birthdays.',
    url: 'https://solveitcalculator.com/time-date/birthday-tracker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Countdown | Days Until Birthday | SolveItCalculator',
    description:
      'Count down to your next birthday, see days and weeks remaining, calculate days lived, and explore milestone dates such as half and golden birthdays.',
  },
};

export default function BirthdayTrackerPage() {
  return <BirthdayTrackerClient />;
}
