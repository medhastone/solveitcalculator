import { Metadata } from 'next';
import AddSubtractTimeCalculator from '@/components/AddSubtractTimeCalculator';

export const metadata: Metadata = {
  title: 'Add & Subtract Time Calculator | Date & Time | SolveItCalculator',
  description:
    'Add or subtract years, months, weeks, days, hours, minutes, and seconds from a date and time. Use optional business-day and time-zone settings.',
  keywords: [
    'add and subtract time calculator',
    'time calculator',
    'add time to date',
    'subtract time from date',
    'date and time calculator',
    'business days calculator',
    'add days to date',
    'subtract days from date',
    'hours and minutes calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/add-subtract-time',
  },
  openGraph: {
    title: 'Add & Subtract Time Calculator | Date & Time | SolveItCalculator',
    description:
      'Add or subtract years, months, weeks, days, hours, minutes, and seconds from a date and time. Use optional business-day and time-zone settings.',
    url: 'https://solveitcalculator.com/time-date/add-subtract-time',
    siteName: 'SolveIt Calculator',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add & Subtract Time Calculator | Date & Time | SolveItCalculator',
    description:
      'Add or subtract years, months, weeks, days, hours, minutes, and seconds from a date and time. Use optional business-day and time-zone settings.',
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

export default function AddSubtractTimePage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://solveitcalculator.com/add-subtract-time-calculator#webapp",
        "name": "Add & Subtract Time Calculator",
        "alternateName": "Instant Date & Time Offset Calculator",
        "url": "https://solveitcalculator.com/add-subtract-time-calculator",
        "operatingSystem": "All modern web browsers (Desktop, Tablet, Mobile)",
        "applicationCategory": "UtilityApplication",
        "applicationSubCategory": "Time & Date Computational Tool",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Add or subtract years, months, weeks, days, hours, minutes, and seconds",
          "Include or exclude weekends with business days calculation mode",
          "Live multi-timezone synchronization across UTC, EST, GMT, CET, and IST",
          "Gregorian calendar leap year normalization and month-end clamping",
          "ISO 8601 timestamp and epoch unix time output",
          "Future age calculation by birth year",
          "Export calculation results to CSV/TXT and print schedule plan"
        ],
        "description": "High-precision computational tool to add or subtract years, months, weeks, days, hours, minutes, and seconds from any date. Includes business days calculation, leap year validation, and multi-timezone offsets."
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://solveitcalculator.com/add-subtract-time-calculator#breadcrumbs",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://solveitcalculator.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Time & Date Calculators",
            "item": "https://solveitcalculator.com/time-date"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Add & Subtract Time Calculator",
            "item": "https://solveitcalculator.com/add-subtract-time-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "@id": "https://solveitcalculator.com/add-subtract-time-calculator#howto",
        "name": "How to Add or Subtract Time From Any Date",
        "description": "Step-by-step procedure to calculate past and future dates accurately using calendrical offsets and business days constraints.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Select Baseline Date and Time",
            "text": "Choose your reference calendar date, clock hour, minute, second, and associated international timezone."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Set Operation Mode",
            "text": "Toggle between Add (+) to project future milestones or Subtract (−) to audit historical timestamps."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Input Offsets & Configure Workweek Rules",
            "text": "Enter years, months, weeks, days, hours, minutes, and seconds, while choosing whether to include all calendar days or skip weekend intervals (business days mode)."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Read, Copy, or Print Target Result",
            "text": "Inspect the calculated target date, time, day badge, ISO 8601 timestamp, epoch, or use the Print Schedule Plan button for a paper report."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://solveitcalculator.com/add-subtract-time-calculator#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does adding a month work on the 31st of January?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "When adding one month to January 31st, February has only 28 (or 29 in a leap year) days. Our algorithm employs Gregorian month clamping: it caps the target day at the last valid day of February, preventing unintended overflow into March."
            }
          },
          {
            "@type": "Question",
            "name": "What is ISO 8601 and why is it recommended?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ISO 8601 (e.g. 2026-11-12T16:15:00Z) is the international standard for timestamp data. It completely removes ambiguity between international formats (such as MM/DD/YYYY vs DD/MM/YYYY), making it ideal for API calls, databases, and flight ticketing."
            }
          },
          {
            "@type": "Question",
            "name": "How are Daylight Saving Time (DST) changes handled?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Calculations performed in reference time zones follow standard IANA timezone offset rules. When an offset crosses a spring-forward (+1h) or fall-back (−1h) transition, the resulting local clock updates according to local jurisdictional laws."
            }
          },
          {
            "@type": "Question",
            "name": "Can I add fractional hours like 7.5 hours?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. You can enter 7 hours and 30 minutes in their designated fields, or make use of our Work Shift preset module which automatically converts half-hour portions into exact 30-minute additions."
            }
          },
          {
            "@type": "Question",
            "name": "Does subtracting time allow going into past calendar eras?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The computational workbench handles historical timestamps across multiple centuries back to Gregorian calendar inception, accurately factoring in historical leap year occurrences."
            }
          },
          {
            "@type": "Question",
            "name": "How do business days differ from calendar days?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Calendar days represent uninterrupted 24-hour cycles (365 or 366 days per year). Business days count only Monday through Friday, skipping weekends and optional statutory holidays, reflecting actual corporate and legal operating time."
            }
          },
          {
            "@type": "Question",
            "name": "What happens if my start date falls on a weekend?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In Business Days mode, if the starting date is on a Saturday or Sunday, the system automatically advances to the following Monday morning before beginning offset counting, ensuring accurate deliverable planning."
            }
          },
          {
            "@type": "Question",
            "name": "Is my scheduling data kept private?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Completely. All calculations are executed strictly within your local browser sandbox via JavaScript. No data is stored, cached on external servers, or shared with analytics providers."
            }
          },
          {
            "@type": "Question",
            "name": "Can I calculate past epochs for software debugging?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our Future Age & Epoch Marker module outputs the Unix timestamp (seconds since January 1, 1970 UTC) for any computed result, ideal for developers inspecting backend database expirations."
            }
          },
          {
            "@type": "Question",
            "name": "How does this tool handle leap seconds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Standard civil time follows UTC without accounting for discrete leap seconds, adhering to POSIX standards where every day is treated as containing exactly 86,400 SI seconds."
            }
          },
          {
            "@type": "Question",
            "name": "How can I print or export my calculated date?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Click the 'Export CSV / TXT' button on the results card to download a formatted text summary, or use 'Print Schedule Plan' for a printer-optimized paper copy."
            }
          },
          {
            "@type": "Question",
            "name": "What is the maximum offset range supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can calculate offsets up to 999 years and over 1,000,000 minutes in a single calculation, enabling long-range projections such as generational trusts or infrastructure lifespan planning."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AddSubtractTimeCalculator />
    </>
  );
}
