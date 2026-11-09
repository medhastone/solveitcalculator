'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import {
  calculateSalaryToHourly,
  calculateIndiaInHandSalary,
  calculateUsStateTakeHome,
  calculateOvertimePay,
  calculatePayRaise,
  calculateBonusTax,
} from '@/lib/finance-core/tax-payroll-business-engines';
import {
  US_FICA_2025,
  US_STATE_TAX_PROFILES_2025,
  INDIA_TAX_DATA,
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
// #40: SALARY TO HOURLY CALCULATOR
// ============================================================================
export function SalaryToHourlyClient() {
  const [inputMode, setInputMode] = useState<'annual' | 'hourly'>('annual');
  const [amount, setAmount] = useState<number>(95000);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(52);
  const [unpaidLeaveWeeks, setUnpaidLeaveWeeks] = useState<number>(0);
  const [paidHolidayDays, setPaidHolidayDays] = useState<number>(15);
  const [adjustForPaidHolidays, setAdjustForPaidHolidays] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const res = useMemo(
    () =>
      calculateSalaryToHourly({
        inputMode,
        amount,
        hoursPerWeek,
        weeksPerYear,
        unpaidLeaveWeeks,
        paidHolidayDays,
        adjustForPaidHolidays,
      }),
    [inputMode, amount, hoursPerWeek, weeksPerYear, unpaidLeaveWeeks, paidHolidayDays, adjustForPaidHolidays]
  );

  const handleCopyTable = () => {
    const text = `Salary to Hourly Breakdown:
Annual: ${formatMoney(res.annualSalary)}
Monthly (12): ${formatMoney(res.monthly)}
Semi-Monthly (24): ${formatMoney(res.semiMonthly)}
Bi-Weekly (26): ${formatMoney(res.biWeekly)}
Weekly (${weeksPerYear}): ${formatMoney(res.weekly)}
Daily: ${formatMoney(res.daily, '$', 2)}
Standard Hourly (${res.scheduledHoursPerYear}h): ${formatMoney(res.nominalHourly, '$', 2)}/hr
Effective Worked Hourly (${res.actualWorkedHoursPerYear}h): ${formatMoney(res.effectiveWorkedHourly, '$', 2)}/hr`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setInputMode('annual');
                setAmount(95000);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                inputMode === 'annual' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
              }`}
            >
              Salary → Hourly
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMode('hourly');
                setAmount(45);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                inputMode === 'hourly' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
              }`}
            >
              Hourly → Salary
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="sth-amt">
                {inputMode === 'annual' ? 'Annual Salary ($)' : 'Hourly Rate ($/hr)'}
              </label>
              <span className="font-mono font-bold text-primary">
                {inputMode === 'annual' ? formatMoney(amount) : `${formatMoney(amount, '$', 2)}/hr`}
              </span>
            </div>
            <input
              id="sth-amt"
              type="number"
              min={0}
              step={inputMode === 'annual' ? 1000 : 1}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel={inputMode === 'annual' ? 'Annual Salary' : 'Hourly Rate'}
              min={inputMode === 'annual' ? 20000 : 10}
              max={inputMode === 'annual' ? 300000 : 150}
              step={inputMode === 'annual' ? 2500 : 1}
              value={amount}
              onChange={setAmount}
              minLabel={inputMode === 'annual' ? '$20k' : '$10/hr'}
              midLabel={inputMode === 'annual' ? '$150k' : '$75/hr'}
              maxLabel={inputMode === 'annual' ? '$300k' : '$150/hr'}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="sth-hrs">
                Hours / Week
              </label>
              <input
                id="sth-hrs"
                type="number"
                min={1}
                max={100}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="sth-wks">
                Weeks / Year
              </label>
              <input
                id="sth-wks"
                type="number"
                min={1}
                max={52}
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(Math.max(1, Math.min(52, Number(e.target.value))))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="sth-unpaid">
                Unpaid Leave (Weeks)
              </label>
              <input
                id="sth-unpaid"
                type="number"
                min={0}
                max={26}
                value={unpaidLeaveWeeks}
                onChange={(e) => setUnpaidLeaveWeeks(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="sth-pto">
                Paid Holidays + PTO (Days)
              </label>
              <input
                id="sth-pto"
                type="number"
                min={0}
                max={60}
                value={paidHolidayDays}
                onChange={(e) => setPaidHolidayDays(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 pt-1 text-xs text-on-surface cursor-pointer">
            <input
              type="checkbox"
              checked={adjustForPaidHolidays}
              onChange={(e) => setAdjustForPaidHolidays(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span>Compute Effective Hourly Rate across actual worked hours (excluding paid PTO/holidays)</span>
          </label>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">
                  STANDARD 2,080 HOURS = 40 HRS × 52 WEEKS
                </span>
                <h3 className="text-lg font-bold text-on-surface">All Pay Periods in One Table</h3>
              </div>
              <button
                type="button"
                onClick={handleCopyTable}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Breakdown'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">
                  SCHEDULED HOURLY ({res.scheduledHoursPerYear.toLocaleString()} HRS/YR)
                </span>
                <div className="text-3xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.nominalHourly, '$', 2)}/hr
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">
                  EFFECTIVE WORKED HOURLY ({res.actualWorkedHoursPerYear.toLocaleString()} HRS/YR)
                </span>
                <div className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatMoney(res.effectiveWorkedHourly, '$', 2)}/hr
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pt-2 border-t border-outline-variant/40">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/50 text-on-surface-variant">
                    <th className="py-2">Pay Period</th>
                    <th className="py-2">Paychecks / Year</th>
                    <th className="py-2 text-right">Gross Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 font-mono">
                  <tr>
                    <td className="py-2.5 font-sans font-semibold text-on-surface">Hourly Rate (Scheduled)</td>
                    <td className="py-2.5">{res.scheduledHoursPerYear.toLocaleString()} hours</td>
                    <td className="py-2.5 text-right font-bold text-primary">{formatMoney(res.nominalHourly, '$', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans font-semibold text-on-surface">Daily Rate ({hoursPerWeek / 5}h day)</td>
                    <td className="py-2.5">{(weeksPerYear - unpaidLeaveWeeks) * 5} days</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(res.daily, '$', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans font-semibold text-on-surface">Weekly Paycheck</td>
                    <td className="py-2.5">{weeksPerYear} weeks</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(res.weekly, '$', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans font-semibold text-on-surface">Bi-Weekly Paycheck</td>
                    <td className="py-2.5">26 pay periods</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(res.biWeekly, '$', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans font-semibold text-on-surface">Semi-Monthly Paycheck</td>
                    <td className="py-2.5">24 pay periods</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(res.semiMonthly, '$', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans font-semibold text-on-surface">Monthly Salary</td>
                    <td className="py-2.5">12 months</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(res.monthly, '$', 2)}</td>
                  </tr>
                  <tr className="bg-result-highlight font-bold">
                    <td className="py-3 font-sans text-on-surface">Annual Salary</td>
                    <td className="py-3">1 year</td>
                    <td className="py-3 text-right text-primary">{formatMoney(res.annualSalary, '$', 2)}</td>
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
            title: 'Overtime Pay Calculator',
            description: 'Calculate 1.5x time-and-a-half and 2.0x double-time earnings under FLSA and state rules.',
            href: '/finance/overtime-pay-calculator',
          },
          {
            title: 'Take-Home Pay Calculator',
            description: 'See your net paycheck after federal, state, and FICA payroll taxes.',
            href: '/finance/take-home-pay-calculator',
          },
          {
            title: 'Pay Raise Calculator',
            description: 'Calculate your new hourly and annual pay after a percentage raise.',
            href: '/finance/pay-raise-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #41: TAKE-HOME PAY / IN-HAND SALARY CALCULATOR (US & INDIA CTC MODES)
// ============================================================================
export function TakeHomeInHandSalaryClient({
  defaultRegion = 'INDIA',
}: {
  defaultRegion?: 'US' | 'INDIA';
}) {
  const [regionMode, setRegionMode] = useState<'US' | 'INDIA'>(defaultRegion);

  // India CTC State
  const [annualCtc, setAnnualCtc] = useState<number>(1800000);
  const [basicPctOfCtc, setBasicPctOfCtc] = useState<number>(40);
  const [hraPctOfBasic, setHraPctOfBasic] = useState<number>(50);
  const [epfCapAtStatutoryCeiling, setEpfCapAtStatutoryCeiling] = useState<boolean>(false);
  const [includeGratuityInCtc, setIncludeGratuityInCtc] = useState<boolean>(true);
  const [indiaStateCode, setIndiaStateCode] = useState<keyof typeof INDIA_TAX_DATA.professionalTaxByStateAnnual>('MH');
  const [regime, setRegime] = useState<'new' | 'old'>('new');
  const [deduction80CExtra, setDeduction80CExtra] = useState<number>(50000);
  const [rentPaidAnnual, setRentPaidAnnual] = useState<number>(240000);
  const [isMetroCity, setIsMetroCity] = useState<boolean>(true);

  // US Paycheck State
  const [usSalary, setUsSalary] = useState<number>(110000);
  const [usState, setUsState] = useState<string>('CA');
  const [usFilingStatus, setUsFilingStatus] = useState<UsFilingStatus>('single');
  const [usPreTax401k, setUsPreTax401k] = useState<number>(6600);

  const indiaRes = useMemo(
    () =>
      calculateIndiaInHandSalary({
        annualCtc,
        basicPctOfCtc,
        hraPctOfBasic,
        epfCapAtStatutoryCeiling,
        includeGratuityInCtc,
        stateCode: indiaStateCode,
        regime,
        deduction80CExtra,
        rentPaidAnnual,
        isMetroCity,
      }),
    [
      annualCtc,
      basicPctOfCtc,
      hraPctOfBasic,
      epfCapAtStatutoryCeiling,
      includeGratuityInCtc,
      indiaStateCode,
      regime,
      deduction80CExtra,
      rentPaidAnnual,
      isMetroCity,
    ]
  );

  const usRes = useMemo(
    () =>
      calculateUsStateTakeHome({
        stateCode: usState,
        annualSalary: usSalary,
        payFrequency: 'monthly',
        filingStatus: usFilingStatus,
        preTax401k: usPreTax401k,
        preTaxHsaAndHealth: 1800,
      }),
    [usState, usSalary, usFilingStatus, usPreTax401k]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={regionMode === 'INDIA' ? INDIA_TAX_DATA.source : US_FICA_2025.source} />

      {/* Mode Switcher */}
      <div className="flex p-1.5 rounded-xl bg-surface-container border border-outline-variant/50 max-w-md">
        <button
          type="button"
          onClick={() => setRegionMode('INDIA')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
            regionMode === 'INDIA' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          India CTC → Monthly In-Hand
        </button>
        <button
          type="button"
          onClick={() => setRegionMode('US')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
            regionMode === 'US' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          US Paycheck Take-Home
        </button>
      </div>

      {regionMode === 'INDIA' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-on-surface" htmlFor="ctc-amt">
                  Annual Cost to Company (CTC ₹)
                </label>
                <span className="font-mono font-bold text-primary">{formatIndianRupees(annualCtc)}</span>
              </div>
              <input
                id="ctc-amt"
                type="number"
                min={0}
                step={50000}
                value={annualCtc}
                onChange={(e) => setAnnualCtc(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
              <SuiteSlider
                ariaLabel="Annual CTC in Rupees"
                min={300000}
                max={6000000}
                step={50000}
                value={annualCtc}
                onChange={setAnnualCtc}
                minLabel="₹3L"
                midLabel="₹20L"
                maxLabel="₹60L"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface" htmlFor="ctc-basic">
                  Basic % of CTC
                </label>
                <input
                  id="ctc-basic"
                  type="number"
                  min={20}
                  max={70}
                  value={basicPctOfCtc}
                  onChange={(e) => setBasicPctOfCtc(Math.max(20, Math.min(70, Number(e.target.value))))}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface" htmlFor="ctc-hra">
                  HRA % of Basic
                </label>
                <input
                  id="ctc-hra"
                  type="number"
                  min={0}
                  max={80}
                  value={hraPctOfBasic}
                  onChange={(e) => setHraPctOfBasic(Math.max(0, Math.min(80, Number(e.target.value))))}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs font-bold text-on-surface"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface" htmlFor="ctc-state">
                  State (Professional Tax)
                </label>
                <select
                  id="ctc-state"
                  value={indiaStateCode}
                  onChange={(e) => setIndiaStateCode(e.target.value as keyof typeof INDIA_TAX_DATA.professionalTaxByStateAnnual)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
                >
                  {Object.entries(INDIA_TAX_DATA.professionalTaxByStateAnnual).map(([code, st]) => (
                    <option key={code} value={code}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface" htmlFor="ctc-regime">
                  Income Tax Regime
                </label>
                <select
                  id="ctc-regime"
                  value={regime}
                  onChange={(e) => setRegime(e.target.value as 'new' | 'old')}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
                >
                  <option value="new">New Regime (Sec 115BAC)</option>
                  <option value="old">Old Tax Regime</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 border-t border-outline-variant/40 text-xs text-on-surface cursor-pointer">
              <input
                type="checkbox"
                checked={epfCapAtStatutoryCeiling}
                onChange={(e) => setEpfCapAtStatutoryCeiling(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              <span>Cap Employee PF at ₹1,800/mo statutory ceiling (12% of ₹15,000 wage ceiling)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-on-surface cursor-pointer">
              <input
                type="checkbox"
                checked={includeGratuityInCtc}
                onChange={(e) => setIncludeGratuityInCtc(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              <span>Deduct Gratuity (4.81% of Basic) from CTC</span>
            </label>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                  <span className="text-xs font-semibold text-on-surface-variant block">MONTHLY IN-HAND SALARY</span>
                  <div className="text-3xl font-extrabold font-mono text-primary mt-1">
                    {formatIndianRupees(indiaRes.netInHandMonthly)}/mo
                  </div>
                  <span className="text-xs text-on-surface-variant mt-1 block">
                    Annual Net In-Hand: {formatIndianRupees(indiaRes.netInHandAnnual)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                  <span className="text-xs font-semibold text-on-surface-variant block">ANNUAL INCOME TAX (TDS)</span>
                  <div className="text-3xl font-extrabold font-mono text-on-surface mt-1">
                    {formatIndianRupees(indiaRes.annualTds)}/yr
                  </div>
                  <span className="text-xs text-on-surface-variant mt-1 block">
                    Monthly TDS: {formatIndianRupees(indiaRes.annualTds / 12)}/mo
                  </span>
                </div>
              </div>

              <div className="divide-y divide-outline-variant/30 text-xs font-mono pt-2 border-t border-outline-variant/40">
                <div className="py-2 flex justify-between">
                  <span className="font-sans font-semibold text-on-surface">Total Annual CTC</span>
                  <span className="font-bold">{formatIndianRupees(indiaRes.ctc)}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-sans text-on-surface">Basic Salary ({basicPctOfCtc}% of CTC)</span>
                  <span>{formatIndianRupees(indiaRes.basicAnnual)} ({formatIndianRupees(indiaRes.basicAnnual / 12)}/mo)</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-sans text-on-surface">House Rent Allowance (HRA)</span>
                  <span>{formatIndianRupees(indiaRes.hraAnnual)} ({formatIndianRupees(indiaRes.hraAnnual / 12)}/mo)</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-sans text-on-surface">Special &amp; Flexible Allowances</span>
                  <span>{formatIndianRupees(indiaRes.specialAllowanceAnnual)}</span>
                </div>
                <div className="py-2 flex justify-between text-amber-600 dark:text-amber-400">
                  <span className="font-sans">Employer PF + Gratuity (Part of CTC)</span>
                  <span>-{formatIndianRupees(indiaRes.employerPfAnnual + indiaRes.gratuityAnnual)}</span>
                </div>
                <div className="py-2 flex justify-between text-teal-600 dark:text-teal-400">
                  <span className="font-sans">Employee PF Deduction (12%)</span>
                  <span>-{formatIndianRupees(indiaRes.employeePfAnnual)} ({formatIndianRupees(indiaRes.employeePfAnnual / 12)}/mo)</span>
                </div>
                <div className="py-2 flex justify-between text-rose-600 dark:text-rose-400">
                  <span className="font-sans">Professional Tax ({indiaRes.ptProfile.monthlyNote})</span>
                  <span>-{formatIndianRupees(indiaRes.professionalTaxAnnual)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-on-surface" htmlFor="us-th-sal">
                  US Annual Gross Salary ($)
                </label>
                <span className="font-mono font-bold text-primary">{formatMoney(usSalary)}</span>
              </div>
              <input
                id="us-th-sal"
                type="number"
                min={0}
                step={2500}
                value={usSalary}
                onChange={(e) => setUsSalary(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
              <SuiteSlider
                ariaLabel="US Annual Salary"
                min={25000}
                max={350000}
                step={2500}
                value={usSalary}
                onChange={setUsSalary}
                minLabel="$25k"
                midLabel="$175k"
                maxLabel="$350k"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface" htmlFor="us-th-state">
                  US State
                </label>
                <select
                  id="us-th-state"
                  value={usState}
                  onChange={(e) => setUsState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
                >
                  {Object.keys(US_STATE_TAX_PROFILES_2025).map((code) => (
                    <option key={code} value={code}>
                      {US_STATE_TAX_PROFILES_2025[code].name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface" htmlFor="us-th-status">
                  Filing Status
                </label>
                <select
                  id="us-th-status"
                  value={usFilingStatus}
                  onChange={(e) => setUsFilingStatus(e.target.value as UsFilingStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
                >
                  <option value="single">Single</option>
                  <option value="marriedFilingJointly">Married Jointly</option>
                  <option value="headOfHousehold">Head of Household</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                  <span className="text-xs font-semibold text-on-surface-variant block">MONTHLY TAKE-HOME PAY</span>
                  <div className="text-3xl font-extrabold font-mono text-primary mt-1">
                    {formatMoney(usRes.netMonthly)}/mo
                  </div>
                  <span className="text-xs text-on-surface-variant mt-1 block">
                    Bi-Weekly: {formatMoney(usRes.netBiWeekly)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                  <span className="text-xs font-semibold text-on-surface-variant block">ANNUAL NET TAKE-HOME</span>
                  <div className="text-3xl font-extrabold font-mono text-on-surface mt-1">
                    {formatMoney(usRes.netAnnual)}/yr
                  </div>
                  <span className="text-xs text-on-surface-variant mt-1 block">
                    Total Taxes: {formatMoney(usRes.totalTaxes)} ({usRes.effectiveTaxRatePct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'India Income Tax Calculator',
            description: 'Compare New vs. Old Tax Regime slabs, Section 87A rebates, and deductions.',
            href: '/finance/india-income-tax-calculator',
          },
          {
            title: 'HRA Exemption Calculator',
            description: 'Compute exact tax-exempt House Rent Allowance under Section 10(13A).',
            href: '/finance/hra-exemption-calculator',
          },
          {
            title: 'Salary to Hourly Calculator',
            description: 'Convert annual compensation across hourly, daily, weekly, and monthly periods.',
            href: '/finance/salary-to-hourly-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #42: OVERTIME PAY CALCULATOR
// ============================================================================
export function OvertimePayClient() {
  const [payMode, setPayMode] = useState<'hourly' | 'annual_salary'>('hourly');
  const [baseRateOrSalary, setBaseRateOrSalary] = useState<number>(32);
  const [regularHoursPerWeek, setRegularHoursPerWeek] = useState<number>(40);
  const [overtimeHours15x, setOvertimeHours15x] = useState<number>(8);
  const [doubleTimeHours20x, setDoubleTimeHours20x] = useState<number>(0);
  const [customOvertimeMultiplier, setCustomOvertimeMultiplier] = useState<number>(1.5);

  const res = useMemo(
    () =>
      calculateOvertimePay({
        payMode,
        baseRateOrSalary,
        regularHoursPerWeek,
        overtimeHours15x,
        doubleTimeHours20x,
        customOvertimeMultiplier,
      }),
    [payMode, baseRateOrSalary, regularHoursPerWeek, overtimeHours15x, doubleTimeHours20x, customOvertimeMultiplier]
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="ot-rate">
                Base Hourly Rate ($/hr)
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(baseRateOrSalary, '$', 2)}/hr</span>
            </div>
            <input
              id="ot-rate"
              type="number"
              min={0}
              step={1}
              value={baseRateOrSalary}
              onChange={(e) => setBaseRateOrSalary(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Base Hourly Rate"
              min={10}
              max={120}
              step={1}
              value={baseRateOrSalary}
              onChange={setBaseRateOrSalary}
              minLabel="$10/hr"
              midLabel="$65/hr"
              maxLabel="$120/hr"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="ot-reg">
                Regular Hours / Week
              </label>
              <input
                id="ot-reg"
                type="number"
                min={0}
                max={80}
                value={regularHoursPerWeek}
                onChange={(e) => setRegularHoursPerWeek(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="ot-mult">
                OT Multiplier (1.5x / 2.0x)
              </label>
              <select
                id="ot-mult"
                value={customOvertimeMultiplier}
                onChange={(e) => setCustomOvertimeMultiplier(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
              >
                <option value={1.5}>1.5x (US FLSA Time-and-a-Half)</option>
                <option value={2.0}>2.0x (Double-Time / India Factories Act)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="ot-hrs">Overtime Hours / Week ({customOvertimeMultiplier}x)</label>
              <span className="font-mono text-primary">{overtimeHours15x} hrs</span>
            </div>
            <SuiteSlider
              ariaLabel="Overtime Hours per Week"
              min={0}
              max={40}
              step={1}
              value={overtimeHours15x}
              onChange={setOvertimeHours15x}
              minLabel="0 hrs"
              midLabel="20 hrs"
              maxLabel="40 hrs"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="dt-hrs">Double-Time Hours / Week (2.0x)</label>
              <span className="font-mono text-primary">{doubleTimeHours20x} hrs</span>
            </div>
            <SuiteSlider
              ariaLabel="Double-Time Hours per Week"
              min={0}
              max={20}
              step={1}
              value={doubleTimeHours20x}
              onChange={setDoubleTimeHours20x}
              minLabel="0 hrs"
              midLabel="10 hrs"
              maxLabel="20 hrs"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">TOTAL WEEKLY GROSS PAY</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.totalGrossWeekly, '$', 2)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Bi-Weekly: {formatMoney(res.totalGrossBiWeekly, '$', 2)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">OVERTIME EARNINGS / WK</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatMoney(res.totalOvertimePayWeekly, '$', 2)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  OT Rate: {formatMoney(res.overtimeRate, '$', 2)}/hr
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">EFFECTIVE BLENDED RATE</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {formatMoney(res.effectiveHourlyRate, '$', 2)}/hr
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Annualized: {formatMoney(res.totalGrossAnnual)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-outline-variant/50 space-y-2 text-xs text-on-surface-variant">
              <h4 className="font-bold text-on-surface">FLSA Exempt vs. Non-Exempt &amp; Statutory Overtime Rules</h4>
              <p>
                • <strong>US Federal FLSA Rule:</strong> Non-exempt employees must receive at least <strong>1.5×</strong>{' '}
                regular pay for all hours worked beyond <strong>40 hours in a workweek</strong>. Executive, administrative,
                and professional exemptions require meeting both the salary basis threshold and primary duties tests.
              </p>
              <p>
                • <strong>California Daily &amp; Double-Time Rule:</strong> Requires 1.5× after 8 hours/day (or 40/week) and{' '}
                <strong>2.0× double-time</strong> after 12 hours in a single workday.
              </p>
              <p>
                • <strong>India Factories Act (Sec 59):</strong> Overtime beyond 9 hours/day or 48 hours/week is compensated at{' '}
                <strong>2.0× twice the ordinary rate of wages</strong>.
              </p>
              <div className="flex flex-wrap gap-4 pt-1">
                <a
                  href="https://www.dol.gov/agencies/whd/overtime"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  <span>US Department of Labor (WHD)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://labour.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  <span>India Ministry of Labour &amp; Employment</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'Salary to Hourly Calculator',
            description: 'Convert annual salary to hourly, daily, weekly, and bi-weekly pay.',
            href: '/finance/salary-to-hourly-calculator',
          },
          {
            title: 'Take-Home Pay Calculator',
            description: 'Estimate net paycheck after federal, FICA, and state taxes.',
            href: '/finance/take-home-pay-calculator',
          },
          {
            title: 'Pay Raise Calculator',
            description: 'See how a base rate raise compounds across regular and overtime hours.',
            href: '/finance/pay-raise-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #43: PAY RAISE CALCULATOR
// ============================================================================
export function PayRaiseClient() {
  const [payPeriod, setPayPeriod] = useState<'hourly' | 'monthly' | 'annual'>('annual');
  const [currentPay, setCurrentPay] = useState<number>(85000);
  const [raiseMode, setRaiseMode] = useState<'percentage' | 'new_amount'>('percentage');
  const [raiseValue, setRaiseValue] = useState<number>(8);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [inflationRatePct, setInflationRatePct] = useState<number>(2.8);
  const [compoundingYears, setCompoundingYears] = useState<number>(5);

  const res = useMemo(
    () =>
      calculatePayRaise({
        payPeriod,
        currentPay,
        raiseMode,
        raiseValue,
        hoursPerWeek,
        inflationRatePct,
        compoundingYears,
      }),
    [payPeriod, currentPay, raiseMode, raiseValue, hoursPerWeek, inflationRatePct, compoundingYears]
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
          <div className="grid grid-cols-3 gap-1.5">
            {(['annual', 'monthly', 'hourly'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPayPeriod(p);
                  if (p === 'annual') setCurrentPay(85000);
                  if (p === 'monthly') setCurrentPay(7000);
                  if (p === 'hourly') setCurrentPay(40);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold capitalize cursor-pointer ${
                  payPeriod === p ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="pr-curr">
                Current {payPeriod} Pay ($)
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(currentPay)}</span>
            </div>
            <input
              id="pr-curr"
              type="number"
              min={0}
              value={currentPay}
              onChange={(e) => setCurrentPay(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="pr-val">
                Raise Percentage (%)
              </label>
              <span className="font-mono font-bold text-primary">{raiseValue}%</span>
            </div>
            <input
              id="pr-val"
              type="number"
              step={0.5}
              value={raiseValue}
              onChange={(e) => setRaiseValue(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Raise Percentage"
              min={1}
              max={35}
              step={0.5}
              value={raiseValue}
              onChange={setRaiseValue}
              minLabel="1%"
              midLabel="15%"
              maxLabel="35%"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface" htmlFor="pr-inf">
                Annual Inflation Rate (%)
              </label>
              <span className="font-mono text-xs font-bold text-primary">{inflationRatePct}%</span>
            </div>
            <SuiteSlider
              ariaLabel="Annual Inflation Rate"
              min={0}
              max={10}
              step={0.1}
              value={inflationRatePct}
              onChange={setInflationRatePct}
              minLabel="0%"
              midLabel="3%"
              maxLabel="10%"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">NEW ANNUAL PAY</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.newAnnual)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  +{formatMoney(res.annualDiff)}/yr (+{res.nominalRaisePct.toFixed(2)}%)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">REAL RAISE (AFTER INFLATION)</span>
                <div className={`text-2xl font-extrabold font-mono mt-1 ${res.realRaisePct >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
                  {res.realRaisePct >= 0 ? '+' : ''}{res.realRaisePct.toFixed(2)}%
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Real Power: {formatMoney(res.realPurchasingPowerAnnual)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">MONTHLY &amp; HOURLY BOOST</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  +{formatMoney(res.monthlyDiff)}/mo
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  +{formatMoney(res.hourlyDiff, '$', 2)}/hr ({formatMoney(res.newHourly, '$', 2)}/hr new)
                </span>
              </div>
            </div>

            <div className="overflow-x-auto pt-2 border-t border-outline-variant/40">
              <h4 className="text-sm font-bold text-on-surface mb-2">Multi-Year Compounding Raise Trajectory</h4>
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-outline-variant/50 text-on-surface-variant font-sans">
                    <th className="py-2">Year</th>
                    <th className="py-2 text-right">Compounded Salary</th>
                    <th className="py-2 text-right">Real Purchasing Power</th>
                    <th className="py-2 text-right">Gain vs Today</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {res.multiYearSchedule.map((row) => (
                    <tr key={row.year}>
                      <td className="py-2 font-sans font-semibold">Year {row.year}</td>
                      <td className="py-2 text-right font-bold text-primary">{formatMoney(row.projectedSalary)}</td>
                      <td className="py-2 text-right">{formatMoney(row.realSalary)}</td>
                      <td className="py-2 text-right text-emerald-700 dark:text-emerald-400">+{formatMoney(row.gainOverCurrent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'Real Rate of Return & Inflation Calculator',
            description: 'Measure how CPI inflation erodes purchasing power over time.',
            href: '/finance/real-rate-of-return-calculator',
          },
          {
            title: 'Salary to Hourly Calculator',
            description: 'Convert your new salary across hourly, bi-weekly, and monthly paychecks.',
            href: '/finance/salary-to-hourly-calculator',
          },
          {
            title: 'Take-Home Pay Calculator',
            description: 'See how much of your pay raise you keep after taxes.',
            href: '/finance/take-home-pay-calculator',
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// #44: BONUS TAX CALCULATOR (FLAT SUPPLEMENTAL 22% VS AGGREGATE)
// ============================================================================
export function BonusTaxClient() {
  const [bonusAmount, setBonusAmount] = useState<number>(20000);
  const [annualSalary, setAnnualSalary] = useState<number>(125000);
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');
  const [stateCode, setStateCode] = useState<string>('CA');
  const [withholdingMethod, setWithholdingMethod] = useState<'flat_supplemental' | 'aggregate'>('flat_supplemental');
  const [bonus401kDeferralPct, setBonus401kDeferralPct] = useState<number>(6);

  const res = useMemo(
    () =>
      calculateBonusTax({
        bonusAmount,
        annualSalary,
        filingStatus,
        stateCode,
        withholdingMethod,
        bonus401kDeferralPct,
      }),
    [bonusAmount, annualSalary, filingStatus, stateCode, withholdingMethod, bonus401kDeferralPct]
  );

  return (
    <div className="space-y-8">
      <VerifiedAuthorityBanner source={res.source} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="bon-amt">
                Gross Bonus Amount ($)
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(bonusAmount)}</span>
            </div>
            <input
              id="bon-amt"
              type="number"
              min={0}
              step={1000}
              value={bonusAmount}
              onChange={(e) => setBonusAmount(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
            <SuiteSlider
              ariaLabel="Gross Bonus Amount"
              min={1000}
              max={250000}
              step={1000}
              value={bonusAmount}
              onChange={setBonusAmount}
              minLabel="$1k"
              midLabel="$50k"
              maxLabel="$250k"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface" htmlFor="bon-sal">
                Regular Annual Base Salary ($)
              </label>
              <span className="font-mono font-bold text-primary">{formatMoney(annualSalary)}</span>
            </div>
            <input
              id="bon-sal"
              type="number"
              min={0}
              step={5000}
              value={annualSalary}
              onChange={(e) => setAnnualSalary(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant font-mono font-bold text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="bon-state">
                State
              </label>
              <select
                id="bon-state"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
              >
                {Object.keys(US_STATE_TAX_PROFILES_2025).map((code) => (
                  <option key={code} value={code}>
                    {US_STATE_TAX_PROFILES_2025[code].name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface" htmlFor="bon-method">
                IRS Withholding Method
              </label>
              <select
                id="bon-method"
                value={withholdingMethod}
                onChange={(e) => setWithholdingMethod(e.target.value as 'flat_supplemental' | 'aggregate')}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface"
              >
                <option value="flat_supplemental">Flat Supplemental (22% / 37% &gt;$1M)</option>
                <option value="aggregate">Aggregate Method (Marginal)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="bon-401k">401(k) Deferral from Bonus (%)</label>
              <span className="font-mono text-primary">{bonus401kDeferralPct}%</span>
            </div>
            <SuiteSlider
              ariaLabel="Bonus 401k Deferral Percentage"
              min={0}
              max={50}
              step={1}
              value={bonus401kDeferralPct}
              onChange={setBonus401kDeferralPct}
              minLabel="0%"
              midLabel="25%"
              maxLabel="50%"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-result-highlight border border-primary/20">
                <span className="text-xs font-semibold text-on-surface-variant block">NET TAKE-HOME BONUS</span>
                <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                  {formatMoney(res.netBonusCheck)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Tax Withheld: {res.effectiveWithholdingRatePct.toFixed(1)}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">FEDERAL WITHHELD NOW</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {formatMoney(res.federalWithheldOnPaycheck)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Actual Liability: {formatMoney(res.actualFederalLiabilityOnBonus)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <span className="text-xs font-semibold text-on-surface-variant block">FICA + STATE WITHHELD</span>
                <div className="text-2xl font-extrabold font-mono text-on-surface mt-1">
                  {formatMoney(res.totalFica + res.stateWithholding)}
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  FICA: {formatMoney(res.totalFica)} · State: {formatMoney(res.stateWithholding)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-outline-variant/50 text-xs space-y-1.5">
              <strong className="text-on-surface block">
                Withholding vs. Actual Tax Liability at April Filing:
              </strong>
              <p className="text-on-surface-variant leading-relaxed">
                Under the IRS 22% Flat Supplemental Method, your employer withholds{' '}
                <strong>{formatMoney(res.flatFederalWithholding)}</strong> in federal tax, whereas your true marginal federal
                tax liability on this bonus is <strong>{formatMoney(res.actualFederalLiabilityOnBonus)}</strong>.{' '}
                {Math.abs(res.withholdingMinusActualFederal) < 10 ? (
                  <span>Your paycheck withholding matches your actual tax liability.</span>
                ) : res.withholdingMinusActualFederal > 0 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    Your bonus is over-withheld by {formatMoney(res.withholdingMinusActualFederal)}, which will be returned to
                    you as a tax refund when you file your Form 1040.
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    Your bonus is under-withheld by {formatMoney(Math.abs(res.withholdingMinusActualFederal))} because your
                    marginal bracket exceeds 22%, resulting in a balance due at tax filing.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsGrid
        items={[
          {
            title: 'US Federal Income Tax Calculator',
            description: 'See your full progressive tax brackets and refund/owed calculation.',
            href: '/finance/us-federal-income-tax-calculator',
          },
          {
            title: 'US State Take-Home Paycheck Calculator',
            description: 'Compute regular paycheck withholding across all 50 states.',
            href: '/finance/us-state-take-home-calculator',
          },
          {
            title: '401(k) Calculator',
            description: 'See how deferring part of your bonus into your 401(k) shelters it from immediate tax.',
            href: '/finance/401k-calculator',
          },
        ]}
      />
    </div>
  );
}
