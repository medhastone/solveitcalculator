import React from 'react';
import Link from 'next/link';
import { MATH_CATEGORIES } from '../mathCategoryData';

export default function MathCategories() {
  return (
    <section
      id="math-categories"
      className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Complete Topical Directory
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Browse Math Calculators by Topic
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
            Explore 11 foundational and advanced branches of mathematics with formula-driven solvers, derivations, and worked examples.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MATH_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.id}
              id={cat.id}
              className="p-4 rounded-xl bg-surface border border-outline-variant/30 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-primary font-semibold">
                        0{idx + 1}
                      </span>
                      <h3 className="font-bold text-on-surface text-lg leading-tight">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    {cat.tools.length} Tools
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {cat.desc}
                </p>

                <div className="space-y-2 mb-5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
                    Popular in this topic:
                  </span>
                  <div className="space-y-1.5">
                    {cat.tools.slice(0, 4).map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.path}
                        className="group flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-surface-container-low transition-colors"
                      >
                        <span className="text-on-surface group-hover:text-primary transition-colors font-medium truncate">
                          {tool.name}
                        </span>
                        <span className="material-symbols-outlined text-xs text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0 ml-1">
                          arrow_forward
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant/70 font-medium">
                  {cat.tools.length} calculators
                </span>
                <Link
                  href={cat.tools[0]?.path || '#'}
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Explore {cat.name} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
