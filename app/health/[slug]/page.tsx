import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HealthToolClient from './HealthToolClient';
import { ALL_HEALTH_SLUGS, resolveToolConfig } from '../healthToolConfig';
import { getClinicalSeoGuide } from '../healthSeoContent';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_HEALTH_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = resolveToolConfig(slug);

  if (!config) {
    return {
      title: 'Health & Fitness Tool | SolveIt Calculators',
      description: 'Clinical grade health and fitness computation workbench.',
    };
  }

  const seoGuide = getClinicalSeoGuide(config.id, config);

  return {
    title: seoGuide.metaTitle,
    description: seoGuide.metaDescription,
    keywords: [
      ...seoGuide.targetKeywords,
      config.name,
      config.title,
      config.categoryName,
      'clinical health calculator',
      'SolveIt health tools',
    ],
    openGraph: {
      title: seoGuide.metaTitle,
      description: seoGuide.metaDescription,
      type: 'website',
      url: `https://solveitcalculator.com/health/${config.slug}`,
      siteName: 'SolveIt Calculator Suite',
    },
    alternates: {
      canonical: `https://solveitcalculator.com/health/${config.slug}`,
    },
  };
}

export default async function HealthToolPage({ params }: PageProps) {
  const { slug } = await params;
  const config = resolveToolConfig(slug);

  if (!config) {
    notFound();
  }

  const seoGuide = getClinicalSeoGuide(config.id, config);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
          { '@type': 'ListItem', position: 2, name: 'Health & Fitness', item: 'https://solveitcalculator.com/health' },
          { '@type': 'ListItem', position: 3, name: config.name, item: `https://solveitcalculator.com/health/${config.slug}` },
        ],
      },
      {
        '@type': 'MedicalWebPage',
        name: seoGuide.headline,
        headline: seoGuide.headline,
        description: seoGuide.metaDescription,
        url: `https://solveitcalculator.com/health/${config.slug}`,
        medicalAudience: 'Patients, Athletes, Health Enthusiasts, Clinical Practitioners',
        aspect: ['Overview', 'Mathematical Derivation', 'Physiological Basis', 'Normative Classification', 'Clinical Guidelines'],
        author: {
          '@type': 'Person',
          name: seoGuide.medicalReview.reviewerName,
          jobTitle: seoGuide.medicalReview.reviewerCredentials,
        },
        reviewedBy: {
          '@type': 'Person',
          name: seoGuide.medicalReview.reviewerName,
          jobTitle: seoGuide.medicalReview.reviewerCredentials,
        },
        citation: seoGuide.academicReferences.map((ref) => `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}. ${ref.citationInfo}`),
      },
      {
        '@type': 'FAQPage',
        mainEntity: seoGuide.expandedFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
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
      <HealthToolClient initialSlug={slug} />
    </>
  );
}
