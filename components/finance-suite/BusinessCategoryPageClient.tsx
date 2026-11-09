'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  BarChart3,
  Percent,
  TrendingUp,
  Scale,
  Briefcase,
  FileText,
  Tag,
  Coins,
  Calculator,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Flame,
  FolderOpen,
  Lightbulb,
  Settings,
  HelpCircle,
  LayoutGrid,
  ArrowLeftRight,
  Calendar,
  Heart,
  FlaskConical,
} from 'lucide-react';

type BusinessFilterCategory =
  | 'All'
  | 'Pricing & Margin'
  | 'Profitability'
  | 'Freelance & Tax'
  | 'Growth & Loans';

interface BusinessToolRow {
  id: string;
  name: string;
  description: string;
  href: string;
  category: Exclude<BusinessFilterCategory, 'All'>;
  displayBadge: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  isPopular?: boolean;
}

const BUSINESS_FILTERS: BusinessFilterCategory[] = [
  'All',
  'Pricing & Margin',
  'Profitability',
  'Freelance & Tax',
  'Growth & Loans',
];

const BUSINESS_TOOLS: BusinessToolRow[] = [
  {
    id: 'margin-calculator',
    name: 'Gross Margin Calculator',
    description:
      'Calculate gross margin percentage, unit profit, and required selling price from product cost.',
    href: '/finance/margin-calculator',
    category: 'Pricing & Margin',
    displayBadge: 'Pricing & Margin',
    icon: BarChart3,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
    isPopular: true,
  },
  {
    id: 'markup-calculator',
    name: 'Markup Calculator',
    description:
      'Find selling price, dollar profit, and equivalent gross margin from cost and markup percentage.',
    href: '/finance/markup-calculator',
    category: 'Pricing & Margin',
    displayBadge: 'Pricing & Margin',
    icon: Percent,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
    isPopular: true,
  },
  {
    id: 'profit-margin-calculator',
    name: 'Profit Margin Calculator',
    description:
      'Compute gross, operating, and net profit margins after cost of goods sold, overhead, and taxes.',
    href: '/finance/profit-margin-calculator',
    category: 'Profitability',
    displayBadge: 'Profitability',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
    isPopular: true,
  },
  {
    id: 'break-even-calculator',
    name: 'Break-Even Point Calculator',
    description:
      'Determine the exact sales volume in units and revenue needed to cover fixed and variable costs.',
    href: '/finance/break-even-calculator',
    category: 'Profitability',
    displayBadge: 'Profitability',
    icon: Scale,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
    isPopular: true,
  },
  {
    id: 'discount-calculator',
    name: 'Discount & Promotional Price Calculator',
    description:
      'Calculate promotional sale prices, customer savings, and net revenue after percentage markdowns.',
    href: '/math/discount-calculator',
    category: 'Pricing & Margin',
    displayBadge: 'Pricing & Margin',
    icon: Tag,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
    isPopular: true,
  },
  {
    id: 'self-employment-tax-calculator',
    name: 'Self-Employment Tax Calculator',
    description:
      'Calculate Social Security and Medicare SE taxes, deductible business half, and quarterly IRS estimates.',
    href: '/finance/self-employment-tax-calculator',
    category: 'Freelance & Tax',
    displayBadge: 'Freelance & Tax',
    icon: FileText,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
    isPopular: true,
  },
  {
    id: '1099-vs-w2-calculator',
    name: '1099 vs. W-2 Compensation Calculator',
    description:
      'Compare net income between independent contracting and salaried employment, including benefits and expenses.',
    href: '/finance/1099-vs-w2-calculator',
    category: 'Freelance & Tax',
    displayBadge: 'Freelance & Tax',
    icon: Briefcase,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'percentage-change-calculator',
    name: 'Revenue & Percentage Change Calculator',
    description:
      'Measure period-over-period revenue growth, expense changes, and conversion rate shifts.',
    href: '/math/percentage-change-calculator',
    category: 'Growth & Loans',
    displayBadge: 'Growth & Loans',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'loan-calculator',
    name: 'Business Loan Payment Calculator',
    description:
      'Estimate monthly loan payments, total interest, and amortization for equipment or working capital loans.',
    href: '/loan-calculator',
    category: 'Growth & Loans',
    displayBadge: 'Growth & Loans',
    icon: Coins,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
];

const RELATED_CATEGORIES = [
  {
    name: 'Finance Calculators',
    href: '/finance',
    icon: Coins,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    name: 'Math Calculators',
    href: '/math',
    icon: Calculator,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Unit Conversion',
    href: '/conversions',
    icon: ArrowLeftRight,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Date & Time Calculators',
    href: '/date-time',
    icon: Calendar,
    iconBg: 'bg-[#FFF0F0]',
    iconColor: 'text-[#E11D48]',
  },
  {
    name: 'Health & Fitness Calculators',
    href: '/health-fitness',
    icon: Heart,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Science Calculators',
    href: '/science',
    icon: FlaskConical,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
];

const BUSINESS_CHOOSE_STEPS = [
  {
    step: 1,
    title: 'Identify your business metric',
    description:
      'Decide whether you are setting unit prices, checking profit margins, or finding your break-even volume.',
  },
  {
    step: 2,
    title: 'Enter costs and revenue',
    description:
      'Input your unit cost, selling price, fixed overhead, or net business profit.',
  },
  {
    step: 3,
    title: 'Open the calculator',
    description: 'Click on the calculator from the directory list above.',
  },
  {
    step: 4,
    title: 'Review the formula',
    description:
      'Inspect unit profit, margin vs. markup tables, and step-by-step calculations.',
  },
];

const BUSINESS_FAQS = [
  {
    question: 'What is the difference between gross margin and markup?',
    answer:
      'Gross margin is profit expressed as a percentage of the selling price: (Price − Cost) ÷ Price. Markup is profit expressed as a percentage of the cost: (Price − Cost) ÷ Cost. For example, an item that costs $60 and sells for $100 has a 40% gross margin and a 66.7% markup.',
  },
  {
    question: 'How do I convert markup percentage to profit margin percentage?',
    answer:
      'Divide the markup percentage by (100% + Markup %). For example, a 50% markup equals 50 ÷ (100 + 50) = 33.33% gross margin. A 100% markup (doubling your cost) equals a 50% gross margin.',
  },
  {
    question: 'How do I price a product to achieve a target gross margin?',
    answer:
      'Divide your unit cost (COGS) by (1 − Target Margin Decimal). Never simply add your desired margin percentage to the cost. For example, to earn a 40% gross margin on an item that costs $30, calculate $30 ÷ (1 − 0.40) = $50.00 selling price.',
  },
  {
    question: 'How do I calculate my break-even point in units and revenue?',
    answer:
      'Divide your total fixed costs by the contribution margin per unit (Selling Price per Unit − Variable Cost per Unit). If fixed costs are $10,000 and each unit sells for $50 with $30 in variable costs, you need $10,000 ÷ $20 = 500 units ($25,000 in revenue) to break even.',
  },
  {
    question: 'What is a healthy net profit margin for a small business?',
    answer:
      'Net profit margins vary by industry—retail and grocery often operate at 2% to 6%, e-commerce and manufacturing average 8% to 15%, while consulting, software, and professional services commonly achieve 15% to 25%+.',
  },
  {
    question: 'How much should freelancers set aside for quarterly estimated taxes?',
    answer:
      'Most independent contractors set aside 25% to 30% of net business profit to cover both the 15.3% Self-Employment tax (Social Security and Medicare on 92.35% of net earnings) and federal/state income taxes.',
  },
  {
    question: 'How does the 20% QBI (Section 199A) deduction work for 1099 contractors?',
    answer:
      'Eligible sole proprietors, LLCs, and S-corps can deduct up to 20% of qualified business income from their taxable income on Form 1040, subject to taxable income phase-out thresholds and specified service business rules.',
  },
  {
    question: 'Are these business calculators free to use?',
    answer:
      'Yes. Every business calculator on SolveItCalculator.com is completely free to use with no account or subscription required.',
  },
];

export default function BusinessCategoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] =
    useState<BusinessFilterCategory>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BUSINESS_TOOLS.filter((tool) => {
      const matchesCat =
        selectedFilter === 'All' || tool.category === selectedFilter;
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, selectedFilter]);

  const popularTools = useMemo(
    () => BUSINESS_TOOLS.filter((t) => t.isPopular),
    []
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTools.length === 1) {
      router.push(filteredTools[0].href);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Category Header / Hero Section */}
      <section
        aria-labelledby="business-category-heading"
        className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#EAF2FF] via-[#F1F6FF] to-[#F5F7FA] pt-5 pb-6"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb: Home / Business */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
              <li>
                <Link
                  href="/"
                  className="text-[#2457D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li>
                <Link
                  href="/finance"
                  className="text-[#2457D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                >
                  Finance
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li aria-current="page" className="text-[#2457D6] font-semibold">
                Business
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 max-w-4xl">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-2xl bg-[#DCE8FF] border border-[#C6DBFF] text-[#2457D6] flex items-center justify-center shrink-0 shadow-2xs"
                  aria-hidden="true"
                >
                  <BarChart3 className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div>
                  <h1
                    id="business-category-heading"
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#152238]"
                  >
                    Business Calculators
                  </h1>
                  <p className="mt-1.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                    Make smarter pricing and operations decisions. Calculate
                    gross margin, price markup, net profit, break-even units,
                    and contractor taxes with clear formulas.
                  </p>
                </div>
              </div>

              {/* Prominent Search Field */}
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                aria-label="Find a business calculator"
                className="mt-5 flex items-center bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 focus-within:ring-2 focus-within:ring-[#2457D6] focus-within:border-[#2457D6] transition-all"
              >
                <label htmlFor="business-category-search" className="sr-only">
                  Find a business calculator
                </label>
                <div className="pl-3 pr-2 text-[#152238] flex items-center pointer-events-none">
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="business-category-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a business calculator (e.g. margin, markup, break-even...)"
                  className="w-full py-2 px-2 text-sm sm:text-base text-[#152238] placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-[#2457D6] hover:bg-[#1d47b0] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
                >
                  Search
                </button>
              </form>

              {/* Filter Controls */}
              <div
                role="group"
                aria-label="Filter business calculators by topic"
                className="mt-3.5 flex flex-wrap items-center gap-2"
              >
                {BUSINESS_FILTERS.map((category) => {
                  const isActive = selectedFilter === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedFilter(category)}
                      aria-pressed={isActive}
                      className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                        isActive
                          ? 'bg-[#2457D6] text-white border-[#2457D6] shadow-2xs'
                          : 'bg-[#E2ECFC] hover:bg-[#D2E2FA] text-[#152238] border-[#C6DBFF] dark:bg-[#1E325C] dark:border-[#33528E] dark:text-[#F8FAFC] dark:hover:bg-[#284278]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Decorative Illustration */}
            <div
              aria-hidden="true"
              className="hidden xl:flex items-center justify-center relative w-64 h-44 shrink-0 select-none"
            >
              <div className="w-44 h-44 rounded-full bg-[#DCE8FF]/70 flex items-center justify-center relative">
                <div className="absolute -left-2 top-3 w-11 h-11 rounded-xl bg-[#7C3AED] text-white font-extrabold text-xl flex items-center justify-center shadow-sm -rotate-12">
                  %
                </div>
                <div className="absolute -left-5 bottom-8 w-11 h-10 rounded-xl bg-[#D1FAE5] text-[#16856B] font-extrabold text-base flex items-center justify-center shadow-sm -rotate-6">
                  $
                </div>
                <div className="w-24 h-32 rounded-2xl bg-[#2457D6] p-2.5 shadow-md rotate-12 flex flex-col justify-between border-2 border-[#3B82F6]">
                  <div className="h-6 rounded-md bg-[#93C5FD]/90 w-full" />
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#60A5FA]" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#60A5FA]" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#FBBF24]" />
                  </div>
                </div>
                <div className="absolute -right-3 top-12 w-11 h-11 rounded-xl bg-[#FBBF24] text-white font-extrabold text-lg flex items-center justify-center shadow-sm rotate-12">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Content */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left Main Column */}
          <div className="lg:col-span-8">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <LayoutGrid
                  className="w-5 h-5 text-[#2457D6]"
                  aria-hidden="true"
                />
                <h2 className="text-xl font-extrabold text-[#152238] tracking-tight">
                  {selectedFilter === 'All'
                    ? 'All Business Calculators'
                    : `${selectedFilter} Calculators`}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 pl-7">
                Choose a calculator below to get started.
              </p>
            </div>

            {filteredTools.length > 0 ? (
              <div className="space-y-3" role="list">
                {filteredTools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      role="listitem"
                      className="group rounded-xl bg-white border border-slate-200/90 px-4 py-3.5 hover:border-[#2457D6] hover:shadow-xs transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          <div
                            className={`w-12 h-12 rounded-xl ${tool.iconBg} ${tool.iconColor} flex items-center justify-center shrink-0`}
                            aria-hidden="true"
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={tool.href}
                              className="text-base font-bold text-[#152238] group-hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                            >
                              {tool.name}
                            </Link>
                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
                              {tool.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-15 sm:pl-0">
                          <span className="text-[11px] font-semibold text-slate-700 bg-[#EEF3FA] border border-slate-200/80 dark:bg-[#1E2E4F] dark:text-[#E2E8F0] dark:border-[#334E7D] px-2.5 py-1 rounded-md">
                            {tool.displayBadge}
                          </span>
                          <Link
                            href={tool.href}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2457D6] hover:text-[#1d47b0] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md py-1 px-1.5"
                          >
                            <span>Open calculator</span>
                            <ArrowRight
                              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
                <p className="text-base font-bold text-[#152238]">
                  No matching business calculators found
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Try clearing your search query or switching the filter back to
                  &ldquo;All&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('All');
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2457D6] text-white text-xs sm:text-sm font-semibold hover:bg-[#1d47b0] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <aside
            aria-label="Popular and related calculators"
            className="lg:col-span-4 space-y-5"
          >
            <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Flame
                  className="w-5 h-5 text-[#EA580C] fill-[#EA580C]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-extrabold text-[#152238]">
                  Popular in Business
                </h2>
              </div>

              <ul className="divide-y divide-slate-100 mt-1">
                {popularTools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <li key={tool.id}>
                      <Link
                        href={tool.href}
                        className="group flex items-center justify-between gap-3 py-2.5 hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg ${tool.iconBg} ${tool.iconColor} flex items-center justify-center shrink-0`}
                          >
                            <IconComponent
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-[#152238] group-hover:text-[#2457D6] truncate transition-colors">
                            {tool.name}
                          </span>
                        </div>
                        <ChevronRight
                          className="w-4 h-4 text-slate-400 group-hover:text-[#2457D6] group-hover:translate-x-0.5 transition-all shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FolderOpen
                  className="w-5 h-5 text-[#2457D6]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-extrabold text-[#152238]">
                  Related Calculator Categories
                </h2>
              </div>

              <ul className="divide-y divide-slate-100 mt-1">
                {RELATED_CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <li key={cat.name}>
                      <Link
                        href={cat.href}
                        className="group flex items-center justify-between gap-3 py-2.5 hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg ${cat.iconBg} ${cat.iconColor} flex items-center justify-center shrink-0`}
                          >
                            <IconComponent
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-[#152238] group-hover:text-[#2457D6] truncate transition-colors">
                            {cat.name}
                          </span>
                        </div>
                        <ChevronRight
                          className="w-4 h-4 text-slate-400 group-hover:text-[#2457D6] group-hover:translate-x-0.5 transition-all shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl bg-[#EAF2FF] border border-[#CFE0FF] p-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
                  <Lightbulb className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#152238]">
                    Need a different calculator?
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Browse all calculators to find the right tool for your
                    needs.
                  </p>
                </div>
              </div>

              <Link
                href="/calculators"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#2457D6] hover:bg-[#1d47b0] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
              >
                <span>View All Calculators</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Bottom Two-Column Row */}
        <section
          aria-label="Calculator selection guide and FAQs"
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          <div className="lg:col-span-7 rounded-2xl bg-[#EBF7F3] border border-[#BDE5D7] p-6">
            <div className="flex items-center gap-2.5">
              <Settings
                className="w-5 h-5 text-[#16856B]"
                aria-hidden="true"
              />
              <h2 className="text-lg font-extrabold text-[#152238]">
                How to choose the right business calculator
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {BUSINESS_CHOOSE_STEPS.map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D2EFE6] border border-[#BDE5D7] text-[#16856B] dark:bg-[#184239] dark:border-[#286658] dark:text-[#6EE7B7] font-extrabold text-sm flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#152238]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle
                className="w-5 h-5 text-[#2457D6] fill-[#2457D6]/10"
                aria-hidden="true"
              />
              <h2 className="text-lg font-extrabold text-[#152238]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2">
              {BUSINESS_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className="rounded-xl bg-white border border-slate-200/90 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-[#152238] hover:text-[#2457D6] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2457D6]"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#2457D6] shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
