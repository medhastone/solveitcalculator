'use client';

import React from 'react';

export interface ChartBarData {
  label: string;
  value: number;
  secondaryValue?: number;
  formattedValue: string;
  color?: string;
}

interface CalculatorVisualChartProps {
  title: string;
  data: ChartBarData[];
  primaryLabel?: string;
  secondaryLabel?: string;
  currency?: boolean;
}

export default function CalculatorVisualChart({
  title,
  data,
  primaryLabel = 'Principal / Value',
  secondaryLabel = 'Interest / Growth',
  currency = true
}: CalculatorVisualChartProps) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => (d.secondaryValue ? d.value + d.secondaryValue : d.value)), 1);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            {primaryLabel}
          </span>
          {data.some((d) => d.secondaryValue !== undefined) && (
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              {secondaryLabel}
            </span>
          )}
        </div>
      </div>

      {/* Chart Bars */}
      <div className="space-y-3 pt-2">
        {data.map((item, idx) => {
          const primaryPercent = (item.value / maxVal) * 100;
          const secondaryPercent = item.secondaryValue ? (item.secondaryValue / maxVal) * 100 : 0;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{item.label}</span>
                <span className="font-mono text-white font-semibold">{item.formattedValue}</span>
              </div>
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${primaryPercent}%` }}
                  className="bg-indigo-500 h-full transition-all duration-300"
                  title={`${primaryLabel}: ${item.value}`}
                />
                {secondaryPercent > 0 && (
                  <div
                    style={{ width: `${secondaryPercent}%` }}
                    className="bg-emerald-400 h-full transition-all duration-300"
                    title={`${secondaryLabel}: ${item.secondaryValue}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
