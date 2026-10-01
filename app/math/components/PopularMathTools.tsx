import React from 'react';
import Link from 'next/link';
import { POPULAR_MATH_TOOLS } from '../mathCategoryData';

export default function PopularMathTools() {
  return (
    <section id="popular-tools" className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Essential Solvers
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Popular Math Tools
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Instant calculations and step-by-step problem solvers for everyday and academic math.
            </p>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-surface-container text-on-surface-variant self-start sm:self-auto border border-outline-variant/20">
            {POPULAR_MATH_TOOLS.length} Core Tools
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_MATH_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              className="group p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{tool.icon}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    {tool.category.split(' ')[0]}
                  </span>
                </div>

                <h3 className="font-bold text-on-surface text-base group-hover:text-primary transition-colors mb-1.5">
                  {tool.name}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs font-semibold text-primary">
                <span>{tool.supportsSteps ? 'Solve & Show Steps' : 'Calculate'}</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
