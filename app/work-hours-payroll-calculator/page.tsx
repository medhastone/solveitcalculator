import React from 'react';
import type { Metadata } from 'next';
import WorkHoursPayrollCalculator from '@/components/WorkHoursPayrollCalculator';

export const metadata: Metadata = {
  title: 'Work Hours & Payroll Calculator — Timesheet & Take-Home Pay',
  description:
    'Calculate exact regular hours, overtime, gross earnings, itemized deductions, and take-home pay. Features precision timesheet logs, shift differentials, and instantaneous income projections.',
  keywords: [
    'work hours and payroll calculator',
    'work hours calculator',
    'payroll calculator',
    'timesheet calculator',
    'time card calculator',
    'overtime pay calculator',
    'take home pay calculator',
    'gross to net pay calculator',
    'biweekly payroll calculator',
    'shift differential calculator',
    'hourly wage calculator',
    '1099 contractor tax estimator',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/work-hours-payroll-calculator',
  },
  openGraph: {
    title: 'Work Hours & Payroll Calculator — Timesheet & Take-Home Pay',
    description:
      'High-precision timesheet and paycheck calculator. Determine regular hours, overtime pay, shift differentials, tax withholdings, and net earnings in real-time.',
    url: 'https://solveitcalculator.com/work-hours-payroll-calculator',
    siteName: 'SolveIt Calculator',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://solveitcalculator.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Work Hours & Payroll Calculator — Timesheet & Take-Home Pay',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work Hours & Payroll Calculator — Timesheet & Take-Home Pay',
    description:
      'Calculate exact regular hours, overtime, gross earnings, itemized deductions, and take-home pay. 100% in-browser private with CSV & print export.',
    images: ['https://solveitcalculator.com/og-image.png'],
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
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/work-hours-payroll-calculator#webapp',
      name: 'Work Hours & Payroll Calculator',
      alternateName: 'Timesheet & Take-Home Pay Calculator',
      url: 'https://solveitcalculator.com/work-hours-payroll-calculator',
      operatingSystem: 'All modern web browsers (Desktop, Tablet, Mobile)',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Payroll & Timesheet Management Tool',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Weekly, Bi-Weekly, Monthly, and Daily payroll calculation',
        '7-day responsive timesheet logger with automatic break deduction',
        'FLSA daily and weekly overtime threshold options (1.5x, 2.0x, 2.5x)',
        'Shift differentials (night shifts, weekend bonuses, commissions)',
        'Itemized tax withholdings, 401(k) pension, and healthcare deductions',
        'Take-home pay bar meter and effective hourly rate computation',
        '1099 independent contractor self-employment tax estimator (15.3%)',
        'Multi-horizon income projections (Bi-Weekly, Monthly, Quarterly, Annual)',
        '1-click Timesheet CSV export and print-ready employee pay stub',
      ],
      description:
        'Calculate exact regular hours, overtime, gross earnings, itemized deductions, and take-home pay with precision timesheet logs, shift differentials, and instantaneous income projections.',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/work-hours-payroll-calculator#breadcrumbs',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://solveitcalculator.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Time & Date Calculators',
          item: 'https://solveitcalculator.com/time-date-calculators',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Work Hours & Payroll Calculator',
          item: 'https://solveitcalculator.com/work-hours-payroll-calculator',
        },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://solveitcalculator.com/work-hours-payroll-calculator#howto',
      name: 'How to Calculate Work Hours and Net Payroll',
      description:
        'Step-by-step instructions to convert start and end shift hours into net work time, overtime pay, and take-home earnings.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Set Base Hourly Wage and Overtime Multiplier',
          text: 'Choose your currency and enter your agreed hourly base rate along with overtime thresholds (such as 1.5x after 40 hours weekly).',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Log Daily Shift Times and Meal Breaks',
          text: 'Enter shift start, finish times, and unpaid break minutes for Monday through Sunday. Daily net hours and pay update automatically.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Add Differentials and Deductions',
          text: 'Incorporate evening shift premiums, weekend bonuses, income taxes, retirement contributions, and insurance premiums.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Review Summary and Export CSV or Print Pay Stub',
          text: 'Inspect your estimated net take-home pay, effective hourly rate, and annual projections. Download a CSV or print an itemized pay stub.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/work-hours-payroll-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is regular work time distinguished from overtime?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under the US Fair Labor Standards Act (FLSA), non-exempt employees must receive overtime pay for hours worked over 40 in a designated workweek. Select jurisdictions (such as California, Nevada, and Alaska) additionally mandate daily overtime pay for hours worked beyond 8 in a single 24-hour workday.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are meal breaks required to be paid by law?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Federal law does not require employers to pay for bona fide meal breaks lasting 30 minutes or longer, provided the worker is entirely relieved from all duties. Short rest breaks (usually 5 to 20 minutes) must be counted as compensable working hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between gross pay and net pay?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Gross pay is total compensation earned before any deductions—including base wages, overtime premiums, bonuses, and differentials. Net pay is the final amount deposited into an employee’s account after deducting income taxes, payroll taxes (FICA/Medicare), retirement savings, and insurance premiums.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do decimal hours work (e.g., 8 hours and 15 minutes)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Wages are computed by multiplying hourly rates by decimal hours, not minutes. To convert minutes to decimals, divide by 60: 15 minutes = 0.25h, 30 minutes = 0.5h, and 45 minutes = 0.75h. Our calculator executes this conversion automatically behind the scenes.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a shift differential and how is it paid?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A shift differential is an extra premium paid to employees who work outside standard daytime hours (such as swing shifts, night graveyard shifts, or weekends). It is typically structured as an added flat dollar amount (e.g., +$3.00/hr) or a percentage bonus (+10%).',
          },
        },
        {
          '@type': 'Question',
          name: 'Does weekend work automatically pay time-and-a-half?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Under federal regulations, working on Saturday or Sunday does not automatically trigger overtime pay unless those hours push the employee\'s total weekly working duration beyond the 40-hour limit, or if an employment contract specifically guarantees weekend premiums.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Double Time (2.0×)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Double time refers to compensation paid at two times the regular hourly rate. While not federally mandated across all states, certain state codes (like California) mandate double time for hours worked past 12 in a single day or for work past 8 hours on the 7th consecutive day of a workweek.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do holiday hours affect regular payroll calculations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Unless bound by a collective bargaining agreement or company handbook, federal law does not mandate premium holiday pay for working on holidays. However, many competitive employers offer 1.5× or 2.0× compensation as an incentive for holiday labor.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is an effective hourly rate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An effective hourly rate is calculated by dividing your total net take-home earnings by the total physical hours worked. It provides an honest assessment of your actual hourly purchasing power after subtracting taxes and withholding contributions.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do pre-tax deductions like 401(k) reduce taxes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pre-tax deductions (traditional 401k, 403b, health insurance premiums, FSA/HSA contributions) are subtracted from gross earnings before income taxes are computed. This lowers your taxable income base and decreases your immediate tax bill.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are exempt employees eligible for overtime pay?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Exempt employees (often salaried professionals, managers, and executives meeting statutory salary basis criteria) are not entitled to overtime under the FLSA. Non-exempt hourly staff are legally protected and must receive overtime premiums.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the 7-minute rounding rule work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The FLSA allows employers to round employee clock punches to the nearest quarter hour (15 minutes). Punches between 1 and 7 minutes round down, while punches between 8 and 14 minutes round up to the nearest 15-minute mark, provided the practice averages out fairly over time.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is my wage and timesheet data kept private?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, 100%. SolveIt executes all calculations entirely inside your local web browser sandbox using modern client-side JavaScript. Zero timesheet data, hourly rates, or pay figures are transmitted to remote servers or stored in tracking cookies.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does bi-weekly pay compare to semi-monthly pay?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Bi-weekly workers receive 26 paychecks per year (every two weeks, meaning two months will have three paychecks). Semi-monthly workers receive 24 paychecks per year (typically on the 15th and last day of each month). Annual salary equivalents differ accordingly.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I export my timesheet for payroll submission?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Click the "Timesheet CSV" button in the right-hand dashboard to instantly generate a standardized comma-separated file that can be opened in Microsoft Excel, Apple Numbers, Google Sheets, or uploaded to payroll management software.',
          },
        },
      ],
    },
  ],
};

export default function WorkHoursPayrollPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorkHoursPayrollCalculator />
    </>
  );
}
