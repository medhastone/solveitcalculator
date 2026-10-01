'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Repeat,
  Clock,
  Wrench,
  HeartPulse,
  Briefcase,
  Sparkles,
  Search,
  Bookmark,
  History,
} from 'lucide-react';

interface GlobalQuickActionsBarProps {
  onOpenSearch?: () => void;
  onOpenHistory?: () => void;
  onOpenSaved?: () => void;
}

const QUICK_LINKS = [
  { name: 'EMI Calculator', href: '/loans-and-amortization', icon: TrendingUp, color: 'text-emerald-400' },
  { name: 'Unit Converter', href: '/conversions', icon: Repeat, color: 'text-amber-400' },
  { name: 'Time & Date', href: '/time-date', icon: Clock, color: 'text-cyan-400' },
  { name: 'Scientific', href: '/scientific-calculator', icon: Wrench, color: 'text-purple-400' },
  { name: 'Health & BMI', href: '/bmi-calculator', icon: HeartPulse, color: 'text-rose-400' },
  { name: 'Payroll & Wages', href: '/work-hours-payroll-calculator', icon: Briefcase, color: 'text-blue-400' },
];

export default function GlobalQuickActionsBar({
  onOpenSearch,
  onOpenHistory,
  onOpenSaved,
}: GlobalQuickActionsBarProps) {
  return (
    <div className="w-full bg-surface-container-lowest/90 border-b border-outline-variant/30 backdrop-blur-sm px-4 py-2 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        {/* Quick Links Pills */}
        <div className="flex items-center gap-2 text-xs flex-nowrap shrink-0">
          <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider mr-1">
            <Sparkles className="w-3 h-3 text-primary" />
            Quick:
          </span>
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high/60 hover:bg-surface-container-high border border-outline-variant/40 text-on-surface hover:text-primary transition-all whitespace-nowrap text-xs font-medium"
              >
                <Icon className={`w-3 h-3 ${link.color}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-outline-variant/40">
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-1.5 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-colors cursor-pointer"
            title="Search Calculators"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onOpenSaved}
            className="p-1.5 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-colors cursor-pointer"
            title="Saved Calculators"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onOpenHistory}
            className="p-1.5 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-colors cursor-pointer"
            title="Calculation History"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
