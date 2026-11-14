import type { Metadata } from 'next';
import MortgageCalculator from '@/components/calculators/MortgageCalculator';

const PAGE_TITLE = 'Home Mortgage Payment & PITI Calculator | SolveItCalculator';
const PAGE_DESCRIPTION =
  'Estimate monthly mortgage payments with principal, interest, property tax, and insurance. For example, $320,000 at 6.5% over 30 years is $2,023 P&I.';
const OG_IMAGE_URL =
  'https://solveitcalculator.com/api/og?title=Mortgage%20Calculator&badge=Finance&subtitle=Monthly%20mortgage%20payment%20with%20principal%2C%20interest%2C%20taxes%2C%20and%20insurance.&example=%24320%2C000%20at%206.5%25%20(30y)%20%3D%20%242%2C023%2Fmo';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: 'https://solveitcalculator.com/mortgage-calculator',
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://solveitcalculator.com/mortgage-calculator',
    siteName: 'SolveItCalculator',
    type: 'website',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Mortgage Calculator | SolveItCalculator',
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

export default function MortgagePage() {
  return <MortgageCalculator />;
}
