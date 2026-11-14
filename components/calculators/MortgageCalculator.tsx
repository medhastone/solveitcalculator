'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/lib/currency';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';

const MORTGAGE_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: 'Loan Payment & Amortization Calculator',
    description: 'Estimate monthly payments for auto, personal, and student loans.',
    href: '/loan-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'Compound Interest Growth Calculator',
    description: 'Project long-term investment growth and compound returns.',
    href: '/compound-interest-calculator',
    iconVariant: 'chart-green',
  },
  {
    name: 'Net Take-Home Pay Calculator',
    description: 'Estimate after-tax monthly income to budget for housing.',
    href: '/finance/take-home-pay-calculator',
    iconVariant: 'tag-amber',
  },
  {
    name: 'Down Payment Percentage Calculator',
    description: 'Compute 20% down payment targets and closing cost ratios.',
    href: '/math/percentage-calculator',
    iconVariant: 'percent-coral',
  },
  {
    name: 'Property Lot & Area Converter',
    description: 'Convert square feet, square meters, and acres for lots.',
    href: '/conversions/area',
    iconVariant: 'arrows-blue',
  },
];

const MORTGAGE_REFERENCE_ROWS = [
  {
    scenarioLabel: '5.5% APR · 30-Year Fixed',
    multiplierLabel: '$5.68 per $1k',
    calculatedOutput: '$1,817 / mo P&I',
    formulaNote: 'On $320,000 loan · $334,078 total interest',
  },
  {
    scenarioLabel: '6.0% APR · 30-Year Fixed',
    multiplierLabel: '$6.00 per $1k',
    calculatedOutput: '$1,919 / mo P&I',
    formulaNote: 'On $320,000 loan · $370,682 total interest',
  },
  {
    scenarioLabel: '6.5% APR · 30-Year Fixed',
    multiplierLabel: '$6.32 per $1k',
    calculatedOutput: '$2,023 / mo P&I',
    formulaNote: 'On $320,000 loan · $408,142 total interest',
  },
  {
    scenarioLabel: '7.0% APR · 30-Year Fixed',
    multiplierLabel: '$6.65 per $1k',
    calculatedOutput: '$2,129 / mo P&I',
    formulaNote: 'On $320,000 loan · $446,429 total interest',
  },
  {
    scenarioLabel: '6.0% APR · 15-Year Fixed',
    multiplierLabel: '$8.44 per $1k',
    calculatedOutput: '$2,700 / mo P&I',
    formulaNote: 'On $320,000 loan · $166,062 total interest',
  },
  {
    scenarioLabel: '6.5% APR · 15-Year Fixed',
    multiplierLabel: '$8.71 per $1k',
    calculatedOutput: '$2,788 / mo P&I',
    formulaNote: 'On $320,000 loan · $181,758 total interest',
  },
];

export default function MortgageCalculator() {
  const { symbol } = useCurrency();
  const [rawHomePrice, setRawHomePrice] = useState<string>('');
  const [rawDownPaymentPct, setRawDownPaymentPct] = useState<string>('');
  const [rawLoanTermYears, setRawLoanTermYears] = useState<string>('');
  const [rawInterestRate, setRawInterestRate] = useState<string>('');
  const [rawPropertyTaxAnnual, setRawPropertyTaxAnnual] = useState<string>('');
  const [rawHomeInsuranceAnnual, setRawHomeInsuranceAnnual] = useState<string>('');

  const homePrice = useMemo(() => {
    const parsed = parseFloat(rawHomePrice);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }, [rawHomePrice]);

  const downPaymentPct = useMemo(() => {
    const parsed = parseFloat(rawDownPaymentPct);
    return Number.isFinite(parsed) ? Math.min(95, Math.max(0, parsed)) : 0;
  }, [rawDownPaymentPct]);

  const loanTermYears = useMemo(() => {
    const parsed = parseFloat(rawLoanTermYears);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [rawLoanTermYears]);

  const interestRate = useMemo(() => {
    const parsed = parseFloat(rawInterestRate);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }, [rawInterestRate]);

  const propertyTaxAnnual = useMemo(() => {
    const parsed = parseFloat(rawPropertyTaxAnnual);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }, [rawPropertyTaxAnnual]);

  const homeInsuranceAnnual = useMemo(() => {
    const parsed = parseFloat(rawHomeInsuranceAnnual);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }, [rawHomeInsuranceAnnual]);

  const isEmpty =
    rawHomePrice.trim() === '' ||
    homePrice <= 0 ||
    rawDownPaymentPct.trim() === '' ||
    rawInterestRate.trim() === '' ||
    rawLoanTermYears.trim() === '' ||
    loanTermYears <= 0;

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

  const handleLoadSample = () => {
    setRawHomePrice('400000');
    setRawDownPaymentPct('20');
    setRawInterestRate('6.5');
    setRawLoanTermYears('30');
    setRawPropertyTaxAnnual('4800');
    setRawHomeInsuranceAnnual('1500');
  };

  const handleReset = () => {
    setRawHomePrice('');
    setRawDownPaymentPct('');
    setRawLoanTermYears('');
    setRawInterestRate('');
    setRawPropertyTaxAnnual('');
    setRawHomeInsuranceAnnual('');
  };

  const calculatorCard = (
    <section
      id="calculator"
      aria-label="Mortgage Payment Calculator input panel"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 shadow-2xs space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#152238]">
              Calculate Monthly Mortgage Payment
            </h2>
            <p className="text-xs text-[#64748B]">
              Enter home price, down payment, rate, term, and optional escrow taxes or insurance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="mtg-price" className="block text-xs sm:text-sm font-extrabold text-[#152238] mb-1">
            Home Price ({symbol}) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15 min-h-[44px]">
            <input
              id="mtg-price"
              type="number"
              min={1000}
              step={5000}
              placeholder="e.g. 400000"
              value={rawHomePrice}
              onChange={(e) => setRawHomePrice(e.target.value)}
              className="w-full min-h-[44px] px-3 bg-white text-sm sm:text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-2.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              {symbol}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="mtg-down" className="block text-xs sm:text-sm font-extrabold text-[#152238] mb-1">
            Down Payment (%) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15 min-h-[44px]">
            <input
              id="mtg-down"
              type="number"
              min={0}
              max={95}
              step={1}
              placeholder="e.g. 20"
              value={rawDownPaymentPct}
              onChange={(e) => setRawDownPaymentPct(e.target.value)}
              className="w-full min-h-[44px] px-3 bg-white text-sm sm:text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-2.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              %
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="mtg-rate" className="block text-xs sm:text-sm font-extrabold text-[#152238] mb-1">
            Interest Rate (%) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15 min-h-[44px]">
            <input
              id="mtg-rate"
              type="number"
              min={0}
              max={25}
              step={0.125}
              placeholder="e.g. 6.5"
              value={rawInterestRate}
              onChange={(e) => setRawInterestRate(e.target.value)}
              className="w-full min-h-[44px] px-3 bg-white text-sm sm:text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-2.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              %
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="mtg-term" className="block text-xs sm:text-sm font-extrabold text-[#152238] mb-1">
            Loan Term (Yrs) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15 min-h-[44px]">
            <input
              id="mtg-term"
              type="number"
              min={1}
              max={40}
              step={5}
              placeholder="e.g. 30"
              value={rawLoanTermYears}
              onChange={(e) => setRawLoanTermYears(e.target.value)}
              className="w-full min-h-[44px] px-3 bg-white text-sm sm:text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-2.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              Yrs
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="mtg-tax" className="block text-xs sm:text-sm font-extrabold text-[#152238] mb-1">
            Property Tax ({symbol}/yr)
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15 min-h-[44px]">
            <input
              id="mtg-tax"
              type="number"
              min={0}
              step={100}
              placeholder="e.g. 4800"
              value={rawPropertyTaxAnnual}
              onChange={(e) => setRawPropertyTaxAnnual(e.target.value)}
              className="w-full min-h-[44px] px-3 bg-white text-sm sm:text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-2 bg-[#F1F5F9] border-l border-[#CBD5E1] text-[11px] font-bold text-[#475569] flex items-center">
              /yr
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="mtg-ins" className="block text-xs sm:text-sm font-extrabold text-[#152238] mb-1">
            Home Insurance ({symbol}/yr)
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15 min-h-[44px]">
            <input
              id="mtg-ins"
              type="number"
              min={0}
              step={100}
              placeholder="e.g. 1500"
              value={rawHomeInsuranceAnnual}
              onChange={(e) => setRawHomeInsuranceAnnual(e.target.value)}
              className="w-full min-h-[44px] px-3 bg-white text-sm sm:text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-2 bg-[#F1F5F9] border-l border-[#CBD5E1] text-[11px] font-bold text-[#475569] flex items-center">
              /yr
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleLoadSample}
          className="col-span-7 sm:col-span-8 min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0B5CFF] hover:bg-[#1D46B0] text-white text-sm sm:text-base font-extrabold shadow-xs transition-colors cursor-pointer"
        >
          <Calculator className="w-4 h-4" />
          <span>Try Sample ($400k)</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="col-span-5 sm:col-span-4 min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-sm sm:text-base font-extrabold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );

  return (
    <SingleCalculatorPageShell
      layoutVariant="result-below-inputs"
      useCuratedFaqsOnly={true}
      schemaAppCategory="FinanceApplication"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Finance', href: '/finance' },
        { label: 'Mortgage Calculator' },
      ]}
      title="Mortgage Calculator"
      subtitle="Calculate your monthly PITI mortgage payment across principal, interest, taxes, and insurance."
      quickAnswer={{
        question: 'How much is a $320,000 mortgage per month at 6.5%?',
        answer:
          'A $320,000 loan at 6.5% over 30 years costs $2,023/month in principal and interest ($2,548/month PITI with $4,800/year property tax and $1,500/year homeowners insurance).',
        targetAnchor: '#reference-table',
        targetLabel: 'APR & term table ↓',
      }}
      workedExampleCard={{
        title: '$400,000 home with 20% down ($320,000 loan) at 6.5% APR for 30 years:',
        equation: '$2,023 P&I + $400 tax + $125 insurance = $2,548/mo total PITI',
        steps: [
          'Loan principal = $400,000 − $80,000 down payment = $320,000',
          'Monthly P&I = $2,023 (total 30-year interest = $408,142)',
          'Escrow = ($4,800 ÷ 12) + ($1,500 ÷ 12) = $525/mo',
        ],
      }}
      matchingGuide={{
        title: 'How to Calculate Loan & Mortgage Payments (PITI Guide)',
        description:
          'Walk through amortization formulas, 15- vs 30-year interest savings, and PMI down-payment thresholds.',
        href: '/guides/how-to-calculate-loan-and-mortgage-payments',
      }}
      heroSymbol="$"
      heroBadgeBg="bg-[#EBF2FF]"
      heroBadgeColor="text-[#2457D6]"
      categoryName="Finance"
      categoryHref="/finance"
      otherCalculatorsTitle="Other Finance Calculators"
      otherCalculators={MORTGAGE_RELATED_LINKS}
      relatedCalculators={MORTGAGE_RELATED_LINKS}
      calculatorCard={calculatorCard}
      resultCard={{
        isEmpty,
        placeholderMessage:
          'Enter home price, down payment %, interest rate %, and loan term years to see your monthly payment.',
        promptSummary: `Monthly mortgage payment (${loanTermYears}-yr fixed)`,
        promptSuffix: 'is:',
        mainValue: `${formatCurrency(calc.monthlyTotal)}/mo`,
        equation: `${formatCurrency(calc.monthlyTotal)} = P&I (${formatCurrency(calc.monthlyPI)}) + Tax (${formatCurrency(calc.monthlyTax)}) + Insurance (${formatCurrency(calc.monthlyIns)})`,
        secondaryNote: `Down Payment: ${formatCurrency(calc.downPayment)} · Loan Principal: ${formatCurrency(calc.principal)} · Total Interest: ${formatCurrency(calc.totalInterest)}`,
      }}
      referenceTableRows={MORTGAGE_REFERENCE_ROWS}
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
        'Enter Home Price, Down Payment (%), Interest Rate (%), and Loan Term (Years).',
        'Optionally enter annual Property Tax and Homeowners Insurance to include monthly escrow.',
        'Read your monthly PITI breakdown, loan principal, and total lifetime interest right below the inputs.',
        'Compare 15-year and 30-year interest rates in the reference table or click Copy or Share.',
      ]}
      howItWorks={{
        paragraph:
          'First, the calculator subtracts your down payment from the home price to determine your mortgage loan principal (P). Next, it applies the fixed amortization formula over 12 × Years monthly payments and adds 1/12th of your annual property taxes and home insurance.',
        formulaBox: 'Total Monthly Payment = Principal & Interest + Monthly Property Tax + Monthly Insurance',
        closingNote:
          'Putting at least 20% down brings your loan-to-value ratio to 80%, removing Private Mortgage Insurance (PMI) on conventional mortgages.',
      }}
      understandingResult={{
        paragraph: (
          <>
            {isEmpty ? (
              <>
                With an example <strong className="font-bold text-[#152238]">$400,000 home</strong> and{' '}
                <strong className="font-bold text-[#152238]">20% down payment</strong> at 6.5% over 30 years,
                principal and interest is <strong className="font-bold text-[#152238]">$2,023/mo</strong> and
                total PITI reaches <strong className="font-bold text-[#152238]">$2,548/mo</strong> with typical
                taxes and insurance.
              </>
            ) : (
              <>
                Your estimated total monthly payment is{' '}
                <strong className="font-bold text-[#152238]">{formatCurrency(calc.monthlyTotal)}</strong>, which includes{' '}
                <strong className="font-bold text-[#152238]">{formatCurrency(calc.monthlyPI)}</strong> for loan principal and interest plus{' '}
                <strong className="font-bold text-[#152238]">
                  {formatCurrency(calc.monthlyTax + calc.monthlyIns)}
                </strong>{' '}
                for monthly property taxes and homeowners insurance escrow.
              </>
            )}
          </>
        ),
      }}
      faqs={[
        {
          question: 'What does PITI stand for in a mortgage payment?',
          answer:
            'PITI stands for Principal, Interest, Taxes (property taxes), and Insurance (homeowners insurance)—the four core components bundled into a typical monthly housing payment.',
        },
        {
          question: 'Should I choose a 15-year or 30-year fixed mortgage?',
          answer:
            'A 30-year fixed loan minimizes the required monthly payment, whereas a 15-year fixed loan pairs higher monthly payments with a lower rate and saves well over half the lifetime interest.',
        },
        {
          question: 'How much down payment do I need to avoid PMI?',
          answer:
            'Conventional lenders require at least a 20% down payment (an 80% loan-to-value ratio) at closing to avoid Private Mortgage Insurance (PMI), which otherwise adds roughly 0.3% to 1.5% of the loan per year.',
        },
        {
          question: 'Are property taxes and home insurance included in my monthly bill?',
          answer:
            'Most mortgage servicers collect 1/12th of your annual property taxes and homeowners insurance every month in an escrow account and disburse those bills directly to your county and insurer.',
        },
        {
          question: 'How much difference does a 0.5% lower mortgage interest rate make?',
          answer:
            'On a $320,000 30-year mortgage, dropping the rate from 6.5% to 6.0% reduces your monthly principal and interest by $104 ($2,023 down to $1,919) and saves $37,460 in total interest.',
        },
        {
          question: 'What is the difference between mortgage interest rate and APR?',
          answer:
            'The interest rate determines your base monthly principal and interest payment, while the Annual Percentage Rate (APR) reflects the true yearly borrowing cost by folding origination fees, discount points, and closing costs into the rate.',
        },
      ]}
    />
  );
}
