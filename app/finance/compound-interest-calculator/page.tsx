import { Metadata } from 'next';
import CompoundInterestClient from './CompoundInterestClient';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator: Free Investment Growth Tool | SolveItCalculator',
  description: 'Calculate your investment growth with our free compound interest calculator. Factor in monthly contributions, compounding frequency, and see your wealth grow.',
  keywords: [
    'compound interest calculator',
    'investment calculator',
    'future value calculator',
    'savings calculator',
    'wealth growth calculator',
    'APY calculator',
    'ROI calculator',
    'financial calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/compound-interest-calculator',
  },
  openGraph: {
    title: 'Compound Interest Calculator: Free Investment Growth Tool',
    description: 'Calculate your investment growth with our free compound interest calculator. Factor in monthly contributions, compounding frequency, and see your wealth grow.',
    url: 'https://solveitcalculator.com/finance/compound-interest-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest Calculator: Free Investment Growth Tool',
    description: 'Calculate your investment growth with our free compound interest calculator. Factor in monthly contributions, compounding frequency, and see your wealth grow.',
  }
};

export default function CompoundInterestCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Compound Interest Calculator",
        "url": "https://solveitcalculator.com/finance/compound-interest-calculator",
        "description": "Calculate your investment growth with our free compound interest calculator. Factor in monthly contributions, compounding frequency, and see your wealth grow.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript"
      },
      {
        "@type": "SoftwareApplication",
        "name": "Compound Interest Calculator",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "BreadcrumbList",
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
            "name": "Financial Calculators",
            "item": "https://solveitcalculator.com/finance"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Compound Interest Calculator"
          }
        ]
      },
      {
        "@type": "Article",
        "headline": "How to Calculate Compound Interest: The Ultimate Guide",
        "author": {
          "@type": "Organization",
          "name": "SolveItCalculator Engineering"
        },
        "publisher": {
          "@type": "Organization",
          "name": "SolveItCalculator",
          "logo": {
            "@type": "ImageObject",
            "url": "https://solveitcalculator.com/logo.png?v=2"
          }
        },
        "datePublished": "2024-01-01T08:00:00+08:00",
        "dateModified": "2026-09-01T08:00:00+08:00"
      },
      {
        "@type": "HowTo",
        "name": "How to Use the Compound Interest Calculator",
        "description": "A step-by-step guide on how to calculate future value using compounding interest.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Set Your Baseline",
            "text": "Enter your starting principal amount. This is the lump sum you are depositing today."
          },
          {
            "@type": "HowToStep",
            "name": "Define Contributions",
            "text": "Input how much you plan to consistently add each month to accelerate the compounding effect."
          },
          {
            "@type": "HowToStep",
            "name": "Estimate Your Rate",
            "text": "Enter the expected annual return. Historically, the S&P 500 averages around 7-10% annually before inflation."
          },
          {
            "@type": "HowToStep",
            "name": "Select Time Horizon",
            "text": "Choose how many years you intend to let the investment grow."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the Rule of 72?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Rule of 72 is a mental math shortcut used to estimate how long it takes an investment to double in value. Simply divide 72 by the annual rate of return."
            }
          },
          {
            "@type": "Question",
            "name": "Does compounding frequency make a big difference?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The more frequently interest is compounded (e.g., daily vs. annually), the higher the effective yield."
            }
          },
          {
            "@type": "Question",
            "name": "Is inflation factored into this compound interest calculator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "By default, this calculator shows nominal value (not adjusted for inflation). To estimate your 'real' return purchasing power, subtract the expected inflation rate from your estimated annual rate."
            }
          },
          {
            "@type": "Question",
            "name": "Can I lose money with compound interest?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "While compound interest is a mathematical certainty, the underlying investments generating that interest (like index funds, stocks, or bonds) can fluctuate. Only high-yield savings accounts and CDs offer guaranteed interest rates."
            }
          },
          {
            "@type": "Question",
            "name": "Why is time the most important factor in compounding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Because the growth is exponential. The interest earned in year 30 is significantly larger than the interest earned in year 10, because the principal base has expanded massively."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between APR and APY?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "APR (Annual Percentage Rate) is the simple interest rate over a year. APY (Annual Percentage Yield) takes compounding into account, representing the actual effective return you will earn over a year."
            }
          },
          {
            "@type": "Question",
            "name": "How are monthly contributions calculated here?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In this model, monthly contributions are added at the end of each period, and interest is calculated based on the selected compounding frequency."
            }
          },
          {
            "@type": "Question",
            "name": "How does this compare to a simple interest calculator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A simple interest calculator only calculates interest on the initial principal. A compound interest calculator computes interest on the principal PLUS all previously accumulated interest, resulting in an upward-curving snowball effect."
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
      <CompoundInterestClient />
    </>
  );
}
