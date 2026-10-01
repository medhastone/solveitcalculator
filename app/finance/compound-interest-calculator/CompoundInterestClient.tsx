'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Info, Calculator, Download, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

// Interfaces
interface CalculationData {
  year: number;
  principal: number;
  contributions: number;
  interest: number;
  balance: number;
}

export default function CompoundInterestClient() {
  const [principal, setPrincipal] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [years, setYears] = useState<number>(20);
  const [rate, setRate] = useState<number>(7);
  const [compoundFreq, setCompoundFreq] = useState<number>(12); // 12 = monthly, 1 = annually, 365 = daily
  
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData: CalculationData[] = useMemo(() => {
    const data: CalculationData[] = [];
    let currentBalance = principal;
    let totalContributions = 0;
    
    // Yearly breakdown
    for (let y = 0; y <= years; y++) {
      if (y === 0) {
        data.push({
          year: 0,
          principal: principal,
          contributions: 0,
          interest: 0,
          balance: principal,
        });
        continue;
      }

      // Calculate year by year for accurate charting when compounding != 1
      let yearStartBalance = currentBalance;
      let yearlyContribution = 0;

      // Compounding loop per period
      for (let c = 0; c < compoundFreq; c++) {
        // Add contribution for the period (assuming contribution freq matches compound freq for simplicity, or prorated)
        const periodContribution = (monthlyContribution * 12) / compoundFreq;
        currentBalance += periodContribution;
        yearlyContribution += periodContribution;
        totalContributions += periodContribution;

        // Apply interest
        const periodInterest = currentBalance * (rate / 100 / compoundFreq);
        currentBalance += periodInterest;
      }

      data.push({
        year: y,
        principal: principal,
        contributions: Math.round(totalContributions),
        interest: Math.round(currentBalance - principal - totalContributions),
        balance: Math.round(currentBalance),
      });
    }

    return data;
  }, [principal, monthlyContribution, years, rate, compoundFreq]);

  const finalData = chartData[chartData.length - 1];

  const handleExport = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Hydration safeguard
  if (!isMounted) return <div className="min-h-screen bg-surface" />;

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      {/* Hero Section */}
      <section className="bg-surface-container-low border-b border-outline-variant/30 pt-16 pb-12 px-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm font-semibold">
            <Calculator className="w-4 h-4" />
            <span>Financial Calculators</span>
          </div>
          <h1 className="font-headline-lg md:font-display-md text-on-surface font-bold tracking-tight">
            Compound Interest Calculator
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-3xl">
            Model your financial future with our free, precise compound interest calculator. 
            Adjust your initial investment, monthly contributions, and compounding frequency to visualize how the power of compounding accelerates wealth accumulation over time.
          </p>
        </div>
      </section>

      {/* Main Calculator Workspace */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-6">
              <div>
                <label className="block font-headline-sm text-on-surface mb-2">Initial Investment ($)</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block font-headline-sm text-on-surface mb-2">Monthly Contribution ($)</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block font-headline-sm text-on-surface mb-2">Investment Time Span (Years)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    className="w-full accent-primary"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                  <span className="font-data-mono font-bold text-on-surface min-w-[3rem] text-right">{years}</span>
                </div>
              </div>

              <div>
                <label className="block font-headline-sm text-on-surface mb-2">Estimated Annual Rate (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block font-headline-sm text-on-surface mb-2">Compounding Frequency</label>
                <select 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={compoundFreq}
                  onChange={(e) => setCompoundFreq(Number(e.target.value))}
                >
                  <option value={1}>Annually (1/yr)</option>
                  <option value={2}>Semi-Annually (2/yr)</option>
                  <option value={4}>Quarterly (4/yr)</option>
                  <option value={12}>Monthly (12/yr)</option>
                  <option value={365}>Daily (365/yr)</option>
                </select>
              </div>
            </div>
            
            {/* Quick Internal Links */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
              <h4 className="font-headline-sm mb-3">Related Calculators</h4>
              <ul className="space-y-2 text-primary font-body-sm">
                <li><Link href="/finance/investment-calculator" className="hover:underline">Investment ROI Calculator →</Link></li>
                <li><Link href="/finance/mortgage-calculator" className="hover:underline">Mortgage Amortization Tool →</Link></li>
                <li><Link href="/savings-calculators" className="hover:underline">Emergency Fund Planner →</Link></li>
              </ul>
            </div>
          </div>

          {/* Right Column: Results & Chart */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface p-5 rounded-2xl shadow-sm border border-outline-variant/30">
                <p className="text-on-surface-variant font-label-md mb-1 uppercase tracking-wider">Total Future Value</p>
                <p className="font-data-mono text-2xl md:text-3xl font-bold text-primary">{formatCurrency(finalData.balance)}</p>
              </div>
              <div className="bg-surface p-5 rounded-2xl shadow-sm border border-outline-variant/30">
                <p className="text-on-surface-variant font-label-md mb-1 uppercase tracking-wider">Total Interest</p>
                <p className="font-data-mono text-2xl md:text-3xl font-bold text-secondary">{formatCurrency(finalData.interest)}</p>
              </div>
              <div className="bg-surface p-5 rounded-2xl shadow-sm border border-outline-variant/30">
                <p className="text-on-surface-variant font-label-md mb-1 uppercase tracking-wider">Total Deposits</p>
                <p className="font-data-mono text-xl md:text-2xl font-bold text-on-surface">{formatCurrency(finalData.principal + finalData.contributions)}</p>
              </div>
              <div className="bg-surface p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-center items-center">
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest px-4 py-2 rounded-xl text-primary font-headline-sm transition-colors w-full justify-center h-full"
                >
                  <Download className="w-5 h-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="font-headline-md">Wealth Accumulation Over {years} Years</h3>
                <div className="flex items-center gap-4 text-xs font-label-md">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>Interest</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>Contributions</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-400 inline-block"></span>Principal</span>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              {(() => {
                const maxVal = Math.max(...chartData.map(d => d.balance), 1);
                const w = 700;
                const h = 300;
                const padL = 65;
                const padR = 20;
                const padT = 20;
                const padB = 40;
                const plotW = w - padL - padR;
                const plotH = h - padT - padB;

                const getX = (idx: number) => padL + (idx / Math.max(chartData.length - 1, 1)) * plotW;
                const getY = (val: number) => padT + plotH - (val / maxVal) * plotH;

                // Build Area Polygons
                const principalPoints = chartData.map((d, i) => `${getX(i)},${getY(d.principal)}`).join(' ');
                const principalArea = `${padL},${padT + plotH} ${principalPoints} ${getX(chartData.length - 1)},${padT + plotH}`;

                const depPoints = chartData.map((d, i) => `${getX(i)},${getY(d.principal + d.contributions)}`).join(' ');
                const revPrincipalPoints = [...chartData].reverse().map((d, i) => `${getX(chartData.length - 1 - i)},${getY(d.principal)}`).join(' ');
                const contribArea = `${depPoints} ${revPrincipalPoints}`;

                const totalPoints = chartData.map((d, i) => `${getX(i)},${getY(d.balance)}`).join(' ');
                const revDepPoints = [...chartData].reverse().map((d, i) => `${getX(chartData.length - 1 - i)},${getY(d.principal + d.contributions)}`).join(' ');
                const interestArea = `${totalPoints} ${revDepPoints}`;

                const activeData = hoveredIndex !== null && chartData[hoveredIndex] ? chartData[hoveredIndex] : chartData[chartData.length - 1];

                const yTicks = [0, 0.25, 0.5, 0.75, 1].map(pct => {
                  const val = maxVal * pct;
                  const formatted = val >= 1000000 ? `$${(val / 1000000).toFixed(1)}M` : `$${Math.round(val / 1000)}k`;
                  return { val, y: getY(val), label: formatted };
                });

                const xStep = Math.max(1, Math.floor(years / 5));
                const xTicks = chartData.filter((d, i) => d.year % xStep === 0 || i === chartData.length - 1);

                return (
                  <div className="relative w-full">
                    {/* Hover Info Card */}
                    {activeData && (
                      <div className="mb-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-on-surface font-headline-sm">Year {activeData.year}</span>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-slate-600 dark:text-slate-300">Principal: <strong className="font-data-mono">{formatCurrency(activeData.principal)}</strong></span>
                          <span className="text-blue-600 dark:text-blue-400">Deposits: <strong className="font-data-mono">{formatCurrency(activeData.contributions)}</strong></span>
                          <span className="text-emerald-600 dark:text-emerald-400">Interest: <strong className="font-data-mono">{formatCurrency(activeData.interest)}</strong></span>
                          <span className="text-primary font-bold">Total: <strong className="font-data-mono">{formatCurrency(activeData.balance)}</strong></span>
                        </div>
                      </div>
                    )}

                    <div className="w-full overflow-x-auto">
                      <svg
                        viewBox={`0 0 ${w} ${h}`}
                        className="w-full h-auto min-w-[500px] select-none"
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <defs>
                          <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                          </linearGradient>
                          <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                          </linearGradient>
                          <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.4" />
                          </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        {yTicks.map((tick, idx) => (
                          <g key={idx}>
                            <line
                              x1={padL}
                              y1={tick.y}
                              x2={w - padR}
                              y2={tick.y}
                              stroke="currentColor"
                              className="text-outline-variant/30"
                              strokeDasharray="4 4"
                            />
                            <text
                              x={padL - 8}
                              y={tick.y + 4}
                              textAnchor="end"
                              className="fill-on-surface-variant text-[11px] font-data-mono"
                            >
                              {tick.label}
                            </text>
                          </g>
                        ))}

                        {/* Area Paths */}
                        <polygon points={interestArea} fill="url(#interestGrad)" />
                        <polygon points={contribArea} fill="url(#contribGrad)" />
                        <polygon points={principalArea} fill="url(#principalGrad)" />

                        {/* Lines */}
                        <polyline points={totalPoints} fill="none" stroke="#059669" strokeWidth="2.5" />
                        <polyline points={depPoints} fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 3" />

                        {/* X Axis Labels */}
                        {xTicks.map((d) => (
                          <g key={d.year}>
                            <line
                              x1={getX(d.year)}
                              y1={padT + plotH}
                              x2={getX(d.year)}
                              y2={padT + plotH + 5}
                              stroke="currentColor"
                              className="text-outline-variant"
                            />
                            <text
                              x={getX(d.year)}
                              y={padT + plotH + 18}
                              textAnchor="middle"
                              className="fill-on-surface-variant text-[11px] font-data-mono"
                            >
                              Yr {d.year}
                            </text>
                          </g>
                        ))}

                        {/* Interactive Columns for Touch/Hover */}
                        {chartData.map((d, i) => {
                          const colW = plotW / Math.max(chartData.length, 1);
                          return (
                            <rect
                              key={i}
                              x={getX(i) - colW / 2}
                              y={padT}
                              width={colW}
                              height={plotH}
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredIndex(i)}
                              onTouchStart={() => setHoveredIndex(i)}
                            />
                          );
                        })}

                        {/* Active Year Vertical Guideline */}
                        {hoveredIndex !== null && chartData[hoveredIndex] && (
                          <g pointerEvents="none">
                            <line
                              x1={getX(hoveredIndex)}
                              y1={padT}
                              x2={getX(hoveredIndex)}
                              y2={padT + plotH}
                              stroke="#2563eb"
                              strokeWidth="2"
                              strokeDasharray="2 2"
                            />
                            <circle
                              cx={getX(hoveredIndex)}
                              cy={getY(chartData[hoveredIndex].balance)}
                              r="5"
                              fill="#10b981"
                              stroke="#ffffff"
                              strokeWidth="2"
                            />
                          </g>
                        )}
                      </svg>
                    </div>
                  </div>
                );
              })()}
            </div>
            
          </div>
        </div>
      </section>

      {/* SEO & Educational Content Sections */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        {/* Quick Answer */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
          <h2 className="font-headline-md text-primary mb-3 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            What is Compound Interest?
          </h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Compound interest is the interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, which only pays on the original deposit, compound interest allows your wealth to snowball, creating an exponential growth curve over time. It is widely considered the most powerful concept in finance and wealth generation.
          </p>
        </div>

        {/* Step by step */}
        <div className="space-y-6">
          <h2 className="font-headline-lg text-on-surface">How to Use the Compound Interest Calculator</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold mb-4">1</div>
              <h3 className="font-headline-sm mb-2">Set Your Baseline</h3>
              <p className="font-body-sm text-on-surface-variant">Enter your starting principal amount. This is the lump sum you are depositing today.</p>
            </div>
            <div className="bg-surface rounded-2xl p-6 border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold mb-4">2</div>
              <h3 className="font-headline-sm mb-2">Define Contributions</h3>
              <p className="font-body-sm text-on-surface-variant">Input how much you plan to consistently add each month to accelerate the compounding effect.</p>
            </div>
            <div className="bg-surface rounded-2xl p-6 border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold mb-4">3</div>
              <h3 className="font-headline-sm mb-2">Estimate Your Rate</h3>
              <p className="font-body-sm text-on-surface-variant">Enter the expected annual return. Historically, the S&P 500 averages around 7-10% annually before inflation.</p>
            </div>
            <div className="bg-surface rounded-2xl p-6 border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold mb-4">4</div>
              <h3 className="font-headline-sm mb-2">Select Time Horizon</h3>
              <p className="font-body-sm text-on-surface-variant">Choose how many years you intend to let the investment grow. Time is the most critical variable in compounding.</p>
            </div>
          </div>
        </div>

        {/* Formula Section */}
        <div className="space-y-6">
          <h2 className="font-headline-lg text-on-surface">The Compound Interest Formula</h2>
          <p className="font-body-md text-on-surface-variant">
            The mathematical formula utilized by financial analysts and our calculation engine to determine the future value of an investment is:
          </p>
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-8 text-center overflow-x-auto shadow-inner">
            <span className="font-data-mono text-2xl md:text-4xl text-on-surface">
              A = P(1 + r/n)<sup>nt</sup>
            </span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body-sm text-on-surface-variant list-disc pl-5">
            <li><strong>A</strong> = The future value of the investment/loan, including interest</li>
            <li><strong>P</strong> = The principal investment amount (the initial deposit)</li>
            <li><strong>r</strong> = The annual interest rate (decimal form)</li>
            <li><strong>n</strong> = The number of times that interest is compounded per year</li>
            <li><strong>t</strong> = The number of years the money is invested or borrowed for</li>
          </ul>
        </div>

        {/* Comparison Table */}
        <div className="space-y-6">
          <h2 className="font-headline-lg text-on-surface">Industry Benchmarks: Compound vs Simple Interest</h2>
          <p className="font-body-md text-on-surface-variant">
            Notice how the gap between simple interest and compound interest widens exponentially as time increases. Based on a $10,000 initial investment at 8% annual return.
          </p>
          <div className="overflow-x-auto border border-outline-variant/30 rounded-xl">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="p-4 font-headline-sm text-on-surface">Time Horizon</th>
                  <th className="p-4 font-headline-sm text-on-surface">Simple Interest Total</th>
                  <th className="p-4 font-headline-sm text-primary">Compound Interest Total</th>
                  <th className="p-4 font-headline-sm text-on-surface">Wealth Gap</th>
                </tr>
              </thead>
              <tbody className="text-body-sm text-on-surface-variant">
                <tr className="border-b border-outline-variant/30">
                  <td className="p-4 font-semibold">10 Years</td>
                  <td className="p-4">$18,000</td>
                  <td className="p-4 font-bold text-primary">$21,589</td>
                  <td className="p-4">+$3,589</td>
                </tr>
                <tr className="border-b border-outline-variant/30">
                  <td className="p-4 font-semibold">20 Years</td>
                  <td className="p-4">$26,000</td>
                  <td className="p-4 font-bold text-primary">$46,610</td>
                  <td className="p-4">+$20,610</td>
                </tr>
                <tr className="border-b border-outline-variant/30">
                  <td className="p-4 font-semibold">30 Years</td>
                  <td className="p-4">$34,000</td>
                  <td className="p-4 font-bold text-primary">$100,627</td>
                  <td className="p-4">+$66,627</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">40 Years</td>
                  <td className="p-4">$42,000</td>
                  <td className="p-4 font-bold text-primary">$217,245</td>
                  <td className="p-4">+$175,245</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* EEAT & Methodology */}
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row gap-6">
          <div className="shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-headline-sm text-on-surface mb-2">Mathematical Model &amp; Accuracy</h3>
            <p className="font-body-sm text-on-surface-variant mb-4">
              The calculations provided by the SolveItCalculator engine utilize standard geometric progression compounding formulas to ensure accurate projections over short and long investment horizons.
            </p>
            <div className="text-xs text-on-surface-variant/70">
              <strong>Last Updated:</strong> September 2026 &nbsp;|&nbsp; <strong>Methodology:</strong> Standard Geometric Progression Model
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 pb-12">
          <h2 className="font-headline-lg text-on-surface">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What is the Rule of 72?",
                a: "The Rule of 72 is a mental math shortcut used to estimate how long it takes an investment to double in value. Simply divide 72 by the annual rate of return. For example, at an 8% return, your money will double in approximately 9 years (72 ÷ 8 = 9)."
              },
              {
                q: "Does compounding frequency make a big difference?",
                a: "Yes. The more frequently interest is compounded (e.g., daily vs. annually), the higher the effective yield. However, over long periods, the difference between monthly and daily compounding is marginal compared to the impact of the interest rate itself."
              },
              {
                q: "Is inflation factored into this compound interest calculator?",
                a: "By default, this calculator shows nominal value (not adjusted for inflation). To estimate your 'real' return purchasing power, subtract the expected inflation rate (historically 2.5% - 3%) from your estimated annual rate."
              },
              {
                q: "Can I lose money with compound interest?",
                a: "While compound interest is a mathematical certainty, the underlying investments generating that interest (like index funds, stocks, or bonds) can fluctuate. Only high-yield savings accounts and CDs offer guaranteed interest rates."
              },
              {
                q: "Why is time the most important factor in compounding?",
                a: "Because the growth is exponential. The interest earned in year 30 is significantly larger than the interest earned in year 10, because the principal base has expanded massively. Starting 10 years earlier often yields more wealth than contributing twice as much money later in life."
              },
              {
                q: "What is the difference between APR and APY?",
                a: "APR (Annual Percentage Rate) is the simple interest rate over a year. APY (Annual Percentage Yield) takes compounding into account, representing the actual effective return you will earn over a year."
              },
              {
                q: "How are monthly contributions calculated here?",
                a: "In this model, monthly contributions are added at the end of each period, and interest is calculated based on the selected compounding frequency. It aligns with standard end-of-month payroll deduction models."
              },
              {
                q: "How does this compare to a simple interest calculator?",
                a: "A simple interest calculator only calculates interest on the initial principal. A compound interest calculator computes interest on the principal PLUS all previously accumulated interest, resulting in an upward-curving snowball effect."
              }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-surface rounded-xl border border-outline-variant/30 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-5 font-headline-sm cursor-pointer select-none">
                  {faq.q}
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-5 pb-5 font-body-sm text-on-surface-variant leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
