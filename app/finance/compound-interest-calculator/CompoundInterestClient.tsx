'use client';

import React, { useState, useMemo } from 'react';
import { RotateCcw, DollarSign, Percent, TrendingUp, Calendar } from 'lucide-react';
import CalculatorBreakdownTabs from '@/components/calculator/CalculatorBreakdownTabs';
import CalculatorVisualChart, { ChartBarData } from '@/components/calculator/CalculatorVisualChart';

export default function CompoundInterestClient() {
  const [initialDeposit, setInitialDeposit] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [interestRate, setInterestRate] = useState<number>(8.0);
  const [years, setYears] = useState<number>(20);
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12); // 12 = monthly, 1 = annually

  // Calculation
  const { futureValue, totalContributions, totalInterestEarned, growthData } = useMemo(() => {
    const r = interestRate / 100;
    const n = compoundFrequency;
    const totalPeriods = n * years;
    const periodicRate = r / n;

    // Growth on initial
    const principalGrowth = initialDeposit * Math.pow(1 + periodicRate, totalPeriods);

    // Growth on PMT (monthly converted to compounding periods)
    const pmtPerPeriod = (monthlyContribution * 12) / n;
    const pmtGrowth =
      pmtPerPeriod > 0
        ? pmtPerPeriod * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate)
        : 0;

    const fv = principalGrowth + pmtGrowth;
    const totalDeposited = initialDeposit + monthlyContribution * 12 * years;
    const totalInterest = Math.max(0, fv - totalDeposited);

    // Milestone trajectory (Years 1, 5, 10, 15, 20, 25, 30)
    const milestoneYears = [1, 5, 10, 15, 20, 25, 30, years]
      .filter((y, idx, self) => y <= years && self.indexOf(y) === idx)
      .sort((a, b) => a - b);

    const chartData: ChartBarData[] = milestoneYears.map((yr) => {
      const periods = n * yr;
      const princG = initialDeposit * Math.pow(1 + periodicRate, periods);
      const pmtG =
        pmtPerPeriod > 0
          ? pmtPerPeriod * ((Math.pow(1 + periodicRate, periods) - 1) / periodicRate)
          : 0;
      const totalAtYr = princG + pmtG;
      const contribAtYr = initialDeposit + monthlyContribution * 12 * yr;
      const interestAtYr = Math.max(0, totalAtYr - contribAtYr);

      return {
        label: `Year ${yr}`,
        value: Math.round(contribAtYr),
        secondaryValue: Math.round(interestAtYr),
        formattedValue: `$${Math.round(totalAtYr).toLocaleString()}`
      };
    });

    return {
      futureValue: fv,
      totalContributions: totalDeposited,
      totalInterestEarned: totalInterest,
      growthData: chartData
    };
  }, [initialDeposit, monthlyContribution, interestRate, years, compoundFrequency]);

  const handleReset = () => {
    setInitialDeposit(10000);
    setMonthlyContribution(500);
    setInterestRate(8.0);
    setYears(20);
    setCompoundFrequency(12);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Investment Parameters
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Initial Deposit */}
            <div>
              <label htmlFor="initial-deposit" className="block text-xs font-medium text-slate-400 mb-1">
                Initial Investment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                <input
                  id="initial-deposit"
                  type="number"
                  min="0"
                  max="10000000"
                  step="1000"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Monthly Contribution */}
            <div>
              <label htmlFor="monthly-contribution" className="block text-xs font-medium text-slate-400 mb-1">
                Monthly Contribution
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                <input
                  id="monthly-contribution"
                  type="number"
                  min="0"
                  max="1000000"
                  step="50"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Annual Return Rate */}
            <div>
              <label htmlFor="interest-rate" className="block text-xs font-medium text-slate-400 mb-1">
                Estimated Annual Return
              </label>
              <div className="relative">
                <input
                  id="interest-rate"
                  type="number"
                  min="0.1"
                  max="40"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
                  className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">%</span>
              </div>
            </div>

            {/* Investment Horizon */}
            <div>
              <label htmlFor="years-horizon" className="block text-xs font-medium text-slate-400 mb-1">
                Investment Horizon
              </label>
              <div className="relative">
                <input
                  id="years-horizon"
                  type="number"
                  min="1"
                  max="60"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
                  className="w-full pl-3 pr-14 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">Years</span>
              </div>
            </div>

            {/* Compounding Frequency */}
            <div className="sm:col-span-2">
              <label htmlFor="compound-freq" className="block text-xs font-medium text-slate-400 mb-1">
                Compounding Frequency
              </label>
              <select
                id="compound-freq"
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={12}>Monthly (12 times/year - Standard Investment Account)</option>
                <option value={365}>Daily (365 times/year - High Yield Savings Account)</option>
                <option value={4}>Quarterly (4 times/year - Dividends)</option>
                <option value={1}>Annually (1 time/year - Certificates of Deposit)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Panel: Primary Hero Metric */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-900/40 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Projected Future Balance
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mb-2">
              ${Math.round(futureValue).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Total future portfolio balance after {years} years of compounding growth.
            </p>

            <div className="space-y-2 text-xs border-t border-slate-800/80 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Total Out-of-Pocket Deposits:
                </span>
                <span className="font-mono text-white font-semibold">
                  ${totalContributions.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Total Compound Interest:
                </span>
                <span className="font-mono text-emerald-300 font-bold">
                  +${Math.round(totalInterestEarned).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">Interest-to-Deposit Ratio: </span>
            <span className="font-mono text-amber-300 font-bold">
              {totalContributions > 0 ? ((totalInterestEarned / totalContributions) * 100).toFixed(1) : 0}%
            </span>
            <span className="text-slate-500 block text-[11px] mt-0.5">
              Interest generates {totalContributions > 0 ? (totalInterestEarned / totalContributions).toFixed(2) : 0}× your original capital.
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <CalculatorBreakdownTabs
        summaryContent={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Initial Starting Deposit</span>
              <span className="text-xl font-bold font-mono text-white">${initialDeposit.toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Invested on Day 1</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Recurring Deposits</span>
              <span className="text-xl font-bold font-mono text-indigo-300">${(monthlyContribution * 12 * years).toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 block mt-1">${monthlyContribution}/mo over {years} years</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Compound Growth Multiplier</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{totalContributions > 0 ? (futureValue / totalContributions).toFixed(2) : 0}×</span>
              <span className="text-[11px] text-slate-500 block mt-1">Total future value / Total deposits</span>
            </div>
          </div>
        }
        chartContent={
          <CalculatorVisualChart
            title={`Cumulative Capital Deposits vs. Compound Interest Growth (${years} Years)`}
            data={growthData}
            primaryLabel="Total Contributions"
            secondaryLabel="Compound Interest"
          />
        }
        tableContent={
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Milestone</th>
                  <th className="py-2.5 px-3">Total Invested</th>
                  <th className="py-2.5 px-3">Interest Earned</th>
                  <th className="py-2.5 px-3">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {growthData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 font-semibold text-white">{row.label}</td>
                    <td className="py-2.5 px-3 text-indigo-300">${row.value.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-emerald-300">${(row.secondaryValue || 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-white font-bold">{row.formattedValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      />
    </div>
  );
}
