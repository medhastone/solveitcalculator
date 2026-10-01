import React from 'react';
import type { Metadata } from 'next';
import DaysBetweenDatesClient from './DaysBetweenDatesClient';

export const metadata: Metadata = {
  title: 'Days Between Dates | Days, Weeks & Months | SolveItCalculator',
  description:
    'Count calendar days between two dates with inclusive or exclusive settings. Compare weeks and calendar months, with optional business-day adjustments.',
  keywords: [
    'days between dates',
    'days between dates calculator',
    'days calculator',
    'calculate days between two dates',
    'business days between dates',
    'working days calculator',
    'calendar days counter',
    'weeks between two dates',
    'work hours between dates',
    'date difference calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/days-between-dates',
  },
  openGraph: {
    title: 'Days Between Dates | Days, Weeks & Months | SolveItCalculator',
    description:
      'Count calendar days between two dates with inclusive or exclusive settings. Compare weeks and calendar months, with optional business-day adjustments.',
    url: 'https://solveitcalculator.com/time-date/days-between-dates',
    siteName: 'SolveIt Calculator',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Days Between Dates | Days, Weeks & Months | SolveItCalculator',
    description:
      'Count calendar days between two dates with inclusive or exclusive settings. Compare weeks and calendar months, with optional business-day adjustments.',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      '@id': 'https://solveitcalculator.com/time-date/days-between-dates/#software',
      name: 'Days Between Dates Calculator',
      alternateName: 'Date Difference & Business Days Calculator',
      headline: 'Free Online Days Between Dates & Working Days Calculator',
      url: 'https://solveitcalculator.com/time-date/days-between-dates/',
      applicationCategory: 'UtilityApplication',
      applicationSubCategory: 'Business & Productivity Tools',
      operatingSystem: 'All (Web Browser, iOS, Android, Windows, macOS, Linux)',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      description:
        'Professional web application to calculate exact calendar days, business working days, weekend counts, full weeks, and total work hours between any two dates with custom holiday exclusion and milestone tracking.',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      featureList: [
        'Exact calendar days count with optional inclusive end date toggle',
        'Working business days calculation with 5-day, 6-day, 4-day, and custom weekend schedules',
        'Statutory public holiday exclusion for US, UK, Canada, Australia, India, and Germany',
        'Work hours & FTE equivalent computation with customizable daily shifts and lunch break subtractions',
        'Interactive timeline countdown with live milestone counter',
        'One-click copy and CSV data export for timesheets and project schedules',
      ],
      author: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com/',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/time-date/days-between-dates/#breadcrumb',
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
          name: 'Time & Date Calculators',
          item: 'https://solveitcalculator.com/time-date/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Days Between Dates Calculator',
          item: 'https://solveitcalculator.com/time-date/days-between-dates/',
        },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://solveitcalculator.com/time-date/days-between-dates/#howto',
      name: 'How to Calculate the Exact Days Between Two Dates',
      description:
        'Step-by-step instructions to calculate total calendar days, working business days, or work hours between two dates.',
      totalTime: 'PT1M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Select Start and End Dates',
          text: 'Choose your start date and end date using the calendar pickers, or click quick shortcuts like Today, +30 Days, or End of Year.',
          url: 'https://solveitcalculator.com/time-date/days-between-dates/#step1',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Choose Calculation Mode',
          text: 'Select whether to calculate all calendar days, working business days only, or total work hours with customized shifts.',
          url: 'https://solveitcalculator.com/time-date/days-between-dates/#step2',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Set Exclusions and Options',
          text: 'Toggle weekend exclusion, pick your country for national public holiday deductions (US, UK, CA, AU, IN, DE), and choose whether to include the end date in the total count.',
          url: 'https://solveitcalculator.com/time-date/days-between-dates/#step3',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'View and Export Detailed Results',
          text: 'Review the instant calculation breakdown in total days, business days, weeks, months, and hours, then copy or export the results to CSV.',
          url: 'https://solveitcalculator.com/time-date/days-between-dates/#step4',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/time-date/days-between-dates/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I calculate the days between two dates?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To calculate the number of days between two dates, subtract the starting date from the ending date. For calendar days, count every 24-hour interval. For working days, exclude weekends and any statutory public holidays.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does this calculator account for leap years?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The calculator uses precise Gregorian calendar algorithms to automatically check if your date range spans February 29 during a leap year and accurately accounts for the extra day (366 days in leap years).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between calendar days and business days?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Calendar days include all 7 days of every week (Monday through Sunday). Business days (working days) only include standard workdays (typically Monday through Friday) and exclude weekend days as well as public national holidays.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does "Include End Date" mean?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'By default, calculating date difference counts the elapsed duration between two dates (like subtracting day 1 from day 5 = 4 days). Enabling "Include End Date" treats both the start date and the end date as full active days, adding +1 day to the total count.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I count days between dates in Excel or Google Sheets?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In Microsoft Excel or Google Sheets, use =DAYS(end_date, start_date) for total calendar days, or =NETWORKDAYS(start_date, end_date, [holidays]) to calculate business days excluding weekends and custom holiday ranges.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which countries\' public holidays are supported for deduction?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SolveIt supports major national statutory holidays for the United States, United Kingdom, Canada, Australia, India, and Germany, including roll-over observed days when a holiday falls on a weekend.',
          },
        },
        {
          '@type': 'Question',
          name: 'How are working hours and FTE equivalents calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Working hours are calculated by multiplying the net business days by the daily shift hours (e.g., 8 hours per day minus lunch breaks). Full-Time Equivalent (FTE) is calculated by dividing total working hours by standard weekly workload (e.g., 40 hours per FTE week).',
          },
        },
        {
          '@type': 'Question',
          name: 'Is my calculation data private and secure?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, 100%. All date computations, milestone entries, and timesheet conversions run entirely client-side inside your browser. No dates, notes, or personal schedules are transmitted to or stored on external servers.',
          },
        },
      ],
    },
  ],
};

export default function DaysBetweenDatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DaysBetweenDatesClient />
    </>
  );
}
