import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

const FOOTER_CATEGORY_LINKS = [
  { label: 'Math Calculators', href: '/math' },
  { label: 'Finance & Tax', href: '/finance' },
  { label: 'Unit Conversions', href: '/conversions' },
  { label: 'Date & Time', href: '/date-time' },
  { label: 'Health & Fitness', href: '/health-fitness' },
  { label: 'Home & Construction', href: '/home-construction' },
  { label: 'Science & Lab', href: '/science' },
  { label: 'Retirement & Super', href: '/retirement-and-super' },
];

const FOOTER_POPULAR_TOOLS = [
  { label: 'Percentage Calculator', href: '/math/percentage-calculator' },
  { label: 'Mortgage Calculator', href: '/mortgage-calculator' },
  { label: 'BMI Calculator', href: '/bmi-calculator' },
  { label: 'Age Calculator', href: '/age-calculator' },
  { label: 'Weight Converter (kg to lbs)', href: '/conversions/weight' },
  { label: 'Global Salary & Take-Home Pay', href: '/salary-calculator' },
  { label: 'US Federal Income Tax', href: '/finance/us-federal-income-tax-calculator' },
  { label: 'Compound Interest Calculator', href: '/compound-interest-calculator' },
];

const FOOTER_GUIDE_AND_HUB_LINKS = [
  { label: 'All Calculators Directory (A–Z)', href: '/calculators' },
  { label: 'Formula Guides & Tutorials', href: '/guides' },
  { label: 'Calculation Workspace', href: '/calculation-workspace' },
  { label: 'Business & Margin Tools', href: '/finance/business' },
  { label: 'FIRE Retirement Forecaster', href: '/fire-forecaster' },
  { label: 'Construction Project Estimator', href: '/construction-project-calculator' },
  { label: 'Flooring & Carton Calculator', href: '/home-construction/flooring-calculator' },
  { label: 'Recipe & Baking Converter', href: '/recipe-converter' },
];

const FOOTER_ABOUT_AND_TRUST_LINKS = [
  { label: 'About SolveItCalculator', href: '/about' },
  { label: 'Editorial & Testing Policy', href: '/about#editorial-policy' },
  { label: 'Calculation Methodology', href: '/calculation-methodology' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
];

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[#152238] dark:text-slate-100 mt-auto"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        {/* Main Structured 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-9 border-b border-slate-200 dark:border-slate-800">
          {/* Column 1: Brand Identity, Mission & Standards (4 cols) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 pr-0 lg:pr-4">
            <BrandLogo variant="footer" />

            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Free, fast online calculators built with transparent step-by-step formulas,
              worked examples, and primary source citations across math, personal finance,
              tax, unit conversions, health, construction, and science.
            </p>

            {/* Clean Trust & Standards Highlights */}
            <ul className="space-y-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck
                  className="w-4 h-4 text-[#16856B] shrink-0"
                  aria-hidden="true"
                />
                <span>Conversion factors from NIST SP 811 &amp; statutory tax tables</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock
                  className="w-4 h-4 text-[#2457D6] dark:text-blue-400 shrink-0"
                  aria-hidden="true"
                />
                <span>100% browser-private — inputs never leave your device</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen
                  className="w-4 h-4 text-[#D97706] shrink-0"
                  aria-hidden="true"
                />
                <span>Every tool shows its formula, assumptions &amp; primary sources</span>
              </li>
            </ul>

            {/* Direct Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <Link
                href="/calculators"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2457D6] hover:bg-[#1D47B0] text-white text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <span>All Calculators</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-[#2457D6] dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <span>About Us</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Calculator Categories (2 cols) */}
          <nav
            aria-label="Calculator categories"
            className="lg:col-span-2 space-y-3"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Categories
            </h2>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-400">
              {FOOTER_CATEGORY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Popular Calculators (2 cols) */}
          <nav
            aria-label="Popular calculators"
            className="lg:col-span-2 space-y-3"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Popular Tools
            </h2>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-400">
              {FOOTER_POPULAR_TOOLS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Directory, Guides & Workspaces (2 cols) */}
          <nav
            aria-label="Guides and workspaces"
            className="lg:col-span-2 space-y-3"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Guides &amp; Hubs
            </h2>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-400">
              {FOOTER_GUIDE_AND_HUB_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 5: Dedicated About, Editorial Policy, Methodology & Legal List (2 cols) */}
          <nav
            aria-label="About, methodology, and policies"
            className="lg:col-span-2 space-y-3"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              About &amp; Policies
            </h2>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-400">
              {FOOTER_ABOUT_AND_TRUST_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar: Copyright, Disclaimer & Direct Trust/Legal Links */}
        <div className="pt-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="space-y-1">
            <p className="text-slate-600 dark:text-slate-300">
              © {new Date().getFullYear()}{' '}
              <strong className="font-bold text-slate-900 dark:text-white">
                SolveItCalculator.com
              </strong>
              . All rights reserved.
            </p>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Calculators and reference guides are estimates for informational and educational
              use only and do not constitute financial, tax, legal, medical, or engineering advice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-semibold text-slate-600 dark:text-slate-300">
            <Link
              href="/about"
              className="hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/calculation-methodology"
              className="hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
