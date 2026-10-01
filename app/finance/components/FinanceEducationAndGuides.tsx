'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function FinanceEducationAndGuides() {
  // 4% Rule interactive tester state
  const [nestEgg, setNestEgg] = useState<number>(1000000);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(4.0);

  const annualWithdrawal = (nestEgg * withdrawalRate) / 100;
  const monthlyWithdrawal = annualWithdrawal / 12;

  // What changes your result tabs
  const [activeCategory, setActiveCategory] = useState<'mortgage' | 'investment' | 'retirement' | 'tax' | 'loan'>('mortgage');

  const variableData = {
    mortgage: [
      { name: 'Interest Rate', desc: 'Even a 0.5% shift in APR dramatically changes the total interest paid over 30 years.' },
      { name: 'Loan Term', desc: 'A 15-year term has higher monthly payments but saves tens of thousands in lifetime interest vs. 30 years.' },
      { name: 'Property Taxes & Insurance', desc: 'Local tax rates and hazard insurance premiums vary significantly by county and state.' },
      { name: 'Down Payment (PMI)', desc: 'Putting down less than 20% typically adds Private Mortgage Insurance until reaching 20% equity.' },
    ],
    investment: [
      { name: 'Compounding Frequency', desc: 'Daily compounding accrues interest faster than annual compounding over long horizons.' },
      { name: 'Contribution Timing', desc: 'Depositing money at the beginning of each period vs. the end compounds slightly higher gains.' },
      { name: 'Inflation Drag', desc: 'Real purchasing power equals nominal investment returns minus average inflation rates.' },
      { name: 'Expense Ratios & Fees', desc: 'Management fees of 1% can erode up to 25% of total wealth accumulation over 30 years.' },
    ],
    retirement: [
      { name: 'Safe Withdrawal Rate', desc: 'Withdrawing 3.5% vs. 4.5% significantly affects portfolio longevity over 30-year retirements.' },
      { name: 'Asset Allocation', desc: 'The split between equities and fixed-income assets dictates historical drawdown resilience.' },
      { name: 'Sequence of Returns', desc: 'Experiencing market downturns in the first 5 years of retirement increases portfolio stress.' },
    ],
    tax: [
      { name: 'Filing Status', desc: 'Single, Married Filing Jointly, or Head of Household dictates statutory bracket thresholds.' },
      { name: 'Deductions (Standard vs. Itemized)', desc: 'Claiming standard vs. itemized deductions changes your taxable base income directly.' },
      { name: 'Statutory Tax Year', desc: 'Annual inflation indexing by revenue authorities shifts tax bracket cutoffs every year.' },
    ],
    loan: [
      { name: 'Extra Principal Payments', desc: 'Making one extra payment per year can shave multiple years and interest off an amortizing loan.' },
      { name: 'Origination & Processing Fees', desc: 'APR reflects total borrowing costs including lender origination fees, unlike base nominal interest.' },
      { name: 'Payment Frequency', desc: 'Bi-weekly payments create 26 half-payments (13 full payments per year), accelerating payoff.' },
    ],
  };

  return (
    <div className="w-full">
      {/* 1. Calculate -> Compare -> Understand Framework */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">Our Core Approach</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
              Calculate &rarr; Compare &rarr; Understand
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
              We believe a finance calculator should do more than output a raw number. It should clarify the math,
              allow scenario testing, and explain how each assumption impacts your result.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mb-3">
                1
              </div>
              <h3 className="font-bold text-base text-on-surface mb-1">Calculate</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Enter your real financial numbers—loan balances, expected rates, or contribution schedules—to get exact, formula-driven mathematical results.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mb-3">
                2
              </div>
              <h3 className="font-bold text-base text-on-surface mb-1">Compare</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Test different assumptions side-by-side. See what happens when interest rates shift by 0.5% or when you add $100 extra to your monthly payment.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mb-3">
                3
              </div>
              <h3 className="font-bold text-base text-on-surface mb-1">Understand</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Review the underlying formulas, compounding intervals, and limitations so you can interpret the numbers with clarity and context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Educational Guides */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-left mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Financial Literacy &amp; Math</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Learn How Finance Calculations Work
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
            Understand the formulas, amortizations, and assumptions behind common financial calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'How EMI Works (Equated Monthly Installment)',
              desc: 'Learn the standard amortization formula P × r × (1+r)^n / ((1+r)^n - 1) and how early payments are heavily interest-weighted.',
              link: '/article/how-emi-works',
            },
            {
              title: 'Investment Planning & Compound Interest',
              desc: 'Discover how exponential compounding works, why frequency matters, and how small initial deposits grow over decades.',
              link: '/article/investment-planning-basics',
            },
            {
              title: 'Understanding GST & Sales Tax Calculations',
              desc: 'Learn how forward and reverse GST formulas work to add or back out statutory sales taxes from gross prices.',
              link: '/article/understanding-gst',
            },
            {
              title: 'Debt Avalanche vs. Debt Snowball',
              desc: 'Compare the mathematical savings of targeting highest-interest debt against the psychological momentum of smallest balances.',
              link: '/loans-and-amortization',
            },
            {
              title: 'What Is CAGR (Compound Annual Growth Rate)?',
              desc: 'Understand how CAGR smooths volatile historical investment returns into a steady annual baseline metric.',
              link: '/finance/investment-calculator',
            },
            {
              title: 'How Mortgage P&I and Escrow are Calculated',
              desc: 'Break down monthly home loan payments into principal, interest, county property taxes, insurance, and PMI.',
              link: '/finance/mortgage-calculator',
            },
          ].map((guide) => (
            <div
              key={guide.title}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-sm sm:text-base text-on-surface">{guide.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  {guide.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20">
                <Link
                  href={guide.link}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Read Guide</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The 4% Rule Section with Interactive Tester */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="text-left mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">Retirement Framework</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              What Is the 4% Withdrawal Rule?
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-3xl leading-relaxed">
              Originated from the 1994 Bengen study and the 1998 Trinity Study, the 4% rule is a historical benchmark suggesting
              that withdrawing 4% of an investment portfolio in the first year of retirement—adjusted annually for inflation—historically
              sustained a 30-year retirement without portfolio depletion in the vast majority of historical US market periods.
            </p>
            <p className="text-xs text-on-surface-variant mt-1 italic">
              Note: The 4% rule is an empirical historical framework, not a guarantee of future outcomes. Market valuations, interest rates, and longer lifespans may warrant different withdrawal rates (e.g., 3.25%–3.75%).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Starting Portfolio Value: <span className="font-mono text-primary">${nestEgg.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="200000"
                  max="3000000"
                  step="50000"
                  value={nestEgg}
                  onChange={(e) => setNestEgg(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Annual Withdrawal Rate: <span className="font-mono text-primary">{withdrawalRate}%</span>
                </label>
                <input
                  type="range"
                  min="3.0"
                  max="5.5"
                  step="0.25"
                  value={withdrawalRate}
                  onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-outline mt-1 font-mono">
                  <span>3.0% (Conservative)</span>
                  <span>4.0% (Classic)</span>
                  <span>5.0% (Aggressive)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-around gap-4">
              <div>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">Estimated Annual Income:</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-on-surface block mt-1">
                  ${Math.round(annualWithdrawal).toLocaleString()}
                </span>
                <span className="text-xs text-on-surface-variant">Adjusted for inflation each year</span>
              </div>
              <div className="h-10 w-[1px] bg-outline-variant/40 hidden sm:block" />
              <div>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">Estimated Monthly Budget:</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-primary block mt-1">
                  ${Math.round(monthlyWithdrawal).toLocaleString()}
                </span>
                <span className="text-xs text-on-surface-variant">Pre-tax monthly cash flow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What Can Change Your Financial Result? */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-left mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Sensitivity Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            What Can Change Your Financial Result?
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
            Financial calculations are highly sensitive to specific input variables. Select a category below to see what moves the needle most.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-2xl overflow-x-auto mb-6">
          {(['mortgage', 'investment', 'retirement', 'tax', 'loan'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat} Variables
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {variableData[activeCategory].map((v) => (
            <div
              key={v.name}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs"
            >
              <h3 className="font-bold text-sm text-on-surface">{v.name}</h3>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why Your Result May Differ From Another Calculator */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30">
          <div className="text-left mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">Transparency &amp; Precision</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Why Your Result May Differ From Another Calculator
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-3xl leading-relaxed">
              If you compare outputs between different financial platforms, banks, or online calculators, you may notice small variations. These discrepancies are normal and typically result from differences in underlying assumptions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
              <h3 className="font-bold text-sm text-on-surface mb-1">Compounding Frequency</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Interest can compound annually, semi-annually (standard for Canadian mortgages), monthly (standard for US loans), or daily (credit cards). Different compounding frequencies yield slight variations in effective annual yields.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
              <h3 className="font-bold text-sm text-on-surface mb-1">Payment Timing (Annuity Due vs. Ordinary)</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Whether contributions or loan payments are assumed to occur at the beginning of the period or at the end changes the compounding period applied to each payment.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
              <h3 className="font-bold text-sm text-on-surface mb-1">Rounding &amp; Intermediate Decimal Precision</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Some calculators round monthly amortization payments to the nearest cent at each step, while others maintain full floating-point precision until displaying final totals.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
              <h3 className="font-bold text-sm text-on-surface mb-1">Escrow, Fees, &amp; Additional Costs</h3>
              <p className="text-on-surface-variant leading-relaxed">
                A basic loan calculator computes Principal &amp; Interest (P&amp;I) only. Comprehensive tools include escrowed property taxes, home insurance, HOA fees, and PMI, which changes the total monthly payment.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
              <h3 className="font-bold text-sm text-on-surface mb-1">Statutory Tax Year &amp; Indexing</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Tax calculators updated for the 2025/2026 tax year apply revised standard deductions and tax bracket cutoffs compared to tools using older tax tables.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
              <h3 className="font-bold text-sm text-on-surface mb-1">Lender-Specific Policies</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Lenders may use 360-day or 365-day day-count conventions, assess upfront origination charges, or use proprietary underwriting formulas that differ from open mathematical models.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
