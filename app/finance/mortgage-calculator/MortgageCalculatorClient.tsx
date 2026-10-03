'use client';

import React, { useState, useMemo } from 'react';
import { RotateCcw, DollarSign, Percent, Calendar, Shield, Home, PieChart } from 'lucide-react';
import CalculatorBreakdownTabs from '@/components/calculator/CalculatorBreakdownTabs';
import CalculatorVisualChart, { ChartBarData } from '@/components/calculator/CalculatorVisualChart';

export default function MortgageCalculatorClient() {
  // Inputs
  const [homePrice, setHomePrice] = useState<number>(450000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(5400);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState<number>(1400);
  const [hoaMonthly, setHoaMonthly] = useState<number>(0);

  // Derived down payment and loan amount
  const downPaymentDollars = useMemo(() => {
    return Math.round((homePrice * downPaymentPercent) / 100);
  }, [homePrice, downPaymentPercent]);

  const loanAmount = useMemo(() => {
    return Math.max(0, homePrice - downPaymentDollars);
  }, [homePrice, downPaymentDollars]);

  // Monthly Principal and Interest calculation
  const monthlyPI = useMemo(() => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTermYears <= 0) return 0;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;
    const factor = Math.pow(1 + monthlyRate, totalPayments);
    const payment = (loanAmount * (monthlyRate * factor)) / (factor - 1);
    return isFinite(payment) ? payment : 0;
  }, [loanAmount, interestRate, loanTermYears]);

  // Monthly escrow
  const monthlyTax = propertyTaxAnnual / 12;
  const monthlyInsurance = homeInsuranceAnnual / 12;
  const monthlyPmi = downPaymentPercent < 20 ? (loanAmount * 0.007) / 12 : 0;
  const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyPmi + hoaMonthly;

  const totalLifetimePayments = monthlyPI * loanTermYears * 12;
  const totalLifetimeInterest = Math.max(0, totalLifetimePayments - loanAmount);

  // Amortization Schedule summary points (Years 1, 5, 10, 15, 20, 25, 30)
  const amortizationChartData: ChartBarData[] = useMemo(() => {
    const years = [1, 5, 10, 15, 20, 25, loanTermYears].filter((y) => y <= loanTermYears);
    const monthlyRate = interestRate / 100 / 12;

    return years.map((yr) => {
      let balance = loanAmount;
      let totalPaidPrincipal = 0;
      let totalPaidInterest = 0;
      const months = yr * 12;

      for (let m = 1; m <= months; m++) {
        const intPayment = balance * monthlyRate;
        const princPayment = monthlyPI - intPayment;
        balance = Math.max(0, balance - princPayment);
        totalPaidPrincipal += princPayment;
        totalPaidInterest += intPayment;
      }

      return {
        label: `Year ${yr}`,
        value: Math.round(totalPaidPrincipal),
        secondaryValue: Math.round(totalPaidInterest),
        formattedValue: `$${Math.round(totalPaidPrincipal + totalPaidInterest).toLocaleString()}`
      };
    });
  }, [loanAmount, interestRate, loanTermYears, monthlyPI]);

  // Reset defaults
  const handleReset = () => {
    setHomePrice(450000);
    setDownPaymentPercent(20);
    setInterestRate(6.5);
    setLoanTermYears(30);
    setPropertyTaxAnnual(5400);
    setHomeInsuranceAnnual(1400);
    setHoaMonthly(0);
  };

  return (
    <div className="space-y-8">
      {/* Top Input Form & Primary Result Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs with inline units */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Loan & Purchase Parameters
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
            {/* Home Price */}
            <div>
              <label htmlFor="home-price" className="block text-xs font-medium text-slate-400 mb-1">
                Home Purchase Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                <input
                  id="home-price"
                  type="number"
                  min="10000"
                  max="10000000"
                  step="5000"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <label htmlFor="down-payment" className="block text-xs font-medium text-slate-400 mb-1">
                Down Payment ({downPaymentPercent}%)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                <input
                  id="down-payment"
                  type="number"
                  min="0"
                  max={homePrice}
                  step="1000"
                  value={downPaymentDollars}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const pct = homePrice > 0 ? (val / homePrice) * 100 : 0;
                    setDownPaymentPercent(Number(pct.toFixed(1)));
                  }}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label htmlFor="interest-rate" className="block text-xs font-medium text-slate-400 mb-1">
                Interest Rate (APR)
              </label>
              <div className="relative">
                <input
                  id="interest-rate"
                  type="number"
                  min="0.1"
                  max="25"
                  step="0.125"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
                  className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label htmlFor="loan-term" className="block text-xs font-medium text-slate-400 mb-1">
                Loan Term
              </label>
              <select
                id="loan-term"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={30}>30 Years (Fixed)</option>
                <option value={20}>20 Years (Fixed)</option>
                <option value={15}>15 Years (Fixed)</option>
                <option value={10}>10 Years (Fixed)</option>
              </select>
            </div>

            {/* Annual Property Tax */}
            <div>
              <label htmlFor="property-tax" className="block text-xs font-medium text-slate-400 mb-1">
                Annual Property Tax
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                <input
                  id="property-tax"
                  type="number"
                  min="0"
                  step="100"
                  value={propertyTaxAnnual}
                  onChange={(e) => setPropertyTaxAnnual(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Annual Home Insurance */}
            <div>
              <label htmlFor="home-insurance" className="block text-xs font-medium text-slate-400 mb-1">
                Annual Home Insurance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                <input
                  id="home-insurance"
                  type="number"
                  min="0"
                  step="50"
                  value={homeInsuranceAnnual}
                  onChange={(e) => setHomeInsuranceAnnual(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Primary Monthly Result Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-900/40 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              Estimated Monthly Payment
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mb-2">
              ${Math.round(totalMonthlyPayment).toLocaleString()}
              <span className="text-base text-slate-400 font-normal"> /mo</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Total monthly PITI payment (Principal, Interest, Taxes & Insurance).
            </p>

            {/* Component Summary Breakdown */}
            <div className="space-y-2 text-xs border-t border-slate-800/80 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Principal & Interest:
                </span>
                <span className="font-mono text-white font-semibold">
                  ${Math.round(monthlyPI).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Property Taxes:
                </span>
                <span className="font-mono text-slate-300">
                  ${Math.round(monthlyTax).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Home Insurance:
                </span>
                <span className="font-mono text-slate-300">
                  ${Math.round(monthlyInsurance).toLocaleString()}
                </span>
              </div>
              {monthlyPmi > 0 && (
                <div className="flex items-center justify-between text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    PMI (Under 20% down):
                  </span>
                  <span className="font-mono font-semibold">
                    ${Math.round(monthlyPmi).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Total Loan Principal:</span>
              <span className="font-mono text-white font-medium">${loanAmount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total 30-Yr Interest:</span>
              <span className="font-mono text-amber-300 font-medium">${Math.round(totalLifetimeInterest).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Breakdown Tabs: Summary, Visual Chart, Schedule Table */}
      <CalculatorBreakdownTabs
        summaryContent={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total Loan Amount</span>
              <span className="text-xl font-bold font-mono text-white">${loanAmount.toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Home Price minus Down Payment</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total Interest Paid</span>
              <span className="text-xl font-bold font-mono text-amber-300">${Math.round(totalLifetimeInterest).toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Cost of borrowing over {loanTermYears} years</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total Loan Cost</span>
              <span className="text-xl font-bold font-mono text-emerald-400">${Math.round(totalLifetimePayments).toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Principal plus lifetime interest</span>
            </div>
          </div>
        }
        chartContent={
          <CalculatorVisualChart
            title={`Cumulative Principal vs. Interest Paid (${loanTermYears}-Year Fixed Amortization)`}
            data={amortizationChartData}
            primaryLabel="Paid Principal"
            secondaryLabel="Cumulative Interest"
          />
        }
        tableContent={
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Milestone</th>
                  <th className="py-2.5 px-3">Principal Paid</th>
                  <th className="py-2.5 px-3">Interest Paid</th>
                  <th className="py-2.5 px-3">Cumulative Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {amortizationChartData.map((row, idx) => (
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
