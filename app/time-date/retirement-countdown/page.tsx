import { Metadata } from 'next';
import RetirementCountdownClient from '@/app/retirement-countdown-in-workdays/RetirementCountdownClient';

export const metadata: Metadata = {
  title: 'Retirement Countdown Calculator in Workdays | Exact Shifts, Hours & PTO',
  description:
    'Calculate your exact retirement countdown in calendar days, workdays, shifts, and hours. Factor in PTO balances, company holidays, and custom schedules with 100% private in-browser precision.',
  keywords: [
    'retirement countdown in workdays',
    'retirement countdown calculator',
    'workdays until retirement',
    'shifts until retirement',
    'retirement date countdown',
    'estimated last working day',
    'vacation before retirement calculator',
    'retirement hours calculator',
    'working days left till retirement',
    'solveit retirement countdown',
  ],
  authors: [{ name: 'SolveIt Retirement Planning & Chronometry Group' }],
  creator: 'SolveIt Calculator',
  publisher: 'SolveIt Calculator',
  category: 'Retirement & Pension Calculators',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/retirement-countdown',
  },
  openGraph: {
    title: 'Retirement Countdown Calculator in Workdays & Shifts – SolveIt',
    description:
      'How much work do you really have left? Calculate exact remaining shifts, working hours, and your estimated last working day with vacation time & holiday time off.',
    url: 'https://solveitcalculator.com/time-date/retirement-countdown',
    siteName: 'SolveIt Calculator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retirement Countdown Calculator in Workdays | SolveIt',
    description:
      'Count the exact workdays, shifts, and hours until retirement with customizable work schedules, vacation time, and paid holidays.',
    creator: '@SolveItCalc',
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

export default function RetirementCountdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Retirement Countdown in Workdays Calculator',
        url: 'https://solveitcalculator.com/time-date/retirement-countdown',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires modern JavaScript-enabled browser',
        description:
          'Interactive retirement countdown calculator computing exact calendar days, scheduled workdays, shifts, and hours remaining with vacation balance and holiday deductions.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Exact Scheduled Workday & Shift Countdown',
          'Vacation & Paid Time Off (PTO) Deduction Planner',
          'Company & Official Holiday Manager',
          'Custom Daily Shift Hours & Flexible Work Schedules',
          'Estimated Last Working Day (Using Vacation Before Retirement)',
          'What-If Retirement Scenario Comparison',
          'Career Journey Progress & Milestone Tracker',
          'Exportable CSV & Copyable Summary',
        ],
        citation: [
          'https://www.ssa.gov/benefits/retirement/planner/ageincrease.html',
          'https://www.bls.gov/ebs/',
        ],
        creator: {
          '@type': 'Organization',
          name: 'SolveIt Calculator',
          url: 'https://solveitcalculator.com',
        },
      },
      {
        '@type': 'BreadcrumbList',
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
            item: 'https://solveitcalculator.com/time-date',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Retirement Countdown in Workdays',
            item: 'https://solveitcalculator.com/time-date/retirement-countdown',
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Calculate Exact Workdays Left Until Retirement',
        description:
          'Learn how to find your true remaining shifts and hours rather than just counting calendar days.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Select Start and Retirement Dates',
            text: 'Enter your start date (or today) and your planned retirement date.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Set Your Work Schedule',
            text: 'Choose standard Monday–Friday 8-hour days, 4x10 schedules, 12-hour shifts, or enter custom hours for each day.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Enter Vacation Days and Paid Holidays',
            text: 'Add your remaining vacation days and annual holidays to subtract time you will not be working.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Review Actual Workdays and Estimated Last Day',
            text: 'See your actual shifts, required work hours, and your estimated final working day if you use your vacation right before retiring.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the difference between calendar days and scheduled workdays?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Calendar days measure the continuous timeline including all Saturdays, Sundays, and holidays (365 days per standard year). Scheduled workdays include only the days you are rostered to work (typically around 250 days per year for a standard Monday–Friday worker).',
            },
          },
          {
            '@type': 'Question',
            name: 'What is an "Estimated Last Working Day"?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Your Estimated Last Working Day is the last day you physically go to work if you take your remaining accrued vacation time (PTO) immediately before your official retirement date.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does the calculator handle holidays falling on weekends?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The calculator follows standard observed holiday rules: if a fixed holiday falls on a Saturday, the preceding Friday is counted as the day off. If it falls on Sunday, the following Monday is taken.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I calculate countdowns for 12-hour shifts or 4-on / 4-off schedules?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Under the Work Schedule tab, you can select the 4-on / 4-off option or adjust daily hours to 12 hours. The calculator will compute your remaining shifts and hours rather than assuming a standard 8-hour day.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is it better to take vacation time before retirement or cash it out?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Using vacation time right before retirement allows you to stop working earlier while continuing to receive employer benefits and pension service credit. Cashing out provides a single lump-sum payout, but may be taxed at supplemental withholding rates. Check your workplace policy.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative pt-0 bg-surface min-h-screen w-full">
        <RetirementCountdownClient />
      </main>
    </>
  );
}
