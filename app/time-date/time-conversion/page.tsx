import React from 'react';
import type { Metadata } from 'next';
import CategoryHubShell from '@/components/time-date/CategoryHubShell';

export const metadata: Metadata = {
  title: 'Time Unit & Format Converters | Seconds, Hours, Days & 24h Clock',
  description: 'Convert between 12 standard units of time, convert 24-hour clock to 12-hour AM/PM, military time, and decimal hours for payroll.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/time-conversion',
  },
};

export default function TimeConversionCategoryPage() {
  return (
    <CategoryHubShell
      category="time-conversion"
      title="Time Unit & Format Converters"
      description="Instant bidirectional converters across nanoseconds, seconds, minutes, hours, days, weeks, months, years, centuries, plus 24-hour military clock and decimal timesheet tools."
      canonicalPath="/time-date/time-conversion"
    />
  );
}
