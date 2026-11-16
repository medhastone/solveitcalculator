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

  const canonicalUrl = `https://solveitcalculator.com/guides/${guide.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${canonicalUrl}#article`,
        headline: guide.title,
        description: guide.heroIntro,
        url: canonicalUrl,
        datePublished: '2026-10-20',
        dateModified: '2026-11-16',
        author: {
          '@type': 'Person',
          name: 'Krchandan',
          jobTitle: 'Founder & Writer, SolveItCalculator.com',
          url: 'https://solveitcalculator.com/about',
        },
        publisher: {
          '@type': 'Organization',
          name: 'SolveItCalculator',
          url: 'https://solveitcalculator.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://solveitcalculator.com/apple-icon',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      },
      {
        '@type': 'HowTo',
        '@id': `${canonicalUrl}#howto`,
        name: guide.title,
        description: guide.section3.exampleTask,
        step: guide.section3.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.title,
          text: step.lines.join(' '),
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://solveitcalculator.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Guides',
            item: 'https://solveitcalculator.com/guides',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: guide.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: guide.sidebar.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuideArticleTemplate guide={guide} />
    </>
  );
}
