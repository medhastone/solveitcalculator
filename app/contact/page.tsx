import type { Metadata } from 'next';
import ContactErrorReportClient from '@/components/contact/ContactErrorReportClient';

export const metadata: Metadata = {
  title: 'Contact Us & Report a Calculation Error | SolveItCalculator',
  description:
    'Share general feedback, suggest a new calculator, or report a calculation error on SolveItCalculator.com with clear reproduction fields and transparent privacy.',
  alternates: {
    canonical: 'https://solveitcalculator.com/contact',
  },
  openGraph: {
    title: 'How can we help? — Contact & Report a Calculation Error | SolveItCalculator',
    description:
      'Share feedback, suggest a new calculator, or report a calculation error to help improve SolveItCalculator for everyone.',
    url: 'https://solveitcalculator.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us & Report a Calculation Error | SolveItCalculator',
    description:
      'Share feedback, suggest a new calculator, or report a calculation error to help improve SolveItCalculator for everyone.',
  },
};

const CONTACT_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://solveitcalculator.com/contact#webpage',
      url: 'https://solveitcalculator.com/contact',
      name: 'Contact Us & Report a Calculation Error | SolveItCalculator',
      description:
        'Share general feedback, suggest a new calculator, or report a calculation error on SolveItCalculator.com with clear reproduction fields and transparent privacy.',
      dateModified: '2026-11-16',
      mainEntity: {
        '@type': 'Organization',
        '@id': 'https://solveitcalculator.com/#organization',
        name: 'SolveItCalculator',
        url: 'https://solveitcalculator.com',
        email: 'info@solveitcalculator.com',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'info@solveitcalculator.com',
          contactType: 'customer support',
          url: 'https://solveitcalculator.com/contact',
        },
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/contact#breadcrumb',
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
          name: 'Contact Us',
          item: 'https://solveitcalculator.com/contact',
        },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSON_LD) }}
      />
      <ContactErrorReportClient />
    </>
  );
}
