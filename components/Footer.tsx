'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentTheme, toggleTheme } from '../lib/theme';

export default function Footer() {
  const [isDark, setIsDark] = useState<boolean>(false);

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
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 mt-space-3xl transition-colors duration-150">
      <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop pt-space-2xl pb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl pb-space-2xl border-b border-outline-variant/30">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <img alt="SolveIt Brand Logo" className="h-12 w-auto object-contain" src="/logo.png"/>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mb-4">
              &quot;Every Calculation. One Place.&quot; High-precision algorithms delivered through an Apple-inspired SaaS aesthetic. Zero fluff, 100% client-side execution.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-caps text-label-caps border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Online Engine v4.2.5</span>
              </div>
              <button
                type="button"
                onClick={handleToggle}
                aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isDark ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <p className="font-label-caps text-label-caps text-on-surface uppercase font-bold tracking-wider mb-4">
              <Link href="/business" className="hover:text-primary transition-colors">Business &amp; Finance</Link>
            </p>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><Link href="/business" className="hover:text-primary font-medium text-primary transition-colors">Business Suite Hub</Link></li>
              <li><Link href="/finance" className="hover:text-primary transition-colors">Finance &amp; Mortgages</Link></li>
              <li><Link href="/business#category-profit" className="hover:text-primary transition-colors">Profit Margin &amp; Markup</Link></li>
              <li><Link href="/business#category-saas" className="hover:text-primary transition-colors">SaaS Rule of 40 &amp; ARR</Link></li>
              <li><Link href="/business#category-startup" className="hover:text-primary transition-colors">Cash Runway &amp; Burn Rate</Link></li>
              <li><Link href="/business#category-ecommerce" className="hover:text-primary transition-colors">Ecommerce &amp; FBA Net</Link></li>
              <li><Link href="/fire-forecaster" className="hover:text-primary transition-colors">FIRE Forecaster</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="font-label-caps text-label-caps text-on-surface uppercase font-bold tracking-wider mb-4">
              <Link href="/health" className="hover:text-primary transition-colors">Health &amp; Fitness</Link>
            </p>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><Link href="/health/bmi" className="hover:text-primary transition-colors">BMI &amp; Body Mass Index</Link></li>
              <li><Link href="/health#bmr-card" className="hover:text-primary transition-colors">Mifflin BMR Baseline</Link></li>
              <li><Link href="/health#tdee-card" className="hover:text-primary transition-colors">TDEE Caloric Needs</Link></li>
              <li><Link href="/health#navy-card" className="hover:text-primary transition-colors">Navy Body Fat Matrix</Link></li>
              <li><Link href="/health#zone2-card" className="hover:text-primary transition-colors">Target Heart Rate Zones</Link></li>
              <li><Link href="/health#water-card" className="hover:text-primary transition-colors">Daily Hydration Volume</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="font-label-caps text-label-caps text-on-surface uppercase font-bold tracking-wider mb-4">
              <Link href="/technology" className="hover:text-primary transition-colors">Technology &amp; Dev</Link>
            </p>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><Link href="/technology" className="hover:text-primary font-medium text-primary transition-colors">Technology Hub</Link></li>
              <li><Link href="/technology#workbench-subnet" className="hover:text-primary transition-colors">Subnet &amp; CIDR Sizer</Link></li>
              <li><Link href="/technology#workbench-speed" className="hover:text-primary transition-colors">Bandwidth &amp; Download</Link></li>
              <li><Link href="/technology#workbench-crypto" className="hover:text-primary transition-colors">Password Entropy Bits</Link></li>
              <li><Link href="/technology#workbench-raid" className="hover:text-primary transition-colors">RAID Array Capacity</Link></li>
              <li><Link href="/technology#directory" className="hover:text-primary transition-colors">500+ Dev Workbenches</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="font-label-caps text-label-caps text-on-surface uppercase font-bold tracking-wider mb-4">
              <Link href="/education" className="hover:text-primary transition-colors">Education &amp; Science</Link>
            </p>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><Link href="/science" className="hover:text-primary font-medium text-primary transition-colors">Science Tools Hub</Link></li>
              <li><Link href="/education" className="hover:text-primary font-medium text-primary transition-colors">Education Hub</Link></li>
              <li><Link href="/science#workbenches" className="hover:text-primary transition-colors">Density &amp; Molarity Models</Link></li>
              <li><Link href="/education#workbench-gpa" className="hover:text-primary transition-colors">Target GPA Predictor</Link></li>
              <li><Link href="/education#workbench-final" className="hover:text-primary transition-colors">Final Exam Needed</Link></li>
              <li><Link href="/math" className="hover:text-primary transition-colors">Math Solvers &amp; Stats</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="font-label-caps text-label-caps text-on-surface uppercase font-bold tracking-wider mb-4">
              <Link href="/time-date" className="hover:text-primary transition-colors">Time &amp; Date Suite</Link>
            </p>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><Link href="/time-date/birthday-tracker" className="hover:text-primary font-medium text-primary transition-colors">Birthday Tracker &amp; Solar Orbit</Link></li>
              <li><Link href="/time-date/age-calculator" className="hover:text-primary transition-colors">Exact Age Calculator</Link></li>
              <li><Link href="/time-date/date-difference" className="hover:text-primary transition-colors">Date Difference &amp; Delta</Link></li>
              <li><Link href="/time-date/days-calculator" className="hover:text-primary transition-colors">Business Days &amp; Holidays</Link></li>
              <li><Link href="/time-date/world-clock-grid" className="hover:text-primary transition-colors">World Clock Matrix</Link></li>
              <li><Link href="/time-date/countdown-timer" className="hover:text-primary transition-colors">High-Precision Countdown</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="font-label-caps text-label-caps text-on-surface uppercase font-bold tracking-wider mb-4">
              <Link href="/electrical" className="hover:text-primary transition-colors">Electrical &amp; Construction</Link>
            </p>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li><Link href="/electrical" className="hover:text-primary font-medium text-primary transition-colors">Electrical Tools Hub</Link></li>
              <li><Link href="/electrical#workbench-cable" className="hover:text-primary transition-colors">Cable Sizing &amp; Ampacity</Link></li>
              <li><Link href="/electrical#workbench-transformer" className="hover:text-primary transition-colors">Transformer FLA &amp; kVA</Link></li>
              <li><Link href="/electrical#workbench-motor" className="hover:text-primary transition-colors">Motor FLA &amp; Overload</Link></li>
              <li><Link href="/electrical#workbench-solar" className="hover:text-primary transition-colors">Solar PV Array &amp; Battery</Link></li>
              <li><Link href="/home-construction" className="hover:text-primary transition-colors">Home &amp; Construction</Link></li>
              <li><Link href="/home-construction#concrete-calc" className="hover:text-primary transition-colors">Concrete Volume Solver</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-on-surface-variant">
          <p>© 2025 SolveItCalculator.com. All mathematical models tested and verified for educational &amp; analytical purposes.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">security</span> Local Client Compute</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">speed</span> 60 FPS Fluid UI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
