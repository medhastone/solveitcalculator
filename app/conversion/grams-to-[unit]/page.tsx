import { UNIT_DATABASE } from '../../../lib/conversion-units';
import DynamicConversionClient from '../../../components/conversion/dynamic/DynamicConversionClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ unit: string }> }) {
  const resolvedParams = await params;
  const unitConfig = UNIT_DATABASE[resolvedParams.unit];
  if (!unitConfig) {
    return { title: 'Not Found' };
  }

  return {
    title: `Grams to ${unitConfig.name} Calculator | SolveIt Metrology`,
    description: unitConfig.description,
  };
}

// Generate static params for all the units we want to pre-render
export async function generateStaticParams() {
  return Object.keys(UNIT_DATABASE).map((unit) => ({
    unit,
  }));
}

export default async function DynamicConversionPage({ params }: { params: Promise<{ unit: string }> }) {
  const resolvedParams = await params;
  const unitConfig = UNIT_DATABASE[resolvedParams.unit];

  if (!unitConfig) {
    notFound();
  }

  return <DynamicConversionClient unit={unitConfig} />;
}
