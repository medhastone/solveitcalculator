import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GUIDES_DATA, getGuideBySlug } from '@/lib/guidesData';
import GuideArticleTemplate from '@/components/guides/GuideArticleTemplate';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES_DATA.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | SolveItCalculator',
    };
  }

  const canonicalUrl = `https://solveitcalculator.com/guides/${guide.slug}`;

  return {
    title: `${guide.title} — Step-by-Step Guide & Formula | SolveItCalculator`,
    description: guide.heroIntro,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${guide.title} | SolveItCalculator`,
      description: guide.heroIntro,
      url: canonicalUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${guide.title} | SolveItCalculator`,
      description: guide.heroIntro,
    },
  };
}

export default async function DynamicGuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return <GuideArticleTemplate guide={guide} />;
}
