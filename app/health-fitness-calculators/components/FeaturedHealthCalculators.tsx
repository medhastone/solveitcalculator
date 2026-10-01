import React from 'react';
import Link from 'next/link';
import { FEATURED_HEALTH_TOOLS } from '../healthCategoryData';

export default function FeaturedHealthCalculators() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              In-Depth Workbenches
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Featured Health &amp; Fitness Calculators
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1">
              Essential computation tools with stated problem contexts, required input parameters, and transparent outputs.
            </p>
          </div>
          <span className="text-xs text-on-surface-variant/80 shrink-0">
            8 Featured Tools
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_HEALTH_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">{tool.icon}</span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                    {tool.category}
                  </span>
                </div>

                <h3 className="font-bold text-on-surface text-base mb-3 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-surface-container-low/60 border border-outline-variant/15">
                    <div className="font-semibold text-on-surface mb-0.5 flex items-center gap-1 text-[11px] text-primary">
                      <span className="material-symbols-outlined text-xs">task_alt</span>
                      Problem It Solves
                    </div>
                    <div className="text-on-surface-variant leading-relaxed">
                      {tool.problemSolved}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-on-surface">You Enter: </span>
                    <span className="text-on-surface-variant">{tool.userEnters}</span>
                  </div>

                  <div>
                    <span className="font-semibold text-on-surface">You Receive: </span>
                    <span className="text-on-surface-variant">{tool.userReceives}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-outline-variant/20">
                <Link
                  href={tool.path}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-on-primary text-xs font-semibold transition-colors"
                >
                  <span>Open Calculator</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
