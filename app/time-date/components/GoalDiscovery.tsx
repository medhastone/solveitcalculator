'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import { GOAL_CARDS } from '../data/timeDateData';

export default function GoalDiscovery() {
  return (
    <section className="w-full bg-surface-container-low py-12 sm:py-16 border-y border-outline-variant/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Task-Oriented Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            What Do You Want to Do?
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            Start with your task instead of searching through a long calculator list.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GOAL_CARDS.map((card, idx) => (
            <div
              key={card.title}
              className={`bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/40 shadow-sm flex flex-col justify-between ${
                idx === GOAL_CARDS.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                <h3 className="text-sm font-extrabold tracking-wider text-primary uppercase mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mb-4">
                  {card.desc}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-outline-variant/20">
                {card.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between text-xs sm:text-sm font-semibold text-on-surface hover:text-primary p-2 rounded-lg hover:bg-surface-container transition-colors group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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
