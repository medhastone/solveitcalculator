import type { Metadata } from 'next';
import AgeCalculatorPageClient from '@/components/calculators/AgeCalculatorPageClient';

const PAGE_TITLE = 'Age in Years, Months & Days Calculator | SolveItCalculator';
const PAGE_DESCRIPTION =
  'Calculate your exact age in years, months, weeks, and days from any birth date. For example, someone born June 15, 1995 turns 31 on June 15, 2026.';
const OG_IMAGE_URL =
  'https://solveitcalculator.com/api/og?title=Age%20Calculator&badge=Date%20%26%20Time&subtitle=Exact%20age%20in%20years%2C%20months%2C%20weeks%2C%20and%20days.&example=Born%20June%2015%2C%201995%20%E2%86%92%2031%20years%20old';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: 'https://solveitcalculator.com/age-calculator',
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://solveitcalculator.com/age-calculator',
    siteName: 'SolveItCalculator',
    type: 'website',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Age Calculator — SolveItCalculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
};

export default function AgeCalculatorPage() {
  const initialTodayDate = new Date().toISOString().slice(0, 10);
  return <AgeCalculatorPageClient initialTodayDate={initialTodayDate} />;
}
