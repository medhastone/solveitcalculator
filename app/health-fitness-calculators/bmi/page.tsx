import React from 'react';
import type { Metadata } from 'next';
import BmiClient from './BmiClient';

export const metadata: Metadata = {
  title: 'BMI Calculator & Body Mass Index Tool | Clinical Metric & Imperial | SolveIt',
  description: 'Calculate clinical Body Mass Index (BMI), personalized healthy weight envelope, metabolic risk tier, and anthropometric ratios using WHO and NIH standards. Includes Metric and Imperial units.',
  alternates: {
    canonical: 'https://solveitcalculator.com/health-fitness-calculators/bmi',
  },
  openGraph: {
    title: 'BMI Calculator & Body Mass Index Tool | SolveIt',
    description: 'Calculate clinical Body Mass Index (BMI), personalized healthy weight envelope, metabolic risk tier, and anthropometric ratios using WHO and NIH standards.',
    url: 'https://solveitcalculator.com/health-fitness-calculators/bmi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universal BMI & Body Composition Calculator | SolveIt',
    description: 'Calculate clinical Body Mass Index (BMI), personalized healthy weight envelope, metabolic risk tier, and anthropometric ratios using WHO and NIH standards.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://solveitcalculator.com' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Health & Fitness', 'item': 'https://solveitcalculator.com/health-fitness-calculators' },
        { '@type': 'ListItem', 'position': 3, 'name': 'BMI Calculator', 'item': 'https://solveitcalculator.com/health-fitness-calculators/bmi' }
      ]
    },
    {
      '@type': 'MedicalWebPage',
      'name': 'Universal BMI & Body Composition Clinical Workbench',
      'description': 'Calculate clinical Body Mass Index (BMI), personalized healthy weight envelope, metabolic risk tier, and anthropometric ratios using WHO and NIH standards.',
      'medicalAudience': 'Patients, Health Enthusiasts, Clinical Practitioners',
      'aspect': ['Overview', 'Calculation', 'Clinical Guidelines', 'Epidemiological Cutoffs']
    },
    {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How accurate is BMI as an indicator of body fatness?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Body Mass Index (BMI) provides a strong population-level surrogate for adiposity but does not distinguish lean tissue mass from adipose tissue. For clinical precision, combining BMI with waist circumference or dual-energy X-ray absorptiometry (DEXA) is recommended.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Why do Asian populations have different BMI cutoff thresholds?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'WHO Asian-Pacific guidelines lower the overweight threshold to 23.0 kg/m² and obesity to 27.5 kg/m² due to elevated visceral adipose tissue accumulation and metabolic risk factors at lower total body weights.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Is my health or biometric data saved to external servers?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'No. SolveIt Calculator executes all calculations locally on device using client-side JavaScript. Zero telemetry, cookies, or biometric records leave your browser sandbox.'
          }
        }
      ]
    }
  ]
};

export default function BmiPage() {
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
