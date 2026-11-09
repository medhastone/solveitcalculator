'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Percent,
  Calendar,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  Scale,
  Receipt,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  calculateUsStateTakeHome,
  calculateSelfEmploymentTax,
  calculateUsCapitalGains,
  calculateIndiaCapitalGains,
  calculate1099VsW2,
} from '@/lib/finance-core/tax-payroll-business-engines';
import {
  US_FICA_2025,
  US_STATE_TAX_PROFILES_2025,
} from '@/lib/finance-core/tax-payroll-business-data';
import type { UsFilingStatus } from '@/lib/finance-core/us-federal-tax';
import {
  formatMoney,
  formatIndianRupees,
  SuiteSlider,
  VerifiedAuthorityBanner,
  RelatedCalculatorsGrid,
} from '@/components/calculator/FinanceSuitePrimitives';

// ============================================================================
// #31: US STATE TAKE-HOME CALCULATOR ("PAYCHECK CALCULATOR")
// ============================================================================
export function UsStateTakeHomeClient() {
  const [stateCode, setStateCode] = useState<string>('CA');
  const [annualSalary, setAnnualSalary] = useState<number>(115000);
  const [payFrequency, setPayFrequency] = useState<'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'annual'>('biweekly');
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');
  const [preTax401k, setPreTax401k] = useState<number>(6900);
  const [preTaxHsaAndHealth, setPreTaxHsaAndHealth] = useState<number>(2400);

  const res = useMemo(
    () =>
      calculateUsStateTakeHome({
        stateCode,
        annualSalary,
        payFrequency,
        filingStatus,
        preTax401k,
        preTaxHsaAndHealth,
      }),
    [stateCode, annualSalary, payFrequency, filingStatus, preTax401k, preTaxHsaAndHealth]
  );

  const priorityStates = ['CA', 'NY', 'TX', 'FL', 'WA'];
  const allStateKeys = Object.keys(US_STATE_TAX_PROFILES_2025);

  const grossSafe = Math.max(1, res.grossAnnual);
  const netPct = (res.netAnnual / grossSafe) * 100;
  const fedPct = (res.federalTax / grossSafe) * 100;
  const ficaPct = (res.totalFica / grossSafe) * 100;
  const statePct = ((res.stateIncomeTax + res.statePayrollTotal) / grossSafe) * 100;
  const preTaxPct = (res.totalPreTax / grossSafe) * 100;

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={US_FICA_2025.source} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface" htmlFor="state-select">
              State of Employment (Priority States First)
            </label>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {priorityStates.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setStateCode(code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    stateCode === code
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {code} ({US_STATE_TAX_PROFILES_2025[code].name})
                </button>
              ))}
            </div>
            <select
              id="state-select"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface"
            >
              {allStateKeys.map((code) => {
                const st = US_STATE_TAX_PROFILES_2025[code];
                return (
                  <option key={code} value={code}>
                    {st.name} ({st.code}) — {st.hasIncomeTax ? 'State Income Tax' : '0% State Income Tax'}
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-on-surface-variant">{res.stateProfile.source}</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="paycheck-salary">
                Annual Gross Salary
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(annualSalary)}</span>
            </div>
            <input
              id="paycheck-salary"
              type="number"
              min={0}
              step={1000}
              value={annualSalary}
              onChange={(e) => setAnnualSalary(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Annual Gross Salary"
              min={20000}
              max={400000}
              step={2500}
              value={annualSalary}
              onChange={setAnnualSalary}
              minLabel="$20k"
              midLabel="$200k"
              maxLabel="$400k"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="pay-freq">
                Pay Frequency
              </label>
              <select
                id="pay-freq"
                value={payFrequency}
                onChange={(e) => setPayFrequency(e.target.value as 'biweekly' | 'semimonthly' | 'monthly' | 'weekly' | 'annual')}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
              >
                <option value="biweekly">Bi-Weekly (26 checks/yr)</option>
                <option value="semimonthly">Semi-Monthly (24 checks/yr)</option>
                <option value="monthly">Monthly (12 checks/yr)</option>
                <option value="weekly">Weekly (52 checks/yr)</option>
                <option value="annual">Annual (1 lump sum)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="paycheck-status">
                Filing Status
              </label>
              <select
                id="paycheck-status"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as UsFilingStatus)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
              >
                <option value="single">Single</option>
                <option value="marriedFilingJointly">Married Filing Jointly</option>
                <option value="headOfHousehold">Head of Household</option>
                <option value="marriedFilingSeparately">Married Filing Separately</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="pretax-401k">
                Pre-Tax 401(k) / 403(b) Contribution ($/yr)
              </label>
              <span className="font-mono text-xs font-bold text-primary">{formatMoney(preTax401k)}</span>
            </div>
            <input
              id="pretax-401k"
              type="number"
              min={0}
              max={34750}
              step={500}
              value={preTax401k}
              onChange={(e) => setPreTax401k(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Pre-Tax 401k Contribution"
              min={0}
              max={23500}
              step={500}
              value={preTax401k}
              onChange={setPreTax401k}
              minLabel="$0"
              midLabel="$11,750"
              maxLabel="$23,500 (2025 Limit)"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="pretax-health">
                Pre-Tax Health Insurance &amp; HSA ($/yr)
              </label>
              <span className="font-mono text-xs font-bold text-primary">{formatMoney(preTaxHsaAndHealth)}</span>
            </div>
            <input
              id="pretax-health"
              type="number"
              min={0}
              step={250}
              value={preTaxHsaAndHealth}
              onChange={(e) => setPreTaxHsaAndHealth(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Pre-Tax Health and HSA"
              min={0}
              max={15000}
              step={250}
              value={preTaxHsaAndHealth}
              onChange={setPreTaxHsaAndHealth}
              minLabel="$0"
              midLabel="$7,500"
              maxLabel="$15,000"
            />
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">
                  NET TAKE-HOME PER PAYCHECK ({payFrequency.toUpperCase()})
                </span>
                <div className="text-3xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.netPerPaycheck)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Gross per paycheck: {formatMoney(res.grossPerPaycheck)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">
                  ANNUAL NET TAKE-HOME PAY
                </span>
                <div className="text-3xl font-extrabold font-mono text-on-surface mt-1">
                  {formatMoney(res.netAnnual)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Effective Total Tax Rate: {res.effectiveTaxRatePct.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Pay Period Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-surface border border-outline-variant/50">
                <span className="text-xs text-on-surface-variant block">Per Year</span>
                <span className="font-mono font-bold text-on-surface">{formatMoney(res.netAnnual)}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-outline-variant/50">
                <span className="text-xs text-on-surface-variant block">Per Month</span>
                <span className="font-mono font-bold text-on-surface">{formatMoney(res.netMonthly)}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-outline-variant/50">
                <span className="text-xs text-on-surface-variant block">Bi-Weekly (26)</span>
                <span className="font-mono font-bold text-on-surface">{formatMoney(res.netBiWeekly)}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-outline-variant/50">
                <span className="text-xs text-on-surface-variant block">Hourly (2,080h)</span>
                <span className="font-mono font-bold text-on-surface">{formatMoney(res.netHourly, '$', 2)}/hr</span>
              </div>
            </div>

            {/* Stacked Bar of Where the Money Goes */}
            <div className="space-y-3 pt-2 border-t border-outline-variant/40">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-on-surface">Where Your Gross Paycheck Goes</h3>
                <span className="text-xs font-mono text-on-surface-variant">
                  {netPct.toFixed(1)}% Take-Home
                </span>
              </div>
              <div className="w-full h-5 rounded-full overflow-hidden flex bg-surface-container-high">
                <div
                  style={{ width: `${netPct}%` }}
                  className="bg-emerald-600 h-full"
                  title={`Net Take-Home: ${netPct.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${fedPct}%` }}
                  className="bg-blue-600 h-full"
                  title={`Federal Tax: ${fedPct.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${ficaPct}%` }}
                  className="bg-amber-500 h-full"
                  title={`FICA: ${ficaPct.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${statePct}%` }}
                  className="bg-rose-500 h-full"
                  title={`State Tax & SDI: ${statePct.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${preTaxPct}%` }}
                  className="bg-teal-500 h-full"
                  title={`Pre-Tax 401k/HSA: ${preTaxPct.toFixed(1)}%`}
                />
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant/50 text-on-surface-variant">
                      <th className="py-2">Paycheck Component</th>
                      <th className="py-2 text-right">Annual</th>
                      <th className="py-2 text-right">Monthly</th>
                      <th className="py-2 text-right">Bi-Weekly</th>
                      <th className="py-2 text-right">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 font-mono">
                    <tr>
                      <td className="py-2.5 font-sans font-semibold text-on-surface">Gross Salary</td>
                      <td className="py-2.5 text-right font-bold">{formatMoney(res.grossAnnual)}</td>
                      <td className="py-2.5 text-right">{formatMoney(res.grossAnnual / 12)}</td>
                      <td className="py-2.5 text-right">{formatMoney(res.grossAnnual / 26)}</td>
                      <td className="py-2.5 text-right">100.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans text-on-surface">Federal Income Tax ({res.federalMarginalRate}% top bracket)</td>
                      <td className="py-2.5 text-right text-rose-600 dark:text-rose-400">-{formatMoney(res.federalTax)}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.federalTax / 12)}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.federalTax / 26)}</td>
                      <td className="py-2.5 text-right">{fedPct.toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans text-on-surface">Social Security (6.2% up to $176,100 cap)</td>
                      <td className="py-2.5 text-right text-amber-600 dark:text-amber-400">-{formatMoney(res.socialSecurityTax)}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.socialSecurityTax / 12)}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.socialSecurityTax / 26)}</td>
                      <td className="py-2.5 text-right">{((res.socialSecurityTax / grossSafe) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans text-on-surface">Medicare (1.45% + 0.9% Surtax over threshold)</td>
                      <td className="py-2.5 text-right text-amber-600 dark:text-amber-400">-{formatMoney(res.medicareTax)}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.medicareTax / 12)}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.medicareTax / 26)}</td>
                      <td className="py-2.5 text-right">{((res.medicareTax / grossSafe) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans text-on-surface">{res.stateProfile.name} State Income Tax</td>
                      <td className="py-2.5 text-right text-rose-600 dark:text-rose-400">-{formatMoney(res.stateIncomeTax)}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.stateIncomeTax / 12)}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.stateIncomeTax / 26)}</td>
                      <td className="py-2.5 text-right">{((res.stateIncomeTax / grossSafe) * 100).toFixed(1)}%</td>
                    </tr>
                    {res.statePayrollBreakdown.map((item) => (
                      <tr key={item.name}>
                        <td className="py-2.5 font-sans text-on-surface">{item.name}</td>
                        <td className="py-2.5 text-right text-rose-600 dark:text-rose-400">-{formatMoney(item.amount)}</td>
                        <td className="py-2.5 text-right">-{formatMoney(item.amount / 12)}</td>
                        <td className="py-2.5 text-right">-{formatMoney(item.amount / 26)}</td>
                        <td className="py-2.5 text-right">{((item.amount / grossSafe) * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-2.5 font-sans text-on-surface">Pre-Tax 401(k) &amp; Health/HSA</td>
                      <td className="py-2.5 text-right text-teal-600 dark:text-teal-400">-{formatMoney(res.totalPreTax)}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.totalPreTax / 12)}</td>
                      <td className="py-2.5 text-right">-{formatMoney(res.totalPreTax / 26)}</td>
                      <td className="py-2.5 text-right">{preTaxPct.toFixed(1)}%</td>
                    </tr>
                    <tr className="bg-result-highlight font-bold">
                      <td className="py-3 font-sans text-on-surface">Net Take-Home Pay</td>
                      <td className="py-3 text-right text-primary">{formatMoney(res.netAnnual)}</td>
                      <td className="py-3 text-right text-primary">{formatMoney(res.netMonthly)}</td>
                      <td className="py-3 text-right text-primary">{formatMoney(res.netBiWeekly)}</td>
                      <td className="py-3 text-right text-primary">{netPct.toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'US Federal Income Tax Calculator',
            description: 'Deep-dive into IRS progressive brackets, standard vs. itemized deductions, and tax credits.',
            href: '/finance/us-federal-income-tax-calculator',
          },
          {
            title: '401(k) Retirement & Match Calculator',
            description: 'Model how pre-tax 401(k) deferrals lower your paycheck tax while capturing full employer matching.',
            href: '/finance/401k-calculator',
          },
          {
            title: 'Salary to Hourly Calculator',
            description: 'Convert annual pay across hourly, daily, weekly, bi-weekly, and semi-monthly schedules.',
            href: '/finance/salary-to-hourly-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #32: SELF-EMPLOYMENT TAX CALCULATOR (IRS SCHEDULE SE & 1040-ES)
// ============================================================================
export function SelfEmploymentTaxClient() {
  const [netBusinessProfit, setNetBusinessProfit] = useState<number>(110000);
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');
  const [otherW2Wages, setOtherW2Wages] = useState<number>(0);

  const res = useMemo(
    () =>
      calculateSelfEmploymentTax({
        netBusinessProfit,
        filingStatus,
        otherW2Wages,
      }),
    [netBusinessProfit, filingStatus, otherW2Wages]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={res.source} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="se-profit">
                Net Business Profit (Schedule C)
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(netBusinessProfit)}</span>
            </div>
            <input
              id="se-profit"
              type="number"
              min={0}
              step={1000}
              value={netBusinessProfit}
              onChange={(e) => setNetBusinessProfit(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Net Business Profit"
              min={5000}
              max={350000}
              step={2500}
              value={netBusinessProfit}
              onChange={setNetBusinessProfit}
              minLabel="$5k"
              midLabel="$175k"
              maxLabel="$350k"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <label className="block text-sm font-bold text-on-surface" htmlFor="se-status">
              IRS Filing Status
            </label>
            <select
              id="se-status"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as UsFilingStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface"
            >
              <option value="single">Single</option>
              <option value="marriedFilingJointly">Married Filing Jointly</option>
              <option value="headOfHousehold">Head of Household</option>
              <option value="marriedFilingSeparately">Married Filing Separately</option>
            </select>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="se-w2">
                Other W-2 Wages (Reduces $176,100 SS Cap)
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(otherW2Wages)}</span>
            </div>
            <input
              id="se-w2"
              type="number"
              min={0}
              step={1000}
              value={otherW2Wages}
              onChange={(e) => setOtherW2Wages(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Other W-2 Wages"
              min={0}
              max={220000}
              step={2500}
              value={otherW2Wages}
              onChange={setOtherW2Wages}
              minLabel="$0"
              midLabel="$110k"
              maxLabel="$220k"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">TOTAL SE TAX (15.3%)</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.totalSeTax)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  {res.effectiveSeRatePct.toFixed(2)}% of net profit
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">50% SE TAX DEDUCTION</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatMoney(res.deductibleHalfSeTax)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Schedule 1 Line 15 AGI adjustment
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">QUARTERLY ESTIMATE</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {formatMoney(res.quarterlyPayment)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  (SE Tax + Income Tax) ÷ 4
                </span>
              </div>
            </div>

            {/* Step-by-Step IRS Schedule SE Breakdown */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/40 text-xs">
              <h3 className="text-sm font-bold text-on-surface">IRS Schedule SE Step-by-Step Breakdown</h3>
              <div className="divide-y divide-outline-variant/30 font-mono">
                <div className="py-2 flex justify-between">
                  <span className="font-sans text-on-surface">1. Net Business Profit (Schedule C)</span>
                  <span className="font-bold">{formatMoney(res.profit)}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-sans text-on-surface">2. Net Earnings Subject to SE Tax (92.35% × Profit)</span>
                  <span className="font-bold">{formatMoney(res.netEarningsFromSE)}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-sans text-on-surface">
                    3. Social Security (12.4% on {formatMoney(res.taxableSsEarnings)} after W-2 cap offset)
                  </span>
                  <span>{formatMoney(res.socialSecurityTax)}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-sans text-on-surface">4. Medicare (2.9% on all net SE earnings)</span>
                  <span>{formatMoney(res.medicareTax)}</span>
                </div>
                {res.additionalMedicareTax > 0 && (
                  <div className="py-2 flex justify-between">
                    <span className="font-sans text-on-surface">5. Additional Medicare Surtax (0.9% above threshold)</span>
                    <span>{formatMoney(res.additionalMedicareTax)}</span>
                  </div>
                )}
                <div className="py-2 flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span className="font-sans font-semibold">Deductible Employer-Equivalent Half (50% of SE Tax)</span>
                  <span className="font-bold">-{formatMoney(res.deductibleHalfSeTax)}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-sans text-on-surface">Estimated Federal Income Tax on Business Profit</span>
                  <span>{formatMoney(res.incrementalIncomeTax)}</span>
                </div>
              </div>
            </div>

            {/* Quarterly Payment Schedule Table */}
            <div className="space-y-3 pt-2 border-t border-outline-variant/40">
              <h3 className="text-sm font-bold text-on-surface">2025 IRS Form 1040-ES Quarterly Due Dates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {res.quarterlySchedule.map((q) => (
                  <div key={q.quarter} className="p-3.5 rounded-xl bg-surface border border-outline-variant/50 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-on-surface block">{q.quarter}</span>
                      <span className="text-xs text-on-surface-variant">Due: {q.dueDate}</span>
                    </div>
                    <span className="font-mono font-extrabold text-primary">{formatMoney(q.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50 text-xs text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">IRS Underpayment Safe-Harbor Rule (IRC §6654):</strong> You avoid
                estimated tax underpayment penalties if you pay at least <strong>90%</strong> of your current-year tax
                liability OR <strong>100%</strong> of your prior-year total tax shown on your return (<strong>110%</strong> if
                your prior-year Adjusted Gross Income exceeded $150,000, or $75,000 if Married Filing Separately).
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: '1099 vs W-2 Compensation Calculator',
            description: 'Find the exact 1099 hourly and annual rate needed to match a W-2 salary with benefits.',
            href: '/finance/1099-vs-w2-calculator',
          },
          {
            title: 'US Federal Income Tax Calculator',
            description: 'Compute full federal brackets, standard vs. itemized deductions, and child/education credits.',
            href: '/finance/us-federal-income-tax-calculator',
          },
          {
            title: 'US State Take-Home Paycheck Calculator',
            description: 'Compare paycheck deductions and net take-home pay across all 50 US states.',
            href: '/finance/us-state-take-home-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #33: US CAPITAL GAINS TAX CALCULATOR
// ============================================================================
export function CapitalGainsTaxClient() {
  const [assetType, setAssetType] = useState<'stocks_crypto' | 'real_estate' | 'collectibles'>('stocks_crypto');
  const [purchasePrice, setPurchasePrice] = useState<number>(40000);
  const [salePrice, setSalePrice] = useState<number>(95000);
  const [sellingFees, setSellingFees] = useState<number>(500);
  const [purchaseDate, setPurchaseDate] = useState<string>('2023-01-15');
  const [saleDate, setSaleDate] = useState<string>('2025-03-01');
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');
  const [otherTaxableIncome, setOtherTaxableIncome] = useState<number>(85000);

  const res = useMemo(
    () =>
      calculateUsCapitalGains({
        assetType,
        purchasePrice,
        salePrice,
        sellingFees,
        purchaseDate,
        saleDate,
        filingStatus,
        otherTaxableIncome,
      }),
    [assetType, purchasePrice, salePrice, sellingFees, purchaseDate, saleDate, filingStatus, otherTaxableIncome]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={res.source} />

      {/* Regional Separation Note: Direct link to dedicated India Capital Gains page */}
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>
            Looking for <strong>India Capital Gains Tax</strong> (Section 112A ₹1.25L exemption &amp; 12.5% LTCG / 20% STCG)?
          </span>
        </div>
        <Link
          href="/finance/india-capital-gains-tax-calculator"
          className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>Switch to India Capital Gains Calculator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface" htmlFor="cg-asset">
              Asset Classification
            </label>
            <select
              id="cg-asset"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as 'stocks_crypto' | 'real_estate' | 'collectibles')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface"
            >
              <option value="stocks_crypto">Stocks, ETFs, Mutual Funds &amp; Crypto</option>
              <option value="real_estate">Investment Real Estate</option>
              <option value="collectibles">Collectibles, Physical Gold &amp; Art (28% Max LTCG)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="cg-buy">
                Purchase Price (Basis)
              </label>
              <input
                id="cg-buy"
                type="number"
                min={0}
                step={1000}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="cg-sell">
                Gross Sale Price
              </label>
              <input
                id="cg-sell"
                type="number"
                min={0}
                step={1000}
                value={salePrice}
                onChange={(e) => setSalePrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface" htmlFor="cg-fees">
              Commissions, Improvements &amp; Selling Fees ($)
            </label>
            <input
              id="cg-fees"
              type="number"
              min={0}
              step={100}
              value={sellingFees}
              onChange={(e) => setSellingFees(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="cg-pdate">
                Purchase Date
              </label>
              <input
                id="cg-pdate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="cg-sdate">
                Sale Date
              </label>
              <input
                id="cg-sdate"
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <label className="block text-xs font-bold text-on-surface" htmlFor="cg-status">
              Filing Status
            </label>
            <select
              id="cg-status"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as UsFilingStatus)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
            >
              <option value="single">Single</option>
              <option value="marriedFilingJointly">Married Filing Jointly</option>
              <option value="headOfHousehold">Head of Household</option>
              <option value="marriedFilingSeparately">Married Filing Separately</option>
            </select>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface" htmlFor="cg-other">
                Other Taxable Income ($/yr)
              </label>
              <span className="font-mono text-xs font-bold text-primary">{formatMoney(otherTaxableIncome)}</span>
            </div>
            <input
              id="cg-other"
              type="number"
              min={0}
              step={2500}
              value={otherTaxableIncome}
              onChange={(e) => setOtherTaxableIncome(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Other Taxable Income"
              min={0}
              max={600000}
              step={5000}
              value={otherTaxableIncome}
              onChange={setOtherTaxableIncome}
              minLabel="$0"
              midLabel="$300k"
              maxLabel="$600k"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline-variant/40">
              <div>
                <span className="text-xs font-semibold text-on-surface-variant">HOLDING CLASSIFICATION</span>
                <h3 className="text-lg font-bold text-on-surface">
                  {res.isLongTerm ? 'Long-Term Capital Gain (> 365 Days)' : 'Short-Term Capital Gain (≤ 365 Days)'}
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-primary">
                Held {res.holdingDays.toLocaleString()} Days
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">NET CAPITAL GAIN / LOSS</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {formatMoney(res.rawGain)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">ESTIMATED TAX OWED</span>
                <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400 mt-1">
                  {formatMoney(res.totalTax)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Effective Rate: {res.effectiveTaxRatePct.toFixed(1)}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">NET PROCEEDS AFTER TAX</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.netProceeds)}
                </div>
              </div>
            </div>

            {res.rawGain < 0 ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                <strong className="text-on-surface block">Capital Loss Offset &amp; Carryforward (IRC §1211):</strong>
                <p className="text-on-surface-variant">
                  You realized a net capital loss of <strong>{formatMoney(Math.abs(res.rawGain))}</strong>. You may deduct
                  up to <strong>{formatMoney(res.deductibleLossThisYear)}</strong> against ordinary income on your 2025
                  return, and carry forward the remaining <strong>{formatMoney(res.carryforwardLoss)}</strong> indefinitely
                  to offset future capital gains.
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-2 border-t border-outline-variant/40 text-xs">
                <h4 className="text-sm font-bold text-on-surface">Tax Bracket &amp; NIIT Breakdown</h4>
                <div className="divide-y divide-outline-variant/30 font-mono">
                  {res.bracketBreakdown.map((b, i) => (
                    <div key={i} className="py-2 flex justify-between">
                      <span className="font-sans text-on-surface">
                        Gain taxed at {b.ratePct}% ({formatMoney(b.amount)})
                      </span>
                      <span className="font-bold">{formatMoney(b.tax)}</span>
                    </div>
                  ))}
                  <div className="py-2 flex justify-between">
                    <span className="font-sans text-on-surface">
                      Net Investment Income Tax (3.8% NIIT above $200k/$250k MAGI)
                    </span>
                    <span className="font-bold">{formatMoney(res.niitTax)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'US Federal Income Tax Calculator',
            description: 'See how ordinary taxable income stacks underneath your long-term capital gains brackets.',
            href: '/finance/us-federal-income-tax-calculator',
          },
          {
            title: 'Investment Growth & ROI Calculator',
            description: 'Compute total return on investment and annualized return before and after taxes.',
            href: '/finance/investment-growth-calculator',
          },
          {
            title: 'Real Rate of Return Calculator',
            description: 'Measure inflation-adjusted and after-tax real investment yield.',
            href: '/finance/real-rate-of-return-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #33B: INDIA CAPITAL GAINS TAX CALCULATOR (SEPARATE REGIONAL PAGE)
// ============================================================================
export function IndiaCapitalGainsTaxClient() {
  const [assetCategory, setAssetCategory] = useState<'listed_equity_mf' | 'unlisted_real_estate_gold' | 'debt_mf'>('listed_equity_mf');
  const [purchasePrice, setPurchasePrice] = useState<number>(500000);
  const [salePrice, setSalePrice] = useState<number>(950000);
  const [transferExpenses, setTransferExpenses] = useState<number>(2000);
  const [holdingMonths, setHoldingMonths] = useState<number>(18);
  const [slabRatePct, setSlabRatePct] = useState<number>(30);

  const res = useMemo(
    () =>
      calculateIndiaCapitalGains({
        assetCategory,
        purchasePrice,
        salePrice,
        transferExpenses,
        holdingMonths,
        slabRatePct,
      }),
    [assetCategory, purchasePrice, salePrice, transferExpenses, holdingMonths, slabRatePct]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={res.source} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface" htmlFor="in-cg-asset">
              Asset Class (Finance Act 2024 / 2025 Rules)
            </label>
            <select
              id="in-cg-asset"
              value={assetCategory}
              onChange={(e) => setAssetCategory(e.target.value as 'listed_equity_mf' | 'unlisted_real_estate_gold' | 'debt_mf')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface"
            >
              <option value="listed_equity_mf">Listed Equity Shares &amp; Equity Mutual Funds (STT Paid)</option>
              <option value="unlisted_real_estate_gold">Real Estate, Physical Gold &amp; Unlisted Shares</option>
              <option value="debt_mf">Specified Debt Mutual Funds (Section 50AA)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-buy">
                Purchase Cost (₹)
              </label>
              <input
                id="in-buy"
                type="number"
                min={0}
                step={10000}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-sell">
                Sale Value (₹)
              </label>
              <input
                id="in-sell"
                type="number"
                min={0}
                step={10000}
                value={salePrice}
                onChange={(e) => setSalePrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface" htmlFor="in-months">
                Holding Period (Months)
              </label>
              <span className="font-mono text-xs font-bold text-primary">{holdingMonths} Months</span>
            </div>
            <SuiteSlider
              ariaLabel="Holding Period in Months"
              min={1}
              max={60}
              step={1}
              value={holdingMonths}
              onChange={setHoldingMonths}
              minLabel="1 mo"
              midLabel="12 mo (Equity LTCG)"
              maxLabel="60 mo"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">TOTAL CAPITAL GAIN</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {formatIndianRupees(res.gain)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  {res.isLongTerm ? 'Long-Term (LTCG)' : 'Short-Term (STCG)'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">SEC 112A EXEMPTION</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatIndianRupees(res.exemptionApplied)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  ₹1.25 Lakh annual equity LTCG limit
                </span>
              </div>

              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">TOTAL TAX + 4% CESS</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatIndianRupees(res.totalTax)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Base Rate: {res.baseTaxRatePct}% + 4% Cess
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'India Income Tax Calculator (New vs Old)',
            description: 'Compare Section 115BAC New Tax Regime vs. Old Tax Regime slabs and rebates.',
            href: '/finance/india-income-tax-calculator',
          },
          {
            title: 'US Capital Gains Tax Calculator',
            description: 'Switch to the US IRS long-term and short-term capital gains & NIIT calculator.',
            href: '/finance/capital-gains-tax-calculator',
          },
          {
            title: 'Compound Interest & SIP Calculator',
            description: 'Project long-term mutual fund accumulation and wealth creation.',
            href: '/compound-interest-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #34: 1099 VS W-2 CALCULATOR (WITH MOBILE TABS & BISECTION SOLVER)
// ============================================================================
export function W2Vs1099Client() {
  const [mobileTab, setMobileTab] = useState<'w2' | '1099'>('w2');
  const [w2Salary, setW2Salary] = useState<number>(110000);
  const [w2EmployerHealthBenefit, setW2EmployerHealthBenefit] = useState<number>(7200);
  const [w2Employer401kMatchPct, setW2Employer401kMatchPct] = useState<number>(4);
  const [w2PaidLeaveDays, setW2PaidLeaveDays] = useState<number>(20);

  const [contractorMode, setContractorMode] = useState<'hourly' | 'annual'>('hourly');
  const [contractorHourlyRate, setContractorHourlyRate] = useState<number>(75);
  const [contractorBillableHoursPerYear, setContractorBillableHoursPerYear] = useState<number>(1920);
  const [contractorAnnualGross, setContractorAnnualGross] = useState<number>(144000);
  const [contractorBusinessExpenses, setContractorBusinessExpenses] = useState<number>(6000);
  const [contractorHealthInsuranceCost, setContractorHealthInsuranceCost] = useState<number>(7200);
  const [applyQbi20PctDeduction, setApplyQbi20PctDeduction] = useState<boolean>(true);
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');

  const res = useMemo(
    () =>
      calculate1099VsW2({
        w2Salary,
        w2EmployerHealthBenefit,
        w2Employer401kMatchPct,
        w2PaidLeaveDays,
        contractorMode,
        contractorHourlyRate,
        contractorBillableHoursPerYear,
        contractorAnnualGross,
        contractorBusinessExpenses,
        contractorHealthInsuranceCost,
        applyQbi20PctDeduction,
        filingStatus,
      }),
    [
      w2Salary,
      w2EmployerHealthBenefit,
      w2Employer401kMatchPct,
      w2PaidLeaveDays,
      contractorMode,
      contractorHourlyRate,
      contractorBillableHoursPerYear,
      contractorAnnualGross,
      contractorBusinessExpenses,
      contractorHealthInsuranceCost,
      applyQbi20PctDeduction,
      filingStatus,
    ]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={US_FICA_2025.source} />

      {/* Mobile W-2 / 1099 Switcher Tabs */}
      <div className="flex sm:hidden p-1 rounded-xl bg-surface-container border border-outline-variant/50">
        <button
          type="button"
          onClick={() => setMobileTab('w2')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            mobileTab === 'w2' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          W-2 Employee Inputs
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('1099')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            mobileTab === '1099' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          1099 Contractor Inputs
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* W-2 Inputs Card */}
        <div
          className={`${
            mobileTab === 'w2' ? 'block' : 'hidden sm:block'
          } p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4`}
        >
          <h3 className="text-base font-bold text-on-surface">W-2 Full-Time Offer</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="w2-sal">W-2 Base Annual Salary</label>
              <span className="font-mono text-primary">{formatMoney(w2Salary)}</span>
            </div>
            <input
              id="w2-sal"
              type="number"
              min={0}
              step={2500}
              value={w2Salary}
              onChange={(e) => setW2Salary(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="W-2 Base Annual Salary"
              min={30000}
              max={300000}
              step={2500}
              value={w2Salary}
              onChange={setW2Salary}
              minLabel="$30k"
              midLabel="$150k"
              maxLabel="$300k"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="w2-health">
                Employer Health Subsidy ($/yr)
              </label>
              <input
                id="w2-health"
                type="number"
                min={0}
                step={500}
                value={w2EmployerHealthBenefit}
                onChange={(e) => setW2EmployerHealthBenefit(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="w2-match">
                Employer 401(k) Match (%)
              </label>
              <input
                id="w2-match"
                type="number"
                min={0}
                max={15}
                step={0.5}
                value={w2Employer401kMatchPct}
                onChange={(e) => setW2Employer401kMatchPct(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="w2-pto">
                Paid Leave + Holidays (Days)
              </label>
              <input
                id="w2-pto"
                type="number"
                min={0}
                max={60}
                value={w2PaidLeaveDays}
                onChange={(e) => setW2PaidLeaveDays(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="w2-status">
                Filing Status
              </label>
              <select
                id="w2-status"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as UsFilingStatus)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
              >
                <option value="single">Single</option>
                <option value="marriedFilingJointly">Married Jointly</option>
                <option value="headOfHousehold">Head of Household</option>
              </select>
            </div>
          </div>
        </div>

        {/* 1099 Inputs Card */}
        <div
          className={`${
            mobileTab === '1099' ? 'block' : 'hidden sm:block'
          } p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-on-surface">1099 Independent Contractor</h3>
            <div className="flex gap-1 bg-surface-container p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setContractorMode('hourly')}
                className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                  contractorMode === 'hourly' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                }`}
              >
                Hourly
              </button>
              <button
                type="button"
                onClick={() => setContractorMode('annual')}
                className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                  contractorMode === 'annual' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          {contractorMode === 'hourly' ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface" htmlFor="c-rate">
                  1099 Hourly Rate ($/hr)
                </label>
                <input
                  id="c-rate"
                  type="number"
                  min={10}
                  step={5}
                  value={contractorHourlyRate}
                  onChange={(e) => setContractorHourlyRate(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface" htmlFor="c-hours">
                  Billable Hours / Year
                </label>
                <input
                  id="c-hours"
                  type="number"
                  min={100}
                  max={3000}
                  step={40}
                  value={contractorBillableHoursPerYear}
                  onChange={(e) => setContractorBillableHoursPerYear(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="c-gross">
                1099 Annual Gross Revenue ($)
              </label>
              <input
                id="c-gross"
                type="number"
                min={0}
                step={2500}
                value={contractorAnnualGross}
                onChange={(e) => setContractorAnnualGross(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="c-exp">
                Business Expenses ($/yr)
              </label>
              <input
                id="c-exp"
                type="number"
                min={0}
                step={500}
                value={contractorBusinessExpenses}
                onChange={(e) => setContractorBusinessExpenses(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface" htmlFor="c-health">
                Health Insurance Cost ($/yr)
              </label>
              <input
                id="c-health"
                type="number"
                min={0}
                step={500}
                value={contractorHealthInsuranceCost}
                onChange={(e) => setContractorHealthInsuranceCost(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 pt-2 text-xs text-on-surface cursor-pointer">
            <input
              type="checkbox"
              checked={applyQbi20PctDeduction}
              onChange={(e) => setApplyQbi20PctDeduction(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span>Apply Section 199A 20% Qualified Business Income (QBI) Deduction</span>
          </label>
        </div>
      </div>

      {/* Unified Comparison Card */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
            <span className="text-xs font-semibold text-on-surface-variant block">
              W-2 NET + BENEFITS VALUE
            </span>
            <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
              {formatMoney(res.w2.totalPackageValue)}
            </div>
            <span className="text-xs text-on-surface-variant mt-1 block">
              Net Cash: {formatMoney(res.w2.netCash)} + {formatMoney(res.w2.employerHealthBenefit + res.w2.employer401kMatch)} benefits
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
            <span className="text-xs font-semibold text-on-surface-variant block">
              1099 NET TAKE-HOME AFTER TAX
            </span>
            <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
              {formatMoney(res.contractor.netTakeHome)}
            </div>
            <span className="text-xs text-on-surface-variant mt-1 block">
              From {formatMoney(res.contractor.grossRevenue)} gross revenue
            </span>
          </div>

          <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
            <span className="text-xs font-semibold text-on-surface-variant block">
              COMPUTED BREAK-EVEN 1099 RATE
            </span>
            <div className="text-2xl font-extrabold font-mono text-primary mt-1">
              {formatMoney(res.breakEven1099Gross)}/yr
            </div>
            <span className="text-xs text-on-surface-variant mt-1 block">
              = {formatMoney(res.breakEven1099Hourly, '$', 2)}/hr across {res.billableHours} billable hrs
            </span>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          To match a <strong>{formatMoney(res.w2.gross)}</strong> W-2 salary (which delivers{' '}
          <strong>{formatMoney(res.w2.totalPackageValue)}</strong> in combined after-tax pay, employer health coverage, and
          401(k) matching), a 1099 contractor must generate exactly{' '}
          <strong>{formatMoney(res.breakEven1099Gross)}</strong> in annual gross revenue (or{' '}
          <strong>{formatMoney(res.breakEven1099Hourly, '$', 2)}/hr</strong>).
        </p>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'Self-Employment Tax Calculator',
            description: 'See your IRS Schedule SE 15.3% tax, 50% deduction, and Form 1040-ES quarterly payments.',
            href: '/finance/self-employment-tax-calculator',
          },
          {
            title: 'US State Take-Home Paycheck Calculator',
            description: 'Calculate net paycheck take-home after Federal, FICA, and state payroll taxes.',
            href: '/finance/us-state-take-home-calculator',
          },
          {
            title: 'Salary to Hourly Calculator',
            description: 'Convert annual compensation to hourly rates adjusted for unpaid time off and holidays.',
            href: '/finance/salary-to-hourly-calculator',
          },
        ]}
      />
    </div>
  );
}
