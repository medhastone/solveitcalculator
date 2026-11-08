'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';

const SALARY_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: 'Country-Specific Salary & Take-Home Calculator',
    description:
      'Estimate take-home pay for the US, UK, Canada, Australia, and India with official tax rules.',
    href: '/salary-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'US State Take-Home Paycheck Calculator',
    description: 'Calculate state-specific net pay across all 50 US states.',
    href: '/finance/us-state-take-home-calculator',
    iconVariant: 'chart-green',
  },
  {
    name: 'Salary to Hourly Calculator',
    description: 'Convert annual salary to hourly, weekly, and bi-weekly pay.',
    href: '/finance/salary-to-hourly-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'Pay Raise Calculator',
    description: 'See how a percentage raise increases your paycheck.',
    href: '/finance/pay-raise-calculator',
    iconVariant: 'tag-amber',
  },
  {
    name: '401(k) Retirement Calculator',
    description: 'Optimize pre-tax 401(k) deferrals and employer match.',
    href: '/finance/401k-calculator',
    iconVariant: 'arrows-blue',
  },
  {
    name: 'US Federal Income Tax Calculator',
    description: 'See your progressive IRS tax bracket breakdown.',
    href: '/finance/us-federal-income-tax-calculator',
    iconVariant: 'percent-coral',
  },
];

export default function SalaryTaxCalculator() {
  const [grossAnnualSalary, setGrossAnnualSalary] = useState<number>(85000);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [stateTaxRate, setStateTaxRate] = useState<number>(4.5);
  const [preTaxDeductionsAnnual, setPreTaxDeductionsAnnual] = useState<number>(4000);

  const taxCalculation = useMemo(() => {
    const gross = Math.max(0, grossAnnualSalary);
    const preTax = Math.max(0, preTaxDeductionsAnnual);
    const taxableIncome = Math.max(0, gross - preTax);

    const standardDeduction = filingStatus === 'single' ? 15000 : 30000;
    const federalTaxable = Math.max(0, taxableIncome - standardDeduction);

    let federalTax = 0;
    if (filingStatus === 'single') {
      if (federalTaxable > 103350) {
        federalTax = 17969 + (federalTaxable - 103350) * 0.24;
      } else if (federalTaxable > 48475) {
        federalTax = 5578 + (federalTaxable - 48475) * 0.22;
      } else if (federalTaxable > 11925) {
        federalTax = 1192.5 + (federalTaxable - 11925) * 0.12;
      } else {
        federalTax = federalTaxable * 0.1;
      }
    } else {
      if (federalTaxable > 206700) {
        federalTax = 35938 + (federalTaxable - 206700) * 0.24;
      } else if (federalTaxable > 96950) {
        federalTax = 11157 + (federalTaxable - 96950) * 0.22;
      } else if (federalTaxable > 23850) {
        federalTax = 2385 + (federalTaxable - 23850) * 0.12;
      } else {
        federalTax = federalTaxable * 0.1;
      }
    }

    const socialSecurity = Math.min(gross, 176100) * 0.062;
    const medicare = gross * 0.0145;
    const totalFica = socialSecurity + medicare;
    const stateTax = taxableIncome * (stateTaxRate / 100);
    const totalTaxes = federalTax + totalFica + stateTax;
    const netTakeHomeAnnual = Math.max(0, gross - totalTaxes - preTax);

    return {
      gross,
      preTax,
      federalTax: Math.round(federalTax),
      totalFica: Math.round(totalFica),
      stateTax: Math.round(stateTax),
      totalTaxes: Math.round(totalTaxes),
      netAnnual: Math.round(netTakeHomeAnnual),
      netMonthly: Math.round(netTakeHomeAnnual / 12),
      netBiWeekly: Math.round(netTakeHomeAnnual / 26),
      effectiveTaxRate: gross > 0 ? ((totalTaxes / gross) * 100).toFixed(1) : '0',
    };
  }, [grossAnnualSalary, filingStatus, stateTaxRate, preTaxDeductionsAnnual]);

  const handleReset = () => {
    setGrossAnnualSalary(85000);
    setFilingStatus('single');
    setStateTaxRate(4.5);
    setPreTaxDeductionsAnnual(4000);
  };

  const calculatorCard = (
    <section
      id="calculator"
      aria-label="Salary & Net Take-Home Pay Calculator input panel"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
              Calculate Net Take-Home Salary
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Enter your gross annual salary, filing status, state tax rate, and pre-tax deductions.
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-xl bg-[#F1F5F9] p-1 border border-[#CBD5E1]">
          <button
            type="button"
            onClick={() => setFilingStatus('single')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
              filingStatus === 'single'
                ? 'bg-[#2457D6] text-white shadow-2xs'
                : 'text-[#475569] hover:text-[#152238]'
            }`}
          >
            Single
          </button>
          <button
            type="button"
            onClick={() => setFilingStatus('married')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
              filingStatus === 'married'
                ? 'bg-[#2457D6] text-white shadow-2xs'
                : 'text-[#475569] hover:text-[#152238]'
            }`}
          >
            Married Filing Jointly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="sal-gross" className="block text-sm font-extrabold text-[#152238] mb-2">
            Annual Salary ($) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="sal-gross"
              type="number"
              min={0}
              step={1000}
              value={grossAnnualSalary}
              onChange={(e) => setGrossAnnualSalary(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              $/yr
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Gross income (e.g. 85000)</p>
        </div>

        <div>
          <label htmlFor="sal-state" className="block text-sm font-extrabold text-[#152238] mb-2">
            State Tax Rate (%) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="sal-state"
              type="number"
              min={0}
              max={15}
              step={0.25}
              value={stateTaxRate}
              onChange={(e) => setStateTaxRate(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              %
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">0% in TX/FL/WA; ~4.5% avg</p>
        </div>

        <div>
          <label htmlFor="sal-pretax" className="block text-sm font-extrabold text-[#152238] mb-2">
            Pre-Tax 401(k)/HSA ($)
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="sal-pretax"
              type="number"
              min={0}
              step={500}
              value={preTaxDeductionsAnnual}
              onChange={(e) => setPreTaxDeductionsAnnual(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              $/yr
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Annual pre-tax deductions</p>
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
        { label: 'Salary & Tax Calculator' },
      ]}
      title="Salary & Tax Calculator"
      subtitle="Estimate your net monthly, bi-weekly, and annual take-home pay after Federal income taxes, Social Security, Medicare, and state taxes."
      heroSymbol="$"
      heroBadgeBg="bg-[#E6F6F1]"
      heroBadgeColor="text-[#16856B]"
      categoryName="Finance"
      categoryHref="/finance"
      otherCalculatorsTitle="Other Salary & Tax Calculators"
      otherCalculators={SALARY_RELATED_LINKS}
      relatedCalculators={SALARY_RELATED_LINKS.slice(0, 4)}
      calculatorCard={calculatorCard}
      resultCard={{
        promptSummary: `Net take-home pay on ${formatCurrency(grossAnnualSalary)}`,
        promptSuffix: 'is:',
        mainValue: `${formatCurrency(taxCalculation.netMonthly)}/mo`,
        equation: `Annual Net (${formatCurrency(taxCalculation.netAnnual)}) = Gross (${formatCurrency(grossAnnualSalary)}) − Taxes (${formatCurrency(taxCalculation.totalTaxes)}) − Pre-Tax (${formatCurrency(preTaxDeductionsAnnual)})`,
        secondaryNote: `Bi-Weekly Paycheck: ${formatCurrency(taxCalculation.netBiWeekly)} · Effective Tax Rate: ${taxCalculation.effectiveTaxRate}%`,
      }}
      formulaCard={{
        introText: 'The formula to calculate net take-home pay is:',
        formulaText: 'Net Pay = Gross Salary − Pre-Tax Deductions − Federal Tax − FICA − State Tax',
        exampleTitle: '$85,000 Single Salary with $4,000 401(k) and 4.5% State Tax:',
        exampleSteps: [
          'Federal Income Tax = $8,906 · FICA (7.65%) = $6,503',
          'State Tax (4.5%) = $3,645 · Pre-Tax 401(k) = $4,000',
          'Net Annual Pay = $61,946 ($5,162 / month)',
        ],
      }}
      howToUseSteps={[
        'Select your tax filing status (Single or Married Filing Jointly).',
        'Enter your gross Annual Salary ($) in the first field.',
        'Enter your estimated State Tax Rate (%) and annual Pre-Tax Deductions ($).',
        'Review your net monthly paycheck, bi-weekly paycheck, and tax breakdown.',
      ]}
      howItWorks={{
        paragraph:
          'First, pre-tax deductions (like 401k and HSA) and the standard deduction ($15,000 Single / $30,000 Married) reduce your federal taxable income. Progressive IRS tax brackets, FICA payroll taxes (6.2% Social Security + 1.45% Medicare), and state taxes are then subtracted.',
        formulaBox: 'Net Take-Home = Gross − (Federal Tax + FICA + State Tax + Pre-Tax Deferrals)',
        closingNote:
          'Contributing to a pre-tax 401(k) or HSA lowers your taxable income and reduces your federal and state income tax bill.',
      }}
      understandingResult={{
        paragraph: (
          <>
            Out of a gross annual salary of{' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(grossAnnualSalary)}</strong>, you take home{' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(taxCalculation.netAnnual)}/year</strong> ({' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(taxCalculation.netMonthly)}/month</strong> or{' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(taxCalculation.netBiWeekly)} bi-weekly</strong>) after{' '}
            <strong className="font-bold text-[#152238]">{formatCurrency(taxCalculation.totalTaxes)}</strong> in combined federal, FICA, and state taxes.
          </>
        ),
      }}
      faqs={[
        {
          question: 'What is FICA tax on my paycheck?',
          answer:
            'FICA stands for Federal Insurance Contributions Act and consists of 6.2% for Social Security (up to the annual wage base cap) and 1.45% for Medicare (7.65% total employee share).',
        },
        {
          question: 'How do pre-tax deductions increase take-home efficiency?',
          answer:
            'Pre-tax contributions to a Traditional 401(k), 403(b), or HSA are deducted before federal and state income taxes are calculated, saving you your marginal tax rate on every dollar contributed.',
        },
        {
          question: 'Why are there 26 bi-weekly paychecks in a year?',
          answer:
            'Because a 52-week year divided by 2-week pay periods equals 26 paychecks per year (typically two months each year have three paychecks).',
        },
        {
          question: 'Which US states have zero state income tax?',
          answer:
            'Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming do not levy a broad state wage income tax (enter 0% for State Tax Rate).',
        },
      ]}
    />
  );
}
