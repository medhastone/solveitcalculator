import React from 'react';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { MATH_CALCULATORS } from '@/lib/mathCalculatorsData';
import MathToolDetailClient from '@/components/math/MathToolDetailClient';

const DUPLICATE_MATH_REDIRECTS: Record<string, string> = {
  'gcf-lcm-calculator': '/math/gcd-and-lcm-calculator',
  'lcm-gcd-calculator': '/math/gcd-and-lcm-calculator',
  'exponent-root-calculator': '/math/exponent-calculator',
  'quadratic-equation-solver': '/math/quadratic-equation-calculator',
  'linear-equation-solver': '/math/equation-solver',
  'order-of-operations-calculator': '/math/scientific-calculator',
  'rounding-calculator': '/math/average-calculator',
  'mean-median-mode-calculator': '/math/average-calculator',
  'proportion-calculator': '/math/ratio-calculator',
  'decimal-to-fraction-calculator': '/math/fraction-to-decimal-calculator',
  'percentage-difference-calculator': '/math/percentage-change-calculator',
};

export async function generateStaticParams() {
  return MATH_CALCULATORS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = MATH_CALCULATORS.find((t) => t.slug === slug);
  if (!tool) {
    return {
      title: 'Math Calculator | SolveItCalculator',
    };
  }
  const canonicalUrl = `https://solveitcalculator.com/math/${tool.slug}`;

  if (tool.slug === 'percentage-calculator') {
    const title = 'Percentage & Percent Value Calculator | SolveItCalculator';
    const description =
      'Calculate any percentage of a number with step-by-step math for discounts, tips, and scores. For example, 25% of 200 equals 50 via (25 × 200) ÷ 100.';
    const ogImage =
      'https://solveitcalculator.com/api/og?title=Percentage%20Calculator&badge=Math&subtitle=Find%20exact%20percentages%20with%20step-by-step%20math.&example=25%25%20of%20200%20%3D%2050';
    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'SolveItCalculator',
        type: 'website',
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  }

  const fullTitle = `${tool.name} — Free Step-by-Step Math Calculator | SolveItCalculator`;
  return {
    title: fullTitle,
    description: tool.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: tool.description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: tool.description,
    },
  };
}

export default async function MathToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (DUPLICATE_MATH_REDIRECTS[slug]) {
    permanentRedirect(DUPLICATE_MATH_REDIRECTS[slug]);
  }
  const tool = MATH_CALCULATORS.find((t) => t.slug === slug);
  if (!tool) {
    notFound();
  }

  return <MathToolDetailClient tool={tool} />;
}
