import type { Metadata } from 'next';

export const focusTimerMetadata: Metadata = {
  title: 'Focus & Break Timer – Pomodoro, 52/17 & 3 Calm Focus Music Soundscapes | SolveIt',
  description:
    'Boost concentration and prevent burnout with SolveIt Focus & Break Timer. Free Pomodoro (25/5), 52/17 rhythm, distraction tracker & 3 calm focus soundscapes for work and study.',
  keywords: [
    'focus timer',
    'break timer',
    'focus and break timer',
    'pomodoro timer',
    'study timer',
    '52 17 timer',
    'calm music for work',
    'calm music for study',
    'ambient focus soundscapes',
    'deep work timer',
    'study music',
    'pomodoro with music',
    'distraction counter',
    'binaural alpha focus',
    'rain sound for studying',
    'productivity timer',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/focus-and-break-timer',
  },
  openGraph: {
    title: 'Focus & Break Timer – Pomodoro, 52/17 & 3 Calm Focus Music Soundscapes | SolveIt',
    description:
      'Boost concentration, avoid burnout, and get more done with timed focus sessions, break reminders, distraction tracking, and 3 calm ambient soundscapes for work, study, and restorative breaks.',
    url: 'https://solveitcalculator.com/time-date/focus-and-break-timer/',
    siteName: 'SolveIt Calculator',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://solveitcalculator.com/og-focus-timer.png',
        width: 1200,
        height: 630,
        alt: 'SolveIt Focus & Break Timer with 3 Calm Ambient Music Soundscapes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Focus & Break Timer – Pomodoro, 52/17 & 3 Calm Focus Music Soundscapes',
    description:
      'Free online Pomodoro (25/5), 52/17 desk rhythm, and 90-minute deep work intervals with distraction logging and 3 calm soundscapes for work and study.',
    images: ['https://solveitcalculator.com/og-focus-timer.png'],
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

export const focusTimerJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/focus-and-break-timer/#webapp',
      name: 'SolveIt Focus & Break Timer',
      alternateName: 'Pomodoro & 52/17 Study Timer with Calm Music',
      url: 'https://solveitcalculator.com/time-date/focus-and-break-timer/',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5 Audio.',
      inLanguage: 'en-US',
      description:
        'A comprehensive, privacy-first online focus and break timer with Pomodoro (25/5), 52/17 desk rhythm, 90-minute ultradian cycles, built-in distraction tracker, and 3 procedural calm ambient soundscapes for work, study, and mental recharge.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Classic Pomodoro 25/5 interval timer',
        '52/17 Desk Method rhythm',
        '90-Minute Ultradian Deep Work Blocks',
        '3 Built-in Procedural Calm Soundscapes (Deep Work Flow, Study Rain, Zen Recharge)',
        'Built-in Distraction & Urge Counter',
        'Daily Focus Score & Fatigue Diagnostics',
        'Export Productivity Reports to CSV',
        '100% Free & Private in-browser execution with zero advertising',
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/time-date/focus-and-break-timer/#breadcrumb',
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
          name: 'Focus & Break Timer',
          item: 'https://solveitcalculator.com/time-date/focus-and-break-timer/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/time-date/focus-and-break-timer/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the optimal focus-to-break ratio for cognitive work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For short-burst tasks, the Classic Pomodoro (25 min focus / 5 min break) is ideal. For prolonged knowledge work such as programming or writing, empirical tracking highlights the 52/17 Desk Method (52 minutes work / 17 minutes rest) or 90-minute ultradian rhythms as the most effective ratios for cognitive replenishment.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do the 3 calm focus soundscapes (Deep Work, Study Rain, Zen Recharge) boost concentration?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SolveIt provides 3 procedural ambient soundscapes: (1) Deep Work Flow utilizes 10Hz binaural alpha-wave entrainment with warm drone pads to induce sustained focus; (2) Study & Memory pairs soft acoustic rain noise with pentatonic chimes to mask erratic background noises; and (3) Zen Recharge provides 7-second oceanic breath swells with 432Hz Tibetan singing bowl harmonics to trigger parasympathetic relaxation during breaks.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the 52/17 Desk Method differ from standard Pomodoro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 52/17 ratio was discovered by desk-tracking analytics firm Draugiem Group. They observed that the top 10% most productive knowledge workers dedicated 52 consecutive minutes to singular tasks followed by 17 minutes of total screen disconnection, preventing afternoon fatigue.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the Distraction Counter improve focus over time?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Logging an urge or notification with the Distraction Counter transforms unconscious impulses into conscious observations. This cognitive defusion technique satisfies the urge without opening distracting apps, training long-term attentional endurance.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I customize the sprint intervals and cycle counts?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Expand the Timer Settings & Sound Options panel to set custom focus minutes (1 to 180 min), short break durations (1 to 60 min), long break durations (1 to 90 min), and the exact number of cycles before triggering a long break.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I export my daily productivity logs to CSV or Excel?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Click the Export CSV button to instantly download a formatted spreadsheet containing your sprint durations, task names, categories, timestamps, total focus time, distraction count, and deep work score.',
          },
        },
      ],
    },
  ],
};
