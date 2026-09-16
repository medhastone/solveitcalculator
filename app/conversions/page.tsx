import { Metadata } from 'next';
import ConversionsClient from './ConversionsClient';

export const metadata: Metadata = {
  title: 'Unit Converter & Conversion Tools – Convert Length, Weight, Volume & More | SolveItCalculator',
  description: 'Use free unit converters to convert length, weight, temperature, volume, area, speed, time, data storage, cooking measurements, and more with accurate results.',
  keywords: [
    'Unit Converter',
    'Conversion Tools',
    'Measurement Converter',
    'Weight Converter',
    'Length Converter',
    'Volume Converter',
    'Temperature Converter',
    'Area Converter',
    'Speed Converter',
    'Time Converter',
    'Data Storage Converter',
    'Cooking Converter',
    'Metric Converter',
    'Imperial Converter',
    'Online Unit Converter',
    'Unit Conversion Calculator',
    'conversion calculator',
    'free converter tools'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/unit-converter-conversion-tools/',
  },
  openGraph: {
    title: 'Unit Converter & Conversion Tools | Free Measurement Converters',
    description: 'Convert length, weight, volume, temperature, area, speed, time, data storage, and more with accurate unit conversion tools from SolveItCalculator.',
    url: 'https://solveitcalculator.com/unit-converter-conversion-tools/',
    siteName: 'SolveItCalculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unit Converter & Conversion Tools | Free Measurement Converters',
    description: 'Convert units quickly and accurately with free converters for weight, length, volume, temperature, speed, area, time, and more.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/unit-converter-conversion-tools/',
      url: 'https://solveitcalculator.com/unit-converter-conversion-tools/',
      name: 'Unit Converter & Conversion Tools – Convert Length, Weight, Volume & More | SolveItCalculator',
      description: 'Use free unit converters to convert length, weight, temperature, volume, area, speed, time, data storage, cooking measurements, and more with accurate results.',
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
        description: 'Find free Unit Converter & Conversion Tools for converting weight, length, temperature, volume, area, speed, time, data storage, cooking measurements, and more. Fast, accurate, and easy-to-use converters for everyday calculations.',
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
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
            name: 'Unit Converter & Conversion Tools',
            item: 'https://solveitcalculator.com/unit-converter-conversion-tools/',
          },
        ],
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'SolveIt Universal Unit Converter & Conversion Tools',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does SolveIt Calculator ensure conversion accuracy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every calculation uses international standards (BIPM SI Brochure, NIST SP 811, and ISO 80000). Conversion factors between base units are defined with mathematical exactness, eliminating compounding errors.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why are US gallons different from British Imperial gallons?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The US gallon is historically based on the 18th-century Queen Anne wine gallon (~3.7854 L), while the British Imperial gallon was established in 1824 as the volume of 10 pounds of distilled water (~4.546 L).',
          },
        },
        {
          '@type': 'Question',
          name: 'How does temperature conversion work between Celsius and Fahrenheit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Temperature scales feature different zero points and step sizes. To convert Celsius to Fahrenheit: F = (C * 9/5) + 32. To convert Fahrenheit to Celsius: C = (F - 32) * 5/9.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does SolveIt Calculator work offline?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. All unit conversions, radix number translations, and formula lookups run client-side in your browser for instant privacy and zero network delay.',
          },
        },
      ],
    },
  ],
};

export default function ConversionsPage() {
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
