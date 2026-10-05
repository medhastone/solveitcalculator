'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  HEALTH_TOOLS,
  FEATURED_HEALTH_TOOLS,
  HEALTH_CATEGORIES,
  HEALTH_GOALS,
  HEALTH_FORMULAS,
  HEALTH_GUIDES,
  HEALTH_SOURCES,
  POPULAR_SEARCH_CHIPS,
  HEALTH_FAQS,
  HEALTH_WORKBENCH_TOOLS,
} from './healthFitnessData';

export default function HealthFitnessClient() {
  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <HealthHero />
      <FeaturedHealthTools />
      <PopularHealthTools />
      <HealthGoalDiscovery />
      <HealthCategoriesDirectory />
      <HealthHowItWorksSection />
      <HealthAccuracyAndDifferences />
      <HealthGuidesSection />
      <HealthMethodsAndFormulas />
      <HealthSourcesAndEvidence />
      <HealthFAQAndDisclaimer />
    </main>
  );
}

/* =========================================================================
   1. HERO SECTION WITH SEARCH & STATS
   ========================================================================= */
function HealthHero() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
        setIsFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return HEALTH_TOOLS.filter((t) => {
      const matchName = t.name.toLowerCase().includes(q);
      const matchDesc = t.shortDesc.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      const matchKey = t.keywords ? t.keywords.some((k) => k.toLowerCase().includes(q)) : false;
      return matchName || matchDesc || matchCat || matchKey;
    }).slice(0, 8);
  }, [query]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-surface to-surface pt-12 pb-14 border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-semibold">Health & Fitness Calculators</span>
        </nav>

        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-sm">health_and_safety</span>
            Evidence-Based Health & Fitness Suite
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-4">
            Health & Fitness Calculators for Smarter Wellness Planning
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-3xl mb-8">
            Evidence-backed calculators for body composition, caloric expenditure, macronutrient balance, cardiovascular
            performance, sleep architecture, and reproductive timelines. Transparent formulas with clinical literature
            references.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mb-6">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-xl pointer-events-none">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search by metric, equation, or goal (e.g., BMI, Navy Fat, TDEE, Protein, Zone 2)..."
                className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm text-on-surface placeholder:text-on-surface-variant/60"
              />
              <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none text-[11px] font-mono text-on-surface-variant/70 bg-surface-container px-2 py-1 rounded-lg border border-outline-variant/20">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>

            {/* Live Search Results Dropdown */}
            {isFocused && query.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="p-2 divide-y divide-outline-variant/10">
                    {searchResults.map((t) => (
                      <Link
                        key={t.id}
                        href={t.path}
                        onClick={() => {
                          setIsFocused(false);
                          setQuery('');
                        }}
                        className="p-3 hover:bg-surface-container-low rounded-xl flex items-start gap-3 transition-colors group block"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                          <span className="material-symbols-outlined text-lg">{t.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                              {t.name}
                            </span>
                            {t.badge && (
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                                {t.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{t.shortDesc}</p>
                          {t.formulaSummary && (
                            <span className="text-[10px] font-mono text-primary/80 mt-1 block">
                              Formula: {t.formulaSummary}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-on-surface-variant">
                    No calculators matching &ldquo;{query}&rdquo;. Browse the categories below.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <span className="text-xs font-semibold text-on-surface-variant">Popular searches:</span>
            {POPULAR_SEARCH_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setQuery(chip.query);
                  searchInputRef.current?.focus();
                }}
                className="px-3 py-1 rounded-full text-xs bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant/30 transition-colors shadow-2xs cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Value Props / Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">calculate</span>
              </div>
              <div>
                <div className="text-lg font-bold text-on-surface">36 Calculators</div>
                <div className="text-xs text-on-surface-variant">Specialized Tools</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
              <div>
                <div className="text-lg font-bold text-on-surface">6 Domains</div>
                <div className="text-xs text-on-surface-variant">Clinical & Fitness</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <div>
                <div className="text-lg font-bold text-on-surface">100% Private</div>
                <div className="text-xs text-on-surface-variant">In-Browser Calculation</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">menu_book</span>
              </div>
              <div>
                <div className="text-lg font-bold text-on-surface">Peer-Reviewed</div>
                <div className="text-xs text-on-surface-variant">Standardized Formulas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   2. FEATURED HEALTH & FITNESS CALCULATORS
   ========================================================================= */
function FeaturedHealthTools() {
  const [selectedCat, setSelectedCat] = useState('all');

  const filteredTools = useMemo(() => {
    if (selectedCat === 'all') return HEALTH_TOOLS;
    return HEALTH_TOOLS.filter((t) => t.categorySlug === selectedCat);
  }, [selectedCat]);

  const filterTabs = [
    { id: 'all', label: `All Calculators (${HEALTH_TOOLS.length})` },
    { id: 'body-weight', label: 'Body & Weight (9)' },
    { id: 'nutrition-macros', label: 'Nutrition & Macros (6)' },
    { id: 'energy-metabolism', label: 'Energy & Metabolism (5)' },
    { id: 'fitness-performance', label: 'Fitness & Performance (6)' },
    { id: 'cardiovascular-health', label: 'Cardiovascular (5)' },
    { id: 'sleep-recovery', label: 'Sleep & Women’s Health (5)' },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Complete Workbench
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Featured Health & Fitness Calculators
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1">
              Explore our full directory of 36 evidence-based health, nutrition, and metabolic tools.
            </p>
          </div>

          <div className="text-xs text-on-surface-variant font-medium">
            Showing <span className="font-bold text-on-surface">{filteredTools.length}</span> tools
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCat(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === tab.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              className="group p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors mb-1.5 line-clamp-1">
                  {tool.name}
                </h3>

                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                <span className="text-[11px] font-mono text-on-surface-variant/80 truncate max-w-[200px]">
                  {tool.formulaSummary || tool.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                  Launch <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   3. POPULAR HEALTH CALCULATORS GRID
   ========================================================================= */
function PopularHealthTools() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Quick Access
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Popular Health Calculators
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1">
              Most frequently used screening, metabolic, and energy expenditure calculators.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_HEALTH_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              className="p-4 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">{tool.icon}</span>
                  </div>
                  <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                    {tool.name}
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-3">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant/70 font-medium">{tool.category}</span>
                <span className="text-xs font-semibold text-primary flex items-center gap-0.5">
                  Use Tool <span className="material-symbols-outlined text-xs">chevron_right</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   4. GOAL-BASED DISCOVERY ("What Are You Trying to Achieve?")
   ========================================================================= */
function HealthGoalDiscovery() {
  const [activeGoalId, setActiveGoalId] = useState(HEALTH_GOALS[0].id);
  const activeGoal = HEALTH_GOALS.find((g) => g.id === activeGoalId) || HEALTH_GOALS[0];

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Goal-Based Discovery
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            What Are You Trying to Achieve?
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            Select your primary health or athletic objective to view recommended calculation pathways and sequential tools.
          </p>
        </div>

        {/* Goal Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar justify-start lg:justify-center">
          {HEALTH_GOALS.map((goal) => {
            const isSelected = goal.id === activeGoalId;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => setActiveGoalId(goal.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-base">{goal.icon}</span>
                <span>{goal.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Goal Workbench Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">{activeGoal.icon}</span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-on-surface">{activeGoal.title}</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">{activeGoal.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoal.tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.path}
                className="p-4 rounded-xl bg-surface border border-outline-variant/25 hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                      {tool.name}
                    </h4>
                    <span className="material-symbols-outlined text-primary text-sm">open_in_new</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{tool.desc}</p>
                </div>
                <div className="text-[11px] font-semibold text-primary flex items-center gap-1">
                  Launch Step <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   5. HEALTH CALCULATORS BY CATEGORY DIRECTORY
   ========================================================================= */
function HealthCategoriesDirectory() {
  return (
    <section id="categories-directory" className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Complete Directory
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Health Calculators by Category
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            Organized across 6 physiological, dietary, cardiovascular, and metabolic domains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HEALTH_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-surface border border-outline-variant/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                    {cat.tools.length} Calculators
                  </span>
                </div>

                <h3 className="font-bold text-base text-on-surface mb-1.5">{cat.name}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{cat.description}</p>

                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/70 block mb-1">
                    Featured in this category:
                  </span>
                  {cat.tools.slice(0, 4).map((t) => (
                    <Link
                      key={t.name}
                      href={t.path}
                      className="block text-xs text-on-surface hover:text-primary transition-colors truncate py-0.5"
                    >
                      • {t.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/15">
                <Link
                  href={`/health-fitness-calculators/${cat.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  View All {cat.name} Tools
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   6. HOW HEALTH CALCULATORS WORK
   ========================================================================= */
function HealthHowItWorksSection() {
  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Methodology
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            How Health Calculators Work
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            A three-step approach derived from regression modeling, clinical calorimetry, and standardized public health equations.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 relative">
            <div className="text-3xl font-extrabold text-primary/20 mb-3 font-mono">01</div>
            <h3 className="font-bold text-base text-on-surface mb-2">Baseline Estimation</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Calculates your resting physiological baseline (such as BMR via Mifflin-St Jeor or Katch-McArdle) using
              anthropometric inputs like age, sex, height, weight, and lean mass.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 relative">
            <div className="text-3xl font-extrabold text-primary/20 mb-3 font-mono">02</div>
            <h3 className="font-bold text-base text-on-surface mb-2">Dynamic Scaling & Multipliers</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Applies validated Physical Activity Levels (PAL), MET activity coefficients, thermic effects of food (TEF),
              and training intensities to reflect daily energetic requirements.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 relative">
            <div className="text-3xl font-extrabold text-primary/20 mb-3 font-mono">03</div>
            <h3 className="font-bold text-base text-on-surface mb-2">Actionable Target Modeling</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Translates raw energy metrics into personalized calorie deficits/surpluses, gram-level macronutrient distributions,
              heart rate target zones, or recovery timelines.
            </p>
          </div>
        </div>

        {/* Practical Workbench Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HEALTH_WORKBENCH_TOOLS.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  </div>
                  <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                    {item.name}
                  </h4>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mb-2">
                  <span className="font-semibold text-on-surface">Solves: </span>
                  {item.problemSolved}
                </p>
              </div>
              <div className="text-[10px] text-primary font-semibold flex items-center gap-0.5 pt-2 border-t border-outline-variant/15">
                Launch Workbench <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   7. ACCURACY & WHY RESULTS DIFFER SECTION
   ========================================================================= */
function HealthAccuracyAndDifferences() {
  const accuracyFactors = [
    { factor: 'Formula Selection & Origin', explanation: 'Different formulas (e.g. Mifflin-St Jeor vs. Harris-Benedict) were calibrated against distinct populations and decades.', howToAccount: 'Use Katch-McArdle if lean body mass is known; otherwise stick to Mifflin-St Jeor.' },
    { factor: 'Activity Level Multiplier Nuances', explanation: 'Overestimating daily physical activity level (PAL) is the #1 cause of calculated vs actual maintenance discrepancies.', howToAccount: 'Start conservatively at a lower activity bracket and track weight trend across 14-21 days.' },
    { factor: 'Body Composition Discrepancies', explanation: 'BMI treats all body weight identically, while athletes with high muscle mass will register elevated scores.', howToAccount: 'Pair BMI with waist-to-height ratio (WHtR) or Navy body fat percentage.' },
    { factor: 'Water Balance & Glycogen Shifts', explanation: 'Starting a low-carb diet causes sudden 3–6 lb losses due to stored glycogen depletion and bound water shedding.', howToAccount: 'Evaluate moving weekly averages rather than single day-to-day weigh-ins.' },
    { factor: 'Thermic Effect of Food (TEF)', explanation: 'Protein requires 20–30% of its caloric value for digestion, while fats require only 0–3%.', howToAccount: 'Prioritize adequate daily protein (1.6–2.2 g/kg) to maximize satiety and metabolic demand.' },
    { factor: 'Adaptive Thermogenesis', explanation: 'Prolonged calorie deficits lead to down-regulated NEAT (non-exercise activity thermogenesis) and metabolic slowing.', howToAccount: 'Incorporate periodic refeed days or diet breaks every 8–12 weeks of sustained dieting.' },
  ];

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto space-y-16">
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Measurement Nuance
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Why Your Result May Differ From Another Calculator
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Explore why two health calculators can produce different numbers for the same person based on formula assumptions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accuracyFactors.map((item) => (
              <div
                key={item.factor}
                className="p-5 rounded-2xl bg-surface border border-outline-variant/25 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-base">tune</span>
                    <h3 className="font-bold text-sm text-on-surface">{item.factor}</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{item.explanation}</p>
                </div>
                <div className="pt-2.5 border-t border-outline-variant/15 text-[11px] text-primary">
                  <span className="font-semibold">How to account:</span> {item.howToAccount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   8. HEALTH & FITNESS CALCULATION GUIDES
   ========================================================================= */
function HealthGuidesSection() {
  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Evidence-Based Education
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Health & Fitness Calculation Guides
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            In-depth guides on energy balance, cardiovascular training zones, body composition nuances, and metabolic adaptations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HEALTH_GUIDES.map((guide) => (
            <div
              key={guide.title}
              className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    Guide
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">{guide.readTime}</span>
                </div>

                <h3 className="font-bold text-base text-on-surface mb-2">{guide.title}</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">{guide.description}</p>
              </div>

              <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Recommended Tool:</span>
                <Link
                  href={guide.toolPath}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  {guide.toolName}
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   9. HEALTH METHODS & FORMULAS (INTERACTIVE)
   ========================================================================= */
function HealthMethodsAndFormulas() {
  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Transparent Mathematics
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Health Calculator Methods & Formulas
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            Mathematical equations, baseline physiological assumptions, clinical limitations, and scientific citations.
          </p>
        </div>

        {/* Formula Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HEALTH_FORMULAS.map((f) => (
            <div
              key={f.name}
              className="p-6 rounded-2xl bg-surface border border-outline-variant/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base text-on-surface">{f.name}</h3>
                  {f.year && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {f.year}
                    </span>
                  )}
                </div>

                <p className="text-xs text-on-surface-variant mb-3">
                  <span className="font-semibold text-on-surface">Calculates: </span>
                  {f.whatItCalculates}
                </p>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 font-mono text-xs text-on-surface whitespace-pre-wrap leading-relaxed mb-4">
                  {f.formula}
                </div>

                <div className="space-y-2 text-xs text-on-surface-variant">
                  <div>
                    <span className="font-semibold text-on-surface">Inputs: </span>
                    {f.inputs}
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface">Units: </span>
                    {f.units}
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface">Assumptions: </span>
                    {f.assumptions}
                  </div>
                  <div>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Limitations: </span>
                    {f.limitations}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-outline-variant/15 text-[11px] text-on-surface-variant/70 flex items-center justify-between">
                <span>Literature Reference:</span>
                <span className="font-medium text-on-surface truncate ml-2 max-w-[280px]">{f.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   10. SOURCES & EVIDENCE REVIEW
   ========================================================================= */
function HealthSourcesAndEvidence() {
  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm">verified</span>
            Clinical & Evidence Review: September 29, 2026
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Sources & Last Reviewed
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            Calculators reference standardized guidelines and clinical literature published by established international and national public health bodies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HEALTH_SOURCES.map((source) => (
            <div
              key={source.organization}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/25 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-primary">{source.organization}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    Rev. {source.lastReviewed}
                  </span>
                </div>

                <h3 className="font-bold text-on-surface text-sm mb-1">{source.fullName}</h3>
                <div className="text-xs text-primary font-medium mb-2">{source.scope}</div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{source.guideline}</p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-outline-variant/15 text-[11px]">
                <a
                  href={source.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>View Reference Documentation</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   11. FAQS, PRIVACY NOTE & MEDICAL DISCLAIMER
   ========================================================================= */
function HealthFAQAndDisclaimer() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-t border-outline-variant/15">
      <div className="max-w-4xl mx-auto space-y-14">
        {/* FAQs */}
        <div>
          <div className="text-center mb-10">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Common Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Frequently Asked Questions About Health Calculators
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Clear answers regarding mathematical accuracy, data privacy, formula differences, and medical context.
            </p>
          </div>

          <div className="space-y-3">
            {HEALTH_FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-outline-variant/30 bg-surface overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left gap-4 hover:bg-surface-container-low/40 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-on-surface text-sm sm:text-base">{faq.q}</span>
                    <span
                      className={`material-symbols-outlined text-primary text-xl transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      keyboard_arrow_down
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Privacy Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-surface border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base mb-1">Privacy-Conscious Calculations</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Where supported, calculator inputs are processed locally in your browser. Review our{' '}
                <Link href="/privacy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>{' '}
                for information about cookies, analytics, and other site data.
              </p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="shrink-0 text-xs font-semibold px-4 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/30 transition-colors"
          >
            Review Privacy Policy
          </Link>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="p-6 sm:p-7 rounded-2xl bg-amber-500/10 border border-amber-500/25">
          <div className="flex items-start gap-3.5 mb-3">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl shrink-0 mt-0.5">
              medical_information
            </span>
            <div>
              <h3 className="text-base font-bold text-on-surface">Important Health Information</h3>
              <p className="text-xs uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-300">
                Informational and Educational Estimates Only
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Health and fitness calculator results are mathematical or informational estimates based on the inputs and
            methods described. They are not a diagnosis or a substitute for professional medical advice, examination,
            treatment, or emergency care. Always seek the advice of a qualified physician, registered dietitian, or
            licensed healthcare provider with any questions you may have regarding a medical condition, diet change, or
            exercise routine. Never disregard professional medical advice or delay seeking it because of something you have
            read or calculated on this website.
          </p>
        </div>
      </div>
    </section>
  );
}
