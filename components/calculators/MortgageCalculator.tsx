'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';

const MORTGAGE_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: 'Loan Payment Calculator',
    description: 'Calculate monthly payments for auto, personal, and student loans.',
    href: '/loan-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'Compound Interest Calculator',
    description: 'Project long-term investment growth and compound returns.',
    href: '/compound-interest-calculator',
    iconVariant: 'chart-green',
  },
  {
    name: 'Salary & Tax Calculator',
    description: 'Calculate net monthly take-home pay to budget for housing.',
    href: '/salary-tax-calculator',
    iconVariant: 'tag-amber',
  },
  {
    name: 'Percentage Calculator',
    description: 'Calculate 20% down payment amounts and closing cost percentages.',
    href: '/math/percentage-calculator',
    iconVariant: 'percent-coral',
  },
  {
    name: 'Area & Land Converter',
    description: 'Convert square feet, square meters, and acres for property lots.',
    href: '/unit-converter',
    iconVariant: 'arrows-blue',
  },
];

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState<number>(400000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(4800);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState<number>(1500);

  const calc = useMemo(() => {
    const downPayment = (homePrice * downPaymentPct) / 100;
    const principal = Math.max(0, homePrice - downPayment);
    const r = Math.max(0, interestRate) / 100 / 12;
    const n = Math.max(1, loanTermYears * 12);

    let monthlyPI = 0;
    if (r === 0) {
      monthlyPI = principal / n;
    } else {
      monthlyPI = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    const monthlyTax = propertyTaxAnnual / 12;
    const monthlyIns = homeInsuranceAnnual / 12;
    const monthlyTotal = monthlyPI + monthlyTax + monthlyIns;
    const totalInterest = Math.max(0, monthlyPI * n - principal);

    return {
      downPayment: Math.round(downPayment),
      principal: Math.round(principal),
      monthlyPI: Math.round(monthlyPI),
      monthlyTax: Math.round(monthlyTax),
      monthlyIns: Math.round(monthlyIns),
      monthlyTotal: Math.round(monthlyTotal),
      totalInterest: Math.round(totalInterest),
    };
  }, [homePrice, downPaymentPct, loanTermYears, interestRate, propertyTaxAnnual, homeInsuranceAnnual]);

  const handleReset = () => {
    setHomePrice(400000);
    setDownPaymentPct(20);
    setLoanTermYears(30);
    setInterestRate(6.5);
    setPropertyTaxAnnual(4800);
    setHomeInsuranceAnnual(1500);
  };

  const calculatorCard = (
    <section
      id="calculator"
      aria-label="Mortgage Payment Calculator input panel"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
            Calculate Monthly Mortgage Payment
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Enter home price, down payment, interest rate, and taxes to calculate your monthly PITI payment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="mtg-price" className="block text-sm font-extrabold text-[#152238] mb-2">
            Home Price ($) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="mtg-price"
              type="number"
              min={10000}
              step={5000}
              value={homePrice}
              onChange={(e) => setHomePrice(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              $
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Purchase price (e.g. 400000)</p>
        </div>

        <div>
          <label htmlFor="mtg-down" className="block text-sm font-extrabold text-[#152238] mb-2">
            Down Payment (%) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="mtg-down"
              type="number"
              min={0}
              max={95}
              step={1}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Math.min(95, Math.max(0, Number(e.target.value))))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              %
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">
            Down payment: {formatCurrency(calc.downPayment)} (Loan: {formatCurrency(calc.principal)})
          </p>
        </div>

        <div>
          <label htmlFor="mtg-rate" className="block text-sm font-extrabold text-[#152238] mb-2">
            Interest Rate (%) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="mtg-rate"
              type="number"
              min={0}
              max={25}
              step={0.125}
              value={interestRate}
              onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              %
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Annual mortgage rate (e.g. 6.5)</p>
        </div>

        <div>
          <label htmlFor="mtg-term" className="block text-sm font-extrabold text-[#152238] mb-2">
            Loan Term (Years) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="mtg-term"
              type="number"
              min={5}
              max={40}
              step={5}
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(Math.max(1, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              Years
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Standard 30 or 15 years</p>
        </div>

        <div>
          <label htmlFor="mtg-tax" className="block text-sm font-extrabold text-[#152238] mb-2">
            Annual Property Tax ($)
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="mtg-tax"
              type="number"
              min={0}
              step={100}
              value={propertyTaxAnnual}
              onChange={(e) => setPropertyTaxAnnual(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              $/yr
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="mtg-ins" className="block text-sm font-extrabold text-[#152238] mb-2">
            Annual Home Insurance ($)
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="mtg-ins"
              type="number"
              min={0}
              step={100}
              value={homeInsuranceAnnual}
              onChange={(e) => setHomeInsuranceAnnual(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              $/yr
            </span>
          </div>
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
        { label: 'Mortgage Calculator' },
      ]}
      title="Mortgage Calculator"
      subtitle="Calculate your total monthly mortgage payment including principal, interest, property taxes, and homeowners insurance (PITI)."
      heroSymbol="$"
      heroBadgeBg="bg-[#EBF2FF]"
      heroBadgeColor="text-[#2457D6]"
      categoryName="Finance"
      categoryHref="/finance"
      otherCalculatorsTitle="Other Finance Calculators"
      otherCalculators={MORTGAGE_RELATED_LINKS}
      relatedCalculators={MORTGAGE_RELATED_LINKS.slice(0, 4)}
      calculatorCard={calculatorCard}
      resultCard={{
        promptSummary: `Total monthly mortgage payment (${loanTermYears}-yr fixed)`,
        promptSuffix: 'is:',
        mainValue: `${formatCurrency(calc.monthlyTotal)}/mo`,
        equation: `${formatCurrency(calc.monthlyTotal)} = P&I (${formatCurrency(calc.monthlyPI)}) + Tax (${formatCurrency(calc.monthlyTax)}) + Insurance (${formatCurrency(calc.monthlyIns)})`,
        secondaryNote: `Loan Principal: ${formatCurrency(calc.principal)} · Total Lifetime Interest: ${formatCurrency(calc.totalInterest)}`,
      }}
      formulaCard={{
        introText: 'The formula to calculate monthly mortgage principal and interest (P&I) is:',
        formulaText: 'M = P × [r(1 + r)ⁿ] ÷ [(1 + r)ⁿ − 1] + (Tax + Insurance) ÷ 12',
        exampleTitle: '$400,000 Home with 20% Down ($320,000 Loan) at 6.5% for 30 Years:',
        exampleSteps: [
          'Principal & Interest = $2,023 / month',
          'Property Tax ($400/mo) + Insurance ($125/mo) = $525 / month',
          'Total Monthly PITI Payment = $2,548 / month',
        ],
      }}
      howToUseSteps={[
        'Enter the Home Price ($) and your planned Down Payment (%).',
        'Enter the annual mortgage Interest Rate (%) and Loan Term in years (e.g., 30 or 15).',
        'Enter estimated annual Property Tax and Home Insurance costs.',
        'View your monthly PITI breakdown, loan principal, and total lifetime interest.',
      ]}
      howItWorks={{
        paragraph:
          'First, the calculator subtracts your down payment from the home price to determine your mortgage loan principal (P). Next, it computes your monthly Principal & Interest payment over 12 × Years payments and adds 1/12th of your annual property taxes and home insurance.',
        formulaBox: 'Total Monthly Payment = Principal & Interest + Monthly Property Tax + Monthly Insurance',
        closingNote:
          'Putting at least 20% down avoids Private Mortgage Insurance (PMI) on conventional home loans.',
      }}
      understandingResult={{
        paragraph: (
          <>
            Your estimated total monthly payment is{' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(calc.monthlyTotal)}</strong>, which includes{' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(calc.monthlyPI)}</strong> for loan principal and interest plus{' '}
            <strong className="font-bold text-[#152238]">
              {formatCurrency(calc.monthlyTax + calc.monthlyIns)}
            </strong>{' '}
            for monthly property taxes and homeowners insurance escrow.
          </>
        ),
      }}
      faqs={[
        {
          question: 'What does PITI stand for in a mortgage payment?',
          answer:
            'PITI stands for Principal, Interest, Taxes (property taxes), and Insurance (homeowners insurance)—the four core components of a monthly mortgage payment.',
        },
        {
          question: 'Should I choose a 15-year or 30-year mortgage?',
          answer:
            'A 30-year mortgage offers a lower monthly payment, while a 15-year mortgage typically carries a lower interest rate and saves more than 50% in total lifetime interest.',
        },
        {
          question: 'How much down payment do I need to avoid PMI?',
          answer:
            'Conventional mortgages require a 20% down payment to avoid Private Mortgage Insurance (PMI).',
        },
        {
          question: 'Are property taxes and insurance included in my monthly bill?',
          answer:
            'Most lenders collect 1/12th of your annual property taxes and home insurance each month in an escrow account and pay those bills on your behalf when due.',
        },
      ]}
    />
  );
}
