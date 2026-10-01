import React from 'react';
import Link from 'next/link';

export default function MathLearningPathAndExams() {
  const learningSteps = [
    {
      level: 'Stage 01',
      title: 'Foundations',
      desc: 'Master arithmetic, fractions, decimals, percentages, and basic ratios.',
      topics: ['Order of Operations (PEMDAS)', 'Fraction Simplification', 'Percentage Calculations', 'Greatest Common Factor'],
      path: '#quick-answers',
    },
    {
      level: 'Stage 02',
      title: 'Algebra & Geometry',
      desc: 'Progress from linear equations to quadratics, coordinate geometry, and trigonometry.',
      topics: ['Linear Equations ax + b = c', 'Quadratic Formula & Vertex', 'Pythagorean Theorem', 'Unit Circle Coordinates'],
      path: '/math/quadratic-formula-solver-with-steps',
    },
    {
      level: 'Stage 03',
      title: 'Statistics & Probability',
      desc: 'Understand data distributions, measures of spread, and combinatorial counting.',
      topics: ['Mean, Median & Mode', 'Standard Deviation & Variance', 'Normal Curve & Z-Scores', 'Permutations & Combinations'],
      path: '/math/standard-deviation-calculator',
    },
    {
      level: 'Stage 04',
      title: 'Advanced & Applied Math',
      desc: 'Explore calculus limits, progressions, infinite series sums, and scientific conversions.',
      topics: ['Limits & Derivatives', 'Arithmetic & Geometric Sequences', 'Compound Interest Amortization', 'Unit System Conversions'],
      path: '#formula-library',
    },
  ];

  const examSuites = [
    {
      exam: 'SAT Math Practice',
      focus: 'Heart of Algebra, Passport to Advanced Math, Problem Solving & Data Analysis.',
      keyTools: ['Linear Systems', 'Quadratic Equations', 'Percent Problems', 'Circle Geometry'],
      linkText: 'Practice SAT Topics',
      path: '/math/system-of-linear-equations-2x2-3x3',
    },
    {
      exam: 'ACT Math Practice',
      focus: 'Pre-Algebra, Elementary Algebra, Intermediate Algebra, Coordinate & Plane Geometry, Trigonometry.',
      keyTools: ['Trig Functions (SOH-CAH-TOA)', 'Area & Volume', 'Fractions & Proportions', 'Standard Deviation'],
      linkText: 'Practice ACT Topics',
      path: '/scientific-calculator',
    },
    {
      exam: 'AP Calculus & AP Stats',
      focus: 'Limits, derivative rules, Riemann sums, hypothesis testing, and normal distribution z-scores.',
      keyTools: ['Derivative Evaluator', 'Z-Score Normal Curve', 'Sample vs Population Variance', 'Series Sums'],
      linkText: 'Practice AP Topics',
      path: '/math/standard-deviation-calculator',
    },
    {
      exam: 'GRE & GMAT Quantitative',
      focus: 'Quantitative comparison, discrete probability, combinatorics, and rate/work calculations.',
      keyTools: ['Permutations & Combinations', 'Weighted Averages', 'Rate of Change', 'Ratio Scalers'],
      linkText: 'Practice Grad Prep Topics',
      path: '/percentage-calculator',
    },
  ];

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section 1: Math Learning Path */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Curriculum Progression
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Math Learning Path
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              A structured roadmap from basic arithmetic to advanced calculus and applied quantitative analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {learningSteps.map((step) => (
              <div
                key={step.level}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all"
              >
                <div>
                  <div className="text-[11px] font-mono font-bold text-primary mb-1">
                    {step.level}
                  </div>
                  <h3 className="font-bold text-on-surface text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                    {step.desc}
                  </p>

                  <div className="space-y-1.5 border-t border-outline-variant/15 pt-3 mb-4">
                    <span className="text-[10px] uppercase font-semibold text-on-surface-variant/70 tracking-wider">
                      Core Concepts:
                    </span>
                    {step.topics.map((t) => (
                      <div key={t} className="flex items-center gap-1.5 text-xs text-on-surface">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0"></span>
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={step.path}
                  className="pt-2 text-xs font-semibold text-primary hover:underline flex items-center justify-between"
                >
                  <span>Explore Stage Tools</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Math Exam Practice */}
        <div className="pt-12 border-t border-outline-variant/20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Standardized Test Preparation
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Math Exam Practice
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Practice common mathematical concepts and problem types frequently encountered on standardized examinations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {examSuites.map((suite) => (
              <div
                key={suite.exam}
                className="p-5 rounded-2xl bg-surface border border-outline-variant/30 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all"
              >
                <div>
                  <h3 className="font-bold text-on-surface text-base mb-2">
                    {suite.exam}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                    {suite.focus}
                  </p>

                  <div className="space-y-1 text-xs text-on-surface-variant border-t border-outline-variant/15 pt-3 mb-4">
                    <span className="text-[10px] uppercase font-semibold text-on-surface-variant/70 tracking-wider">
                      Relevant Tools:
                    </span>
                    {suite.keyTools.map((tool) => (
                      <div key={tool} className="text-xs text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs text-primary">check</span>
                        <span>{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={suite.path}
                  className="pt-2 text-xs font-semibold text-primary hover:underline flex items-center justify-between"
                >
                  <span>{suite.linkText}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Exam Disclaimer */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant leading-relaxed">
            <span className="font-semibold text-on-surface">Standardized Testing Notice: </span>
            SAT® and AP® are registered trademarks of the College Board. ACT® is a registered trademark of ACT, Inc. GRE® is a registered trademark of Educational Testing Service (ETS). GMAT® is a registered trademark of the Graduate Management Admission Council (GMAC). None of these organizations sponsor, endorse, or are affiliated with SolveItCalculator. These tools are independent practice resources designed for mathematical concept reinforcement.
          </div>
        </div>
      </div>
    </section>
  );
}
