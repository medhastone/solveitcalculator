'use client';

import React, { useState, useMemo } from 'react';
import { calculate1099VsW2 } from '@/lib/finance-core/tax-payroll-business-engines';
import { US_FICA_2025 } from '@/lib/finance-core/tax-payroll-business-data';
import { UsFilingStatus, FILING_STATUS_LABELS } from '@/lib/finance-core/us-federal-tax';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Scale, Briefcase, Building2 } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function W2Vs1099Client() {
  useCurrency();
  const [mobileTab, setMobileTab] = useState<'w2' | '1099'>('w2');
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');

  // W-2 Inputs
  const [w2Salary, setW2Salary] = useState<number>(100000);
  const [w2EmployerHealthBenefit, setW2EmployerHealthBenefit] = useState<number>(6500);
  const [w2Employer401kMatchPct, setW2Employer401kMatchPct] = useState<number>(4);
  const [w2PaidLeaveDays, setW2PaidLeaveDays] = useState<number>(20);

  // 1099 Inputs
  const [contractorMode, setContractorMode] = useState<'hourly' | 'annual'>('hourly');
  const [contractorHourlyRate, setContractorHourlyRate] = useState<number>(75);
  const [contractorBillableHoursPerYear, setContractorBillableHoursPerYear] = useState<number>(1840);
  const [contractorAnnualGross, setContractorAnnualGross] = useState<number>(138000);
  const [contractorBusinessExpenses, setContractorBusinessExpenses] = useState<number>(6000);
  const [contractorHealthInsuranceCost, setContractorHealthInsuranceCost] = useState<number>(7200);
  const [applyQbi20PctDeduction, setApplyQbi20PctDeduction] = useState<boolean>(true);

  const result = useMemo(
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

  const handleReset = () => {
    setFilingStatus('single');
    setW2Salary(100000);
    setW2EmployerHealthBenefit(6500);
    setW2Employer401kMatchPct(4);
    setW2PaidLeaveDays(20);
    setContractorMode('hourly');
    setContractorHourlyRate(75);
    setContractorBillableHoursPerYear(1840);
    setContractorAnnualGross(138000);
    setContractorBusinessExpenses(6000);
    setContractorHealthInsuranceCost(7200);
    setApplyQbi20PctDeduction(true);
  };

  return (
    <div className="space-y-6">
      <VerifiedSourceBadge
        authority={US_FICA_2025.source.authority}
        document="IRC § 1, § 1401 (Schedule SE) & § 199A (QBI Deduction)"
        verifiedDate={US_FICA_2025.source.verifiedDate}
        url={US_FICA_2025.source.url}
      />

      {/* Mobile UX Tabs for W-2 vs 1099 Inputs */}
      <div className="flex lg:hidden rounded-xl bg-[var(--bg)] p-1 border border-[var(--border)]">
        <button
          type="button"
          onClick={() => setMobileTab('w2')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
            mobileTab === 'w2' ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--muted)]'
          }`}
        >
          1. W-2 Employee Offer
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('1099')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
            mobileTab === '1099' ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--muted)]'
          }`}
        >
          2. 1099 Contractor Offer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* W-2 INPUTS */}
        <div
          className={`lg:col-span-4 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5 ${
            mobileTab === '1099' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>W-2 Full-Time Package</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
              Tax Filing Status
            </label>
            <select
              aria-label="Filing Status"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as UsFilingStatus)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
            >
              {(Object.keys(FILING_STATUS_LABELS) as UsFilingStatus[]).map((st) => (
                <option key={st} value={st}>
                  {FILING_STATUS_LABELS[st]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                W-2 Base Salary ($/yr)
              </label>
              <input
                type="number"
                value={w2Salary}
                onChange={(e) => setW2Salary(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="W-2 Base Salary"
              min={30000}
              max={350000}
              step={2500}
              value={w2Salary}
              onChange={setW2Salary}
              minLabel="$30k"
              midLabel="$190k"
              maxLabel="$350k"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Employer Health Subsidy ($/yr)
              </label>
              <input
                type="number"
                value={w2EmployerHealthBenefit}
                onChange={(e) => setW2EmployerHealthBenefit(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Employer Health Benefit"
              min={0}
              max={24000}
              step={500}
              value={w2EmployerHealthBenefit}
              onChange={setW2EmployerHealthBenefit}
              minLabel="$0"
              midLabel="$12k"
              maxLabel="$24k"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Employer 401(k) Match: {w2Employer401kMatchPct}%
              </label>
              <span className="text-xs font-bold text-emerald-600 tabular-nums">
                +{formatMoney(result.w2.employer401kMatch)}/yr
              </span>
            </div>
            <UnboxedSlider
              ariaLabel="Employer 401k Match Percentage"
              min={0}
              max={10}
              step={0.5}
              value={w2Employer401kMatchPct}
              onChange={setW2Employer401kMatchPct}
              minLabel="0%"
              midLabel="5%"
              maxLabel="10%"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Paid Leave + Holidays: {w2PaidLeaveDays} days
              </label>
              <span className="text-xs font-semibold text-[var(--muted)] tabular-nums">
                ({formatMoney(result.w2.ptoImplicitValue)} value)
              </span>
            </div>
            <UnboxedSlider
              ariaLabel="Paid Leave Days"
              min={0}
              max={45}
              step={1}
              value={w2PaidLeaveDays}
              onChange={setW2PaidLeaveDays}
              minLabel="0d"
              midLabel="20d"
              maxLabel="45d"
            />
          </div>
        </div>

        {/* 1099 INPUTS */}
        <div
          className={`lg:col-span-4 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5 ${
            mobileTab === 'w2' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>1099 Independent Contractor</span>
            </div>
            <div className="inline-flex rounded-lg border border-[var(--border)] p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setContractorMode('hourly')}
                className={`px-2 py-0.5 rounded-md ${
                  contractorMode === 'hourly' ? 'bg-blue-600 text-white' : 'text-[var(--muted)]'
                }`}
              >
                Hourly
              </button>
              <button
                type="button"
                onClick={() => setContractorMode('annual')}
                className={`px-2 py-0.5 rounded-md ${
                  contractorMode === 'annual' ? 'bg-blue-600 text-white' : 'text-[var(--muted)]'
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          {contractorMode === 'hourly' ? (
            <>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    1099 Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    value={contractorHourlyRate}
                    onChange={(e) => setContractorHourlyRate(Math.max(0, Number(e.target.value)))}
                    className="w-24 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                  />
                </div>
                <UnboxedSlider
                  ariaLabel="1099 Hourly Rate"
                  min={20}
                  max={250}
                  step={2.5}
                  value={contractorHourlyRate}
                  onChange={setContractorHourlyRate}
                  minLabel="$20/hr"
                  midLabel="$125/hr"
                  maxLabel="$250/hr"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Billable Hours / Year
                  </label>
                  <input
                    type="number"
                    value={contractorBillableHoursPerYear}
                    onChange={(e) => setContractorBillableHoursPerYear(Math.max(1, Number(e.target.value)))}
                    className="w-24 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                  />
                </div>
                <UnboxedSlider
                  ariaLabel="Billable Hours Per Year"
                  min={1000}
                  max={2200}
                  step={40}
                  value={contractorBillableHoursPerYear}
                  onChange={setContractorBillableHoursPerYear}
                  minLabel="1,000h"
                  midLabel="1,840h (46wk)"
                  maxLabel="2,200h"
                />
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  1099 Annual Gross ($/yr)
                </label>
                <input
                  type="number"
                  value={contractorAnnualGross}
                  onChange={(e) => setContractorAnnualGross(Math.max(0, Number(e.target.value)))}
                  className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                />
              </div>
              <UnboxedSlider
                ariaLabel="1099 Annual Gross"
                min={30000}
                max={450000}
                step={2500}
                value={contractorAnnualGross}
                onChange={setContractorAnnualGross}
                minLabel="$30k"
                midLabel="$240k"
                maxLabel="$450k"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Business Expenses ($/yr)
              </label>
              <input
                type="number"
                value={contractorBusinessExpenses}
                onChange={(e) => setContractorBusinessExpenses(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Business Expenses"
              min={0}
              max={50000}
              step={1000}
              value={contractorBusinessExpenses}
              onChange={setContractorBusinessExpenses}
              minLabel="$0"
              midLabel="$25k"
              maxLabel="$50k"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                1099 Health Insurance ($/yr)
              </label>
              <input
                type="number"
                value={contractorHealthInsuranceCost}
                onChange={(e) => setContractorHealthInsuranceCost(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="1099 Health Insurance Cost"
              min={0}
              max={24000}
              step={500}
              value={contractorHealthInsuranceCost}
              onChange={setContractorHealthInsuranceCost}
              minLabel="$0"
              midLabel="$12k"
              maxLabel="$24k"
            />
          </div>

          <label className="flex items-center gap-2 pt-1 text-xs font-semibold text-[var(--text)] cursor-pointer">
            <input
              type="checkbox"
              checked={applyQbi20PctDeduction}
              onChange={(e) => setApplyQbi20PctDeduction(e.target.checked)}
              className="rounded border-[var(--border)] text-blue-600"
            />
            <span>Apply 20% QBI Deduction (Section 199A)</span>
          </label>
        </div>

        {/* UNIFIED COMPARISON CARD (Right Column) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-500/5 p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Scale className="w-4 h-4" />
              <span>Exact Break-Even 1099 Solver</span>
            </div>

            <div>
              <div className="text-xs text-[var(--muted)]">
                To match your {formatMoney(w2Salary)} W-2 salary + benefits ({formatMoney(result.w2.totalPackageValue)}{' '}
                net value), your 1099 gross must be:
              </div>
              <div className="text-3xl font-extrabold tabular-nums text-[var(--text)] mt-1">
                {formatMoney(result.breakEven1099Gross)}
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 ml-2">
                  ({formatMoney(result.breakEven1099Hourly, 'USD', 2)}/hr)
                </span>
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-1">
                Computed dynamically across {result.billableHours.toLocaleString()} billable hrs/yr after SE tax,
                expenses, and health insurance.
              </div>
            </div>

            {/* Side-by-Side Net Comparison */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]">
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] font-bold text-[var(--muted)] uppercase">W-2 Total Net Value</div>
                <div className="text-lg font-extrabold tabular-nums mt-0.5">
                  {formatMoney(result.w2.totalPackageValue)}
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  {formatMoney(result.w2.netCash)} cash +{' '}
                  {formatMoney(result.w2.employerHealthBenefit + result.w2.employer401kMatch)} benefits
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] font-bold text-[var(--muted)] uppercase">1099 True Net Cash</div>
                <div className="text-lg font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatMoney(result.contractor.netTakeHome)}
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  From {formatMoney(result.contractor.grossRevenue)} gross
                </div>
              </div>
            </div>

            {/* Line-by-Line Comparison Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs border-collapse tabular-nums">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left">
                    <th className="py-1.5">Metric</th>
                    <th className="py-1.5 text-right">W-2</th>
                    <th className="py-1.5 text-right">1099</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-1.5">Gross Pay / Revenue</td>
                    <td className="py-1.5 text-right font-semibold">{formatMoney(result.w2.gross)}</td>
                    <td className="py-1.5 text-right font-semibold">{formatMoney(result.contractor.grossRevenue)}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">FICA / SE Tax</td>
                    <td className="py-1.5 text-right">−{formatMoney(result.w2.ficaTax)}</td>
                    <td className="py-1.5 text-right">−{formatMoney(result.contractor.seTax)}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">Federal Income Tax</td>
                    <td className="py-1.5 text-right">−{formatMoney(result.w2.federalTax)}</td>
                    <td className="py-1.5 text-right">−{formatMoney(result.contractor.federalIncomeTax)}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">Benefits / Expenses</td>
                    <td className="py-1.5 text-right text-emerald-600">
                      +{formatMoney(result.w2.employerHealthBenefit + result.w2.employer401kMatch)}
                    </td>
                    <td className="py-1.5 text-right text-rose-500">
                      −{formatMoney(contractorBusinessExpenses + contractorHealthInsuranceCost)}
                    </td>
                  </tr>
                  <tr className="font-bold text-[var(--text)]">
                    <td className="py-2">Net Total Compensation</td>
                    <td className="py-2 text-right">{formatMoney(result.w2.totalPackageValue)}</td>
                    <td className="py-2 text-right">{formatMoney(result.contractor.netTakeHome)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'Self-Employment Tax Calculator',
            path: '/finance/self-employment-tax-calculator',
            desc: 'Detailed IRS Schedule SE breakdown, 50% deduction, and quarterly 1040-ES payment schedule.',
          },
          {
            title: 'Freelance Hourly Rate Calculator',
            path: '/finance/salary-to-hourly-calculator',
            desc: 'Model billable utilization, overhead, and target freelance income.',
          },
          {
            title: 'Take-Home Pay Calculator',
            path: '/finance/take-home-pay-calculator',
            desc: 'Calculate net paycheck after federal, state, and payroll deductions.',
          },
        ]}
      />
    </div>
  );
}
