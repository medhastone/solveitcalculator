import React from 'react';
import Link from 'next/link';
import { TimeToolDefinition } from '@/lib/time-date/types';
import UniversalTimeCalculator from './UniversalTimeCalculator';
import UniversalTimeConverter from './UniversalTimeConverter';
import UniversalCountdown from './UniversalCountdown';
import UniversalTimer from './UniversalTimer';
import DynamicDateReference from './DynamicDateReference';
import EducationalSections from './EducationalSections';
import { ChevronRight, Home, ShieldCheck } from 'lucide-react';

interface Props {
  tool: TimeToolDefinition;
}

export default function ToolShell({ tool }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://solveitcalculator.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Time & Date',
            item: 'https://solveitcalculator.com/time-date',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool.name,
            item: `https://solveitcalculator.com${tool.canonicalPath}`,
          },
        ],
      },
      {
        '@type': 'WebApplication',
        name: tool.name,
        url: `https://solveitcalculator.com${tool.canonicalPath}`,
        description: tool.metaDescription,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript and HTML5 support',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      ...(tool.faqs && tool.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: tool.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  const renderActiveTool = () => {
    switch (tool.calculatorType) {
      case 'unit-converter':
      case 'pair-converter':
      case 'format-converter':
        return <UniversalTimeConverter tool={tool} />;

      case 'countdown':
        return <UniversalCountdown tool={tool} />;

      case 'preset-timer':
      case 'custom-timer':
      case 'stopwatch':
        return <UniversalTimer tool={tool} />;

      case 'date-reference':
      case 'days-from-today':
      case 'days-since':
        return <DynamicDateReference tool={tool} />;

      case 'guide':
        return null;

      default:
        return <UniversalTimeCalculator tool={tool} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/time-date" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Time & Date
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
            {tool.name}
          </span>
        </nav>

        {/* Page Header Area */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
            <span>{tool.subcategoryTitle}</span>
            <span aria-hidden="true">·</span>
            <span>Free Online Calculator</span>
            <span aria-hidden="true">·</span>
            <span>Updated 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
            {tool.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {tool.metaDescription}
          </p>
        </header>

        {/* The Working Live Interactive Tool */}
        <main>
          {renderActiveTool()}
          <EducationalSections tool={tool} />
        </main>
      </div>
    </div>
  );
}
