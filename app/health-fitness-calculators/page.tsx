import React from 'react';
import type { Metadata } from 'next';
import HealthFitnessClient from './HealthFitnessClient';
import { HEALTH_TOOLS, HEALTH_FAQS } from './healthFitnessData';

export const metadata: Metadata = {
  title: 'Health & Fitness Calculators | BMI, Calories, BMR & More | SolveItCalculator',
  description:
    'Use free health and fitness calculators for BMI, calories, BMR, TDEE, body fat, nutrition, fitness, sleep, pregnancy dates, and more. Explore formulas and calculation assumptions.',
  keywords: [
    'health calculators',
    'fitness calculators',
    'bmi calculator',
    'body fat calculator',
    'tdee calculator',
    'bmr calculator',
    'calorie calculator',
    'daily protein calculator',
    'running pace calculator',
    'zone 2 heart rate',
    'pregnancy due date calculator',
    'sleep cycle calculator',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/health-fitness-calculators',
  },
  openGraph: {
    title: 'Health & Fitness Calculators | SolveItCalculator',
    description:
      'Free health and fitness calculators for body measurements, calories, nutrition, exercise, sleep, and pregnancy dates with clear explanations.',
    url: 'https://solveitcalculator.com/health-fitness-calculators',
    siteName: 'SolveItCalculator',
    type: 'website',
    images: [
      {
        url: 'https://solveitcalculator.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Health & Fitness Calculators - SolveItCalculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health & Fitness Calculators | SolveItCalculator',
    description:
      'Calculate BMI, body fat %, TDEE, macros, running pace, heart rate zones, and pregnancy dates with transparent clinical formulas.',
    images: ['https://solveitcalculator.com/og-image.png'],
  },
};

export default function HealthFitnessPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Health & Fitness Calculators for Smarter Wellness Planning',
    description:
      'Free health and fitness calculators for body measurements, calories, nutrition, exercise, sleep, and pregnancy dates with clear explanations and stated assumptions.',
    url: 'https://solveitcalculator.com/health-fitness-calculators',
    isPartOf: {
      '@type': 'WebSite',
      name: 'SolveItCalculator',
      url: 'https://solveitcalculator.com',
    },
    about: {
      '@type': 'Thing',
      name: 'Health and Fitness Calculations',
      description: 'Mathematical and physiological models for body composition, metabolism, exercise pacing, and pregnancy timing.',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
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
        name: 'Health & Fitness Calculators',
        item: 'https://solveitcalculator.com/health-fitness-calculators',
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Health and Fitness Calculators Directory',
    itemListElement: HEALTH_TOOLS.map((tool, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: tool.name,
      description: tool.shortDesc,
      url: `https://solveitcalculator.com${tool.path}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HEALTH_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SolveItCalculator',
    url: 'https://solveitcalculator.com',
    email: 'info@solveitcalculator.com',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HealthFitnessClient />
    </>
  );
}
