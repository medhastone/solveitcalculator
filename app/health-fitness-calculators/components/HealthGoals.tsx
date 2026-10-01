'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HEALTH_USER_GOALS } from '../healthCategoryData';

export default function HealthGoals() {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(HEALTH_USER_GOALS[0].id);

  const activeGoal = HEALTH_USER_GOALS.find((g) => g.id === selectedGoalId) || HEALTH_USER_GOALS[0];

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Goal-Based Discovery
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            What Are You Trying to Achieve?
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            Start with your goal instead of searching through hundreds of health calculators.
          </p>
        </div>

        {/* Goal Selection Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {HEALTH_USER_GOALS.map((goal) => {
            const isSelected = goal.id === selectedGoalId;
            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoalId(goal.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-outline-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{goal.icon}</span>
                <span>{goal.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Goal Detail Card */}
        <div className="rounded-2xl bg-surface-container-low/60 border border-outline-variant/30 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-outline-variant/20 gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl">{activeGoal.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface">
                  {activeGoal.title}
                </h3>
                <p className="text-xs sm:text-sm text-primary font-medium">
                  {activeGoal.subtitle}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md leading-relaxed">
              {activeGoal.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoal.tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.path}
                className="group p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/25 hover:border-primary/50 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold text-on-surface group-hover:text-primary transition-colors text-sm mb-1 flex items-center justify-between">
                    <span>{tool.name}</span>
                    <span className="material-symbols-outlined text-base text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                      arrow_forward
                    </span>
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/10 text-[11px] font-semibold text-primary flex items-center">
                  <span>Calculate →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
