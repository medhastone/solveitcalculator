'use client';

import React, { useState, useMemo } from 'react';
import { RotateCcw, Calendar, Clock, Sparkles, Heart } from 'lucide-react';
import CalculatorBreakdownTabs from '@/components/calculator/CalculatorBreakdownTabs';
import CalculatorVisualChart, { ChartBarData } from '@/components/calculator/CalculatorVisualChart';

export default function AgeCalculatorClient() {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [birthDate, setBirthDate] = useState<string>('1995-07-14');
  const [targetDate, setTargetDate] = useState<string>(todayStr);

  const ageResults = useMemo(() => {
    if (!birthDate || !targetDate) return null;

    const b = new Date(birthDate + 'T00:00:00');
    const t = new Date(targetDate + 'T00:00:00');

    if (isNaN(b.getTime()) || isNaN(t.getTime()) || b > t) {
      return null;
    }

    let years = t.getFullYear() - b.getFullYear();
    let months = t.getMonth() - b.getMonth();
    let days = t.getDate() - b.getDate();

    if (days < 0) {
      // Days in previous month
      const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = t.getTime() - b.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next birthday calculation
    const nextBdayYear = t.getMonth() > b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() >= b.getDate())
      ? t.getFullYear() + 1
      : t.getFullYear();
    const nextBday = new Date(nextBdayYear, b.getMonth(), b.getDate());
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));

    // Milestone chart (Days lived in decades)
    const chartData: ChartBarData[] = [
      { label: '0–10 Yrs', value: 3652, formattedValue: '3,652 Days' },
      { label: '10–20 Yrs', value: 3653, formattedValue: '3,653 Days' },
      { label: '20–30 Yrs', value: 3652, formattedValue: '3,652 Days' },
      {
        label: `Current (${years} Yrs)`,
        value: totalDays,
        formattedValue: `${totalDays.toLocaleString()} Days`
      }
    ];

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      daysUntilNextBday,
      nextAge: years + 1,
      chartData
    };
  }, [birthDate, targetDate]);

  const handleReset = () => {
    setBirthDate('1995-07-14');
    setTargetDate(todayStr);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Select Dates
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="birth-date" className="block text-xs font-medium text-slate-400 mb-1">
                Date of Birth
              </label>
              <input
                id="birth-date"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="target-date" className="block text-xs font-medium text-slate-400 mb-1">
                Calculate Age As Of
              </label>
              <input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right Hero Primary Answer */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-900/40 rounded-2xl p-6 flex flex-col justify-between">
          {ageResults ? (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                Exact Chronological Age
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                {ageResults.years} <span className="text-sm text-slate-400 font-normal">Years, </span>
                {ageResults.months} <span className="text-sm text-slate-400 font-normal">Months, </span>
                {ageResults.days} <span className="text-sm text-slate-400 font-normal">Days</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Total Solar Days Lived:</span>
                  <span className="font-mono text-white font-bold">{ageResults.totalDays.toLocaleString()} Days</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Total Elapsed Weeks:</span>
                  <span className="font-mono text-slate-300">{ageResults.totalWeeks.toLocaleString()} Weeks</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Total Hours:</span>
                  <span className="font-mono text-slate-300">{ageResults.totalHours.toLocaleString()} Hours</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-amber-300 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Next Birthday (Turning {ageResults.nextAge}):
                </span>
                <span className="font-mono text-white font-bold">{ageResults.daysUntilNextBday} days left</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              Please select a valid birth date and target date.
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      {ageResults && (
        <CalculatorBreakdownTabs
          summaryContent={
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Total Days</span>
                <span className="text-lg font-bold font-mono text-white">{ageResults.totalDays.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Total Weeks</span>
                <span className="text-lg font-bold font-mono text-indigo-300">{ageResults.totalWeeks.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Total Hours</span>
                <span className="text-lg font-bold font-mono text-emerald-400">{ageResults.totalHours.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Total Minutes</span>
                <span className="text-lg font-bold font-mono text-amber-300">{ageResults.totalMinutes.toLocaleString()}</span>
              </div>
            </div>
          }
          chartContent={
            <CalculatorVisualChart
              title="Milestone Solar Days Comparison"
              data={ageResults.chartData}
              primaryLabel="Days Elapsed"
              currency={false}
            />
          }
          tableContent={
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Exact Elapsed Value</th>
                    <th className="py-2.5 px-3">Standard Notation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Years</td>
                    <td className="py-2.5 px-3 text-indigo-300">{ageResults.years} Full Years</td>
                    <td className="py-2.5 px-3 text-slate-400">Gregorian Calendar</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Solar Days</td>
                    <td className="py-2.5 px-3 text-emerald-300">{ageResults.totalDays.toLocaleString()} Days</td>
                    <td className="py-2.5 px-3 text-slate-400">86,400 SI seconds/day</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Hours</td>
                    <td className="py-2.5 px-3 text-amber-300">{ageResults.totalHours.toLocaleString()} Hours</td>
                    <td className="py-2.5 px-3 text-slate-400">Elapsed solar time</td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        />
      )}
    </div>
  );
}
