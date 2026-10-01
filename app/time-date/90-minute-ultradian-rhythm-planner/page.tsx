import React from 'react';
import type { Metadata } from 'next';
import UltradianRhythmClient from './UltradianRhythmClient';

export const metadata: Metadata = {
  title: '90-Minute Ultradian Rhythm Planner & BRAC Cycle Chronometer | SolveIt',
  description:
    'Plan your daily deep work blocks with Dr. Nathaniel Kleitman’s 90-minute Basic Rest-Activity Cycle (BRAC). Optimize cognitive alertness peaks, schedule 20-minute refractory pauses, and prevent mental burnout.',
  keywords: [
    '90-minute ultradian rhythm',
    'ultradian rhythm planner',
    'basic rest activity cycle',
    'BRAC calculator',
    'deep work planner',
    'deliberate practice cycles',
    'Nathaniel Kleitman',
    'focus timer 90 minutes',
    'chronobiology productivity',
  ],
  openGraph: {
    title: '90-Minute Ultradian Rhythm Planner & BRAC Cycle Chronometer',
    description:
      'Plan your daily deep work blocks with Dr. Nathaniel Kleitman’s 90-minute Basic Rest-Activity Cycle (BRAC). Optimize cognitive alertness peaks, schedule 20-minute refractory pauses, and prevent mental burnout.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '90-Minute Ultradian Rhythm Planner & BRAC Cycle Chronometer',
    description:
      'Plan your daily deep work blocks with Dr. Nathaniel Kleitman’s 90-minute Basic Rest-Activity Cycle (BRAC). Optimize cognitive alertness peaks, schedule 20-minute refractory pauses, and prevent mental burnout.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: '90-Minute Ultradian Rhythm Planner',
      url: 'https://ais-dev-dsvk4qs4l6kbll5jfioudl-360469277331.asia-east1.run.app/time-date/90-minute-ultradian-rhythm-planner',
      description:
        'Interactive chronobiology calculator and schedule generator that synchronizes daily deep work blocks with Dr. Nathaniel Kleitman’s 90-minute Basic Rest-Activity Cycle (BRAC).',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://ais-dev-dsvk4qs4l6kbll5jfioudl-360469277331.asia-east1.run.app/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Time & Date',
          item: 'https://ais-dev-dsvk4qs4l6kbll5jfioudl-360469277331.asia-east1.run.app/time-date',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: '90-Minute Ultradian Rhythm Planner',
          item: 'https://ais-dev-dsvk4qs4l6kbll5jfioudl-360469277331.asia-east1.run.app/time-date/90-minute-ultradian-rhythm-planner',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a 90-minute ultradian rhythm?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pioneered by sleep researcher Dr. Nathaniel Kleitman, the Basic Rest-Activity Cycle (BRAC) is an innate human biological oscillation lasting approximately 90 to 120 minutes characterized by alternating peak alertness and refractory restorative recovery.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the 90-minute Ultradian Method differ from Pomodoro (25/5)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'While the 25/5 Pomodoro method is ideal for overcoming initial friction and completing administrative tasks, complex cognitive tasks such as software engineering and writing take up to 20 minutes to load into working memory. The 90-minute ultradian window allows sustained flow state without premature interruption.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many 90-minute ultradian blocks can a human execute per day?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Empirical research on deliberate practice by Dr. K. Anders Ericsson demonstrates that elite performers rarely exceed 3 to 4 high-intensity 90-minute sessions per day (approximately 4.5 hours of true deliberate practice) before cognitive returns diminish.',
          },
        },
      ],
    },
  ],
};

export default function UltradianRhythmPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UltradianRhythmClient />
    </>
  );
}
