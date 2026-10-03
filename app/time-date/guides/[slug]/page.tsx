import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTimeToolBySlug, getTimeToolsByCategory } from '@/lib/time-date/data';
import ToolShell from '@/components/time-date/ToolShell';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = getTimeToolsByCategory('guides');
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTimeToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Time Guide | SolveItCalculator',
      description: 'Educational guide on timekeeping and calendar systems.',
    };
  }

  const canonicalUrl = `https://solveitcalculator.com${tool.canonicalPath}`;

  return {
    title: `${tool.metaTitle} | SolveItCalculator`,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${tool.metaTitle} | SolveItCalculator`,
      description: tool.metaDescription,
      url: canonicalUrl,
      siteName: 'SolveItCalculator',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.metaTitle} | SolveItCalculator`,
      description: tool.metaDescription,
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTimeToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolShell tool={tool} />;
}
