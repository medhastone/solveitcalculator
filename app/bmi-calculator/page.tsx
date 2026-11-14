import type { Metadata } from 'next';
import BmiCalculator from '@/components/calculators/BmiCalculator';

const PAGE_TITLE = 'Adult Body Mass Index (BMI) Calculator | SolveItCalculator';
const PAGE_DESCRIPTION =
  'Calculate adult Body Mass Index (BMI) and WHO healthy weight range in kg or lbs. For example, 70 kg at 175 cm gives a BMI of 22.9 kg/m² (Normal).';
const OG_IMAGE_URL =
  'https://solveitcalculator.com/api/og?title=BMI%20Calculator&badge=Health%20%26%20Fitness&subtitle=Adult%20Body%20Mass%20Index%20and%20WHO%20healthy%20weight%20range.&example=70%20kg%20at%20175%20cm%20%E2%86%92%20BMI%2022.9%20(Normal)';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: 'https://solveitcalculator.com/bmi-calculator',
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://solveitcalculator.com/bmi-calculator',
    siteName: 'SolveItCalculator',
    type: 'website',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'BMI Calculator — SolveItCalculator',
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

export default function BmiPage() {
  return (
    <BmiCalculator
      initialMode="bmi"
      customTitle="BMI Calculator"
      customSubtitle="Calculate adult Body Mass Index (BMI) and WHO healthy weight range in Metric (kg/cm) or US Imperial (lbs/in) units."
      customHeroSymbol="BMI"
      isPilotTemplate={true}
    />
  );
}
