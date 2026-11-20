import React from 'react';
import type { Metadata } from 'next';
import FireForecasterClient from './FireForecasterClient';
import ServerCalculatorReferenceSection from '@/components/calculator-page/ServerCalculatorReferenceSection';
import CalculatorInternalLinksBand from '@/components/calculator-page/CalculatorInternalLinksBand';

export const metadata: Metadata = {
  title: 'FIRE Forecaster & Financial Independence Calculator | SolveItCalculator',
  description:
    'Calculate your Financial Independence (FIRE) target number, years to retirement, Lean/Regular/Fat/Coast FIRE milestones, and safe withdrawal rate trajectory.',
  alternates: {
    canonical: 'https://solveitcalculator.com/fire-forecaster',
  },
  openGraph: {
    title: 'FIRE Forecaster & Financial Independence Calculator | SolveItCalculator',
    description: 'Calculate your Financial Independence (FIRE) target number, years to retirement, Lean/Regular/Fat/Coast FIRE milestones, and safe withdrawal rate trajectory.',
    url: 'https://solveitcalculator.com/fire-forecaster',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIRE Forecaster & Financial Independence Calculator | SolveItCalculator',
    description: 'Calculate your Financial Independence (FIRE) target number, years to retirement, Lean/Regular/Fat/Coast FIRE milestones, and safe withdrawal rate trajectory.',
  },
};

const FIRE_FORECASTER_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/fire-forecaster#app',
      name: 'FIRE Forecaster & Financial Independence Calculator',
      description:
        'Calculate your Financial Independence (FIRE) target number, years to retirement, Lean/Regular/Fat/Coast FIRE milestones, and safe withdrawal rate trajectory.',
      url: 'https://solveitcalculator.com/fire-forecaster',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/fire-forecaster#breadcrumb',
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
          name: 'Retirement & Super',
          item: 'https://solveitcalculator.com/retirement-and-super',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'FIRE Forecaster',
          item: 'https://solveitcalculator.com/fire-forecaster',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/fire-forecaster#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is the FIRE target number calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Your FIRE target number equals your annual retirement spending divided by your chosen safe withdrawal rate (for example, Annual Expenses ÷ 0.04 = 25× annual spending under the 4% rule).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Coast FIRE?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Coast FIRE is the portfolio milestone where your existing invested assets will compound to reach your full FIRE target by traditional retirement age without requiring any additional savings contributions.',
          },
        },
      ],
    },
  ],
};

export default function FireForecasterPage() {
  const now = new Date();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FIRE_FORECASTER_JSON_LD) }}
      />
      <FireForecasterClient
        initialYear={now.getUTCFullYear()}
        initialMonth={now.getUTCMonth()}
      />
      <ServerCalculatorReferenceSection
        title="FIRE Forecaster"
        formulaHeading="FIRE Number & Real Return Formula Explanation"
        formulaExpression="FIRE Number = Annual Expenses ÷ Safe Withdrawal Rate  |  Real Return = [(1 + Nominal − Tax Drag) ÷ (1 + Inflation)] − 1"
        formulaExplanation="Your Financial Independence target divides expected annual retirement spending by your Safe Withdrawal Rate (SWR), such as 4.0% (25× expenses) or 3.5% (28.57× expenses). Portfolio growth is compounded monthly in inflation-adjusted real dollars using the Fisher equation so your target stays in today's purchasing power."
        exampleHeading="Worked FIRE Example"
        exampleSummary="Example: $54,000 annual spending at a 4.0% Safe Withdrawal Rate with $185,000 invested and $3,250/month saved at 8.5% nominal return (2.5% inflation, 0.5% tax drag)."
        exampleSteps={[
          'Calculate the FIRE target: $54,000 ÷ 0.04 = $1,350,000 in today’s dollars.',
          'Compute real annual return: [(1 + 0.080) ÷ (1 + 0.025)] − 1 = 5.37% real annual yield.',
          'Compound $185,000 plus $3,250/month at the monthly real yield until the portfolio crosses $1,350,000.',
        ]}
      />
      <CalculatorInternalLinksBand calculatorPath="/fire-forecaster" />
    </>
  );
}
