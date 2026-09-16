import React from 'react';
import type { Metadata } from 'next';
import HealthClient from './HealthClient';

export const metadata: Metadata = {
  title: 'Health & Fitness Calculators – BMI, Calories, Weight Loss & More | SolveItCalculator',
  description: 'Use free health and fitness calculators for BMI, calorie needs, body fat, weight loss, BMR, TDEE, heart rate, pregnancy, and nutrition planning. Fast and accurate.',
  alternates: {
    canonical: 'https://solveitcalculator.com/health-fitness-calculators',
  },
  openGraph: {
    title: 'Health & Fitness Calculators | Free BMI, Calories & Wellness Tools',
    description: 'Calculate BMI, calories, body fat, weight loss, nutrition, heart rate, and more with free health and fitness calculators from SolveItCalculator.',
    url: 'https://solveitcalculator.com/health-fitness-calculators',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health & Fitness Calculators | Free BMI, Calories & Wellness Tools',
    description: 'Calculate BMI, calories, body fat, weight loss, nutrition, heart rate, and more with free health and fitness calculators from SolveItCalculator.',
  },
};

export default function HealthPage() {
  return <HealthClient />;
}
