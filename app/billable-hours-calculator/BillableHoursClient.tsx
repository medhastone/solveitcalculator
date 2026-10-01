'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export default function BillableHoursClient() {
  const [totalWorkingHoursPerWeek, setTotalWorkingHoursPerWeek] = useState(40);
  const [workingWeeksPerYear, setWorkingWeeksPerYear] = useState(48); // 4 weeks vacation/PTO
  const [targetAnnualIncome, setTargetAnnualIncome] = useState(120000);
  const [annualBusinessExpenses, setAnnualBusinessExpenses] = useState(18000);
  const [targetProfitMarginPct, setTargetProfitMarginPct] = useState(15);
  const [targetUtilizationPct, setTargetUtilizationPct] = useState(65); // 65% billable, 35% admin/sales
  const [taxRatePct, setTaxRatePct] = useState(25);
  const [currency, setCurrency] = useState('$');

  const metrics = useMemo(() => {
    const totalAvailableHoursYear = totalWorkingHoursPerWeek * workingWeeksPerYear;
    const billableHoursYear = totalAvailableHoursYear * (targetUtilizationPct / 100);
    const nonBillableHoursYear = totalAvailableHoursYear - billableHoursYear;
    const billableHoursWeek = totalWorkingHoursPerWeek * (targetUtilizationPct / 100);

    // Target Gross Revenue Needed
    // Net Income = (Gross - Expenses - Profit) * (1 - TaxRate) -> Target Income Before Tax
    const preTaxIncomeNeeded = targetAnnualIncome / (1 - taxRatePct / 100);
    const totalOperatingCost = preTaxIncomeNeeded + annualBusinessExpenses;
    const targetRevenueWithProfit = totalOperatingCost * (1 + targetProfitMarginPct / 100);

    // Rates
    const breakEvenHourlyRate = totalOperatingCost / (billableHoursYear || 1);
    const recommendedHourlyRate = targetRevenueWithProfit / (billableHoursYear || 1);
    const dailyRate = recommendedHourlyRate * (billableHoursWeek / 5);

    return {
      totalAvailableHoursYear,
      billableHoursYear,
      nonBillableHoursYear,
      billableHoursWeek,
      preTaxIncomeNeeded,
      totalOperatingCost,
      targetRevenueWithProfit,
      breakEvenHourlyRate,
      recommendedHourlyRate,
      dailyRate,
    };
  }, [
    totalWorkingHoursPerWeek,
    workingWeeksPerYear,
    targetAnnualIncome,
    annualBusinessExpenses,
    targetProfitMarginPct,
    targetUtilizationPct,
    taxRatePct,
  ]);

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-4 pb-16 font-body-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/time-date" className="hover:text-primary transition-colors">Time &amp; Date</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">Billable Hours Calculator</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            Agency &amp; Freelance Economics
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mb-3">
            Billable Hours Calculator
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl">
            Calculate billable hours, effective hourly rate, utilization, target revenue, and capacity. Built for freelancers, consultants, agencies, and service teams.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Inputs */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Time Capacity Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-on-surface mb-4">
                1. Capacity &amp; Utilization Targets
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Target Total Hours / Week
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="80"
                    value={totalWorkingHoursPerWeek}
                    onChange={(e) => setTotalWorkingHoursPerWeek(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface font-mono"
                  />
                  <span className="text-[11px] text-on-surface-variant mt-1 block">
                    Standard full-time: 40 hrs
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Working Weeks / Year (After PTO)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="52"
                    value={workingWeeksPerYear}
                    onChange={(e) => setWorkingWeeksPerYear(Math.min(52, Math.max(1, parseInt(e.target.value) || 48)))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface font-mono"
                  />
                  <span className="text-[11px] text-on-surface-variant mt-1 block">
                    52 wks minus {52 - workingWeeksPerYear} wks holiday &amp; sick days
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    Target Billable Utilization Rate: <span className="text-primary font-bold">{targetUtilizationPct}%</span>
                  </label>
                  <span className="text-xs font-mono text-on-surface-variant">
                    {(metrics.billableHoursWeek).toFixed(1)} hrs billable / wk
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="5"
                  value={targetUtilizationPct}
                  onChange={(e) => setTargetUtilizationPct(parseInt(e.target.value) || 65)}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant mt-1 font-mono">
                  <span>20% (High Admin/Sales)</span>
                  <span>65% (Industry Standard)</span>
                  <span>95% (Pure Delivery)</span>
                </div>
              </div>
            </div>

            {/* Financial Objectives Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center justify-between">
                <span>2. Income &amp; Business Overheads</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-mono">Currency:</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="text-xs bg-surface-container border border-outline-variant/40 rounded-lg px-2 py-1 font-mono font-bold"
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="CA$">CAD ($)</option>
                    <option value="A$">AUD ($)</option>
                    <option value="₹">INR (₹)</option>
                  </select>
                </div>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Target Take-Home Income ({currency}/yr)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={targetAnnualIncome}
                    onChange={(e) => setTargetAnnualIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Annual Business Overheads ({currency}/yr)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={annualBusinessExpenses}
                    onChange={(e) => setAnnualBusinessExpenses(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface font-mono"
                  />
                  <span className="text-[11px] text-on-surface-variant mt-1 block">
                    Software, equipment, legal, health insurance
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Estimated Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={taxRatePct}
                    onChange={(e) => setTaxRatePct(Math.min(90, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Target Business Profit Margin (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={targetProfitMarginPct}
                    onChange={(e) => setTargetProfitMarginPct(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Target Rate Banner */}
            <div className="bg-gradient-to-br from-primary/15 via-surface-container-lowest to-surface-container-lowest border border-primary/30 rounded-2xl p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary font-mono block mb-1">
                Target Billable Hourly Rate
              </span>
              <div className="text-4xl sm:text-5xl font-mono font-bold text-on-surface tracking-tight mb-2">
                {currency}{metrics.recommendedHourlyRate.toFixed(2)}<span className="text-lg font-normal text-on-surface-variant">/hr</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Billing this rate at {targetUtilizationPct}% utilization ({metrics.billableHoursYear.toFixed(0)} hrs/yr) achieves your {currency}{targetAnnualIncome.toLocaleString()} take-home income while covering {currency}{annualBusinessExpenses.toLocaleString()} expenses and taxes.
              </p>
            </div>

            {/* Capacity & Revenue Breakdown Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h2 className="text-base font-semibold text-on-surface">Revenue &amp; Hours Matrix</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-xs text-on-surface-variant">Recommended Day Rate (8h billable)</span>
                  <span className="text-sm font-bold font-mono text-on-surface">
                    {currency}{(metrics.recommendedHourlyRate * 8).toFixed(2)}/day
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-xs text-on-surface-variant">Break-Even Hourly Rate (0% Profit)</span>
                  <span className="text-sm font-bold font-mono text-on-surface">
                    {currency}{metrics.breakEvenHourlyRate.toFixed(2)}/hr
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-xs text-on-surface-variant">Annual Target Gross Invoicing</span>
                  <span className="text-sm font-bold font-mono text-primary">
                    {currency}{metrics.targetRevenueWithProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {/* Annual Time Distribution Bar */}
              <div className="pt-2">
                <div className="text-xs font-medium text-on-surface-variant mb-2 flex justify-between">
                  <span>Annual Hours: {metrics.totalAvailableHoursYear} hrs</span>
                  <span className="font-mono text-primary">{metrics.billableHoursYear.toFixed(0)}h Billable</span>
                </div>
                <div className="h-3 rounded-full bg-surface-container-high overflow-hidden flex">
                  <div
                    style={{ width: `${targetUtilizationPct}%` }}
                    className="bg-primary h-full transition-all"
                    title={`Billable: ${metrics.billableHoursYear.toFixed(0)}h`}
                  />
                  <div
                    style={{ width: `${100 - targetUtilizationPct}%` }}
                    className="bg-outline/30 h-full transition-all"
                    title={`Non-Billable (Admin/Sales): ${metrics.nonBillableHoursYear.toFixed(0)}h`}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-on-surface-variant mt-1.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    Billable: {metrics.billableHoursYear.toFixed(0)}h
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-outline/40 inline-block" />
                    Admin/Sales: {metrics.nonBillableHoursYear.toFixed(0)}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
