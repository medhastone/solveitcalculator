import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { localizedSeoContent } from '@/lib/seoContent';
import EmiCalculatorClient from '../EmiCalculatorClient';

type Props = {
  params: Promise<{ country: string }>
};


export function generateStaticParams() {
  return Object.keys(localizedSeoContent).map((country) => ({
    country,
  }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const countrySlug = resolvedParams.country.toLowerCase();
  
  if (!(countrySlug in localizedSeoContent)) {
    return {};
  }
  
  const data = localizedSeoContent[countrySlug as keyof typeof localizedSeoContent];
  return {
    title: data.meta.seoTitle,
    description: data.meta.metaDescription,
  };
}

export default async function CountryEmiCalculatorPage({ params }: Props) {
  const resolvedParams = await params;
  const countrySlug = resolvedParams.country.toLowerCase();
  
  if (!(countrySlug in localizedSeoContent)) {
    notFound();
  }

  return <EmiCalculatorClient defaultCountrySlug={countrySlug} />;
}
