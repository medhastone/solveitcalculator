import React from 'react';
import type { Metadata } from 'next';
import BmiClient from '../health-fitness-calculators/bmi/BmiClient';

export const metadata: Metadata = {
  title: 'BMI Calculator – Body Mass Index & Healthy Weight Range Calculator',
  description:
    'Free online BMI calculator. Calculate your Body Mass Index (BMI), healthy weight range, and category cutoffs for adults according to World Health Organization (WHO) and CDC standards. Supports Metric and Imperial units.',
  keywords: [
    'bmi calculator',
    'body mass index calculator',
    'calculate bmi',
    'healthy weight calculator',
    'bmi chart',
    'ideal weight calculator',
    'bmi metric imperial',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/bmi-calculator',
  },
  openGraph: {
    title: 'BMI Calculator – Free Body Mass Index & Weight Range Tool',
    description:
      'Free online Body Mass Index calculator with WHO benchmarks, healthy weight ranges, and metric/imperial unit support.',
    url: 'https://solveitcalculator.com/bmi-calculator',
    siteName: 'SolveIt Calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMI Calculator – Calculate Body Mass Index Instantly',
    description:
      'Accurate BMI calculation with World Health Organization categorization and target healthy weight calculations.',
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
          name: 'Health & Fitness',
          item: 'https://solveitcalculator.com/health-fitness',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'BMI Calculator',
          item: 'https://solveitcalculator.com/bmi-calculator',
        },
      ],
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/bmi-calculator#app',
      name: 'BMI Calculator',
      url: 'https://solveitcalculator.com/bmi-calculator',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'All',
      description:
        'Calculates Body Mass Index (BMI) and target healthy weight ranges using WHO guidelines for adults in metric and imperial measurements.',
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
          name: 'What is the formula for calculating Body Mass Index (BMI)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In metric units, BMI = weight (kg) / [height (m)]². In US customary units, BMI = [weight (lbs) × 703] / [height (inches)]².',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the standard WHO BMI categories for adults?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'According to the World Health Organization (WHO): Underweight is a BMI below 18.5; Normal weight is 18.5 to 24.9; Overweight is 25.0 to 29.9; and Obesity is a BMI of 30.0 or higher.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the clinical limitations of BMI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BMI is an epidemiological screening tool based strictly on height and weight. It does not directly measure body fat percentage, muscle mass, bone density, or fat distribution (visceral vs. subcutaneous). Athletes with high lean muscle mass may have an elevated BMI without excess adiposity.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is a healthy weight range determined from BMI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A healthy weight range corresponds to a BMI between 18.5 and 24.9. Minimum healthy weight = 18.5 × [height (m)]², and maximum healthy weight = 24.9 × [height (m)]².',
          },
        },
      ],
    },
  ],
};

export default function BmiCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BmiClient />
    </>
  );
}
