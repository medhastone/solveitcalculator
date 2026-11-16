import type { Metadata } from 'next';
import AboutMethodologyClient from '@/components/about/AboutMethodologyClient';

export const metadata: Metadata = {
  title: 'About SolveItCalculator — Founder, Editorial Policy & Testing',
  description:
    'Learn who runs SolveItCalculator (founder Krchandan), what the site does and does not do, how calculators are built and tested, and our editorial policy.',
  alternates: {
    canonical: 'https://solveitcalculator.com/about',
  },
  openGraph: {
    title: 'About SolveItCalculator — Founder, Editorial Policy & Testing',
    description:
      'Who runs SolveItCalculator, what our calculators do and do not do, how tools are built and tested, error reporting, and our editorial policy.',
    url: 'https://solveitcalculator.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SolveItCalculator — Founder, Editorial Policy & Testing',
    description:
      'Who runs SolveItCalculator, what our calculators do and do not do, how tools are built and tested, error reporting, and our editorial policy.',
  },
};

const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://solveitcalculator.com/about#webpage',
      url: 'https://solveitcalculator.com/about',
      name: 'About SolveItCalculator — Founder, Editorial Policy & Testing',
      description:
        'Learn who runs SolveItCalculator (founder Krchandan), what the site does and does not do, how calculators are built and tested, and our editorial policy.',
      dateModified: '2026-11-16',
      mainEntity: {
        '@id': 'https://solveitcalculator.com/#organization',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://solveitcalculator.com/#organization',
      name: 'SolveItCalculator',
      url: 'https://solveitcalculator.com',
      email: 'info@solveitcalculator.com',
      founder: {
        '@type': 'Person',
        name: 'Krchandan',
        jobTitle: 'Founder & Lead Developer',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/about#breadcrumb',
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
          name: 'About SolveItCalculator',
          item: 'https://solveitcalculator.com/about',
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSON_LD) }}
      />
      <AboutMethodologyClient pageVariant="about" />
    </>
  );
}
