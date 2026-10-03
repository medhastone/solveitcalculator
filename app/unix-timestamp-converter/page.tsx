import React from 'react';
import type { Metadata } from 'next';
import UnixTimestampConverterClient from './UnixTimestampConverterClient';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter | Epoch to Human Date & Time Calculator | SolveIt',
  description:
    'Convert seamlessly between Unix epoch timestamps and human-readable UTC/local date formats. Supports seconds, milliseconds, microseconds, nanoseconds, ISO-8601, and hexadecimal notation with zero telemetry.',
  keywords: [
    'unix timestamp converter',
    'epoch converter',
    'unix time to date',
    'epoch to human date',
    'timestamp to date',
    'current unix timestamp',
    'iso 8601 to timestamp',
    'epoch milliseconds converter',
    'hex timestamp converter',
    'year 2038 problem',
    'posix time converter',
    'batch timestamp converter',
    'jwt timestamp decoder'
  ],
  authors: [{ name: 'SolveIt Scientific Computing & Systems Engineering Group' }],
  creator: 'SolveIt Calculator',
  publisher: 'SolveIt Calculator',
  category: 'Time & Chronometry Tools',
  alternates: {
    canonical: 'https://solveitcalculator.com/unix-timestamp-converter',
  },
  openGraph: {
    title: 'Unix Timestamp Converter | Epoch to Human Date & Time Calculator | SolveIt',
    description:
      'High-precision epoch time conversion across seconds, milliseconds, microseconds, nanoseconds, and ISO-8601. Zero-telemetry client-side evaluation.',
    url: 'https://solveitcalculator.com/unix-timestamp-converter/',
    siteName: 'SolveIt Calculator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://solveitcalculator.com/og-home.png',
        width: 1200,
        height: 630,
        alt: 'SolveIt Unix Timestamp Converter and Epoch Intelligence Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unix Timestamp Converter | Epoch to Human Date Calculator',
    description:
      'High-precision epoch time conversion across seconds, milliseconds, microseconds, nanoseconds, and ISO-8601. Zero telemetry.',
    creator: '@SolveItCalc',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/unix-timestamp-converter/#webapp',
      url: 'https://solveitcalculator.com/unix-timestamp-converter/',
      name: 'SolveIt Unix Timestamp Converter & Epoch Developer Intelligence Hub',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All modern browsers (POSIX / IEEE 1003.1 Compliant)',
      browserRequirements: 'Requires JavaScript',
      description:
        'High-precision epoch time conversion across seconds, milliseconds, microseconds, nanoseconds, ISO-8601, and hexadecimal formats. Zero-telemetry client-side processing.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      creator: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com/',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/unix-timestamp-converter/#breadcrumbs',
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
          name: 'Time & Date Calculators',
          item: 'https://solveitcalculator.com/time-date/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Unix Timestamp Converter',
          item: 'https://solveitcalculator.com/unix-timestamp-converter/',
        },
      ],
    },
    {
      '@type': 'TechArticle',
      '@id': 'https://solveitcalculator.com/unix-timestamp-converter/#article',
      headline: 'Engineering Guide to Unix Epoch Time, Chronometry, and the 2038 Overflow Boundary',
      description:
        'Exhaustive developer specifications on POSIX timestamp mechanics, sub-millisecond precision tiers, leap second smearing, and signed 32-bit architectural remediation.',
      author: {
        '@type': 'Organization',
        name: 'SolveIt Scientific Computing',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SolveIt Scientific Computing',
      },
      url: 'https://solveitcalculator.com/unix-timestamp-converter/',
      citation: [
        'https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_16',
        'https://datatracker.ietf.org/doc/html/rfc3339',
        'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now'
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/unix-timestamp-converter/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a Unix timestamp and the Unix Epoch?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Unix timestamp is an integer representing the total elapsed SI seconds since 00:00:00 UTC on Thursday, January 1, 1970 (the Unix Epoch), excluding leap seconds according to the POSIX / IEEE 1003.1 standard.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Year 2038 problem (Y2038)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Year 2038 problem occurs on 19 January 2038 at 03:14:07 UTC when signed 32-bit integers reach their maximum value (2,147,483,647) and overflow to negative values (-2,147,483,648), resetting clocks back to 13 December 1901. Modern systems mitigate this by migrating to 64-bit integer chronometry.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why was January 1, 1970 chosen as the Epoch?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The date was designated arbitrarily by Bell Labs computer scientists Dennis Ritchie and Ken Thompson during the inception of Unix. It represented a convenient round beginning close to Unix development without consuming excess bits for retrospective historical dating.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I distinguish seconds from milliseconds?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Inspect the character length: In current contemporary eras, a timestamp in seconds comprises 10 digits (e.g. 1726743842). A millisecond timestamp has 13 digits (e.g. 1726743842000). Microseconds contain 16 digits, while nanoseconds span 19 digits.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Unix time record leap seconds?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Per POSIX specifications, every calendar day is mandated to contain exactly 86,400 seconds. When an international leap second occurs, standard Unix time either repeats the final second or relies on cloud leap second smearing to distribute the extra duration across surrounding hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can a Unix timestamp be negative?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Signed integer implementations allow negative numbers, which represent dates prior to January 1, 1970. For instance, -86400 corresponds exactly to December 31, 1969 00:00:00 UTC.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does ISO-8601 differ from Unix epoch time?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Unix epoch time is a numeric integer scalar indicating seconds since a reference moment. ISO-8601 is a standardized alphanumeric string notation (e.g. 2024-09-19T11:04:02Z) displaying year, month, day, hour, minute, second, and optional timezone offset flags.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do MongoDB ObjectIDs use Unix timestamps?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A standard 12-byte MongoDB ObjectID embeds the 4-byte (32-bit) Unix timestamp in seconds as its first 8 hexadecimal characters. Parsing the first 8 hex characters provides the documents precise server creation time without storing a separate date field.',
          },
        },
      ],
    },
  ],
};

export default function UnixTimestampConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UnixTimestampConverterClient />
    </>
  );
}
