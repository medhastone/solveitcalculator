import React from 'react';
import type { Metadata } from 'next';
import EventCountdownClient from '../event-countdown/EventCountdownClient';

export const metadata: Metadata = {
  title: 'Event Countdowns & Days Until Calculator | SolveIt',
  description:
    'Free online live event countdown timer. Track days, hours, minutes, and seconds until your wedding, vacation, birthday, exam, retirement, or product launch.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/event-countdown/',
  },
};

export default function EventCountdownsPage() {
  return <EventCountdownClient />;
}
