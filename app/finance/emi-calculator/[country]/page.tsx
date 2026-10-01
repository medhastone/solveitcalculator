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
  const url = `https://solveitcalculator.com/finance/emi-calculator/${countrySlug}`;

  return {
    title: `${data.meta.seoTitle} | SolveIt Calculator`,
    description: data.meta.metaDescription,
    keywords: [
      data.meta.primaryKeyword,
      ...(data.meta.secondaryKeywords || []),
      'Home Loan EMI Calculator',
      'Part-Prepayment Calculator',
      'Home Loan EMI & Part-Prepayment Calculator',
      'Reducing Balance EMI',
      'Amortization Schedule',
      'Early Loan Payoff',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: data.meta.seoTitle,
      description: data.meta.metaDescription,
      url: url,
      siteName: 'SolveIt Calculator',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.meta.seoTitle,
      description: data.meta.metaDescription,
    },
  };
}

export default async function CountryEmiCalculatorPage({ params }: Props) {
  const resolvedParams = await params;
  const countrySlug = resolvedParams.country.toLowerCase();
  
  if (!(countrySlug in localizedSeoContent)) {
    notFound();
  }

  const data = localizedSeoContent[countrySlug as keyof typeof localizedSeoContent];
  const toolName =
    countrySlug === 'in'
      ? 'Home Loan EMI & Part-Prepayment Calculator'
      : (data.meta.h1 || 'Home Loan EMI & Part-Prepayment Calculator');

  const pageUrl = `https://solveitcalculator.com/finance/emi-calculator/${countrySlug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://solveitcalculator.com',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Financial Calculators',
        'item': 'https://solveitcalculator.com/finance',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'Loans & Mortgages',
        'item': 'https://solveitcalculator.com/loans-and-amortization',
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': toolName,
        'item': pageUrl,
      },
    ],
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': toolName,
    'alternateName': 'Home Loan EMI & Part-Prepayment Calculator',
    'description': data.meta.metaDescription,
    'url': pageUrl,
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'featureList': [
      'Exact Monthly Reducing Balance EMI calculation',
      'Annual & Monthly Part-Prepayment Amortization Modeler',
      'Tenure Reduction vs EMI Lowering Comparison',
      'Interest Savings & Payoff Tipping Point Detection',
      'Institutional Regulated Compounding Engine (RBI, CFPB, FCAC, ASIC, FCA)',
    ],
  };

  const faqSchema =
    data.faqs && data.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': data.faqs.map((faq) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <EmiCalculatorClient defaultCountrySlug={countrySlug} />
    </>
  );
}
