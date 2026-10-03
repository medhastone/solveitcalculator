'use client';

import React, { useState, useMemo } from 'react';
import { TimeToolDefinition } from '@/lib/time-date/types';
import { getTodayReferenceMetrics, addSubtractDate } from '@/lib/time-date/calculations';
import { Calendar, Copy, Check, Sparkles, Clock } from 'lucide-react';

interface Props {
  tool: TimeToolDefinition;
}

export default function DynamicDateReference({ tool }: Props) {
  const [copied, setCopied] = useState(false);
  const [daysOffset, setDaysOffset] = useState<number>(tool.relativeDaysOffset || 30);
  const [weeksOffset, setWeeksOffset] = useState<number>(tool.relativeWeeksOffset || 4);
  const [monthsOffset, setMonthsOffset] = useState<number>(tool.relativeMonthsOffset || 6);

  const now = useMemo(() => new Date(), []);
  const todayMetrics = useMemo(() => getTodayReferenceMetrics(now), [now]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculatedOffset = useMemo(() => {
    if (tool.relativeDaysOffset !== undefined || tool.slug.includes('days-from-today')) {
      const target = addSubtractDate(now, { days: daysOffset, operation: 'add' });
      const targetMetrics = getTodayReferenceMetrics(target);
      return {
        targetDate: target,
        metrics: targetMetrics,
        title: `${daysOffset} Days From Today`,
      };
    }

    if (tool.relativeWeeksOffset !== undefined || tool.slug.includes('weeks-from-today')) {
      const target = addSubtractDate(now, { weeks: weeksOffset, operation: 'add' });
      const targetMetrics = getTodayReferenceMetrics(target);
      return {
        targetDate: target,
        metrics: targetMetrics,
        title: `${weeksOffset} Weeks From Today`,
      };
    }

    if (tool.relativeMonthsOffset !== undefined || tool.slug.includes('months-from-today')) {
      const target = addSubtractDate(now, { months: monthsOffset, operation: 'add' });
      const targetMetrics = getTodayReferenceMetrics(target);
      return {
        targetDate: target,
        metrics: targetMetrics,
        title: `${monthsOffset} Months From Today`,
      };
    }

    return null;
  }, [tool, now, daysOffset, weeksOffset, monthsOffset]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-10">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-base">
            {tool.name}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Real-Time Calendar Sync</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* If offset calculator, show interactive slider */}
        {calculatedOffset && (
          <div className="max-w-lg mb-8 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Adjust Interval Offset
              </label>
              <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {tool.relativeDaysOffset !== undefined || tool.slug.includes('days-from-today')
                  ? `${daysOffset} Days`
                  : tool.relativeWeeksOffset !== undefined || tool.slug.includes('weeks-from-today')
                  ? `${weeksOffset} Weeks`
                  : `${monthsOffset} Months`}
              </span>
            </div>

            {tool.relativeDaysOffset !== undefined || tool.slug.includes('days-from-today') ? (
              <input
                type="range"
                min="1"
                max="365"
                value={daysOffset}
                onChange={(e) => setDaysOffset(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            ) : tool.relativeWeeksOffset !== undefined || tool.slug.includes('weeks-from-today') ? (
              <input
                type="range"
                min="1"
                max="52"
                value={weeksOffset}
                onChange={(e) => setWeeksOffset(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            ) : (
              <input
                type="range"
                min="1"
                max="36"
                value={monthsOffset}
                onChange={(e) => setMonthsOffset(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            )}
          </div>
        )}

        {/* Primary Result Display */}
        <div className="bg-slate-950 text-white rounded-xl p-6 relative overflow-hidden mb-6">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Live Reference Date
            </span>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  calculatedOffset
                    ? `${calculatedOffset.metrics.formattedLong} (${calculatedOffset.metrics.isoDate})`
                    : todayMetrics.formattedLong
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Date'}</span>
            </button>
          </div>

          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mb-1 tabular-nums">
            {calculatedOffset ? calculatedOffset.metrics.formattedLong : todayMetrics.formattedLong}
          </div>
          <div className="text-sm text-slate-400 font-mono mb-6">
            ISO 8601: {calculatedOffset ? calculatedOffset.metrics.isoDate : todayMetrics.isoDate}
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-400 mb-0.5">Day of Week</div>
              <div className="text-sm font-semibold text-slate-100 font-mono">
                {calculatedOffset ? calculatedOffset.metrics.dayOfWeek : todayMetrics.dayOfWeek}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-400 mb-0.5">Day of Year</div>
              <div className="text-sm font-semibold text-slate-100 font-mono">
                Day {calculatedOffset ? calculatedOffset.metrics.dayOfYear : todayMetrics.dayOfYear} of {todayMetrics.totalDaysInYear}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-400 mb-0.5">ISO Week #</div>
              <div className="text-sm font-semibold text-slate-100 font-mono">
                Week {calculatedOffset ? calculatedOffset.metrics.weekNumber : todayMetrics.weekNumber}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-400 mb-0.5">Calendar Quarter</div>
              <div className="text-sm font-semibold text-slate-100 font-mono">
                Q{calculatedOffset ? calculatedOffset.metrics.currentQuarter : todayMetrics.currentQuarter}
              </div>
            </div>
          </div>
        </div>

        {/* Annual Progress Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              Days Left in Current Year
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {todayMetrics.daysRemainingInYear} Days Remaining
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              Weeks Left in Current Year
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {todayMetrics.weeksRemainingInYear} Weeks Remaining
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
