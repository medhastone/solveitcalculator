'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';

const COMPOUND_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: '401(k) Retirement Calculator',
    description: 'Calculate retirement nest egg growth with employer matching.',
    href: '/finance/401k-calculator',
    iconVariant: 'chart-green',
  },
  {
    name: 'Roth vs. Traditional Calculator',
    description: 'Compare pre-tax and tax-free retirement growth side by side.',
    href: '/finance/roth-vs-traditional-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'Loan Payment Calculator',
    description: 'Calculate monthly payments and interest on personal or auto loans.',
    href: '/loan-calculator',
    iconVariant: 'tag-amber',
  },
  {
    name: 'Percentage Change Calculator',
    description: 'Find percentage growth between starting and ending balances.',
    href: '/math/percentage-change-calculator',
    iconVariant: 'percent-coral',
  },
  {
    name: 'Mortgage Calculator',
    description: 'Calculate monthly home mortgage principal, interest, and taxes.',
    href: '/mortgage-calculator',
    iconVariant: 'arrows-blue',
  },
];

export default function CompoundInterestCalculator() {
  const [initialPrincipal, setInitialPrincipal] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [years, setYears] = useState<number>(20);
  const [rate, setRate] = useState<number>(8);

  const result = useMemo(() => {
    const rMonthly = Math.max(0, rate) / 100 / 12;
    const totalMonths = Math.max(1, Math.round(years * 12));

    let balance = initialPrincipal;
    let totalDeposited = initialPrincipal;

    for (let m = 1; m <= totalMonths; m++) {
      balance += monthlyContribution;
      totalDeposited += monthlyContribution;
      balance += balance * rMonthly;
    }

    const finalBalance = Math.round(balance);
    const totalInterest = Math.max(0, Math.round(balance - totalDeposited));

    return {
      finalBalance,
      totalDeposited: Math.round(totalDeposited),
      totalInterest,
    };
  }, [initialPrincipal, monthlyContribution, years, rate]);

  const handleReset = () => {
    setInitialPrincipal(10000);
    setMonthlyContribution(500);
    setYears(20);
    setRate(8);
  };

  const calculatorCard = (
    <section
      id="calculator"
      aria-label="Compound Interest Calculator input panel"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
            Calculate Compound Interest Growth
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Enter your initial deposit, monthly contribution, annual return, and time horizon.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="ci-init" className="block text-sm font-extrabold text-[#152238] mb-2">
            Initial Deposit ($) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="ci-init"
              type="number"
              min={0}
              step={1000}
              value={initialPrincipal}
              onChange={(e) => setInitialPrincipal(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              $
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Starting principal (e.g. 10000)</p>
        </div>

        <div>
          <label htmlFor="ci-mo" className="block text-sm font-extrabold text-[#152238] mb-2">
            Monthly Contribution ($) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="ci-mo"
              type="number"
              min={0}
              step={50}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              $/mo
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Monthly addition (e.g. 500)</p>
        </div>

        <div>
          <label htmlFor="ci-rate" className="block text-sm font-extrabold text-[#152238] mb-2">
            Annual Interest Rate (%) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="ci-rate"
              type="number"
              min={0}
              max={35}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              %
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Expected annual return (e.g. 8%)</p>
        </div>

        <div>
          <label htmlFor="ci-yrs" className="block text-sm font-extrabold text-[#152238] mb-2">
            Time Period (Years) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="ci-yrs"
              type="number"
              min={1}
              max={60}
              step={1}
              value={years}
              onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              Years
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Investment horizon (e.g. 20)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-1">
        <button
          type="button"
          onClick={() => {}}
          className="sm:col-span-8 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#0B5CFF] hover:bg-[#1D46B0] text-white text-base font-extrabold shadow-xs transition-colors cursor-pointer"
        >
          <Calculator className="w-5 h-5" />
          <span>Calculate</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="sm:col-span-4 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-base font-extrabold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );

  return (
    <SingleCalculatorPageShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Finance', href: '/finance' },
        { label: 'Compound Interest Calculator' },
      ]}
      title="Compound Interest Calculator"
      subtitle="See how your initial savings, monthly contributions, and compound interest grow your balance over time."
      heroSymbol="%"
      heroBadgeBg="bg-[#E6F6F1]"
      heroBadgeColor="text-[#16856B]"
      categoryName="Finance"
      categoryHref="/finance"
      otherCalculatorsTitle="Other Finance Calculators"
      otherCalculators={COMPOUND_RELATED_LINKS}
      relatedCalculators={COMPOUND_RELATED_LINKS.slice(0, 4)}
      calculatorCard={calculatorCard}
      resultCard={{
        promptSummary: `Future balance after ${years} years at ${rate}%`,
        promptSuffix: 'is:',
        mainValue: formatCurrency(result.finalBalance),
        equation: `${formatCurrency(result.finalBalance)} = Total Deposits (${formatCurrency(result.totalDeposited)}) + Compound Interest (${formatCurrency(result.totalInterest)})`,
        secondaryNote: `Total Interest Earned: ${formatCurrency(result.totalInterest)}`,
      }}
      formulaCard={{
        introText: 'The formula to calculate future value with monthly compounding is:',
        formulaText: 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) ÷ (r/n)]',
        exampleTitle: '$10,000 + $500/mo at 8% for 20 years:',
        exampleSteps: [
          'Total Contributions = $10,000 + ($500 × 240) = $130,000',
          'Compound Interest Earned = $216,037',
          'Final Balance = $346,037',
        ],
      }}
      howToUseSteps={[
        'Enter your starting Initial Deposit ($) in the first field.',
        'Enter how much you plan to add each month in Monthly Contribution ($).',
        'Enter your expected Annual Interest Rate (%) and Time Period in years.',
        'View your total future value, total deposits, and compound interest earned.',
      ]}
      howItWorks={{
        paragraph:
          'Compound interest earns returns not only on your original principal and monthly deposits, but also on the interest accumulated in prior months. Over multi-year horizons, this creates exponential growth.',
        formulaBox: 'Future Value = Principal Growth + Monthly Contribution Growth',
        closingNote:
          'Using the Rule of 72, dividing 72 by your annual return percentage estimates how many years it takes your money to double.',
      }}
      understandingResult={{
        paragraph: (
          <>
            After <strong className="font-bold text-[#152238]">{years} years</strong>, your total out-of-pocket contributions of{' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(result.totalDeposited)}</strong> grow to{' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(result.finalBalance)}</strong>, meaning{' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(result.totalInterest)}</strong> comes purely from compounded investment returns.
          </>
        ),
      }}
      faqs={[
        {
          question: 'What is compound interest?',
          answer:
            'Compound interest is interest calculated on both your initial principal and all previously accumulated interest from earlier periods ("interest on interest").',
        },
        {
          question: 'What is the Rule of 72?',
          answer:
            'Divide 72 by your annual rate of return to estimate how many years it takes for a lump sum to double. At 8% annual return, money doubles in approximately 72 ÷ 8 = 9 years.',
        },
        {
          question: 'Does compounding frequency matter?',
          answer:
            'Yes. Monthly or daily compounding produces a slightly higher effective annual yield (APY) than annual compounding because interest is reinvested more frequently.',
        },
        {
          question: 'How does starting early affect compound growth?',
          answer:
            'Time is the exponent in the compound interest formula. Starting 10 years earlier often results in a larger final balance than doubling your monthly contribution later.',
        },
      ]}
    />
  );
}
