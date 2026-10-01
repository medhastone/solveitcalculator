import React from 'react';
import type { Metadata } from 'next';
import HealthClient from './HealthClient';

export const metadata: Metadata = {
  title: 'Health & Fitness Calculators | BMI, Calories, BMR & More | SolveItCalculator',
  description:
    'Use free health and fitness calculators for BMI, calories, BMR, TDEE, body fat, nutrition, fitness, sleep, pregnancy dates, and more. Explore formulas and calculation assumptions.',
  alternates: {
    canonical: 'https://solveitcalculator.com/health-fitness-calculators',
  },
  openGraph: {
    title: 'Health & Fitness Calculators for Smarter Wellness Planning | SolveItCalculator',
    description:
      'Calculate BMI, calories, BMR, TDEE, body fat, fitness, sleep, and pregnancy dates with clear formulas, assumptions, and helpful explanations.',
    url: 'https://solveitcalculator.com/health-fitness-calculators',
    siteName: 'SolveItCalculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health & Fitness Calculators | SolveItCalculator',
    description:
      'Explore health and fitness calculators for body metrics, calories, nutrition, exercise, sleep, and pregnancy dates with clear explanations and assumptions.',
  },
};

export default function HealthPage() {
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

  const orgSchema = {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <HealthClient />
    </>
  );
}
