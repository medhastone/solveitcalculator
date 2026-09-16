import React from 'react';
import type { Metadata } from 'next';
import GramToLiterClient from './GramToLiterClient';

export const metadata: Metadata = {
  title: 'SolveIt Calculator — Gram to Liter Converter (g to L) – Instant Conversion Calculator',
  description:
    'Convert grams to liters instantly with our free Gram to Liter Converter. Calculate accurate volume conversions based on ingredient density, formulas, conversion charts, and FAQs.',
  keywords: [
    'gram to liter',
    'grams to liters',
    'g to L',
    'convert grams to liters',
    'grams to liters converter',
    'grams to liters water',
    'grams to liters milk',
    'grams to liters oil',
    'mass to volume conversion',
    'density volume calculator',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/gram-to-liter',
  },
  openGraph: {
    title: 'SolveIt Calculator — Gram to Liter Converter (g to L) – Instant Conversion Calculator',
    description:
      'Convert grams to liters instantly with our free Gram to Liter Converter. Calculate accurate volume conversions based on ingredient density, formulas, conversion charts, and FAQs.',
    url: 'https://solveitcalculator.com/conversion/gram-to-liter',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://solveitcalculator.com/conversion/gram-to-liter#webpage',
      url: 'https://solveitcalculator.com/conversion/gram-to-liter',
      name: 'SolveIt Calculator — Gram to Liter Converter (g to L) – Instant Conversion Calculator',
      description:
        'Convert grams to liters instantly with our free Gram to Liter Converter. Calculate accurate volume conversions based on ingredient density, formulas, conversion charts, and FAQs.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://solveitcalculator.com/#website',
        name: 'SolveIt Metrology & Computational Systems',
        url: 'https://solveitcalculator.com',
      },
      breadcrumb: {
        '@id': 'https://solveitcalculator.com/conversion/gram-to-liter#breadcrumb',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/conversion/gram-to-liter#breadcrumb',
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
          name: 'Conversion',
          item: 'https://solveitcalculator.com/conversion',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Weight & Mass',
          item: 'https://solveitcalculator.com/weight-mass-converter',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Gram',
          item: 'https://solveitcalculator.com/conversion/gram',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Gram to Liter',
          item: 'https://solveitcalculator.com/conversion/gram-to-liter',
        },
      ],
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/conversion/gram-to-liter#app',
      name: 'SolveIt Gram to Liter Metrology Workbench',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires JavaScript. Runs client-side isolated sandbox.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'HowTo',
      '@id': 'https://solveitcalculator.com/conversion/gram-to-liter#howto',
      name: 'How to Convert Grams to Liters Using Density',
      description:
        'A certified metrological procedure to calculate geometric volume in liters from mass in grams using substance-specific bulk or absolute density.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Measure or input mass in grams',
          text: 'Determine the net mass (m) of the target substance in grams using a calibrated scale.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Identify substance density',
          text: 'Obtain the volumetric density (ρ) in grams per milliliter (g/mL) at standardized temperature (20°C).',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Execute metrology formula',
          text: 'Compute spatial volume: Liters = Grams / (Density × 1000).',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Extract volume output',
          text: 'Read the resultant spatial volume in liters (L) or derive secondary fluid unit equivalents.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/conversion/gram-to-liter#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How many liters are in 1 gram?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For pure water at 4°C with a standard density of 1.000 g/mL, exactly 1 gram occupies 0.001 liters (1 milliliter). For any other substance, 1 gram equals 1 / (density × 1000) liters.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can grams be directly converted to liters?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No, grams measure mass while liters measure volume. Direct conversion is physically impossible without knowing the density of the specific matter being converted.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many liters is 1000 grams of water?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "1,000 grams of pure liquid water at 4°C equals exactly 1.000 liter (1 L) because water's fundamental reference density is 1.000 g/mL (or 1 kg/L).",
          },
        },
        {
          '@type': 'Question',
          name: 'Why does density affect the conversion?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Density is mass per unit volume (ρ = m/V). Denser substances pack more mass into less space; therefore, 1000 grams of dense honey takes up far less volume (0.704 L) than 1000 grams of lightweight gasoline (1.342 L).',
          },
        },
        {
          '@type': 'Question',
          name: 'Is gram a weight unit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Technically, the gram is the International System of Units (SI) base unit of mass, defined via the Planck constant (h). Colloquially in commercial trade and everyday usage, it is treated as a weight unit.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is liter a volume unit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, the liter is an accepted non-SI metric unit of volume equal to 1 cubic decimeter (1 dm³ or 1,000 cubic centimeters / 10⁻³ m³).',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use this converter for cooking ingredients?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The converter provides factory-calibrated density presets for key culinary items including whole milk, cooking oils, honey, melted butter, granulated sugar, and bulk all-purpose flour.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I convert fuel weights to liters?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Preset densities for automotive gasoline (0.745 g/mL) and industrial ethanol (0.789 g/mL) allow instant weight-to-tank capacity calculations.',
          },
        },
        {
          '@type': 'Question',
          name: 'How accurate is this converter?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SolveIt runs deterministic IEEE 754 64-bit floating-point kernels locally in your browser, maintaining NIST SP 811 calibration accuracy up to 6 selectable decimal places.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the formula for converting grams to liters?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The universal formula is: Liters = Grams / (Density [in g/mL] × 1000). For standard water, this simplifies to Liters = Grams / 1000.',
          },
        },
      ],
    },
  ],
};

export default function GramToLiterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GramToLiterClient />
    </>
  );
}
