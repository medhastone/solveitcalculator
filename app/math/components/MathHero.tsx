'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { POPULAR_MATH_TOOLS, MATH_CATEGORIES, MATH_FORMULAS } from '../mathCategoryData';

export default function MathHero() {
  const [query, setQuery] = useState('');
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [quickCalcResult, setQuickCalcResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Safe client-side evaluator for basic arithmetic expressions (no raw eval)
  useEffect(() => {
    if (!query.trim()) {
      setQuickCalcResult(null);
      return;
    }
    const clean = query.trim();
    // Check if it looks like an arithmetic expression: e.g. "3/4 + 1/8", "15 * 240", "144 / 12"
    if (/^[0-9\.\s\+\-\*\/\^\(\)]+$/.test(clean) && /[0-9]/.test(clean) && /[\+\-\*\/\^]/.test(clean)) {
      try {
        // Safe evaluation by tokenizing only allowed characters
        const sanitized = clean.replace(/\^/g, '**');
        // Check for safe chars only
        if (/^[0-9\.\s\+\-\*\/\(\)]+$/.test(sanitized)) {
          // eslint-disable-next-line no-new-func
          const res = Function(`"use strict"; return (${sanitized});`)();
          if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
            setQuickCalcResult(Number(res.toFixed(4)).toString());
            return;
          }
        }
      } catch {
        // Ignore parsing errors for unfinished user typing
      }
    }
    setQuickCalcResult(null);
  }, [query]);

  // Dynamic suggestions matching tools, categories, equations, and synonyms
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const matches: { title: string; subtitle: string; path: string; icon: string; type: string }[] = [];

    // 1. Check for common equation patterns
    if (q.includes('x') || q.includes('=') || q.includes('linear')) {
      matches.push({
        title: 'Linear Equation Solver',
        subtitle: 'Solve single or multi-variable equations like 2x + 5 = 17',
        path: '/math/system-of-linear-equations-2x2-3x3',
        icon: 'functions',
        type: 'Equation',
      });
    }
    if (q.includes('²') || q.includes('^2') || q.includes('quad') || q.includes('parabola')) {
      matches.push({
        title: 'Quadratic Equation Solver',
        subtitle: 'Solve ax² + bx + c = 0 with real/complex roots and vertex',
        path: '/math/quadratic-formula-solver-with-steps',
        icon: 'variable_add',
        type: 'Equation',
      });
    }
    if (q.includes('/') || q.includes('frac') || q.includes('mixed')) {
      matches.push({
        title: 'Fraction Calculator',
        subtitle: 'Add, subtract, multiply, divide, and simplify rational fractions',
        path: '#quick-answers',
        icon: 'pie_chart',
        type: 'Calculator',
      });
    }
    if (q.includes('sin') || q.includes('cos') || q.includes('tan') || q.includes('trig') || q.includes('deg')) {
      matches.push({
        title: 'Scientific & Trigonometry Calculator',
        subtitle: 'Evaluate trigonometric functions in degrees or radians',
        path: '/scientific-calculator',
        icon: 'calculate',
        type: 'Calculator',
      });
    }
    if (q.includes('mean') || q.includes('median') || q.includes('std') || q.includes('stat') || q.includes('dev')) {
      matches.push({
        title: 'Descriptive Statistics Calculator',
        subtitle: 'Mean, median, mode, sample/population standard deviation',
        path: '/math/standard-deviation-calculator',
        icon: 'bar_chart',
        type: 'Calculator',
      });
    }
    if (q.includes('pythag') || q.includes('hypot') || q.includes('triangle')) {
      matches.push({
        title: 'Pythagorean Theorem Calculator',
        subtitle: 'Solve right triangles: a² + b² = c²',
        path: '#interactive-visuals',
        icon: 'change_history',
        type: 'Geometry',
      });
    }
    if (q.includes('dist') || q.includes('point') || q.includes('slope') || q.includes('midpoint')) {
      matches.push({
        title: 'Coordinate Geometry Calculator',
        subtitle: 'Distance, midpoint, and slope between two Cartesian points',
        path: '#interactive-visuals',
        icon: 'architecture',
        type: 'Geometry',
      });
    }

    // 2. Match popular tools
    POPULAR_MATH_TOOLS.forEach((tool) => {
      if (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDesc.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.includes(q))
      ) {
        if (!matches.some((m) => m.title === tool.name)) {
          matches.push({
            title: tool.name,
            subtitle: tool.shortDesc,
            path: tool.path,
            icon: tool.icon,
            type: tool.category,
          });
        }
      }
    });

    // 3. Match categories
    MATH_CATEGORIES.forEach((cat) => {
      if (cat.name.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q)) {
        if (!matches.some((m) => m.title === cat.name)) {
          matches.push({
            title: `${cat.name} Calculators`,
            subtitle: cat.desc,
            path: `#${cat.id}`,
            icon: cat.icon,
            type: 'Category',
          });
        }
      }
    });

    // 4. Match formulas
    MATH_FORMULAS.forEach((f) => {
      if (f.name.toLowerCase().includes(q) || f.formula.toLowerCase().includes(q)) {
        if (!matches.some((m) => m.title === f.name)) {
          matches.push({
            title: `${f.name} (${f.formula})`,
            subtitle: f.whenToUse,
            path: f.calculatorPath,
            icon: 'menu_book',
            type: 'Formula',
          });
        }
      }
    });

    return matches.slice(0, 6);
  }, [query]);

  const exampleQueries = [
    { label: '2x + 5 = 17', query: '2x + 5 = 17', type: 'Linear' },
    { label: '3/4 + 1/8', query: '3/4 + 1/8', type: 'Fraction' },
    { label: 'x² - 5x + 6 = 0', query: 'x^2 - 5x + 6 = 0', type: 'Quadratic' },
    { label: 'sin(30°)', query: 'sin(30)', type: 'Trig' },
    { label: 'mean: 12, 15, 18, 22', query: 'mean 12 15 18 22', type: 'Statistics' },
    { label: 'distance between (2,3) and (8,11)', query: 'distance (2,3) (8,11)', type: 'Geometry' },
  ];

  return (
    <section className="w-full bg-surface border-b border-outline-variant/20 pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-on-surface-variant">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="material-symbols-outlined text-[14px] text-outline-variant">
                chevron_right
              </span>
            </li>
            <li className="font-semibold text-on-surface" aria-current="page">
              Math Calculators &amp; Step-by-Step Solvers
            </li>
          </ol>
        </nav>

        {/* Hero Headline & Positioning */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-sm">calculate</span>
            <span>SOLVE • SHOW THE STEPS • EXPLAIN • PRACTICE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight mb-4 leading-tight">
            Math Calculators &amp; Step-by-Step Problem Solvers
          </h1>

          <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-indigo-600 to-sky-600 dark:from-primary dark:via-indigo-400 dark:to-sky-400 bg-clip-text text-transparent mb-3">
            Solve It. See the Steps. Understand the Math.
          </div>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Free math calculators and problem solvers for algebra, fractions, geometry, statistics, trigonometry, calculus, percentages, and everyday math.
          </p>
        </div>

        {/* Search & Problem Solver Input */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-2 text-center sm:text-left">
            What Are You Trying to Solve?
          </div>

          <div className="relative">
            <div className="relative flex items-center rounded-2xl bg-surface-container-low border border-outline-variant/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-md transition-all">
              <span className="material-symbols-outlined text-on-surface-variant ml-4 text-xl">
                functions
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveSuggestionIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveSuggestionIndex((prev) =>
                      prev < suggestions.length - 1 ? prev + 1 : prev
                    );
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
                  } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                    e.preventDefault();
                    window.location.href = suggestions[activeSuggestionIndex].path;
                  }
                }}
                placeholder="Try: 2x + 5 = 17, 3/4 + 1/8, x² - 5x + 6 = 0, sin(30°), mean..."
                className="w-full bg-transparent px-3 py-3.5 text-sm sm:text-base text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none"
                aria-label="Search math calculators and problem solvers"
              />
              <div className="flex items-center gap-2 mr-3 shrink-0">
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setQuickCalcResult(null);
                    }}
                    className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                    aria-label="Clear search query"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 rounded bg-surface-container border border-outline-variant/30 font-mono text-[11px] text-on-surface-variant shadow-xs">
                  /
                </kbd>
                <button
                  type="button"
                  onClick={() => {
                    if (suggestions.length > 0) {
                      window.location.href = suggestions[0].path;
                    } else {
                      const el = document.getElementById('popular-tools');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors shadow-xs"
                >
                  Solve
                </button>
              </div>
            </div>

            {/* Quick In-Line Math Evaluator Result */}
            {quickCalcResult && (
              <div className="mt-2 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-mono text-on-surface">
                  <span className="text-primary font-bold">Answer:</span>
                  <span className="font-semibold text-base">{query} = {quickCalcResult}</span>
                </div>
                <Link
                  href="/scientific-calculator"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  See in Scientific Calculator →
                </Link>
              </div>
            )}

            {/* Dropdown Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-surface border border-outline-variant/30 shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-outline-variant/15 text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant flex items-center justify-between">
                  <span>Suggested Tools &amp; Solutions</span>
                  <span>Use ↑ ↓ to navigate, Enter to select</span>
                </div>
                <div className="divide-y divide-outline-variant/10 max-h-80 overflow-y-auto">
                  {suggestions.map((item, idx) => (
                    <Link
                      key={item.title}
                      href={item.path}
                      onClick={() => setQuery('')}
                      className={`flex items-start gap-3 p-3 transition-colors ${
                        activeSuggestionIndex === idx
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs sm:text-sm truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Example Equation Shortcuts */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
            <span className="text-[11px] font-semibold text-on-surface-variant mr-1">
              Try examples:
            </span>
            {exampleQueries.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => {
                  setQuery(ex.query);
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-mono border border-outline-variant/20 hover:border-primary/40 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
