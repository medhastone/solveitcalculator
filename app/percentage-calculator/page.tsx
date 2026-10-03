import React from 'react';
import type { Metadata } from 'next';
import PercentageCalculatorClient from './PercentageCalculatorClient';

export const metadata: Metadata = {
  title: 'Percentage Calculator – Step-by-Step Percentage Increase, Decrease & Difference',
  description:
    'Free online percentage calculator. Calculate percentage increase, percentage decrease, percentage change, relative difference, reverse percentages, and discounts with instant step-by-step mathematical proofs.',
  keywords: [
    'percentage calculator',
    'percent calculator',
    'percentage increase calculator',
    'percentage decrease calculator',
    'percentage change calculator',
    'percentage difference calculator',
    'how to calculate percentage',
    'percent off calculator',
    'reverse percentage calculator',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/percentage-calculator',
  },
  openGraph: {
    title: 'Percentage Calculator – Step-by-Step Calculations & Formulas',
    description:
      'Free online percentage calculator. Calculate percentage increase, percentage decrease, change, differences, and discounts with step-by-step proofs.',
    url: 'https://solveitcalculator.com/percentage-calculator',
    siteName: 'SolveIt Calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Percentage Calculator – Free Online Math Tool',
    description:
      'Calculate percentage increase, decrease, differences, and discount values with transparent step-by-step arithmetic.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
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
          name: 'Math',
          item: 'https://solveitcalculator.com/math',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Percentage Calculator',
          item: 'https://solveitcalculator.com/percentage-calculator',
        },
      ],
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/percentage-calculator#app',
      name: 'Percentage Calculator',
      url: 'https://solveitcalculator.com/percentage-calculator',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      description:
        'Calculates direct percentages, percentage increase, decrease, change, and symmetric difference with step-by-step mathematical solutions.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do you calculate percentage of a number?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To calculate P percent of number Y, convert the percentage into a decimal by dividing by 100, then multiply by the whole: Result = (P / 100) × Y. For example, 20% of 500 = (20 / 100) × 500 = 100.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you calculate percentage increase?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To calculate percentage increase from initial value A to new value B, subtract the original value from the new value, divide by the original value, and multiply by 100: Percentage Increase = ((B - A) / A) × 100.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between percentage change and percentage difference?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Percentage change measures relative movement from a specific past baseline (directional, can be positive or negative). Percentage difference compares two values where neither is a baseline, dividing the absolute difference by their average.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you calculate reverse percentage to find the original whole?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'If you know a partial amount and what percentage share it represents, divide the partial amount by the percentage expressed as a decimal: Whole = Amount / (P / 100). For example, if $40 is 25% of the total, the original total is 40 / 0.25 = $160.',
          },
        },
      ],
    },
  ],
};

export default function PercentageCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PercentageCalculatorClient />
    </>
  );
}
