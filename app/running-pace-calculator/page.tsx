import React from 'react';
import type { Metadata } from 'next';
import RunningPaceCalculatorClient from './RunningPaceCalculatorClient';

export const metadata: Metadata = {
  title: 'Running Pace & Lap Split Calculator | Free Race Pace, Splits & Training Zones | SolveIt',
  description:
    'Free running pace calculator for runners: compute exact pace, finish times, kilometer and mile lap splits, training zones, and negative split pacing strategies.',
  keywords: [
    'running pace calculator',
    'race pace calculator',
    'lap split calculator',
    'marathon pace calculator',
    'half marathon pace calculator',
    '5k pace calculator',
    '10k pace calculator',
    'negative split calculator',
    'running splits per km',
    'running splits per mile',
    'running training zones',
    'vdot pace calculator',
    'race time predictor',
    'pace wristband generator',
    'running speed converter',
  ],
  authors: [{ name: 'SolveIt Calculator' }],
  creator: 'SolveIt Calculator',
  publisher: 'SolveIt Calculator',
  alternates: {
    canonical: 'https://solveitcalculator.com/running-pace-calculator',
  },
  openGraph: {
    title: 'Running Pace & Lap Split Calculator | SolveIt',
    description:
      'Precision pacing workbench for runners: calculate pace, finish times, kilometer & mile splits, training zones, and negative split strategies.',
    url: 'https://solveitcalculator.com/running-pace-calculator',
    siteName: 'SolveIt Calculator',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://solveitcalculator.com/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'SolveIt Running Pace & Lap Split Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Running Pace & Lap Split Calculator | SolveIt',
    description:
      'Precision pacing workbench for runners: calculate pace, finish times, kilometer & mile splits, training zones, and negative split strategies.',
    images: ['https://solveitcalculator.com/icon-512x512.png'],
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
      '@type': ['WebApplication', 'SoftwareApplication'],
      '@id': 'https://solveitcalculator.com/running-pace-calculator/#app',
      name: 'Running Pace & Lap Split Calculator',
      alternateName: [
        'Race Pace Calculator',
        'Running Split Matrix',
        'Pace & Lap Split Workbench',
      ],
      url: 'https://solveitcalculator.com/running-pace-calculator/',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      description:
        'Calculate exact running paces, target finish times, kilometer and mile lap splits, training zones, and negative split strategies for 5K, 10K, Half Marathon, and Marathon distances.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Bidirectional pace, time, and distance calculation',
        'Granular kilometer and mile lap split matrix with cumulative checkpoints',
        'Even, negative, and positive race split strategy modeling',
        'Personalized physiological training zones (Easy, Marathon, Tempo, Interval, Repetition)',
        'Printable race-day wristband pacing cheat sheet',
        'Export split tables to CSV for Garmin, Strava, and spreadsheets',
        'Shareable pacing plan copied directly to clipboard',
        'Preset distances for 1 Mile, 5K, 10K, Half Marathon, and Marathon',
      ],
      creator: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/running-pace-calculator/#breadcrumb',
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
          name: 'Time & Date',
          item: 'https://solveitcalculator.com/time-date/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Running Pace & Lap Split Calculator',
          item: 'https://solveitcalculator.com/running-pace-calculator/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/running-pace-calculator/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is running pace calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Running pace is calculated by dividing total running time (in minutes and seconds) by the total distance covered. For example, running 10 kilometers in 50 minutes yields a pace of 5:00 minutes per kilometer (50 min ÷ 10 km = 5 min/km).',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I convert pace from min/km to min/mile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To convert minutes per kilometer to minutes per mile, multiply your pace in total seconds by 1.609344. For instance, a 5:00 min/km pace is 300 seconds × 1.609344 = 482.8 seconds, which equals 8 minutes and 3 seconds per mile (8:03 min/mi).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a negative split and why is it recommended?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A negative split means running the second half of a race faster than the first half. Most world records in endurance events are set with negative splits because starting conservatively preserves glycogen stores and avoids premature fatigue.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the required pace for a sub-4 hour marathon?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Breaking 4 hours in a full marathon (42.195 km / 26.219 miles) requires holding an average pace of 5:41 minutes per kilometer (9:09 minutes per mile) for a final clock time of 3:59:54.',
          },
        },
        {
          '@type': 'Question',
          name: 'What pace is required to run a sub-20 minute 5K?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To break 20 minutes in a 5K race, you must sustain an average pace of 4:00 minutes per kilometer (6:26 minutes per mile) or faster throughout the entire 5,000-meter course.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you print a race-day pace wristband with this tool?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Click the "Print Wristband" button in the workbench header. The page dynamically formats the split checkpoint table into a compact, printable strip designed to be worn during races.',
          },
        },
      ],
    },
  ],
};

export default function RunningPaceCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RunningPaceCalculatorClient />
    </>
  );
}
