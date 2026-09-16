import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const HomePageClient = dynamic(() => import('./HomePageClient'), {
  ssr: true, // Keep SSR true for SEO, but enable lazy chunking
});

export const metadata: Metadata = {
  title: 'SolveItCalculator – Free Financial & Online Calculators',
  description: 'Use free online calculators for taxes, mortgages, retirement, investments, savings, loans, budgeting, and more. Fast, accurate, and easy to use.',
  keywords: [
    'free online calculators',
    'financial calculator',
    'tax calculator',
    'mortgage calculator',
    'retirement calculator',
    'investment calculator',
    'free calculator tools',
    'calculator website'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com',
  },
  openGraph: {
    title: 'SolveItCalculator: Free Financial & Online Calculators',
    description: 'Use free online calculators for taxes, mortgages, retirement, investments, savings, loans, budgeting, and more. Fast, accurate, and easy to use.',
    url: 'https://solveitcalculator.com',
    type: 'website',
    images: [
      {
        url: 'https://solveitcalculator.com/og-home.png',
        width: 1200,
        height: 630,
        alt: 'SolveItCalculator Suite',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolveItCalculator: Free Financial & Online Calculators',
    description: 'Use free online calculators for taxes, mortgages, retirement, investments, savings, loans, budgeting, and more. Fast, accurate, and easy to use.',
  }
};

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "SolveItCalculator",
        "url": "https://solveitcalculator.com",
        "description": "Use free online calculators for taxes, mortgages, retirement, investments, savings, loans, budgeting, and more. Fast, accurate, and easy to use.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://solveitcalculator.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "SolveItCalculator",
        "url": "https://solveitcalculator.com",
        "logo": "https://solveitcalculator.com/logo.png",
        "sameAs": [
          "https://twitter.com/solveitcalc",
          "https://facebook.com/solveitcalc"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the most accurate online calculator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SolveItCalculator provides some of the most accurate computational tools by utilizing precise IEEE-754 floating-point logic combined with high-precision arbitrary arithmetic libraries where needed, preventing standard JavaScript rounding errors common in legacy calculators."
            }
          },
          {
            "@type": "Question",
            "name": "Are the financial calculators free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Every single tool—including our complex mortgage amortization schedules, SIP returns, compound interest models, and credit card payoff visualizers—is 100% free forever. No registration or premium paywalls."
            }
          },
          {
            "@type": "Question",
            "name": "Do you store my financial or health data?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. SolveItCalculator uses an 'offline-first' architecture. Your inputs (salary, weight, debts, net worth) are processed locally in your device's browser using React state. We do not have database servers storing your personal metrics."
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
      <HomePageClient />
    </>
  );
}
