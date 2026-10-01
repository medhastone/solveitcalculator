'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { POPULAR_TOOLS, ToolItem } from '../data/timeDateData';

interface PopularCalculatorsProps {
  onSelectTool?: (tool: ToolItem) => void;
}

export default function PopularCalculators({ onSelectTool }: PopularCalculatorsProps) {
  return (
    <section id="popular-tools" className="w-full bg-surface py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span>Most Requested Tools</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Popular Time &amp; Date Calculators
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
              Reliable, calendar-aware calculators for your most frequent personal, professional, and deadline calculations.
            </p>
          </div>
        </div>

        {/* 12 Popular Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {POPULAR_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.anchor}
              onClick={() => onSelectTool?.(tool)}
              className="group bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/40 hover:border-primary/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                    {tool.badge}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
                  {tool.name}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary-hover">
                <span>Calculate now</span>
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
