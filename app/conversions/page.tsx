import React from 'react';
import { Metadata } from 'next';
import ConversionsClient from './ConversionsClient';
import { CONVERSION_FAQS, POPULAR_CONVERSION_PAIRS } from './conversionsData';

export const metadata: Metadata = {
  title: 'Unit Converter | Length, Weight, Temperature & More | SolveItCalculator',
  description:
    'Convert length, weight, temperature, volume, area, speed, time, pressure, energy, data and more. Use free unit converters with clear results, formulas and conversion tables.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversions',
  },
  openGraph: {
    title: 'Unit Converter for Length, Weight, Temperature & More | SolveItCalculator',
    description:
      'Convert everyday, technical, engineering, scientific, cooking, automotive, and technology units with clear results, formulas, and conversion tables.',
    url: 'https://solveitcalculator.com/conversions',
    siteName: 'SolveItCalculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unit Converter | SolveItCalculator',
    description:
      'Convert length, weight, temperature, volume, speed, data, pressure, energy, and more with easy-to-use unit conversion tools.',
  },
};

export default function ConversionsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/conversions',
        url: 'https://solveitcalculator.com/conversions',
        name: 'Unit Converter for Length, Weight, Temperature & More | SolveItCalculator',
        description:
          'Convert length, weight, temperature, volume, area, speed, time, pressure, energy, data and more. Use free unit converters with clear results, formulas and conversion tables.',
        inLanguage: 'en-US',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://solveitcalculator.com/#website',
          url: 'https://solveitcalculator.com/',
          name: 'SolveItCalculator',
        },
        about: {
          '@type': 'Thing',
          name: 'Unit Converter',
          description:
            'Free unit converter for length, weight, temperature, volume, area, speed, pressure, energy, data storage, and cooking measurements.',
        },
        breadcrumb: {
          '@id': 'https://solveitcalculator.com/conversions#breadcrumb',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://solveitcalculator.com/conversions#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://solveitcalculator.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Unit Converter',
            item: 'https://solveitcalculator.com/conversions',
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'SolveIt Universal Unit Converter',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'ItemList',
        name: 'Popular Unit Conversions',
        itemListElement: POPULAR_CONVERSION_PAIRS.map((pair, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: `${pair.fromName} to ${pair.toName} Converter`,
          description: `Convert ${pair.fromName} to ${pair.toName} (${pair.fromSymbol} to ${pair.toSymbol}) with formula and steps.`,
          url: `https://solveitcalculator.com/conversion/${pair.slug}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: CONVERSION_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConversionsClient />
    </>
  );
}
