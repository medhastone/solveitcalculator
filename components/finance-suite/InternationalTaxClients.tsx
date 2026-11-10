'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  calculateUkPaye,
  calculateCanadaIncomeTax,
  calculateIndiaIncomeTax,
  calculateHraExemption,
  calculateCountryTax,
} from '@/lib/finance-core/tax-payroll-business-engines';
import {
  UK_PAYE_DATA,
  VERIFIED_INTERNATIONAL_COUNTRIES,
} from '@/lib/finance-core/tax-payroll-business-data';
import {
  formatMoney,
  formatIndianRupees,
  SuiteSlider,
  VerifiedAuthorityBanner,
  RelatedCalculatorsGrid,
} from '@/components/calculator/FinanceSuitePrimitives';
import { useCurrency } from '@/lib/currency';

// ============================================================================
// #35: UK PAYE CALCULATOR (HMRC 2024/25 & 2025/26)
// ============================================================================
export function UkPayeClient() {
  useCurrency();
  const [grossSalary, setGrossSalary] = useState<number>(58000);
  const [pensionPct, setPensionPct] = useState<number>(5);
  const [pensionMethod, setPensionMethod] = useState<'salary_sacrifice' | 'net_pay' | 'relief_at_source'>('salary_sacrifice');
  const [studentLoanPlan, setStudentLoanPlan] = useState<keyof typeof UK_PAYE_DATA.studentLoanPlans>('none');
  const [isScotland, setIsScotland] = useState<boolean>(false);

  const res = useMemo(
    () =>
      calculateUkPaye({
        grossSalary,
        pensionPct,
        pensionMethod,
        studentLoanPlan,
        isScotland,
      }),
    [grossSalary, pensionPct, pensionMethod, studentLoanPlan, isScotland]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={res.source} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface">UK Tax Region</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsScotland(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  !isScotland ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                England, Wales &amp; NI
              </button>
              <button
                type="button"
                onClick={() => setIsScotland(true)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  isScotland ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                Scotland (6 Bands)
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="uk-gross">
                Annual Gross Salary (£)
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(grossSalary, '£')}</span>
            </div>
            <input
              id="uk-gross"
              type="number"
              min={0}
              step={1000}
              value={grossSalary}
              onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="UK Gross Salary"
              min={15000}
              max={200000}
              step={1000}
              value={grossSalary}
              onChange={setGrossSalary}
              minLabel="£15k"
              midLabel="£100k (£12,570 Taper)"
              maxLabel="£200k"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="uk-pension">
                Workplace Pension (%)
              </label>
              <input
                id="uk-pension"
                type="number"
                min={0}
                max={50}
                step={0.5}
                value={pensionPct}
                onChange={(e) => setPensionPct(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="uk-method">
                Pension Relief Method
              </label>
              <select
                id="uk-method"
                value={pensionMethod}
                onChange={(e) => setPensionMethod(e.target.value as 'salary_sacrifice' | 'net_pay' | 'relief_at_source')}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
              >
                <option value="salary_sacrifice">Salary Sacrifice (Saves NI)</option>
                <option value="net_pay">Net Pay Arrangement</option>
                <option value="relief_at_source">Relief at Source</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface" htmlFor="uk-loan">
              Student Loan Repayment Plan
            </label>
            <select
              id="uk-loan"
              value={studentLoanPlan}
              onChange={(e) => setStudentLoanPlan(e.target.value as keyof typeof UK_PAYE_DATA.studentLoanPlans)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
            >
              {Object.entries(UK_PAYE_DATA.studentLoanPlans).map(([key, plan]) => (
                <option key={key} value={key}>
                  {plan.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">NET TAKE-HOME / YEAR</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.netAnnual, '£')}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Personal Allowance: {formatMoney(res.personalAllowance, '£')}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">NET TAKE-HOME / MONTH</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {formatMoney(res.netMonthly, '£')}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Weekly: {formatMoney(res.netWeekly, '£')}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">EFFECTIVE TAX + NI</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.effectiveTaxAndNiRatePct.toFixed(1)}%
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Tax: {formatMoney(res.incomeTax, '£')} · NI: {formatMoney(res.nationalInsurance, '£')}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto pt-2 border-t border-outline-variant/40">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/50 text-on-surface-variant">
                    <th className="py-2">PAYE Item</th>
                    <th className="py-2 text-right">Annual</th>
                    <th className="py-2 text-right">Monthly</th>
                    <th className="py-2 text-right">Weekly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 font-mono">
                  <tr>
                    <td className="py-2.5 font-sans font-semibold text-on-surface">Gross Salary</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(res.gross, '£')}</td>
                    <td className="py-2.5 text-right">{formatMoney(res.gross / 12, '£')}</td>
                    <td className="py-2.5 text-right">{formatMoney(res.gross / 52, '£')}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans text-on-surface">Income Tax ({isScotland ? 'Scottish Bands' : 'rUK Bands'})</td>
                    <td className="py-2.5 text-right text-rose-600 dark:text-rose-400">-{formatMoney(res.incomeTax, '£')}</td>
                    <td className="py-2.5 text-right">-{formatMoney(res.incomeTax / 12, '£')}</td>
                    <td className="py-2.5 text-right">-{formatMoney(res.incomeTax / 52, '£')}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans text-on-surface">Class 1 National Insurance (8% / 2%)</td>
                    <td className="py-2.5 text-right text-amber-600 dark:text-amber-400">-{formatMoney(res.nationalInsurance, '£')}</td>
                    <td className="py-2.5 text-right">-{formatMoney(res.nationalInsurance / 12, '£')}</td>
                    <td className="py-2.5 text-right">-{formatMoney(res.nationalInsurance / 52, '£')}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans text-on-surface">Pension Contribution ({pensionPct}%)</td>
                    <td className="py-2.5 text-right text-teal-600 dark:text-teal-400">-{formatMoney(res.pensionContribution, '£')}</td>
                    <td className="py-2.5 text-right">-{formatMoney(res.pensionContribution / 12, '£')}</td>
                    <td className="py-2.5 text-right">-{formatMoney(res.pensionContribution / 52, '£')}</td>
                  </tr>
                  {res.studentLoan > 0 && (
                    <tr>
                      <td className="py-2.5 font-sans text-on-surface">Student Loan Repayment</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.studentLoan, '£')}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.studentLoan / 12, '£')}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.studentLoan / 52, '£')}</td>
                    </tr>
                  )}
                  <tr className="bg-result-highlight font-bold">
                    <td className="py-3 font-sans text-on-surface">Net Take-Home Pay</td>
                    <td className="py-3 text-right text-primary">{formatMoney(res.netAnnual, '£')}</td>
                    <td className="py-3 text-right text-primary">{formatMoney(res.netMonthly, '£')}</td>
                    <td className="py-3 text-right text-primary">{formatMoney(res.netWeekly, '£')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'Salary to Hourly Calculator',
            description: 'Convert annual pay across hourly, daily, weekly, and monthly periods.',
            href: '/finance/salary-to-hourly-calculator',
          },
          {
            title: 'Take-Home Pay Calculator',
            description: 'Compare net pay and paycheck deductions across global tax systems.',
            href: '/finance/take-home-pay-calculator',
          },
          {
            title: 'Pay Raise Calculator',
            description: 'Calculate your nominal and inflation-adjusted real salary increase.',
            href: '/finance/pay-raise-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #36: CANADA INCOME TAX CALCULATOR (CRA 2025: ONTARIO, BC, ALBERTA)
// ============================================================================
export function CanadaIncomeTaxClient() {
  useCurrency();
  const [province, setProvince] = useState<'ON' | 'BC' | 'AB'>('ON');
  const [grossIncome, setGrossIncome] = useState<number>(95000);
  const [rrspDeduction, setRrspDeduction] = useState<number>(5000);

  const res = useMemo(
    () =>
      calculateCanadaIncomeTax({
        province,
        grossIncome,
        rrspDeduction,
      }),
    [province, grossIncome, rrspDeduction]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={res.source} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface">Province (2025 CRA Verified)</label>
            <div className="grid grid-cols-3 gap-2">
              {(['ON', 'BC', 'AB'] as const).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => setProvince(prov)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    province === prov ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {prov === 'ON' ? 'Ontario' : prov === 'BC' ? 'British Columbia' : 'Alberta'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Note: Quebec (Revenu Québec / QPP / QPIP) is administered under separate provincial rules.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="ca-gross">
                Annual Gross Employment Income (C$)
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(grossIncome, 'C$')}</span>
            </div>
            <input
              id="ca-gross"
              type="number"
              min={0}
              step={1000}
              value={grossIncome}
              onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Canada Gross Income"
              min={20000}
              max={300000}
              step={2500}
              value={grossIncome}
              onChange={setGrossIncome}
              minLabel="C$20k"
              midLabel="C$150k"
              maxLabel="C$300k"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="ca-rrsp">
                RRSP / FHSA Pre-Tax Deduction (C$)
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(rrspDeduction, 'C$')}</span>
            </div>
            <input
              id="ca-rrsp"
              type="number"
              min={0}
              max={32490}
              step={500}
              value={rrspDeduction}
              onChange={(e) => setRrspDeduction(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="RRSP Deduction"
              min={0}
              max={32490}
              step={500}
              value={rrspDeduction}
              onChange={setRrspDeduction}
              minLabel="C$0"
              midLabel="C$16k"
              maxLabel="C$32,490 (2025 Limit)"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">NET ANNUAL INCOME</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.netAnnual, 'C$')}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Monthly: {formatMoney(res.netMonthly, 'C$')}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">MARGINAL &amp; AVG RATE</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.combinedMarginalRatePct.toFixed(2)}%
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Average Rate: {res.averageTaxRatePct.toFixed(1)}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">2025 CPP + CPP2 + EI</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {formatMoney(res.totalCpp + res.eiContribution, 'C$')}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  CPP/CPP2: {formatMoney(res.totalCpp, 'C$')} · EI: {formatMoney(res.eiContribution, 'C$')}
                </span>
              </div>
            </div>

            <div className="divide-y divide-outline-variant/30 text-xs font-mono pt-2 border-t border-outline-variant/40">
              <div className="py-2.5 flex justify-between">
                <span className="font-sans text-on-surface">Federal Income Tax (after $16,129 BPA credit)</span>
                <span className="font-bold">{formatMoney(res.federalTax, 'C$')}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-sans text-on-surface">{res.provinceProfile.name} Provincial Tax</span>
                <span className="font-bold">{formatMoney(res.provincialTax, 'C$')}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-sans text-on-surface">Base CPP (5.95% up to $71,300 YMPE)</span>
                <span>{formatMoney(res.cpp1Contribution, 'C$')}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-sans text-on-surface">Second Additional CPP2 (4% from $71,300 to $81,200 YAMPE)</span>
                <span>{formatMoney(res.cpp2Contribution, 'C$')}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-sans text-on-surface">Employment Insurance EI (1.64% up to $65,700 MIE)</span>
                <span>{formatMoney(res.eiContribution, 'C$')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'Salary to Hourly Calculator',
            description: 'Convert annual salary into bi-weekly, weekly, daily, and hourly pay periods.',
            href: '/finance/salary-to-hourly-calculator',
          },
          {
            title: 'Compound Interest & Savings Calculator',
            description: 'Plan monthly contributions to reach your TFSA, FHSA, or RRSP target balance.',
            href: '/compound-interest-calculator',
          },
          {
            title: 'Pay Raise Calculator',
            description: 'Calculate the net impact of a salary raise after inflation.',
            href: '/finance/pay-raise-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #37: INDIA INCOME TAX CALCULATOR (NEW VS OLD REGIME)
// ============================================================================
export function IndiaIncomeTaxClient() {
  useCurrency();
  const [financialYear, setFinancialYear] = useState<'2025-26' | '2024-25'>('2025-26');
  const [ageBand, setAgeBand] = useState<'under60' | 'senior60to79' | 'superSenior80Plus'>('under60');
  const [grossSalary, setGrossSalary] = useState<number>(1500000);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [deduction80C, setDeduction80C] = useState<number>(150000);
  const [deduction80D, setDeduction80D] = useState<number>(25000);
  const [hraExemption, setHraExemption] = useState<number>(180000);
  const [homeLoanInterest24b, setHomeLoanInterest24b] = useState<number>(0);
  const [npsExtra80CCD1B, setNpsExtra80CCD1B] = useState<number>(50000);
  const [employerNps80CCD2, setEmployerNps80CCD2] = useState<number>(0);

  const res = useMemo(
    () =>
      calculateIndiaIncomeTax({
        financialYear,
        ageBand,
        grossSalary,
        otherIncome,
        deduction80C,
        deduction80D,
        hraExemption,
        homeLoanInterest24b,
        npsExtra80CCD1B,
        employerNps80CCD2,
      }),
    [
      financialYear,
      ageBand,
      grossSalary,
      otherIncome,
      deduction80C,
      deduction80D,
      hraExemption,
      homeLoanInterest24b,
      npsExtra80CCD1B,
      employerNps80CCD2,
    ]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={res.source} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-fy">
                Financial Year
              </label>
              <select
                id="in-fy"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value as '2025-26' | '2024-25')}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
              >
                <option value="2025-26">FY 2025-26 (AY 2026-27 Budget 2025)</option>
                <option value="2024-25">FY 2024-25 (AY 2025-26)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-age">
                Taxpayer Age Band
              </label>
              <select
                id="in-age"
                value={ageBand}
                onChange={(e) => setAgeBand(e.target.value as 'under60' | 'senior60to79' | 'superSenior80Plus')}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
              >
                <option value="under60">Below 60 Years</option>
                <option value="senior60to79">Senior Citizen (60–79)</option>
                <option value="superSenior80Plus">Super Senior (80+)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="in-sal">
                Annual Gross Salary (₹)
              </label>
              <span className="font-mono font-bold text-primary">{formatIndianRupees(grossSalary)}</span>
            </div>
            <input
              id="in-sal"
              type="number"
              min={0}
              step={50000}
              value={grossSalary}
              onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="India Annual Gross Salary"
              min={300000}
              max={5000000}
              step={50000}
              value={grossSalary}
              onChange={setGrossSalary}
              minLabel="₹3L"
              midLabel="₹12.75L (Tax-Free New)"
              maxLabel="₹50L"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-80c">
                Sec 80C (Max ₹1.5L)
              </label>
              <input
                id="in-80c"
                type="number"
                min={0}
                max={150000}
                step={10000}
                value={deduction80C}
                onChange={(e) => setDeduction80C(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-80d">
                Sec 80D Health Ins.
              </label>
              <input
                id="in-80d"
                type="number"
                min={0}
                max={100000}
                step={5000}
                value={deduction80D}
                onChange={(e) => setDeduction80D(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-hra">
                Exempt HRA (Sec 10(13A))
              </label>
              <input
                id="in-hra"
                type="number"
                min={0}
                step={10000}
                value={hraExemption}
                onChange={(e) => setHraExemption(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-24b">
                Home Loan Int. (Sec 24b)
              </label>
              <input
                id="in-24b"
                type="number"
                min={0}
                max={200000}
                step={10000}
                value={homeLoanInterest24b}
                onChange={(e) => setHomeLoanInterest24b(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-nps">
                NPS 80CCD(1B) (Max ₹50k)
              </label>
              <input
                id="in-nps"
                type="number"
                min={0}
                max={50000}
                step={5000}
                value={npsExtra80CCD1B}
                onChange={(e) => setNpsExtra80CCD1B(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-emp-nps">
                Employer NPS 80CCD(2)
              </label>
              <input
                id="in-emp-nps"
                type="number"
                min={0}
                step={10000}
                value={employerNps80CCD2}
                onChange={(e) => setEmployerNps80CCD2(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            {/* Neutral Regime Comparison Summary */}
            <div className="p-4 rounded-xl bg-result-highlight border border-primary/20 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">
                  REGIME COMPARISON RESULT (UNDER ENTERED NUMBERS)
                </span>
                <div className="text-xl font-extrabold text-primary mt-0.5">
                  {res.recommendedRegime === 'Equal Tax in Both'
                    ? 'Both Regimes Result in Identical Tax Liability'
                    : `${res.recommendedRegime} Has Lower Tax by ${formatIndianRupees(res.taxSavings)}/yr`}
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-on-surface">
                Break-Even Old Deductions: {formatIndianRupees(res.totalDeductionsNeededForOldToWin)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Regime Card */}
              <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/60 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-on-surface">New Regime (Sec 115BAC)</h3>
                  <span className="text-xs font-mono text-primary font-bold">Std Ded: ₹75,000</span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-on-surface">
                  {formatIndianRupees(res.newRegime.totalTax)}
                  <span className="text-xs font-normal text-on-surface-variant block">Total Annual Tax (incl. 4% Cess)</span>
                </div>
                <div className="text-xs space-y-1 pt-2 border-t border-outline-variant/40 font-mono">
                  <div className="flex justify-between">
                    <span className="font-sans text-on-surface-variant">Taxable Income:</span>
                    <span>{formatIndianRupees(res.newRegime.taxableIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-on-surface-variant">Monthly Take-Home:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {formatIndianRupees(res.newRegime.netTakeHomeMonthly)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Old Regime Card */}
              <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/60 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-on-surface">Old Tax Regime</h3>
                  <span className="text-xs font-mono text-on-surface-variant font-bold">Std Ded: ₹50,000</span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-on-surface">
                  {formatIndianRupees(res.oldRegime.totalTax)}
                  <span className="text-xs font-normal text-on-surface-variant block">Total Annual Tax (incl. 4% Cess)</span>
                </div>
                <div className="text-xs space-y-1 pt-2 border-t border-outline-variant/40 font-mono">
                  <div className="flex justify-between">
                    <span className="font-sans text-on-surface-variant">Total Deductions Claimed:</span>
                    <span>{formatIndianRupees(res.oldRegime.deductions)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-on-surface-variant">Monthly Take-Home:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {formatIndianRupees(res.oldRegime.netTakeHomeMonthly)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plain Guide: What's Allowed in Each Regime */}
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/50 space-y-2 text-xs">
              <h4 className="font-bold text-on-surface">Plain Guide: What Is Allowed in Each Regime?</h4>
              <p className="text-on-surface-variant">
                • <strong>Allowed in New Regime (Sec 115BAC):</strong> ₹75,000 Standard Deduction for salaried employees,
                Employer NPS contribution u/s 80CCD(2), and Section 87A full tax rebate up to{' '}
                {financialYear === '2025-26' ? '₹12,00,000' : '₹7,00,000'} taxable income.
              </p>
              <p className="text-on-surface-variant">
                • <strong>Allowed Only in Old Regime:</strong> ₹50,000 Standard Deduction, Section 80C (EPF/PPF/ELSS up to
                ₹1.5L), Section 80D (Health Insurance), HRA Exemption u/s 10(13A), Home Loan Interest u/s 24(b) (up to
                ₹2L), and Employee voluntary NPS u/s 80CCD(1B) (up to ₹50,000).
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'HRA Exemption Calculator',
            description: 'Calculate exact exempt and taxable House Rent Allowance under Section 10(13A) Rule 2A.',
            href: '/finance/hra-exemption-calculator',
          },
          {
            title: 'In-Hand Salary Calculator (India CTC)',
            description: 'Break down your annual CTC into monthly in-hand salary after PF, Professional Tax, and TDS.',
            href: '/finance/in-hand-salary-calculator',
          },
          {
            title: 'Compound Interest & SIP Calculator',
            description: 'Model systematic mutual fund and ELSS tax-saving investments.',
            href: '/compound-interest-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #38: HRA EXEMPTION CALCULATOR (SECTION 10(13A) RULE 2A)
// ============================================================================
export function HraExemptionClient() {
  useCurrency();
  const [basicSalaryAnnual, setBasicSalaryAnnual] = useState<number>(720000);
  const [dearnessAllowanceAnnual, setDearnessAllowanceAnnual] = useState<number>(0);
  const [hraReceivedAnnual, setHraReceivedAnnual] = useState<number>(360000);
  const [rentPaidAnnual, setRentPaidAnnual] = useState<number>(300000);
  const [isMetroCity, setIsMetroCity] = useState<boolean>(true);

  const res = useMemo(
    () =>
      calculateHraExemption({
        basicSalaryAnnual,
        dearnessAllowanceAnnual,
        hraReceivedAnnual,
        rentPaidAnnual,
        isMetroCity,
      }),
    [basicSalaryAnnual, dearnessAllowanceAnnual, hraReceivedAnnual, rentPaidAnnual, isMetroCity]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={res.source} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface">City Category (Rule 2A)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsMetroCity(true)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  isMetroCity ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                Metro (50% of Basic+DA)
              </button>
              <button
                type="button"
                onClick={() => setIsMetroCity(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  !isMetroCity ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                Non-Metro (40% of Basic+DA)
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Statutory Metro Cities: {res.metroCities.join(', ')}. Note: HRA exemption is available under the Old Tax Regime only.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="hra-basic">Basic Salary (Annual ₹)</label>
              <span className="font-mono text-primary">{formatIndianRupees(basicSalaryAnnual)}</span>
            </div>
            <input
              id="hra-basic"
              type="number"
              min={0}
              step={25000}
              value={basicSalaryAnnual}
              onChange={(e) => setBasicSalaryAnnual(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Annual Basic Salary"
              min={120000}
              max={3000000}
              step={20000}
              value={basicSalaryAnnual}
              onChange={setBasicSalaryAnnual}
              minLabel="₹1.2L"
              midLabel="₹15L"
              maxLabel="₹30L"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="hra-da">
                Dearness Allowance (DA ₹/yr)
              </label>
              <input
                id="hra-da"
                type="number"
                min={0}
                step={10000}
                value={dearnessAllowanceAnnual}
                onChange={(e) => setDearnessAllowanceAnnual(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="hra-rec">
                Actual HRA Received (₹/yr)
              </label>
              <input
                id="hra-rec"
                type="number"
                min={0}
                step={10000}
                value={hraReceivedAnnual}
                onChange={(e) => setHraReceivedAnnual(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="hra-rent">Actual Rent Paid (Annual ₹)</label>
              <span className="font-mono text-primary">{formatIndianRupees(rentPaidAnnual)}</span>
            </div>
            <input
              id="hra-rent"
              type="number"
              min={0}
              step={12000}
              value={rentPaidAnnual}
              onChange={(e) => setRentPaidAnnual(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Annual Rent Paid"
              min={0}
              max={1500000}
              step={12000}
              value={rentPaidAnnual}
              onChange={setRentPaidAnnual}
              minLabel="₹0"
              midLabel="₹6L"
              maxLabel="₹15L"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">TAX-EXEMPT HRA (ANNUAL / MONTHLY)</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatIndianRupees(res.exemptHraAnnual)}/yr
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  {formatIndianRupees(res.exemptHraMonthly)} / month exempt
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">TAXABLE HRA ADDED TO SALARY</span>
                <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400 mt-1">
                  {formatIndianRupees(res.taxableHraAnnual)}/yr
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  {formatIndianRupees(res.taxableHraMonthly)} / month taxable
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-outline-variant/40 text-xs">
              <h3 className="text-sm font-bold text-on-surface">
                Which of the 3 Section 10(13A) Limits Applied? (Minimum Wins)
              </h3>
              <div className="space-y-2 font-mono">
                <div className={`p-3 rounded-xl border flex justify-between items-center ${res.exemptHraAnnual === res.limit1ActualHra ? 'bg-result-highlight border-primary font-bold' : 'bg-surface border-outline-variant/40'}`}>
                  <span className="font-sans">1. Actual HRA Received</span>
                  <span>{formatIndianRupees(res.limit1ActualHra)}</span>
                </div>
                <div className={`p-3 rounded-xl border flex justify-between items-center ${res.exemptHraAnnual === res.limit2RentMinus10Pct ? 'bg-result-highlight border-primary font-bold' : 'bg-surface border-outline-variant/40'}`}>
                  <span className="font-sans">2. Actual Rent Paid minus 10% of (Basic + DA)</span>
                  <span>{formatIndianRupees(res.limit2RentMinus10Pct)}</span>
                </div>
                <div className={`p-3 rounded-xl border flex justify-between items-center ${res.exemptHraAnnual === res.limit3MetroPct ? 'bg-result-highlight border-primary font-bold' : 'bg-surface border-outline-variant/40'}`}>
                  <span className="font-sans">3. {isMetroCity ? '50% of (Basic + DA) [Metro]' : '40% of (Basic + DA) [Non-Metro]'}</span>
                  <span>{formatIndianRupees(res.limit3MetroPct)}</span>
                </div>
              </div>
              <p className="text-on-surface-variant">
                Governing Limit Applied: <strong className="text-on-surface">{res.governingRuleLabel}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'India Income Tax Calculator (New vs Old)',
            description: 'Feed your exempt HRA directly into the Old vs. New Tax Regime comparison.',
            href: '/finance/india-income-tax-calculator',
          },
          {
            title: 'In-Hand Salary Calculator (India)',
            description: 'Compute monthly take-home pay from your CTC package.',
            href: '/finance/in-hand-salary-calculator',
          },
          {
            title: 'Salary to Hourly Calculator',
            description: 'Convert annual compensation across all pay periods.',
            href: '/finance/salary-to-hourly-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #39: VERIFIED COUNTRY TAX PAGE TEMPLATE (GERMANY, FRANCE, UAE, SINGAPORE)
// ============================================================================
export function CountryTaxTemplateClient({
  initialCountrySlug = 'germany',
}: {
  initialCountrySlug?: 'germany' | 'france' | 'uae' | 'singapore';
}) {
  useCurrency();
  const [countrySlug, setCountrySlug] = useState<'germany' | 'france' | 'uae' | 'singapore'>(initialCountrySlug);
  const [grossIncome, setGrossIncome] = useState<number>(85000);
  const [isMarriedSplitting, setIsMarriedSplitting] = useState<boolean>(false);
  const [optionalDeductions, setOptionalDeductions] = useState<number>(0);
  const [includeChurchOrNationalPension, setIncludeChurchOrNationalPension] = useState<boolean>(true);

  const res = useMemo(
    () =>
      calculateCountryTax({
        countrySlug,
        grossIncome,
        isMarriedSplitting,
        optionalDeductions,
        includeChurchOrNationalPension,
      }),
    [countrySlug, grossIncome, isMarriedSplitting, optionalDeductions, includeChurchOrNationalPension]
  );

  const sym = res.profile.currencySymbol;

  return (
    <div className="space-y-8">
      {/* Official Authority & Reviewer Verification Banner */}
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-on-surface">
            Official Authority: {res.profile.authorityName} ({res.profile.taxYear})
          </span>
          <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
            Verified: {res.profile.dateVerified} · Reviewed by: {res.profile.reviewerName}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-on-surface-variant">
          <span>Filing Deadline: {res.profile.filingDeadline}</span>
          <a
            href={res.profile.authorityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            Official Tax Authority Portal →
          </a>
        </div>
      </div>

      {/* Country Switcher */}
      <div className="flex flex-wrap gap-2">
        {(['germany', 'france', 'uae', 'singapore'] as const).map((slug) => {
          const c = VERIFIED_INTERNATIONAL_COUNTRIES[slug];
          return (
            <Link
              key={slug}
              href={`/finance/${slug}-income-tax-calculator`}
              onClick={() => setCountrySlug(slug)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                countrySlug === slug
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {c.countryName} ({c.currencyCode})
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="ct-gross">
                Annual Gross Salary ({sym.trim()})
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(grossIncome, sym)}</span>
            </div>
            <input
              id="ct-gross"
              type="number"
              min={0}
              step={2500}
              value={grossIncome}
              onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Annual Gross Income"
              min={20000}
              max={300000}
              step={2500}
              value={grossIncome}
              onChange={setGrossIncome}
              minLabel={`${sym}20k`}
              midLabel={`${sym}150k`}
              maxLabel={`${sym}300k`}
            />
          </div>

          {(countrySlug === 'germany' || countrySlug === 'france') && (
            <label className="flex items-center gap-2 pt-2 border-t border-outline-variant/40 text-xs text-on-surface cursor-pointer">
              <input
                type="checkbox"
                checked={isMarriedSplitting}
                onChange={(e) => setIsMarriedSplitting(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              <span>
                {countrySlug === 'germany'
                  ? 'Married Joint Assessment (Ehegattensplitting / Steuerklasse III-V)'
                  : 'Married / Pacsé Joint Household (Quotient Familial 2 Parts)'}
              </span>
            </label>
          )}

          <label className="flex items-center gap-2 pt-2 border-t border-outline-variant/40 text-xs text-on-surface cursor-pointer">
            <input
              type="checkbox"
              checked={includeChurchOrNationalPension}
              onChange={(e) => setIncludeChurchOrNationalPension(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span>
              {countrySlug === 'germany'
                ? 'Include 9% Church Tax (Kirchensteuer)'
                : countrySlug === 'uae'
                ? 'UAE / GCC National (5% Employee GPSSA Pension Contribution)'
                : countrySlug === 'singapore'
                ? 'Singapore Citizen / PR (20% Employee CPF Contribution)'
                : 'Include Mandatory Supplementary Social Contributions'}
            </span>
          </label>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">NET ANNUAL SALARY</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.netAnnual, sym)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Monthly: {formatMoney(res.netMonthly, sym)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">INCOME TAX + SOCIAL</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {formatMoney(res.totalDeductions, sym)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Tax: {formatMoney(res.incomeTax, sym)} · Social: {formatMoney(res.socialContributions, sym)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">EFFECTIVE / MARGINAL</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {res.effectiveRatePct.toFixed(1)}%
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Top Income Tax Rate: {res.marginalRatePct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-outline-variant/50 space-y-2 text-xs">
              <h4 className="font-bold text-on-surface">What Is Not Included in This Statutory Schedule:</h4>
              <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
                {res.profile.notIncludedNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'UK PAYE Tax Calculator',
            description: 'HMRC Income Tax, Personal Allowance taper, and Class 1 National Insurance.',
            href: '/finance/uk-paye-calculator',
          },
          {
            title: 'Canada Income Tax Calculator',
            description: 'CRA Federal and Provincial tax brackets, CPP/CPP2, and EI contributions.',
            href: '/finance/canada-income-tax-calculator',
          },
          {
            title: 'Salary to Hourly Calculator',
            description: 'Convert annual compensation into hourly, daily, weekly, and monthly rates.',
            href: '/finance/salary-to-hourly-calculator',
          },
        ]}
      />
    </div>
  );
}
