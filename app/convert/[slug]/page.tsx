import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveSlug, CANONICAL_POPULAR_PAIRS } from '@/lib/converterSlugs';
import { CONVERSION_CATEGORIES } from '@/lib/conversions';
import UnitConverterView from '@/components/UnitConverterView';
import CategoryConverterView from '@/components/CategoryConverterView';
import VolumeConverterClient from '@/app/volume-converter/VolumeConverterClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveSlug(slug);

  if (!resolved) {
    return {
      title: 'Unit Converter | SolveIt Calculator',
      description: 'Convert between hundreds of physical units with precision.'
    };
  }

  return {
    title: resolved.title,
    description: resolved.description,
    alternates: {
      canonical: resolved.canonicalUrl
    },
    openGraph: {
      title: resolved.title,
      description: resolved.description,
      url: resolved.canonicalUrl,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: resolved.title,
      description: resolved.description
    }
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  // 1. All category slugs
  for (const cat of CONVERSION_CATEGORIES) {
    params.push({ slug: cat.id });
    if (cat.id.includes('_')) {
      params.push({ slug: cat.id.replace(/_/g, '-') });
    }
  }

  // Volume & Capacity specific category aliases
  params.push(
    { slug: 'volume-converter' },
    { slug: 'volume-and-capacity' },
    { slug: 'volume-and-capacity-converter' },
    { slug: 'capacity' },
    { slug: 'capacity-converter' },
    { slug: 'volume-capacity' }
  );

  // 2. Canonical popular pairs
  for (const pair of CANONICAL_POPULAR_PAIRS) {
    params.push({ slug: pair.slug });
  }

  return params;
}

export default async function ConverterSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolveSlug(slug);

  if (!resolved) {
    notFound();
  }

  if (resolved.type === 'category') {
    if (resolved.category.id === 'volume') {
      return <VolumeConverterClient />;
    }
    return <CategoryConverterView categoryId={resolved.category.id} />;
  }

  return (
    <UnitConverterView
      categoryId={resolved.category.id}
      fromUnitId={resolved.fromUnit.id}
      toUnitId={resolved.toUnit.id}
      slug={resolved.slug}
    />
  );
}
