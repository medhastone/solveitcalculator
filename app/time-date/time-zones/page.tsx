import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Globe, ArrowRight, Sparkles, ChevronRight, Home } from 'lucide-react';
import { TIME_CATEGORIES } from '@/lib/time-date/data';

export const metadata: Metadata = {
  title: 'World Time Zone & Clock Tools | SolveItCalculator',
  description: 'Convert meeting hours across global time zones, compare world city clocks, and track international daylight saving transitions.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/time-zones',
  },
};

const TIME_ZONE_TOOLS = [
  {
    name: 'Time Zone Converter',
    path: '/time-date/time-zone-converter',
    desc: 'Convert meeting times, appointments, and flight arrivals between global cities and UTC offsets.',
  },
  {
    name: 'World Clock Grid',
    path: '/time-date/world-clock-grid',
    desc: 'View live synchronized digital clocks for major global financial centers: New York, London, Tokyo, Paris, Sydney.',
  },
  {
    name: 'Meeting Time Overlap Finder',
    path: '/time-date/time-zone-overlap',
    desc: 'Identify shared business daytime hours across distributed remote teams in different hemispheres.',
  },
  {
    name: 'Daylight Saving Transition Tracker',
    path: '/time-date/dst-transition-tracker',
    desc: 'Track exact dates when regions spring forward or fall back for standard and daylight saving time.',
  },
  {
    name: 'Military Time Converter',
    path: '/time-date/military-time-converter',
    desc: 'Convert 12-hour AM/PM times to 24-hour military notation and phonetic military pronunciation.',
  },
  {
    name: 'Unix Timestamp Converter',
    path: '/unix-timestamp-converter',
    desc: 'Convert seconds since the Unix epoch (1970-01-01 UTC) to human-readable international dates.',
  },
];

export default function TimeZonesHubPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'World Time Zone Tools',
    description: 'Convert time across global cities and time zones.',
    url: 'https://solveitcalculator.com/time-date/time-zones',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
            Time Zones
          </span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Topical Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
            World Time Zone Tools
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Convert meeting hours across global time zones, compare world city clocks, and track international daylight saving transitions without confusion.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {TIME_ZONE_TOOLS.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  Global Time
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                  {tool.name}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            Explore Other Time & Date Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIME_CATEGORIES.map((c) => (
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
