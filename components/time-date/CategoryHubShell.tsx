import React from 'react';
import Link from 'next/link';
import { TimeToolCategory, TimeToolDefinition } from '@/lib/time-date/types';
import { getTimeToolsByCategory, TIME_CATEGORIES } from '@/lib/time-date/data';
import { ChevronRight, Home, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  category: TimeToolCategory;
  title: string;
  description: string;
  canonicalPath: string;
}

export default function CategoryHubShell({ category, title, description, canonicalPath }: Props) {
  const tools = getTimeToolsByCategory(category);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: title,
        description,
        url: `https://solveitcalculator.com${canonicalPath}`,
        breadcrumb: {
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
              name: title,
              item: `https://solveitcalculator.com${canonicalPath}`,
            },
          ],
        },
      },
      {
        '@type': 'ItemList',
        name: title,
        itemListElement: tools.map((tool, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: tool.name,
          url: `https://solveitcalculator.com${tool.canonicalPath}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
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
          <span className="text-slate-800 dark:text-slate-200 font-medium">
            {title}
          </span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Topical Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
            {title}
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {description}
          </p>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.canonicalPath}
              className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  {tool.subcategoryTitle}
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                  {tool.name}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {tool.metaDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Use Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Other Hubs Navigator */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            Explore Other Time & Date Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIME_CATEGORIES.filter((c) => c.id !== category).map((c) => (
              <Link
                key={c.id}
                href={c.path}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 text-center"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
