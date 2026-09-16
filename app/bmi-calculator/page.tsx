import React from 'react';
import type { Metadata } from 'next';
import BmiClient from '../health-fitness-calculators/bmi/BmiClient';

export const metadata: Metadata = {
  title: 'BMI Calculator & Body Mass Index Tool | Clinical Metric & Imperial | SolveIt Calculator',
  description: 'Calculate clinical Body Mass Index (BMI), personalized healthy weight envelope, metabolic risk tier, and anthropometric ratios using WHO and NIH standards. Includes Metric and Imperial units.',
  alternates: {
    canonical: 'https://solveitcalculator.com/bmi-calculator',
  },
  openGraph: {
    title: 'BMI Calculator & Body Mass Index Tool | SolveIt Calculator',
    description: 'Calculate clinical Body Mass Index (BMI), personalized healthy weight envelope, metabolic risk tier, and anthropometric ratios using WHO and NIH standards.',
    url: 'https://solveitcalculator.com/bmi-calculator',
    type: 'website',
  },
};

export default function BmiCalculatorPage() {
  return <BmiClient />;
}
