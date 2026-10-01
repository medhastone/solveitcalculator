'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MATH_GOALS } from '../mathCategoryData';

export default function MathGoals() {
  const [selectedGoalId, setSelectedGoalId] = useState(MATH_GOALS[0].id);

  const activeGoal = MATH_GOALS.find((g) => g.id === selectedGoalId) || MATH_GOALS[0];

  return (
    <section id="math-goals" className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Intent-Based Discovery
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            What Are You Working On?
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Find the right tools based on what you want to accomplish right now.
          </p>
        </div>

        {/* Goal Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {MATH_GOALS.map((goal) => {
            const isSelected = goal.id === selectedGoalId;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelectedGoalId(goal.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary border border-outline-variant/25'
                }`}
              >
                <span className="material-symbols-outlined text-base">{goal.icon}</span>
                <span>{goal.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Goal Showcase */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-outline-variant/15 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">{activeGoal.icon}</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-on-surface">
                  {activeGoal.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  {activeGoal.desc}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-surface-container text-on-surface-variant self-start sm:self-center shrink-0">
              {activeGoal.tools.length} Curated Tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activeGoal.tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.path}
                className="group p-4 rounded-xl bg-surface border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-low transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-bold text-on-surface group-hover:text-primary text-sm mb-1">
                    <span>{tool.name}</span>
                    <span className="material-symbols-outlined text-sm text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <div className="mt-3 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Tool →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
