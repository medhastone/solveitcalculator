import React from 'react';
import type { Metadata } from 'next';
import FireForecasterClient from './FireForecasterClient';

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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FIRE_FORECASTER_JSON_LD) }}
      />
      <FireForecasterClient />
    </>
  );
}
