import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UnitConverter from '@/components/calculators/UnitConverter';
import {
  CONVERSION_CATEGORIES,
  CONVERSION_CATEGORY_SLUGS,
  resolveConversionCategorySlug,
} from '@/lib/conversionsData';

interface ConversionCategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CONVERSION_CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: ConversionCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const resolvedSlug = resolveConversionCategorySlug(category);
  if (!resolvedSlug || category !== resolvedSlug) {
    return {
      title: 'Unit Converter | SolveItCalculator',
    };
  }

  const config = CONVERSION_CATEGORIES[resolvedSlug];
  const canonicalUrl = `https://solveitcalculator.com${config.canonicalPath}`;
  const ogImageUrl = `https://solveitcalculator.com/api/og?title=${encodeURIComponent(
    `${config.h1} ${config.h1Highlight}`.trim()
  )}&badge=${encodeURIComponent(config.shortLabel)}&subtitle=${encodeURIComponent(
    config.metaDescription.slice(0, 110)
  )}&example=${encodeURIComponent(config.topQuestionBanner.oneLineAnswer.slice(0, 72))}`;

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.ogTitle,
      description: config.ogDescription,
      url: canonicalUrl,
      type: 'website',
      siteName: 'SolveItCalculator',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: config.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.ogTitle,
      description: config.ogDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function ConversionCategoryPage({
  params,
}: ConversionCategoryPageProps) {
  const { category } = await params;
  const resolvedSlug = resolveConversionCategorySlug(category);

  if (!resolvedSlug || category !== resolvedSlug) {
    notFound();
  }

  return <UnitConverter initialCategory={resolvedSlug} />;
}
