'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export default function MathCalculatorFinder() {
  const [selectedTopic, setSelectedTopic] = useState('Algebra');
  const [selectedNeed, setSelectedNeed] = useState('Step-by-Step Solution');

  const topics = [
    'Fractions',
    'Algebra',
    'Geometry',
    'Statistics',
    'Trigonometry',
    'Calculus',
    'Percentages',
    'Other',
  ];

  const needs = [
    'Quick Answer',
    'Step-by-Step Solution',
    'Graph',
    'Formula',
    'Practice',
  ];

  const recommendation = useMemo(() => {
    if (selectedTopic === 'Algebra') {
      if (selectedNeed === 'Step-by-Step Solution') {
        return {
          title: 'Quadratic Equation & Polynomial Solver',
          desc: 'Solves quadratic equations and polynomials with full factoring steps, discriminant evaluation, and vertex coordinates.',
          path: '/math/quadratic-formula-solver-with-steps',
          actionText: 'Open Quadratic Solver',
          reason: 'Best match for step-by-step algebraic equation solutions.',
        };
      }
      if (selectedNeed === 'Graph') {
        return {
          title: 'Function Graphing Visualizer',
          desc: 'Plots parabolas and linear equations in real time with interactive coefficients and roots.',
          path: '#interactive-visuals',
          actionText: 'Open Graph Visualizer',
          reason: 'Best match for visualizing algebraic equations and curves.',
        };
      }
      if (selectedNeed === 'Formula') {
        return {
          title: 'Quadratic Formula & Exponent Rules',
          desc: 'Detailed formula reference with variables, derivations, and worked examples.',
          path: '#formula-library',
          actionText: 'View Algebra Formulas',
          reason: 'Best match for understanding algebraic laws and equations.',
        };
      }
      return {
        title: 'System of Linear Equations Solver',
        desc: 'Solve 2x2 and 3x3 simultaneous linear systems quickly.',
        path: '/math/system-of-linear-equations-2x2-3x3',
        actionText: 'Solve Linear System',
        reason: 'Best match for algebraic computations.',
      };
    }

    if (selectedTopic === 'Fractions') {
      return {
        title: 'Fraction Arithmetic & Simplifier',
        desc: 'Reduces fractions, finds least common denominators (LCD), and performs exact rational arithmetic without decimal rounding.',
        path: '#quick-answers',
        actionText: 'Open Fraction Tool',
        reason: 'Best match for working with rational fractions, LCDs, and mixed numbers.',
      };
    }

    if (selectedTopic === 'Geometry') {
      if (selectedNeed === 'Graph' || selectedNeed === 'Step-by-Step Solution') {
        return {
          title: 'Coordinate Geometry & Triangle Explorer',
          desc: 'Plot Cartesian coordinate pairs, calculate distance, midpoint, and slope, and explore Pythagorean triangles.',
          path: '#interactive-visuals',
          actionText: 'Open Geometry Explorer',
          reason: 'Best match for visual coordinate calculations and spatial proofs.',
        };
      }
      return {
        title: '2D Area & 3D Volume Calculator',
        desc: 'Calculates perimeter, area, surface area, and volume for polygons, circles, and 3D solids.',
        path: '#interactive-visuals',
        actionText: 'Calculate Geometry',
        reason: 'Best match for spatial dimensions and geometric formulas.',
      };
    }

    if (selectedTopic === 'Statistics') {
      return {
        title: 'Descriptive Statistics & Standard Deviation',
        desc: 'Calculates sample and population mean, median, mode, variance, standard deviation, and IQR with clear formulas.',
        path: '/math/standard-deviation-calculator',
        actionText: 'Calculate Statistics',
        reason: 'Best match for quantitative datasets and statistical dispersion.',
      };
    }

    if (selectedTopic === 'Trigonometry') {
      if (selectedNeed === 'Graph' || selectedNeed === 'Practice') {
        return {
          title: 'Interactive Unit Circle Explorer',
          desc: 'Explore sin, cos, and tan across 360 degrees and 2π radians with exact coordinates.',
          path: '#interactive-visuals',
          actionText: 'Explore Unit Circle',
          reason: 'Best match for trigonometric angle visualization and exact values.',
        };
      }
      return {
        title: 'Scientific Calculator (Trig Mode)',
        desc: 'Evaluate trigonometric functions in either Degree (°) or Radian (rad) mode.',
        path: '/scientific-calculator',
        actionText: 'Open Scientific Calculator',
        reason: 'Best match for trigonometric evaluation.',
      };
    }

    if (selectedTopic === 'Percentages') {
      return {
        title: 'Percentage, Change & Difference Calculator',
        desc: 'Calculate baseline percentages, percentage increase or decrease, and symmetric percent differences.',
        path: '/percentage-calculator',
        actionText: 'Open Percentage Tool',
        reason: 'Best match for retail, commercial, and financial percentage math.',
      };
    }

    if (selectedTopic === 'Calculus') {
      return {
        title: 'Calculus, Sequences & Limits Suite',
        desc: 'Explore arithmetic and geometric series, sequence limits, and derivative rules.',
        path: '#formula-library',
        actionText: 'View Calculus Tools',
        reason: 'Best match for advanced series, progressions, and limits.',
      };
    }

    return {
      title: 'Scientific Calculator & Problem Solver',
      desc: 'All-purpose calculator with support for algebraic expressions, powers, roots, and scientific notation.',
      path: '/scientific-calculator',
      actionText: 'Open Scientific Calculator',
      reason: 'Best general match based on your selections.',
    };
  }, [selectedTopic, selectedNeed]);

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Decision Assistant
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Find the Right Math Calculator
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Answer two quick questions to get the ideal tool for your current mathematical problem.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-6">
          {/* Step 1 */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold">
                1
              </span>
              <span>What are you working with?</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTopic(t)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedTopic === t
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container border border-outline-variant/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold">
                2
              </span>
              <span>What do you need?</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {needs.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSelectedNeed(n)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedNeed === n
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container border border-outline-variant/20'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          <div className="pt-6 border-t border-outline-variant/15">
            <div className="p-5 rounded-2xl bg-surface border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">
                  <span className="material-symbols-outlined text-sm">recommend</span>
                  <span>Recommended Calculator</span>
                </div>
                <h3 className="font-bold text-on-surface text-base sm:text-lg">
                  {recommendation.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-2xl">
                  {recommendation.desc}
                </p>
                <div className="text-[11px] font-medium text-primary mt-2">
                  {recommendation.reason}
                </div>
              </div>

              <Link
                href={recommendation.path}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>{recommendation.actionText}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
