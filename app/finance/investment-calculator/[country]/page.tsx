import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { investmentConfigData, JurisdictionKey } from '@/lib/investment-data';
import InvestmentCalculatorClient from '../InvestmentCalculatorClient';

export function generateStaticParams() {
  return Object.keys(investmentConfigData).map((country) => ({
    country,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const country = resolvedParams.country as JurisdictionKey;
  const config = investmentConfigData[country];
  
  if (!config) {
    return { title: 'Not Found' };
  }

  return {
    title: config.seoTitle || `Global Recurring Investment Calculator - ${config.name} Edition | SolveIt`,
    description: config.seoDescription || `Simulate future portfolio capitalization, exponential compound interest trajectories, and ${config.name} tax deductions using our Interactive Wealth Architecture Engine.`,
  };
}

export default async function InvestmentCalculatorCountryPage({ params }: { params: Promise<{ country: string }> }) {
  const resolvedParams = await params;
  const country = resolvedParams.country as JurisdictionKey;
  const config = investmentConfigData[country];

  if (!config) {
    notFound();
  }

  return <InvestmentCalculatorClient initialJurisdiction={country} />;
}
