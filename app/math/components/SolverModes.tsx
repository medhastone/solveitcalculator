import React from 'react';
import Link from 'next/link';

export default function SolverModes() {
  const modes = [
    {
      title: 'QUICK CALCULATION',
      badge: 'Immediate Answers',
      icon: 'bolt',
      desc: 'Enter numbers or algebraic expressions to get an accurate numerical answer instantly with zero friction.',
      action: 'Open Scientific Calculator',
      path: '/scientific-calculator',
    },
    {
      title: 'SOLVE A PROBLEM',
      badge: 'Step-by-Step Math',
      icon: 'format_list_numbered',
      desc: 'Work through linear equations, quadratic polynomials, or fraction reductions with intermediate mathematical steps.',
      action: 'Solve an Equation',
      path: '/math/quadratic-formula-solver-with-steps',
    },
    {
      title: 'LEARN THE METHOD',
      badge: 'Formulas & Derivations',
      icon: 'menu_book',
      desc: 'Understand why the formula works, what every variable represents, and when to apply specific theorems.',
      action: 'Browse Formula Library',
      path: '#formula-library',
    },
    {
      title: 'PRACTICE',
      badge: 'Worked Examples',
      icon: 'quiz',
      desc: 'Inspect worked sample problems across fractions, algebra, geometry, and descriptive statistics to check your homework.',
      action: 'See Example Problems',
      path: '#quick-answers',
    },
  ];

  return (
    <section className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Product Workflow
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            How Do You Want to Work?
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Choose your learning mode: from fast arithmetic answers to detailed step-by-step problem derivations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((mode) => (
            <div
              key={mode.title}
              className="p-5 rounded-2xl bg-surface border border-outline-variant/30 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">{mode.icon}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    {mode.badge}
                  </span>
                </div>

                <h3 className="font-bold text-on-surface text-base mb-1.5">
                  {mode.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {mode.desc}
                </p>
              </div>

              <Link
                href={mode.path}
                className="pt-3 border-t border-outline-variant/15 text-xs font-semibold text-primary hover:underline flex items-center justify-between"
              >
                <span>{mode.action}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
