'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { getCurrentTheme, toggleTheme } from '../lib/theme';
import SolveItLogo from './SolveItLogo';

export default function Footer() {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDark(getCurrentTheme() === 'dark');
    }, 0);
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setIsDark(customEvent.detail === 'dark');
      } else {
        setIsDark(getCurrentTheme() === 'dark');
      }
    };
    window.addEventListener('solveit-theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('solveit-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setIsDark(next === 'dark');
  };

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 text-on-surface-variant py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand Lockup & Engine Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
              <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] -mr-1 sm:-mr-1.5 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
                <SolveItLogo className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px]" />
              </div>
              <span className="font-bold text-2xl sm:text-3xl tracking-tight text-on-surface">
                SolveIt<span className="text-primary">Calculator</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-md">
              Free, easy-to-use calculators to help you with everyday math. Quickly figure out loan payments, check your health numbers, count days, or convert measurements. Everything runs safely right on your device—we never collect, store, or sell your personal details.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/40">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                In-Browser Processing
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/40">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Private &amp; Secure
              </span>
            </div>
          </div>

          {/* Col 3: Finance & Business */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Finance &amp; Loans
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/finance/mortgage-calculator" className="hover:text-primary transition-colors">
                  Mortgage &amp; Amortization
                </Link>
              </li>
              <li>
                <Link href="/finance/emi-calculator" className="hover:text-primary transition-colors">
                  EMI &amp; Loan Payoff
                </Link>
              </li>
              <li>
                <Link href="/finance/compound-interest-calculator" className="hover:text-primary transition-colors">
                  Compound Interest &amp; SIP
                </Link>
              </li>
              <li>
                <Link href="/finance/salary" className="hover:text-primary transition-colors">
                  Salary &amp; Payroll Breakdown
                </Link>
              </li>
              <li>
                <Link href="/finance/taxes" className="hover:text-primary transition-colors">
                  Global Tax &amp; GST Estimators
                </Link>
              </li>
              <li>
                <Link href="/finance/fire-forecaster" className="hover:text-primary transition-colors">
                  FIRE &amp; Retirement Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Time, Health & Math */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Time, Health &amp; Math
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/time-date/date-difference-calculator" className="hover:text-primary transition-colors">
                  Date Difference Calculator
                </Link>
              </li>
              <li>
                <Link href="/time-date/add-subtract-time-calculator" className="hover:text-primary transition-colors">
                  Add / Subtract Time Tools
                </Link>
              </li>
              <li>
                <Link href="/health-fitness/bmi-calculator" className="hover:text-primary transition-colors">
                  BMI &amp; Healthy Body Weight
                </Link>
              </li>
              <li>
                <Link href="/math/scientific-calculator" className="hover:text-primary transition-colors">
                  Scientific Solver Workbench
                </Link>
              </li>
              <li>
                <Link href="/math/percentage-calculator" className="hover:text-primary transition-colors">
                  Percentage Calculator Suite
                </Link>
              </li>
              <li>
                <Link href="/time-date/work-hours" className="hover:text-primary transition-colors">
                  Work Hours &amp; Timesheets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Unit Converters */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Unit Converters
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/conversions" className="hover:text-primary transition-colors">
                  Universal Unit Directory
                </Link>
              </li>
              <li>
                <Link href="/conversions/length" className="hover:text-primary transition-colors">
                  Length &amp; Distance Units
                </Link>
              </li>
              <li>
                <Link href="/conversions/mass" className="hover:text-primary transition-colors">
                  Weight &amp; Mass Converter
                </Link>
              </li>
              <li>
                <Link href="/conversions/temperature" className="hover:text-primary transition-colors">
                  Temperature Converter
                </Link>
              </li>
              <li>
                <Link href="/conversions/volume" className="hover:text-primary transition-colors">
                  Volume &amp; Capacity Units
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-primary transition-colors font-semibold text-primary inline-flex items-center gap-1">
                  <span>Explore All Tools</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal Links, Mode Toggle & Trust Note */}
        <div className="pt-6 border-t border-outline-variant/30 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          {/* Left: Copyright & Theme Toggle */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <p>© {new Date().getFullYear()} SolveItCalculator.com</p>
            <button
              type="button"
              onClick={handleToggle}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface hover:text-primary transition-colors cursor-pointer"
              title="Toggle Dark / Light Theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-primary" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {/* Center: Legal & Site Links (About, Contact Us, Privacy Policy, Terms of Use, Sitemap) */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium" aria-label="Footer Legal and Sitemap Navigation">
            <Link href="/about-us" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact Us
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="hover:text-primary transition-colors">
              Terms of Use
            </Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">
              Sitemap
            </Link>
          </nav>

          {/* Right: Reassuring Trust Note */}
          <div className="text-xs text-on-surface-variant text-center lg:text-right">
            100% Free &amp; Private · In-Browser Calculations
          </div>
        </div>
      </div>
    </footer>
  );
}
