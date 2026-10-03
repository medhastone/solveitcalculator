'use client';

import React, { useState } from 'react';
import { BarChart3, Table as TableIcon, Layers } from 'lucide-react';

export interface BreakdownTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CalculatorBreakdownTabsProps {
  summaryContent: React.ReactNode;
  chartContent?: React.ReactNode;
  tableContent?: React.ReactNode;
}

export default function CalculatorBreakdownTabs({
  summaryContent,
  chartContent,
  tableContent
}: CalculatorBreakdownTabsProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'chart' | 'table'>('summary');

  return (
    <div className="mt-8 border-t border-slate-800 pt-6">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'summary'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Summary</span>
          </button>

          {chartContent && (
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'chart'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Visual Chart</span>
            </button>
          )}

          {tableContent && (
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Schedule Table</span>
            </button>
          )}
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Interactive Live Breakdown
        </span>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'summary' && <div>{summaryContent}</div>}
        {activeTab === 'chart' && chartContent && <div>{chartContent}</div>}
        {activeTab === 'table' && tableContent && <div>{tableContent}</div>}
      </div>
    </div>
  );
}
