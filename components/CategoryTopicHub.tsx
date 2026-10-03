'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Compass,
  Layers,
  Sparkles,
  Calculator,
  RotateCcw
} from 'lucide-react';
import { CategoryHubConfig } from '@/lib/categoryHubConfigs';
import { CANONICAL_TOOLS, CANONICAL_CATEGORIES } from '@/lib/registry';

interface CategoryTopicHubProps {
  config: CategoryHubConfig;
}

export default function CategoryTopicHub({ config }: CategoryTopicHubProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Authoritative tools belonging to this category
  const categoryTools = useMemo(() => {
    return CANONICAL_TOOLS.filter((t) => {
      const matchCat = t.category.toLowerCase() === config.slug.toLowerCase();
      const matchSlug = t.canonicalPath.startsWith(`/${config.slug}`);
      return matchCat || matchSlug;
    });
  }, [config.slug]);

  // Filtered tools when searching
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categoryTools;
    return categoryTools.filter((t) => {
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.desc.toLowerCase().includes(q);
      const matchKeywords = t.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchKeywords;
    });
  }, [categoryTools, searchQuery]);

  // Popular tools based on config
  const popularTools = useMemo(() => {
    const fromConfig = CANONICAL_TOOLS.filter((t) => config.popularToolSlugs.includes(t.id));
    if (fromConfig.length >= 3) return fromConfig;
    return categoryTools.slice(0, 8);
  }, [config.popularToolSlugs, categoryTools]);

  // Related categories data
  const relatedCategories = useMemo(() => {
    return CANONICAL_CATEGORIES.filter((c) => config.relatedCategorySlugs.includes(c.id));
  }, [config.relatedCategorySlugs]);

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      {/* 1. BREADCRUMB & 2. SEO H1 & 3. INTRO & 4. SEARCH */}
      <header className="relative border-b border-outline-variant/40 bg-surface-container-low/60 pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* SECTION 1: Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>Home</span>
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-outline-variant" />
                <span className="text-on-surface font-semibold" aria-current="page">
                  {config.categoryName}
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              {/* SECTION 2: SEO H1 */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <Layers className="w-3.5 h-3.5" />
                <span>Free &amp; Easy Calculators</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-5">
                {config.h1}
              </h1>

              {/* SECTION 3: Intro Subheading Summary */}
              <div className="text-base sm:text-lg text-on-surface-variant leading-relaxed font-normal mb-8 space-y-1.5">
                {config.intro.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>

              {/* SECTION 4: Search Box */}
              <div className="relative max-w-2xl">
                <label htmlFor="category-search" className="sr-only">
                  Search {config.categoryName} Calculators
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    id="category-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${config.categoryName} calculators (e.g. mortgage, loan, interest)...`}
                    className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base shadow-sm transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                      aria-label="Clear search"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="mt-2 text-xs text-primary font-medium flex items-center justify-between">
                    <span>Showing {filteredTools.length} matching calculators</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-on-surface-variant hover:text-on-surface underline cursor-pointer"
                    >
                      Reset filter
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics & Standards Panel */}
            <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified &amp; Accurate</span>
              </h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-on-surface-variant">Total Free Calculators</dt>
                  <dd className="text-xl font-bold text-on-surface mt-0.5">{categoryTools.length} Tools Available</dd>
                </div>
                <div className="pt-2 border-t border-outline-variant/30">
                  <dt className="text-on-surface-variant">Primary Official Source</dt>
                  <dd className="text-xs text-on-surface font-medium mt-1 bg-surface-container-low p-2 rounded border border-outline-variant/40">
                    {config.trust.sourceReferences[0] || 'Standard Mathematical Formulas & Guidelines'}
                  </dd>
                </div>
                <div className="pt-2 border-t border-outline-variant/30">
                  <dt className="text-on-surface-variant">Calculation Accuracy</dt>
                  <dd className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                    Tested &amp; Reliable Formulas
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* SECTION 5: Popular Calculators */}
        <section aria-labelledby="popular-tools-heading">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-outline-variant/40">
            <div>
              <h2 id="popular-tools-heading" className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Popular {config.categoryName} Calculators</span>
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Frequently used tools with simple formulas and instant, easy-to-read results.
              </p>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant border border-outline-variant/50">
              Verified Free Tools
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool) => (
              <article
                key={tool.id}
                className="group relative bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/60 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {tool.badge || 'Essential'}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-mono">
                      {tool.calculationStandard ? 'Standard Model' : 'Formula Verified'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
                    <Link href={tool.canonicalPath} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {tool.name || tool.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed font-normal">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                  {tool.formulaDisplay ? (
                    <code className="text-[11px] text-primary font-mono truncate max-w-[190px]">
                      {tool.formulaDisplay}
                    </code>
                  ) : (
                    <span className="text-on-surface-variant">Step-by-step solver</span>
                  )}
                  <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Calculate <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION 6: Goal-Based Navigation */}
        <section aria-labelledby="goals-heading" className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>Goal Selector</span>
            </div>
            <h2 id="goals-heading" className="text-2xl font-bold text-on-surface mb-2">
              What do you want to calculate?
            </h2>
            <p className="text-sm text-on-surface-variant">
              Pick your goal below to jump straight to the easiest calculator for the job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.goals.map((goal, idx) => (
              <Link
                key={idx}
                href={goal.targetUrl}
                className="group p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 hover:border-primary/50 hover:bg-surface-container transition-all flex items-start gap-4"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0 mt-0.5">
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-surface-container text-primary border border-outline-variant/40">
                      {goal.badge}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium truncate">
                      → {goal.targetToolTitle}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors leading-snug mb-1">
                    {goal.task}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {goal.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 7: Subcategory Architecture */}
        {config.subcategories.length > 0 && (
          <section aria-labelledby="subcategories-heading">
            <div className="mb-6 pb-2 border-b border-outline-variant/40">
              <h2 id="subcategories-heading" className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <span>{config.categoryName} Topics &amp; Categories</span>
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Browse our free calculators organized by topic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.subcategories.map((sub) => {
                return (
                  <div
                    key={sub.id}
                    className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-bold text-on-surface">
                          <Link href={sub.path} className="hover:text-primary transition-colors">
                            {sub.name}
                          </Link>
                        </h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant border border-outline-variant/40">
                          Topic
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-4 leading-relaxed font-normal">
                        {sub.description}
                      </p>

                      <div className="space-y-1.5 mb-4">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                          Popular Calculators:
                        </span>
                        <ul className="space-y-1 text-xs text-on-surface-variant">
                          {sub.representativeToolSlugs.map((toolSlug) => {
                            const found = CANONICAL_TOOLS.find((t) => t.id === toolSlug);
                            if (!found) return null;
                            return (
                              <li key={toolSlug}>
                                <Link
                                  href={found.canonicalPath}
                                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                  <span className="truncate">{found.title}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    <Link
                      href={sub.path}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors pt-3 border-t border-outline-variant/30"
                    >
                      <span>Explore {sub.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 8: Complete Calculator Directory (Crawlable HTML List) */}
        <section aria-labelledby="directory-heading" className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-outline-variant/40">
            <div>
              <h2 id="directory-heading" className="text-2xl font-bold text-on-surface">
                All {config.categoryName} Calculators
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Browse all {categoryTools.length} free {config.categoryName.toLowerCase()} calculators in one place.
              </p>
            </div>
            <div className="text-xs text-on-surface-variant font-mono bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/40 self-start sm:self-auto">
              Total: {filteredTools.length} Calculators
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 hover:border-primary/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-semibold text-on-surface mb-1">
                    <Link
                      href={tool.canonicalPath}
                      className="hover:text-primary transition-colors"
                    >
                      {tool.name || tool.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">
                    {tool.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/30">
                  <span className="font-mono truncate max-w-[160px]">
                    {tool.badge || 'Verified'}
                  </span>
                  <Link
                    href={tool.canonicalPath}
                    className="text-primary hover:text-primary/80 font-medium flex items-center gap-0.5"
                  >
                    Open <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8B: Category Synthesis & Scope */}
        {config.afterToolsSection && (
          <section aria-labelledby="category-overview-after-tools" className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="max-w-4xl">
              {config.afterToolsSection.badge && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  <BookOpen className="w-4 h-4" />
                  <span>{config.afterToolsSection.badge}</span>
                </div>
              )}
              <h2 id="category-overview-after-tools" className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight leading-snug mb-4">
                <span className="block">{config.afterToolsSection.subheadingLine1}</span>
                <span className="block text-primary font-semibold text-lg sm:text-xl mt-1">
                  {config.afterToolsSection.subheadingLine2}
                </span>
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-normal">
                {config.afterToolsSection.paragraph}
              </p>
            </div>
          </section>
        )}

        {/* SECTION 9: Learning Section & Practical Guides */}
        {config.guides.length > 0 && (
          <section aria-labelledby="guides-heading">
            <div className="mb-6 pb-2 border-b border-outline-variant/40">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Helpful Guides</span>
              </div>
              <h2 id="guides-heading" className="text-2xl font-bold text-on-surface">
                How It Works: Step-by-Step Guides &amp; Examples
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Clear explanations, real-life examples, and helpful practical tips.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {config.guides.map((guide, idx) => (
                <article
                  key={idx}
                  className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-3">
                      {guide.title}
                    </h3>

                    {/* Formula Box */}
                    <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 mb-4">
                      <div className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
                        How It Is Calculated
                      </div>
                      <code className="text-sm sm:text-base text-amber-950 dark:text-amber-300 font-mono block font-bold overflow-x-auto pb-1">
                        {guide.formula}
                      </code>
                      <p className="text-xs text-on-surface-variant mt-2 italic">
                        {guide.formulaDescription}
                      </p>
                    </div>

                    {/* How it works steps */}
                    <div className="mb-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Step-by-Step How It Works</span>
                      </h4>
                      <ol className="space-y-1.5 text-xs text-on-surface-variant list-decimal list-inside">
                        {guide.howItWorks.map((step, sIdx) => (
                          <li key={sIdx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Realistic Worked Example */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                        Real Example: {guide.example.scenario}
                      </h4>
                      <dl className="grid grid-cols-2 gap-2 text-xs text-on-surface mb-2 font-mono bg-surface-container-lowest p-2.5 rounded border border-outline-variant/40">
                        {Object.entries(guide.example.inputs).map(([k, v]) => (
                          <div key={k}>
                            <dt className="text-on-surface-variant">{k}:</dt>
                            <dd className="text-on-surface font-medium">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="text-xs text-on-surface space-y-1">
                        <div className="font-mono text-on-surface-variant text-[11px]">
                          Calculation: {guide.example.calculation}
                        </div>
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 text-xs pt-1 border-t border-outline-variant/30">
                          Result: {guide.example.result}
                        </div>
                      </div>
                    </div>

                    {/* Common Mistakes */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Common Mistakes to Avoid</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-on-surface-variant">
                        {guide.commonMistakes.map((m, mIdx) => (
                          <li key={mIdx} className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold shrink-0">•</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Practical Tips */}
                  {guide.practicalTips.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-outline-variant/30 flex items-start gap-2 text-xs text-amber-950 dark:text-amber-100 bg-amber-100/80 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-300/80 dark:border-amber-800/60">
                      <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-800 dark:text-amber-400" />
                      <div>
                        <span className="font-bold">Helpful Tip: </span>
                        {guide.practicalTips[0]}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 10: Related Categories */}
        {relatedCategories.length > 0 && (
          <section aria-labelledby="related-categories-heading">
            <div className="mb-6 pb-2 border-b border-outline-variant/40">
              <h2 id="related-categories-heading" className="text-xl font-bold text-on-surface">
                Explore Other Categories
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                More free calculators to help you solve everyday problems.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.path}
                  className="group bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 rounded-xl p-4 transition-all hover:bg-surface-container-low shadow-sm"
                >
                  <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between mb-1.5">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 11: FAQ Section */}
        <section aria-labelledby="faqs-heading" className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 id="faqs-heading" className="text-2xl font-bold text-on-surface mb-2">
              {config.categoryName} Calculators FAQ
            </h2>
            <p className="text-sm text-on-surface-variant">
              Clear answers to common questions about using our calculators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-outline-variant/40 rounded-xl p-5 bg-surface-container-low flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-start gap-3 mb-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                      Q
                    </span>
                    <h3 className="text-sm font-semibold text-on-surface leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pl-9">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 12: Trust & Editorial Methodology Section */}
        <section
          aria-labelledby="trust-heading"
          className="bg-surface-container-low/70 border border-outline-variant/40 rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Accuracy &amp; Trust Standards</span>
            </div>
            <h2 id="trust-heading" className="text-2xl font-bold text-on-surface mb-2">
              How We Ensure Accuracy &amp; Reliability
            </h2>
            <p className="text-sm text-on-surface-variant">
              SolveItCalculator uses standard formulas, official guidelines, and tested math so you can calculate with total confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-on-surface-variant">
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm">
                <h3 className="font-bold text-on-surface text-sm mb-1">Formulas &amp; Math Rules</h3>
                <p className="text-on-surface-variant leading-relaxed">{config.trust.formulasUsed}</p>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm">
                <h3 className="font-bold text-on-surface text-sm mb-2">Official Sources &amp; References</h3>
                <ul className="space-y-1 text-on-surface-variant list-disc list-inside">
                  {config.trust.sourceReferences.map((ref, rIdx) => (
                    <li key={rIdx}>{ref}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm">
                <h3 className="font-bold text-on-surface text-sm mb-2">Standard Assumptions</h3>
                <ul className="space-y-1 text-on-surface-variant list-disc list-inside">
                  {config.trust.assumptions.map((asm, aIdx) => (
                    <li key={aIdx}>{asm}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm">
                <h3 className="font-bold text-on-surface text-sm mb-2">Updates &amp; Disclaimers</h3>
                <p className="text-on-surface-variant leading-relaxed mb-2">{config.trust.updateProcess}</p>
                <div className="text-on-surface-variant space-y-1">
                  {config.trust.limitations.map((lim, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-1">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{lim}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 13: Internal Linking Structured Navigation Bar */}
        <nav aria-label="Hub Directory Navigation" className="border-t border-outline-variant/40 pt-8 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-on-surface">Directory Links:</span>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>•</span>
              <Link href="/sitemap" className="hover:text-primary transition-colors">HTML Sitemap</Link>
              <span>•</span>
              <Link href="/about-us" className="hover:text-primary transition-colors">About &amp; Standards</Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-primary transition-colors">Feedback &amp; Inquiries</Link>
            </div>
            <div className="text-on-surface-variant/70">
              All calculations deterministic. Last updated {new Date().getFullYear()}.
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
