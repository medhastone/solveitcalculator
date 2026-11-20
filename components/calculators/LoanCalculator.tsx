'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/lib/currency';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';

const LOAN_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: 'Mortgage Calculator',
    description: 'Calculate monthly home mortgage payments with taxes and insurance.',
    href: '/mortgage-calculator',
    iconVariant: 'chart-green',
  },
  {
    name: 'Compound Interest Calculator',
    description: 'See how savings and investments compound over time.',
    href: '/compound-interest-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'Salary & Tax Calculator',
    description: 'Estimate net paycheck after federal, state, and FICA taxes.',
    href: '/finance/take-home-pay-calculator',
    iconVariant: 'tag-amber',
  },
  {
    name: 'Percentage Calculator',
    description: 'Calculate interest percentages, down payments, and fees.',
    href: '/math/percentage-calculator',
    iconVariant: 'percent-coral',
  },
  {
    name: 'Break-Even Calculator',
    description: 'Find how many units or months are needed to recover a cost.',
    href: '/finance/break-even-calculator',
    iconVariant: 'arrows-blue',
  },
];

export default function LoanCalculator() {
  const { symbol } = useCurrency();
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [termUnit, setTermUnit] = useState<'months' | 'years'>('months');

  const displayedTermValue =
    termUnit === 'years'
      ? Number((loanTermMonths / 12).toFixed(2))
      : loanTermMonths;

  const handleTermValueChange = (rawVal: number) => {
    const clean = Math.max(1, rawVal);
    if (termUnit === 'years') {
      setLoanTermMonths(Math.min(480, Math.max(1, Math.round(clean * 12))));
    } else {
      setLoanTermMonths(Math.min(480, Math.max(1, Math.round(clean))));
    }
  };

  const result = useMemo(() => {
    const P = Math.max(0, loanAmount);
    const n = Math.max(1, Math.round(loanTermMonths));
    const r = Math.max(0, interestRate) / 100 / 12;

    let monthlyPayment = 0;
    if (r === 0) {
      monthlyPayment = P / n;
    } else {
      monthlyPayment = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    const totalPaid = monthlyPayment * n;
    const totalInterest = Math.max(0, totalPaid - P);

    return {
      monthlyPayment,
      totalPaid,
      totalInterest,
      monthlyRatePct: (r * 100).toFixed(3),
    };
  }, [loanAmount, interestRate, loanTermMonths]);

  const handleReset = () => {
    setLoanAmount(25000);
    setInterestRate(6.5);
    setLoanTermMonths(60);
    setTermUnit('months');
  };

  const loanPresets = [
    {
      label: `${symbol}15k Auto · 48 mo @ 5.9%`,
      onSelect: () => {
        setLoanAmount(15000);
        setInterestRate(5.9);
        setLoanTermMonths(48);
      },
    },
    {
      label: `${symbol}25k Personal · 60 mo @ 6.5%`,
      onSelect: () => {
        setLoanAmount(25000);
        setInterestRate(6.5);
        setLoanTermMonths(60);
      },
    },
    {
      label: `${symbol}35k Auto · 72 mo @ 6.9%`,
      onSelect: () => {
        setLoanAmount(35000);
        setInterestRate(6.9);
        setLoanTermMonths(72);
      },
    },
    {
      label: `${symbol}60k Business · 84 mo @ 7.5%`,
      onSelect: () => {
        setLoanAmount(60000);
        setInterestRate(7.5);
        setLoanTermMonths(84);
      },
    },
  ];

  const calculatorCard = (
    <section
      id="calculator"
      aria-label="Loan Payment Calculator input panel"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
              Calculate Monthly Loan Payment
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Enter principal, APR, and term in months or years to compute your exact monthly payment.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Term & Rate Chips inside Workbench */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] mr-1">
          Term:
        </span>
        {[36, 48, 60, 72, 84].map((mo) => (
          <button
            key={mo}
            type="button"
            onClick={() => setLoanTermMonths(mo)}
            className={`px-2.5 py-1 rounded-md text-xs font-bold tabular-nums border transition-colors cursor-pointer ${
              loanTermMonths === mo
                ? 'bg-[#2457D6] text-white border-[#2457D6]'
                : 'bg-[#F8FAFC] hover:bg-[#EEF3FF] text-[#152238] border-[#CBD5E1]'
            }`}
          >
            {mo} mo ({mo / 12} yr)
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="loan-amt" className="block text-sm font-extrabold text-[#152238] mb-2">
            Loan Amount ({symbol}) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="loan-amt"
              type="number"
              min={100}
              step={500}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              {symbol}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Enter principal (e.g. 25000)</p>
        </div>

        <div>
          <label htmlFor="loan-rate" className="block text-sm font-extrabold text-[#152238] mb-2">
            Interest Rate (%) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="loan-rate"
              type="number"
              min={0}
              max={40}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              %
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Annual APR (e.g. 6.5)</p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-1 mb-2">
            <label htmlFor="loan-term" className="block text-sm font-extrabold text-[#152238]">
              Loan Term <span className="text-[#E11D48]">*</span>
            </label>
            <div
              role="group"
              aria-label="Loan term unit toggle"
              className="inline-flex rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-0.5 text-[11px] font-bold"
            >
              <button
                type="button"
                onClick={() => setTermUnit('months')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  termUnit === 'months'
                    ? 'bg-[#2457D6] text-white'
                    : 'text-[#475569] hover:text-[#152238]'
                }`}
              >
                Mo
              </button>
              <button
                type="button"
                onClick={() => setTermUnit('years')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  termUnit === 'years'
                    ? 'bg-[#2457D6] text-white'
                    : 'text-[#475569] hover:text-[#152238]'
                }`}
              >
                Yr
              </button>
            </div>
          </div>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="loan-term"
              type="number"
              min={1}
              max={termUnit === 'years' ? 40 : 480}
              step={termUnit === 'years' ? 1 : 12}
              value={displayedTermValue}
              onChange={(e) => handleTermValueChange(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              {termUnit === 'years' ? 'yr' : 'mo'}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5 tabular-nums">
            = {loanTermMonths} months ({(loanTermMonths / 12).toFixed(1)} years)
          </p>
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
        { label: 'Loan Payment Calculator' },
      ]}
      title="Loan Payment Calculator"
      subtitle="Calculate your monthly payment, total interest cost, and total payoff amount for personal, auto, or student loans."
      heroSymbol="$"
      heroBadgeBg="bg-[#E6F6F1]"
      heroBadgeColor="text-[#16856B]"
      categoryName="Finance"
      categoryHref="/finance"
      otherCalculatorsTitle="Other Finance Calculators"
      otherCalculators={LOAN_RELATED_LINKS}
      relatedCalculators={LOAN_RELATED_LINKS.slice(0, 4)}
      presets={loanPresets}
      calculatorCard={calculatorCard}
      resultCard={{
        promptSummary: `Monthly payment for ${formatCurrency(loanAmount)} over ${loanTermMonths} months`,
        promptSuffix: 'is:',
        mainValue: `${formatCurrency(Math.round(result.monthlyPayment))}/mo`,
        equation: `Total Paid: ${formatCurrency(Math.round(result.totalPaid))} = Principal (${formatCurrency(loanAmount)}) + Interest (${formatCurrency(Math.round(result.totalInterest))})`,
        secondaryNote: `Total Interest Paid over ${loanTermMonths} months: ${formatCurrency(Math.round(result.totalInterest))}`,
      }}
      formulaCard={{
        introText: 'The standard amortization formula for fixed monthly loan payments is:',
        formulaText: 'M = P × [r(1 + r)ⁿ] ÷ [(1 + r)ⁿ − 1]',
        exampleTitle: 'Find payment for $25,000 at 6.5% APR for 60 months:',
        exampleSteps: [
          'Monthly rate r = 6.5% ÷ 12 = 0.005417',
          'M = 25,000 × [0.005417 × (1.005417)⁶⁰] ÷ [(1.005417)⁶⁰ − 1]',
          'Monthly Payment M = $489.15/month',
        ],
      }}
      howToUseSteps={[
        'Enter the total Loan Amount ($) you plan to borrow.',
        'Enter the annual Interest Rate (%) offered by your lender.',
        'Enter the Loan Term in months (e.g., 36, 48, 60, or 72 months).',
        'View your exact monthly payment, total interest cost, and complete payoff equation.',
      ]}
      howItWorks={{
        paragraph:
          'An amortized loan divides your annual interest rate by 12 to find the monthly periodic rate, then calculates a level monthly payment that pays off both principal and accrued interest by the final month.',
        formulaBox: 'Monthly Payment = P × [r(1 + r)ⁿ] ÷ [(1 + r)ⁿ − 1]',
        closingNote:
          'Making extra principal payments early in the loan term reduces your balance faster and lowers total interest paid.',
      }}
      understandingResult={{
        paragraph: (
          <>
            Your monthly payment of{' '}
            <strong className="font-bold text-[#152238]">
              {formatCurrency(Math.round(result.monthlyPayment))}
            </strong>{' '}
            covers both principal reduction and monthly interest charges. Over the full{' '}
            {loanTermMonths}-month term, you will repay{' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(loanAmount)}</strong> in principal plus{' '}
            <strong className="font-bold text-[#152238]">
              {formatCurrency(Math.round(result.totalInterest))}
            </strong>{' '}
            in total interest.
          </>
        ),
      }}
      faqs={[
        {
          question: 'How is a monthly loan payment calculated?',
          answer:
            'Monthly loan payments use the standard amortization formula, which combines your loan principal (P), monthly interest rate (annual APR divided by 12), and total number of monthly payments (n).',
        },
        {
          question: 'How does loan term affect total interest?',
          answer:
            'A longer loan term (such as 72 or 84 months) lowers your monthly payment but significantly increases the total interest paid over the life of the loan.',
        },
        {
          question: 'Can I pay off my loan early?',
          answer:
            'Most personal, auto, and student loans allow early principal prepayments without penalty. Any extra amount paid directly reduces your principal balance and saves future interest.',
        },
        {
          question: 'What is the difference between interest rate and APR?',
          answer:
            'The interest rate is the base cost of borrowing the principal, while the Annual Percentage Rate (APR) also includes upfront lender origination fees expressed as an annualized rate.',
        },
      ]}
    />
  );
}
