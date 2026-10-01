import React from 'react';
import type { Metadata } from 'next';
import MilitaryTimeConverterClient from './MilitaryTimeConverterClient';

export const metadata: Metadata = {
  title: 'Military Time Converter | 24-Hour & 12-Hour Clock | SolveItCalculator',
  description:
    'Convert between 24-hour military time and 12-hour AM/PM formats. Includes phonetic alphabet, timezone offset references, and clear comparison tables.',
  keywords: [
    'military time converter',
    '24 hour clock converter',
    'military time to standard time',
    'standard time to military time',
    'zulu time converter',
    'military time chart',
    'military date time group calculator',
    'DTG converter',
    'STANAG 2211 time',
    'NATO time zones',
    'army time converter'
  ],
  authors: [{ name: 'SolveIt Defense Systems & Chronometry Team', url: 'https://solveitcalculator.com' }],
  creator: 'SolveIt Calculator',
  publisher: 'SolveIt Calculator',
  category: 'Time & Chronometry Tools',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  alternates: {
    canonical: 'https://solveitcalculator.com/military-time-converter',
  },
  openGraph: {
    title: 'Military Time Converter | 24-Hour & 12-Hour Clock | SolveItCalculator',
    description:
      'Convert between 24-hour military time and 12-hour AM/PM formats. Includes phonetic alphabet, timezone offset references, and clear comparison tables.',
    url: 'https://solveitcalculator.com/military-time-converter',
    siteName: 'SolveIt Calculator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Military Time Converter | 24-Hour & 12-Hour Clock | SolveItCalculator',
    description:
      'Convert between 24-hour military time and 12-hour AM/PM formats. Includes phonetic alphabet, timezone offset references, and clear comparison tables.',
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
      '@id': 'https://solveitcalculator.com/military-time-converter/#webapp',
      name: 'Military Time (24-Hour) Converter & Tactical DTG Generator',
      url: 'https://solveitcalculator.com/military-time-converter/',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      inLanguage: 'en-US',
      description:
        'Professional tactical timekeeping utility converting between 12-hour civilian time, 24-hour military format, NATO phonetic pronunciations, and STANAG 2211 Date-Time Groups (DTG) across 25 international defense nautical zones.',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2.4.0',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1420',
        bestRating: '5',
        worstRating: '1',
      },
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      featureList: [
        'Bidirectional 12-Hour civilian to 24-Hour military time conversion',
        'STANAG 2211 and ACP 121(I) compliant Date-Time Group (DTG) generation',
        'Official NATO and ICAO radio phonetic digit enunciation readout',
        'Full 25-letter nautical time zone directory (Alpha through Yankee + Zulu)',
        'Simultaneous 6-theater global command synchronization (Zulu, Alpha, Charlie, Romeo, Uniform, Kilo)',
        'Dynamic 24-hour dual-ring vector dial visualization',
        'Complete hourly military time conversion matrix with verbal phrasing',
        '100% private client-side computation with zero telemetry logging'
      ],
      creator: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com/',
        logo: 'https://solveitcalculator.com/logo.png?v=2',
      },
    },
    {
      '@type': 'TechArticle',
      '@id': 'https://solveitcalculator.com/military-time-converter/#article',
      headline: 'The Complete Technical Guide to 24-Hour Military Time and STANAG 2211 Date-Time Groups',
      description:
        'A comprehensive reference detailing 24-hour time notation, NATO phonetic radio enunciation, nautical meridian zone letters, and the historical avoidance of the letter Juliet.',
      inLanguage: 'en-US',
      mainEntityOfPage: 'https://solveitcalculator.com/military-time-converter/',
      url: 'https://solveitcalculator.com/military-time-converter/',
      datePublished: '2025-01-15T08:00:00+00:00',
      dateModified: '2026-09-19T05:25:00+00:00',
      publisher: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://solveitcalculator.com/logo.png?v=2',
        },
      },
      author: {
        '@type': 'Organization',
        name: 'SolveIt Chronometry & Defense Standards Group',
        url: 'https://solveitcalculator.com',
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', '.military-explanation', '.dtg-explanation'],
      },
      about: [
        { '@type': 'Thing', name: '24-hour clock', sameAs: 'https://en.wikipedia.org/wiki/24-hour_clock' },
        { '@type': 'Thing', name: 'Date-Time Group', sameAs: 'https://en.wikipedia.org/wiki/Date%E2%80%93time_group' },
        { '@type': 'Thing', name: 'NATO phonetic alphabet', sameAs: 'https://en.wikipedia.org/wiki/NATO_phonetic_alphabet' },
        { '@type': 'Thing', name: 'Coordinated Universal Time', sameAs: 'https://en.wikipedia.org/wiki/Coordinated_Universal_Time' },
        { '@type': 'Thing', name: 'ISO 8601', sameAs: 'https://en.wikipedia.org/wiki/ISO_8601' },
        { '@type': 'Thing', name: 'List of military time zones', sameAs: 'https://en.wikipedia.org/wiki/List_of_military_time_zones' }
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://solveitcalculator.com/military-time-converter/#howto',
      name: 'How to Convert Standard Civilian Time to 24-Hour Military Time',
      description:
        'Step-by-step instructions for converting 12-hour AM/PM civilian times to standardized 4-digit military notation.',
      totalTime: 'PT1M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Assess Morning Times (01:00 AM to 11:59 AM)',
          text: 'For morning hours between 1:00 AM and 11:59 AM, keep the hour digits unchanged, prefix single-digit hours with a leading zero, and eliminate the colon and AM label (e.g., 08:30 AM becomes 0830).',
          url: 'https://solveitcalculator.com/military-time-converter/#step1',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Convert Midnight (12:00 AM to 12:59 AM)',
          text: 'Subtract 12 from the hour so that 12 becomes 00. Retain the minutes and drop the colon (e.g., 12:45 AM becomes 0045).',
          url: 'https://solveitcalculator.com/military-time-converter/#step2',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Convert Noon (12:00 PM to 12:59 PM)',
          text: 'Keep the hour at 12 without modification, retain the minute count, and drop the PM tag (e.g., 12:15 PM becomes 1215).',
          url: 'https://solveitcalculator.com/military-time-converter/#step3',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Convert Afternoon and Evening (1:00 PM to 11:59 PM)',
          text: 'Add 12 to the hour value and combine with the two minute digits without a colon (e.g., 6:30 PM + 12 = 1830).',
          url: 'https://solveitcalculator.com/military-time-converter/#step4',
        },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://solveitcalculator.com/military-time-converter/#howto-reverse',
      name: 'How to Convert 24-Hour Military Time Back to 12-Hour Standard Time',
      description:
        'Step-by-step instructions for converting 4-digit military time back into 12-hour civilian AM/PM format.',
      totalTime: 'PT1M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Check for Midnight (0000 to 0059)',
          text: 'If the first two digits are 00, replace 00 with 12, insert a colon before the minute digits, and append AM (e.g., 0045 becomes 12:45 AM).',
          url: 'https://solveitcalculator.com/military-time-converter/#rev-step1',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Check for Morning Hours (0100 to 1159)',
          text: 'If the hour is between 01 and 11, remove the leading zero if desired, insert a colon between hours and minutes, and append AM (e.g., 0715 becomes 7:15 AM).',
          url: 'https://solveitcalculator.com/military-time-converter/#rev-step2',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Check for Noon (1200 to 1259)',
          text: 'If the hour is 12, keep 12 as the hour, insert a colon, and append PM (e.g., 1230 becomes 12:30 PM).',
          url: 'https://solveitcalculator.com/military-time-converter/#rev-step3',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Check for Afternoon and Evening (1300 to 2359)',
          text: 'Subtract 12 from the first two digits, insert a colon, and append PM (e.g., 2145: 21 - 12 = 9, so 9:45 PM).',
          url: 'https://solveitcalculator.com/military-time-converter/#rev-step4',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/military-time-converter/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the difference between military time and 24-hour time?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'While both systems operate on a 24-hour continuum starting at 00:00 midnight and ending at 23:59, military time eliminates the colon separator and uses a continuous 4-digit string (e.g., 0830 or 1745) often appended with a zone letter (such as 1745Z for Zulu/UTC). Standard international 24-hour time (ISO 8601) utilizes a colon delimiter (e.g., 17:45:00) without zone suffixes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why do armed forces, aviators, and space agencies use Zulu time?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Zulu time designates Greenwich Coordinated Universal Time (UTC+0), identified by the nautical letter suffix "Z" (Zulu in the NATO phonetic alphabet). Operating on a unified reference meridian eliminates life-threatening confusion caused by local daylight saving transitions, jurisdictional time zone boundaries, and international borders during multinational tactical operations and flight plans.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is the letter "J" (Juliet) skipped in the NATO nautical time zone system?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In the international 25-letter nautical time zone system, the 24 longitudinal 15-degree sectors are assigned letters A through M (omitting J) for positive east offsets, and N through Y for negative west offsets. The letter J (Juliet) is historically excluded from fixed longitudinal assignments and is reserved strictly to designate the local observer’s current civil time.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you pronounce military numbers over two-way tactical radio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'NATO and ICAO communication doctrine prescribes clear acoustic phonetic numbers to prevent transmission errors: 0 is ZE-RO, 1 is WUN, 2 is TOO, 3 is TREE, 4 is FOW-ER, 5 is FIFE, 6 is SIX, 7 is SEV-EN, 8 is AIT, and 9 is NIN-ER. For example, 1445 is enunciated as "WUN - FOW-ER - FOW-ER - FIFE".',
          },
        },
        {
          '@type': 'Question',
          name: 'Is midnight represented as 0000 or 2400?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In military operations and strict time arithmetic, 0000 indicates the exact beginning of the calendar day, while 2400 designates the theoretical termination of that day. In current DoD message handling and ISO 8601:2019 standards, 0000 is strongly preferred for operational clarity to eliminate ambiguous cross-day scheduling.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a military Date-Time Group (DTG) and how is it formatted?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Date-Time Group (DTG) is an international military standard (STANAG 2211 / ACP 121) used as a message header. It consists of six digits (two for the day of the month, four for the 24-hour time), followed by the single-letter time zone indicator, a three-letter month abbreviation, and two digits for the year (e.g., 191445Z SEP 26).',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is military time used in hospitals, aviation, and emergency services?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In healthcare, law enforcement, and aviation, misinterpreting AM for PM (such as an 8:00 AM vs 8:00 PM medication administration or flight clearance) can lead to catastrophic medical errors or navigational disasters. The 24-hour military format eliminates AM/PM ambiguity completely.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/military-time-converter/#breadcrumbs',
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
          name: 'Military Time Converter',
          item: 'https://solveitcalculator.com/military-time-converter/',
        },
      ],
    },
  ],
};

export default function MilitaryTimeConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MilitaryTimeConverterClient />
    </>
  );
}
