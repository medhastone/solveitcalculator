'use client';

import React, { useState, useMemo } from 'react';
import { RotateCcw, Percent, Calculator, ArrowRight } from 'lucide-react';
import CalculatorBreakdownTabs from '@/components/calculator/CalculatorBreakdownTabs';
import CalculatorVisualChart, { ChartBarData } from '@/components/calculator/CalculatorVisualChart';

export default function PercentageCalculatorClient() {
  // Mode 1: What is X% of Y
  const [val1Percent, setVal1Percent] = useState<number>(25);
  const [val1Base, setVal1Base] = useState<number>(200);

  // Mode 2: Percentage Increase / Decrease (from X to Y)
  const [val2From, setVal2From] = useState<number>(80);
  const [val2To, setVal2To] = useState<number>(100);

  // Mode 3: X is what percent of Y
  const [val3Part, setVal3Part] = useState<number>(45);
  const [val3Whole, setVal3Whole] = useState<number>(150);

  // Results
  const res1 = useMemo(() => (val1Percent / 100) * val1Base, [val1Percent, val1Base]);

  const res2 = useMemo(() => {
    if (val2From === 0) return { pct: 0, isIncrease: true, diff: 0 };
    const diff = val2To - val2From;
    const pct = (diff / Math.abs(val2From)) * 100;
    return { pct, isIncrease: diff >= 0, diff };
  }, [val2From, val2To]);

  const res3 = useMemo(() => {
    if (val3Whole === 0) return 0;
    return (val3Part / val3Whole) * 100;
  }, [val3Part, val3Whole]);

  const chartData: ChartBarData[] = useMemo(() => {
    return [
      { label: `Part (${val1Percent}%)`, value: res1, formattedValue: res1.toLocaleString() },
      { label: `Remaining (${100 - val1Percent}%)`, value: Math.max(0, val1Base - res1), formattedValue: (val1Base - res1).toLocaleString() }
    ];
  }, [val1Percent, val1Base, res1]);

  const handleReset = () => {
    setVal1Percent(25);
    setVal1Base(200);
    setVal2From(80);
    setVal2To(100);
    setVal3Part(45);
    setVal3Whole(150);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Percentage Solvers
        </h3>
        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Percentage of a Number */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
              1. Percentage of a Number
            </h4>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Percentage (X)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={val1Percent}
                    onChange={(e) => setVal1Percent(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 rounded bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">%</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Of Number (Y)</label>
                <input
                  type="number"
                  value={val1Base}
                  onChange={(e) => setVal1Base(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 bg-slate-950/60 -mx-5 -mb-5 p-4 rounded-b-xl">
            <span className="text-[11px] text-slate-400 block mb-0.5">Answer ({val1Percent}% of {val1Base}):</span>
            <span className="text-xl font-bold font-mono text-white">{res1.toLocaleString()}</span>
          </div>
        </div>

        {/* Module 2: Percentage Change (Increase/Decrease) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
              2. Percentage Increase / Decrease
            </h4>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">From Value</label>
                <input
                  type="number"
                  value={val2From}
                  onChange={(e) => setVal2From(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">To Value</label>
                <input
                  type="number"
                  value={val2To}
                  onChange={(e) => setVal2To(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 bg-slate-950/60 -mx-5 -mb-5 p-4 rounded-b-xl">
            <span className="text-[11px] text-slate-400 block mb-0.5">
              Change ({val2From} → {val2To}):
            </span>
            <span className={`text-xl font-bold font-mono ${res2.isIncrease ? 'text-emerald-400' : 'text-rose-400'}`}>
              {res2.pct >= 0 ? `+${res2.pct.toFixed(2)}%` : `${res2.pct.toFixed(2)}%`}
            </span>
          </div>
        </div>

        {/* Module 3: Proportion Ratio */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              3. Proportion Ratio (X is what % of Y)
            </h4>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Part (X)</label>
                <input
                  type="number"
                  value={val3Part}
                  onChange={(e) => setVal3Part(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Whole (Y)</label>
                <input
                  type="number"
                  value={val3Whole}
                  onChange={(e) => setVal3Whole(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 bg-slate-950/60 -mx-5 -mb-5 p-4 rounded-b-xl">
            <span className="text-[11px] text-slate-400 block mb-0.5">
              Proportion ({val3Part} of {val3Whole}):
            </span>
            <span className="text-xl font-bold font-mono text-amber-300">
              {res3.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Tabs */}
      <CalculatorBreakdownTabs
        summaryContent={
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white text-sm">Arithmetic Proof & Derivation:</div>
            <div>• Calculation 1: ({val1Percent} ÷ 100) × {val1Base} = <strong>{res1}</strong></div>
            <div>• Calculation 2: (({val2To} - {val2From}) ÷ |{val2From}|) × 100% = <strong>{res2.pct.toFixed(2)}%</strong></div>
            <div>• Calculation 3: ({val3Part} ÷ {val3Whole}) × 100% = <strong>{res3.toFixed(2)}%</strong></div>
          </div>
        }
        chartContent={
          <CalculatorVisualChart
            title={`Proportional Distribution of ${val1Base} (${val1Percent}% vs. ${100 - val1Percent}%)`}
            data={chartData}
            primaryLabel="Selected Portion"
            currency={false}
          />
        }
      />
    </div>
  );
}
