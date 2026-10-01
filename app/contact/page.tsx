import React from 'react';
import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | SolveItCalculator – Support, Feature Requests & Feedback',
  description:
    'Get in touch with the SolveItCalculator team. Submit calculator feature requests, report calculation issues, partner with us, or share feedback. Fast response within 24-48 hours.',
  alternates: {
    canonical: 'https://solveitcalculator.com/contact',
  },
  openGraph: {
    title: 'Contact Us | SolveItCalculator',
    description:
      'Have questions, feedback, or a tool request? Reach out to the SolveItCalculator engineering and editorial team.',
    url: 'https://solveitcalculator.com/contact',
    siteName: 'SolveItCalculator',
    type: 'website',
  },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact SolveItCalculator',
    url: 'https://solveitcalculator.com/contact',
    description:
      'Contact SolveItCalculator for tool requests, formula verification, bug reports, and general feedback.',
    mainEntity: {
      '@type': 'Organization',
      name: 'SolveItCalculator',
      url: 'https://solveitcalculator.com',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'info@solveitcalculator.com',
        contactType: 'customer support',
        availableLanguage: ['English'],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
        <ContactClient />
      </div>
    </>
  );
}
