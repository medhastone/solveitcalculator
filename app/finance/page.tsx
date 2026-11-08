'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Coins,
  PiggyBank,
  FileText,
  Landmark,
  Briefcase,
  TrendingUp,
  Home,
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
  BarChart3,
  FlaskConical,
  DollarSign,
  Percent,
  Scale,
  Globe,
} from 'lucide-react';

type FinanceFilterCategory =
  | 'All'
  | 'Retirement'
  | 'US Taxes'
  | 'Global Taxes'
  | 'Salary & Pay'
  | 'Loans & Wealth'
  | 'Business';

interface FinanceToolRow {
  id: string;
  name: string;
  description: string;
  href: string;
  category: Exclude<FinanceFilterCategory, 'All'>;
  displayBadge: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  isPopular?: boolean;
}

const FINANCE_FILTERS: FinanceFilterCategory[] = [
  'All',
  'Retirement',
  'US Taxes',
  'Global Taxes',
  'Salary & Pay',
  'Loans & Wealth',
  'Business',
];

const FINANCE_TOOLS: FinanceToolRow[] = [
  {
    id: '401k-calculator',
    name: '401(k) Retirement Calculator',
    description:
      'Project your 401(k) balance at retirement with employer match caps, IRS contribution limits, and inflation adjustment.',
    href: '/finance/401k-calculator',
    category: 'Retirement',
    displayBadge: 'Retirement',
    icon: PiggyBank,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
    isPopular: true,
  },
  {
    id: 'roth-vs-traditional-calculator',
    name: 'Roth vs. Traditional Calculator',
    description:
      'Compare after-tax retirement wealth between pre-tax Traditional and post-tax Roth contributions.',
    href: '/finance/roth-vs-traditional-calculator',
    category: 'Retirement',
    displayBadge: 'Retirement',
    icon: Scale,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
    isPopular: true,
  },
  {
    id: 'rmd-calculator',
    name: 'Required Minimum Distribution (RMD) Calculator',
    description:
      'Calculate mandatory annual withdrawals using official IRS Publication 590-B Uniform Lifetime tables.',
    href: '/finance/rmd-calculator',
    category: 'Retirement',
    displayBadge: 'Retirement',
    icon: Calendar,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'us-federal-income-tax-calculator',
    name: 'US Federal Income Tax Calculator',
    description:
      'Estimate federal tax liability, effective and marginal tax rates, standard deduction, and tax refund or amount owed.',
    href: '/finance/us-federal-income-tax-calculator',
    category: 'US Taxes',
    displayBadge: 'US Taxes',
    icon: Landmark,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
    isPopular: true,
  },
  {
    id: 'us-state-take-home-calculator',
    name: 'US State Take-Home Paycheck Calculator',
    description:
      'Calculate net pay across all 50 US states after federal income tax, FICA, Medicare, and state tax brackets.',
    href: '/finance/us-state-take-home-calculator',
    category: 'US Taxes',
    displayBadge: 'Paycheck',
    icon: DollarSign,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
    isPopular: true,
  },
  {
    id: 'self-employment-tax-calculator',
    name: 'Self-Employment Tax Calculator',
    description:
      'Compute 15.3% Social Security and Medicare SE tax, half-SE deduction, and quarterly estimated payments.',
    href: '/finance/self-employment-tax-calculator',
    category: 'US Taxes',
    displayBadge: 'US Taxes',
    icon: FileText,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    id: 'capital-gains-tax-calculator',
    name: 'Capital Gains Tax Calculator (US)',
    description:
      'Calculate short-term and long-term capital gains tax, 3.8% Net Investment Income Tax (NIIT), and net sale proceeds.',
    href: '/finance/capital-gains-tax-calculator',
    category: 'US Taxes',
    displayBadge: 'Investments',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: '1099-vs-w2-calculator',
    name: '1099 Contractor vs. W-2 Employee Calculator',
    description:
      'Compare total after-tax take-home pay and find the exact break-even 1099 hourly or annual rate.',
    href: '/finance/1099-vs-w2-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Salary & Pay',
    icon: Briefcase,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'loan-calculator',
    name: 'Loan Payment & Amortization Calculator',
    description:
      'Estimate monthly loan payments, total interest cost, and full principal-and-interest payoff schedule.',
    href: '/loan-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Loans',
    icon: Home,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
    isPopular: true,
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Payment Calculator',
    description:
      'Calculate monthly mortgage principal, interest, property taxes, homeowners insurance, and PMI.',
    href: '/mortgage-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Mortgage',
    icon: Home,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
    isPopular: true,
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    description:
      'See how your savings and monthly contributions grow over time with daily, monthly, or annual compounding.',
    href: '/compound-interest-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Wealth',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'salary-to-hourly-calculator',
    name: 'Salary to Hourly Wage Converter',
    description:
      'Convert annual salary into hourly, daily, weekly, bi-weekly, and monthly pay rates adjusted for paid time off.',
    href: '/finance/salary-to-hourly-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Salary & Pay',
    icon: DollarSign,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: 'take-home-pay-calculator',
    name: 'Take-Home Pay Calculator',
    description:
      'Calculate net paycheck amount after taxes, retirement contributions, health insurance, and pre-tax deductions.',
    href: '/finance/take-home-pay-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Salary & Pay',
    icon: Coins,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'pay-raise-calculator',
    name: 'Pay Raise & Salary Increase Calculator',
    description:
      'See your new salary, hourly rate, and additional monthly income after a percentage or flat dollar raise.',
    href: '/finance/pay-raise-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Salary & Pay',
    icon: TrendingUp,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'overtime-pay-calculator',
    name: 'Overtime Pay Calculator (FLSA 1.5x & 2x)',
    description:
      'Compute total gross earnings including regular hours, time-and-a-half overtime, and double-time shifts.',
    href: '/finance/overtime-pay-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Salary & Pay',
    icon: Calculator,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    id: 'bonus-tax-calculator',
    name: 'Bonus Tax Withholding Calculator (US)',
    description:
      'Compare IRS 22% flat supplemental withholding against the aggregate paycheck method for bonuses.',
    href: '/finance/bonus-tax-calculator',
    category: 'Salary & Pay',
    displayBadge: 'US Taxes',
    icon: Percent,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
  },
  {
    id: 'uk-paye-calculator',
    name: 'UK PAYE Income Tax & National Insurance Calculator',
    description:
      'Calculate UK take-home pay, Personal Allowance taper, Class 1 NI, student loans, and Scottish tax bands.',
    href: '/finance/uk-paye-calculator',
    category: 'Global Taxes',
    displayBadge: 'United Kingdom',
    icon: Globe,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: 'india-income-tax-calculator',
    name: 'India Income Tax Calculator (New vs. Old Regime)',
    description:
      'Compare New Regime and Old Regime tax slabs, Section 87A rebate, standard deduction, and 4% cess.',
    href: '/finance/india-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'India',
    icon: Globe,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'in-hand-salary-calculator',
    name: 'India In-Hand Salary Calculator (CTC to Net)',
    description:
      'Break down annual CTC into monthly in-hand take-home pay after EPF, gratuity, professional tax, and income tax.',
    href: '/finance/in-hand-salary-calculator',
    category: 'Global Taxes',
    displayBadge: 'India',
    icon: Coins,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'hra-exemption-calculator',
    name: 'HRA Tax Exemption Calculator (India)',
    description:
      'Calculate tax-exempt House Rent Allowance under Section 10(13A) for metro and non-metro cities.',
    href: '/finance/hra-exemption-calculator',
    category: 'Global Taxes',
    displayBadge: 'India',
    icon: Home,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    id: 'india-capital-gains-tax-calculator',
    name: 'India Capital Gains Tax Calculator (STCG & LTCG)',
    description:
      'Calculate listed equity, mutual fund, and real estate short-term and long-term capital gains tax.',
    href: '/finance/india-capital-gains-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'India',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'canada-income-tax-calculator',
    name: 'Canada Federal & Provincial Income Tax Calculator',
    description:
      'Estimate Canadian net income after federal brackets, provincial tax, CPP/QPP, and EI premiums.',
    href: '/finance/canada-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'Canada',
    icon: Globe,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
  },
  {
    id: 'germany-income-tax-calculator',
    name: 'Germany Brutto-Netto Income Tax Calculator',
    description:
      'Compute German net salary after progressive income tax (§32a EStG), solidarity surcharge, and social insurance.',
    href: '/finance/germany-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'Germany',
    icon: Globe,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'france-income-tax-calculator',
    name: 'France Family Quotient Income Tax Calculator',
    description:
      'Calculate French net pay using household quotient familial parts, CSG/CRDS social charges, and income tax bands.',
    href: '/finance/france-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'France',
    icon: Globe,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: 'singapore-income-tax-calculator',
    name: 'Singapore Resident Income Tax & CPF Calculator',
    description:
      'Estimate Singapore resident income tax and age-banded Central Provident Fund (CPF) contributions.',
    href: '/finance/singapore-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'Singapore',
    icon: Globe,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'uae-income-tax-calculator',
    name: 'UAE Salary & End-of-Service Gratuity Calculator',
    description:
      'Calculate tax-free UAE salary take-home pay and statutory end-of-service gratuity benefits.',
    href: '/finance/uae-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'UAE',
    icon: Globe,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    id: 'margin-calculator',
    name: 'Gross Margin Calculator',
    description:
      'Calculate gross profit margin percentage, unit profit, and markup equivalent from cost and selling price.',
    href: '/finance/margin-calculator',
    category: 'Business',
    displayBadge: 'Business',
    icon: BarChart3,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    id: 'markup-calculator',
    name: 'Price Markup Calculator',
    description:
      'Determine selling price and gross margin when applying a percentage markup over unit cost.',
    href: '/finance/markup-calculator',
    category: 'Business',
    displayBadge: 'Business',
    icon: Percent,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'profit-margin-calculator',
    name: 'Net & Operating Profit Margin Calculator',
    description:
      'Analyze gross, operating, and net profit margins from revenue, COGS, operating expenses, and taxes.',
    href: '/finance/profit-margin-calculator',
    category: 'Business',
    displayBadge: 'Business',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'break-even-calculator',
    name: 'Break-Even Point Calculator',
    description:
      'Find the exact number of units and revenue required to cover fixed and variable business costs.',
    href: '/finance/break-even-calculator',
    category: 'Business',
    displayBadge: 'Business',
    icon: Scale,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
];

const RELATED_CATEGORIES = [
  {
    name: 'Math Calculators',
    href: '/math',
    icon: Calculator,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Business Calculators',
    href: '/finance/business',
    icon: BarChart3,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    name: 'Retirement & Super',
    href: '/retirement-and-super',
    icon: PiggyBank,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Unit Conversion',
    href: '/unit-conversion',
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
    name: 'Home & Construction',
    href: '/home-construction',
    icon: Home,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
];

const FINANCE_CHOOSE_STEPS = [
  {
    step: 1,
    title: 'Identify your financial goal',
    description:
      'Choose whether you are planning retirement, estimating taxes, comparing salary offers, or pricing a loan.',
  },
  {
    step: 2,
    title: 'Enter your figures',
    description:
      'Input your income, contribution rate, filing status, or loan terms.',
  },
  {
    step: 3,
    title: 'Open the calculator',
    description: 'Select the matching calculator from the directory list above.',
  },
  {
    step: 4,
    title: 'Review the breakdown',
    description:
      'Inspect after-tax totals, effective vs. marginal rates, and step-by-step formulas.',
  },
];

const FINANCE_FAQS = [
  {
    question: 'What is the difference between marginal and effective tax rate?',
    answer:
      'Your marginal tax rate is the percentage applied only to the last dollar you earn (your highest tax bracket). Your effective tax rate is the total tax you pay divided by your total gross income, which is always lower than your marginal bracket due to progressive tax brackets and standard deductions.',
  },
  {
    question: 'How is a monthly mortgage payment calculated?',
    answer:
      'Monthly principal and interest (P&I) is calculated using the standard amortization formula: M = P × [r(1 + r)^n] ÷ [(1 + r)^n − 1], where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of monthly payments (years × 12). Property taxes, homeowners insurance, and PMI are added to form total PITI.',
  },
  {
    question: 'How much should I contribute to my 401(k)?',
    answer:
      'At a minimum, aim to contribute enough to capture your full employer match—otherwise you leave guaranteed 50% to 100% return on the table. Financial planners typically recommend saving 15% of gross income across employer-sponsored plans and IRAs.',
  },
  {
    question: 'Should I choose a Roth or Traditional retirement account?',
    answer:
      'If you expect your tax rate in retirement to be higher than your current marginal rate, Roth contributions generally produce more after-tax wealth. If your current marginal tax rate is higher than what you expect in retirement, pre-tax Traditional contributions usually win.',
  },
  {
    question: 'How does compound interest work with monthly contributions?',
    answer:
      'Compound interest earns returns on both your initial principal and previously accumulated interest. When you add recurring monthly contributions, each deposit starts its own compounding curve: FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) ÷ (r/n)].',
  },
  {
    question: 'How are 1099 independent contractors taxed compared to W-2 employees?',
    answer:
      'Independent contractors (1099) pay both the employee and employer halves of Social Security and Medicare taxes (15.3% Self-Employment tax on 92.35% of net profit), though half of that SE tax is deductible from adjusted gross income and eligible businesses may claim up to a 20% QBI deduction.',
  },
  {
    question: 'How do I convert an annual salary to an hourly wage?',
    answer:
      'Divide your annual gross salary by the number of paid hours worked in a year. For a standard full-time schedule of 40 hours per week across 52 weeks (2,080 hours), a $75,000 salary equals $75,000 ÷ 2,080 = $36.06 per hour.',
  },
  {
    question: 'Are these finance and tax calculators free and private?',
    answer:
      'Yes. All calculators on SolveItCalculator.com are 100% free, require no signup, and execute calculations locally in your browser without storing sensitive salary or tax numbers.',
  },
];

export default function FinanceCategoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] =
    useState<FinanceFilterCategory>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FINANCE_TOOLS.filter((tool) => {
      const matchesCat =
        selectedFilter === 'All' || tool.category === selectedFilter;
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.displayBadge.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, selectedFilter]);

  const popularTools = useMemo(
    () => FINANCE_TOOLS.filter((t) => t.isPopular),
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
        aria-labelledby="finance-category-heading"
        className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#EAF2FF] via-[#F1F6FF] to-[#F5F7FA] pt-5 pb-6"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb: Home / Finance */}
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
              <li aria-current="page" className="text-[#2457D6] font-semibold">
                Finance
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
                  <Coins className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div>
                  <h1
                    id="finance-category-heading"
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#152238]"
                  >
                    Finance Calculators
                  </h1>
                  <p className="mt-1.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                    Plan your money with confidence. Calculate loans, mortgages,
                    retirement savings, income taxes, take-home paychecks, and
                    investment returns with clear explanations.
                  </p>
                </div>
              </div>

              {/* Prominent Search Field */}
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                aria-label="Find a finance calculator"
                className="mt-5 flex items-center bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 focus-within:ring-2 focus-within:ring-[#2457D6] focus-within:border-[#2457D6] transition-all"
              >
                <label htmlFor="finance-category-search" className="sr-only">
                  Find a finance calculator
                </label>
                <div className="pl-3 pr-2 text-[#152238] flex items-center pointer-events-none">
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="finance-category-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a finance calculator (e.g. 401k, paycheck, tax, loan...)"
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
                aria-label="Filter finance calculators by topic"
                className="mt-3.5 flex flex-wrap items-center gap-2"
              >
                {FINANCE_FILTERS.map((category) => {
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

            {/* Right: Decorative Finance Illustration */}
            <div
              aria-hidden="true"
              className="hidden xl:flex items-center justify-center relative w-64 h-44 shrink-0 select-none"
            >
              <div className="w-44 h-44 rounded-full bg-[#DCE8FF]/70 flex items-center justify-center relative">
                <div className="absolute -left-2 top-3 w-11 h-11 rounded-xl bg-[#16856B] text-white font-extrabold text-xl flex items-center justify-center shadow-sm -rotate-12">
                  $
                </div>
                <div className="absolute -left-5 bottom-8 w-11 h-10 rounded-xl bg-[#D1FAE5] text-[#16856B] font-extrabold text-sm flex items-center justify-center shadow-sm -rotate-6">
                  %
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
                  <TrendingUp className="w-5 h-5" />
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
                    ? 'All Finance Calculators'
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
                  No matching finance calculators found
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
            {/* Popular in Finance */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Flame
                  className="w-5 h-5 text-[#EA580C] fill-[#EA580C]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-extrabold text-[#152238]">
                  Popular in Finance
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

            {/* Related Calculator Categories */}
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

            {/* Need a different calculator? CTA Box */}
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

        {/* Bottom Two-Column Row: How to Choose Guide (Left) + FAQs (Right) */}
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
                How to choose the right finance calculator
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {FINANCE_CHOOSE_STEPS.map((item) => (
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
              {FINANCE_FAQS.map((faq, index) => {
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
