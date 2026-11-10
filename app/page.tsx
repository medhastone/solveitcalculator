import type { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';

export const metadata: Metadata = {
  title:
    'SolveItCalculator — Free Online Calculators, Step-by-Step Formulas & Reference Charts',
  description:
    'Free, fast online calculators with live step-by-step formulas and reference tables across Math, Finance & Salary Tax, Home & Construction, Unit & Recipe Conversion, Date & Time, Health, and Science.',
  alternates: {
    canonical: 'https://solveitcalculator.com',
  },
  openGraph: {
    title:
      'SolveItCalculator — Free Online Calculators, Step-by-Step Formulas & Reference Charts',
    description:
      'Calculate percentages, construction materials, recipe conversions, country take-home salary, loans, mortgages, BMI, and more with 100% transparent formulas.',
    url: 'https://solveitcalculator.com',
    siteName: 'SolveItCalculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'SolveItCalculator — Free Online Calculators, Step-by-Step Formulas & Reference Charts',
    description:
      'Calculate percentages, construction materials, recipe conversions, country take-home salary, loans, mortgages, BMI, and more with 100% transparent formulas.',
  },
};

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://solveitcalculator.com/#website',
      url: 'https://solveitcalculator.com',
      name: 'SolveItCalculator',
      description:
        'Free, formula-verified online calculators with step-by-step worked examples and authoritative reference tables.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://solveitcalculator.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://solveitcalculator.com/#organization',
      name: 'SolveItCalculator',
      url: 'https://solveitcalculator.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://solveitcalculator.com/apple-icon',
        width: 180,
        height: 180,
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
      <HomePageClient />
    </>
  );
}
