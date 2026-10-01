import React from 'react';
import Link from 'next/link';
import { HEALTH_CATEGORIES_DIRECTORY } from '../healthCategoryData';

export default function HealthCategories() {
  return (
    <section id="categories-directory" className="w-full py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Complete Directory
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            Health Calculators by Category
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
            Browse our full suite of transparent, formula-driven calculators organized across functional health and exercise domains.
          </p>
        </div>

        <div className="space-y-6">
          {HEALTH_CATEGORIES_DIRECTORY.map((category, idx) => (
            <div
              key={category.id}
              className="rounded-xl bg-surface border border-outline-variant/25 p-4 sm:p-5 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-outline-variant/15 gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">{category.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-primary">
                        0{idx + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-on-surface">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {category.description}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0 self-start sm:self-center">
                  {category.tools.length} Tools
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.path}
                    className="group p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-low transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between font-semibold text-on-surface group-hover:text-primary transition-colors text-xs sm:text-sm mb-1">
                        <span className="truncate">{tool.name}</span>
                        <span className="material-symbols-outlined text-xs text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                          arrow_forward
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">
                        {tool.desc}
                      </p>
                    </div>
                    <div className="mt-2 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Calculate →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
