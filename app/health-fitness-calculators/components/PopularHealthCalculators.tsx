import React from 'react';
import Link from 'next/link';
import { POPULAR_HEALTH_TOOLS } from '../healthCategoryData';

export default function PopularHealthCalculators() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
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
              Frequently used tools for body measurements, daily energy, exercise pacing, and pregnancy planning.
            </p>
          </div>
          <span className="text-xs text-on-surface-variant/80 shrink-0">
            12 Essential Calculators
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {POPULAR_HEALTH_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{tool.icon}</span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                    {tool.category}
                  </span>
                </div>
                <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors text-base mb-1.5">
                  {tool.name}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="pt-2 border-t border-outline-variant/15 flex items-center text-xs font-semibold text-primary group-hover:text-primary">
                <span>Calculate</span>
                <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">
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
