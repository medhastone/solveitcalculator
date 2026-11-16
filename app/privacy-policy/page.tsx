import type { Metadata } from 'next';
import PrivacyAccessibilityClient from '@/components/privacy/PrivacyAccessibilityClient';

export const metadata: Metadata = {
  title: 'Privacy Policy & Browser Data Protection | SolveItCalculator',
  description:
    'Learn what information SolveItCalculator collects, how calculator inputs stay private in your browser, your cookie and advertising choices, and our commitment to data protection.',
  alternates: {
    canonical: 'https://solveitcalculator.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy & Browser Data Protection | SolveItCalculator',
    description:
      'Learn how calculator inputs stay 100% private in your browser on SolveItCalculator.com.',
    url: 'https://solveitcalculator.com/privacy-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy & Browser Data Protection | SolveItCalculator',
    description:
      'Learn how calculator inputs stay 100% private in your browser on SolveItCalculator.com.',
  },
};

const PRIVACY_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://solveitcalculator.com/privacy-policy#webpage',
      url: 'https://solveitcalculator.com/privacy-policy',
      name: 'Privacy Policy & Browser Data Protection | SolveItCalculator',
      description:
        'Learn what information SolveItCalculator collects, how calculator inputs stay private in your browser, your cookie and advertising choices, and our commitment to data protection.',
      dateModified: '2026-11-16',
      isPartOf: {
        '@id': 'https://solveitcalculator.com/#website',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/privacy-policy#breadcrumb',
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
          name: 'Privacy Policy',
          item: 'https://solveitcalculator.com/privacy-policy',
        },
      ],
    },
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRIVACY_JSON_LD) }}
      />
      <PrivacyAccessibilityClient pageVariant="privacy" />
    </>
  );
}
