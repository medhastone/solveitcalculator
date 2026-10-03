import React from 'react';
import type { Metadata } from 'next';
import EventCountdownClient from './EventCountdownClient';

export const metadata: Metadata = {
  title: 'Event Countdown Calculator & Live Timer | Days, Hours Left & Alerts | SolveIt',
  description:
    'Free online live event countdown calculator. Track exact days, hours, minutes & seconds left until weddings, vacations, birthdays, exams & launches with instant device notification alerts.',
  keywords: [
    'event countdown calculator',
    'countdown timer',
    'days until calculator',
    'online event countdown',
    'live countdown clock',
    'how many days until',
    'wedding countdown calculator',
    'vacation countdown timer',
    'birthday countdown clock',
    'retirement countdown timer',
    'business days until event',
    'countdown timer with notifications',
    'exam countdown timer',
    'pregnancy due date countdown',
    'new year countdown clock',
    'milestone progress tracker',
    'event timer widget',
    'free countdown clock',
    'days hours minutes seconds countdown',
    'shareable countdown link',
  ],
  authors: [{ name: 'SolveIt Calculator Editorial & Math Team' }],
  creator: 'SolveIt Calculator',
  publisher: 'SolveIt Calculator',
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
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/event-countdown',
  },
  openGraph: {
    title: 'Event Countdown Calculator & Live Timer | SolveIt',
    description:
      'Create a live real-time countdown for any upcoming event, wedding, vacation, exam, or milestone with progress tracking, device notification sync, and calendar export.',
    url: 'https://solveitcalculator.com/time-date/event-countdown/',
    siteName: 'SolveIt Calculator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://solveitcalculator.com/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'SolveIt Event Countdown Calculator and Live Timer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Event Countdown Calculator & Live Timer | SolveIt',
    description:
      'Live countdown chronometer with business day filtering, milestone checklists, and browser notification alerts.',
    images: ['https://solveitcalculator.com/icon-512x512.png'],
    creator: '@SolveItCalc',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://solveitcalculator.com/#organization',
      name: 'SolveIt Calculator',
      url: 'https://solveitcalculator.com/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://solveitcalculator.com/icon-512x512.png',
        width: 512,
        height: 512,
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://solveitcalculator.com/time-date/event-countdown/#webpage',
      url: 'https://solveitcalculator.com/time-date/event-countdown/',
      name: 'Event Countdown Calculator & Live Timer | Days, Hours Left & Alerts',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://solveitcalculator.com/#website',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com/',
      },
      about: {
        '@type': 'Thing',
        name: 'Event Countdown, Time Tracking, and Milestone Scheduling',
      },
      description:
        'A comprehensive live event countdown chronometer and days until calculator featuring milestone checklists, working day exclusions, browser notification alerts, and shareable calendar links.',
      inLanguage: 'en-US',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '#main-countdown-display', '#countdown-stat-badges', '#faq-container'],
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/event-countdown/#app',
      name: 'SolveIt Event Countdown Calculator & Live Timer',
      alternateName: [
        'Days Until Calculator',
        'Live Countdown Clock',
        'Event Timer',
        'Milestone Countdown Tracker',
        'Online Days Left Calculator',
      ],
      url: 'https://solveitcalculator.com/time-date/event-countdown/',
      applicationCategory: 'UtilitiesApplication',
      applicationSubCategory: 'Time Tracking, Countdown Timer & Event Planning',
      operatingSystem: 'All (Windows, macOS, iOS, Android, Linux, ChromeOS)',
      browserRequirements:
        'Requires JavaScript. Works on all modern desktop and mobile web browsers with optional Notification API support.',
      softwareVersion: '3.5.0',
      description:
        'High-precision live event countdown calculator tracking days, hours, minutes, and seconds. Includes customizable milestones, business days filtering, browser notification sync, and .ICS calendar export.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      featureList: [
        'Real-time down-to-the-second live ticking countdown clock',
        'Browser notification alerts for T-0, 1 hour, 24 hours, 7 days, and milestone checkpoints',
        'Business days and weekend exclusions filter',
        'Milestone timeline roadmap with 25%, 50%, 75%, 90% and 100% completion status',
        'Local in-browser private saved events watchlist with independent alert controls',
        'One-click .ICS calendar event export for Google Calendar, Apple Calendar, and Microsoft Outlook',
        'Shareable dynamic countdown links with URL-encoded parameters',
        'Embeddable iframe widget code generator for blogs and websites',
        'Daylight Saving Time and leap year auto-synchronization',
        'Local in-browser processing with zero account requirements',
      ],
      creator: {
        '@id': 'https://solveitcalculator.com/#organization',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/time-date/event-countdown/#breadcrumb',
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
          name: 'Event Countdown Calculator',
          item: 'https://solveitcalculator.com/time-date/event-countdown/',
        },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://solveitcalculator.com/time-date/event-countdown/#howto',
      name: 'How to Count Down to Any Event in 4 Easy Steps',
      description:
        'Learn how to configure and track real-time countdowns for your milestones, vacations, weddings, exams, and launches.',
      totalTime: 'PT1M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Choose Your Event',
          text: 'Name your event and pick your goal, celebration, or deadline (e.g. Wedding, Vacation, Exam, Product Launch).',
          url: 'https://solveitcalculator.com/time-date/event-countdown/#step1',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Pick Date & Time',
          text: 'Select the target day and time; your local time zone and daylight saving time adjustments are applied automatically.',
          url: 'https://solveitcalculator.com/time-date/event-countdown/#step2',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Track in Real Time',
          text: 'Watch days, hours, minutes, and seconds tick down live down to the second with milestone progress tracking.',
          url: 'https://solveitcalculator.com/time-date/event-countdown/#step3',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Enable Alerts & Share',
          text: 'Turn on synchronized browser notification alerts, save to Google/Apple calendar, or share the direct link with family and coworkers.',
          url: 'https://solveitcalculator.com/time-date/event-countdown/#step4',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/time-date/event-countdown/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do browser notification alerts work on this countdown calculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When you enable notifications, SolveIt schedules synchronized browser alerts that notify you when your countdown reaches T-0 (Event Day), 1 hour before, 24 hours before, 7 days before, or when passing major milestones (25%, 50%, 75%, 90%). All alerts operate privately within your browser.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does daylight saving time affect my countdown?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SolveIt Calculator automatically takes daylight saving time transitions into account based on your selected time zone. Whether clocks spring forward or fall back between today and your event, your countdown stays accurate to the exact minute and second.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does this countdown tool save any of my personal event information?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. All countdown calculations and saved event lists are stored 100% privately in your local browser storage. No dates, titles, or personal details are ever transmitted or stored on external servers.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I count only business days instead of total calendar days?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Simply turn on the "Count only business days (skip weekends)" option in the settings. The calculator will automatically exclude all Saturdays and Sundays so you know your exact working days left.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens when the countdown hits zero?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When the timer reaches zero, a celebration screen appears, and an optional sound or notification alert is played if you enabled it. The timer will then automatically count days elapsed since your big day arrived.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I embed this countdown timer on my website or blog?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Click the "Embed on Website" button under your live countdown to copy a clean, responsive code snippet that works smoothly on WordPress, Squarespace, Wix, Notion, or custom HTML sites.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I share my live countdown link with friends, family, or coworkers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Click "Share Link" to generate a direct link. The event name and date are encoded securely in the URL link itself, allowing recipients to view your live countdown instantly on any device without creating an account.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does leap year affect countdown accuracy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SolveIt Calculator uses standard astronomical and Gregorian calendar rules to automatically include February 29th during leap years (such as 2024, 2028, etc.), guaranteeing that multi-year countdown calculations never drift by a single day.',
          },
        },
      ],
    },
  ],
};

export default function EventCountdownPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventCountdownClient />
    </>
  );
}
