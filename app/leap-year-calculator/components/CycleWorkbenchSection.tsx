'use client';

import React, { useState, useMemo } from 'react';
import { CycleFilter } from '../types';
import { generateCycleYears, checkLeap } from '../utils';

interface CycleWorkbenchSectionProps {
  onSelectYear: (year: number) => void;
}

export default function CycleWorkbenchSection({ onSelectYear }: CycleWorkbenchSectionProps) {
  const [baseYear, setBaseYear] = useState<number>(2001);
  const [filter, setFilter] = useState<CycleFilter>('all');
  const [inspectedYear, setInspectedYear] = useState<number>(2028);

  const cycleYears = useMemo(() => {
    return generateCycleYears(baseYear);
  }, [baseYear]);

  const filteredYears = useMemo(() => {
    return cycleYears.filter((item) => {
      if (filter === 'leap') return item.isLeap;
      if (filter === 'common') return !item.isLeap;
      if (filter === 'centuries') return item.year % 100 === 0;
      return true;
    });
  }, [cycleYears, filter]);

  const inspectorInfo = useMemo(() => {
    return checkLeap(inspectedYear);
  }, [inspectedYear]);

  const handleExportCsv = () => {
    let csv = 'Year,IsLeapYear,FebruaryDays,TotalDays,RuleExplanation\n';
    cycleYears.forEach((item) => {
      csv += `${item.year},${item.isLeap},${item.febDays},${item.totalDays},"${item.reason}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Gregorian_Cycle_${baseYear}_${baseYear + 399}.csv`;
    link.click();
  };

  const getInspectorDescription = () => {
    if (inspectorInfo.isLeap) {
      if (inspectorInfo.isDiv400) {
        return 'Century Leap Year (366 Days, Feb 29). Divisible by 400! Rare occurrence.';
      }
      return 'Standard Leap Year (366 Days, Feb 29). Divisible by 4, not 100.';
    }
    if (inspectorInfo.isDiv100) {
      return 'Century Non-Leap Year (365 Days, Feb 28). Divisible by 100 but not 400.';
    }
    return 'Common Year (365 Days, Feb 28). Divisible by neither 4 nor 400.';
  };

  return (
    <section className="max-w-max-width-canvas mx-auto w-full flex flex-col gap-space-md" id="cycle-workbench">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="px-space-xs py-0.5 rounded-full bg-secondary-container/30 text-on-secondary-container font-label-caps text-label-caps uppercase font-bold">
              CALENDAR FACTS • 400-YEAR CYCLE
            </span>
            <span className="text-outline text-body-sm font-data-mono">146,097 Days</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
            The 400-Year Calendar Pattern
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Every 400 years, the calendar completely resets and repeats the exact same dates and weekdays.
          </p>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            className="px-space-sm py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-1 shadow-sm transition-all border border-outline-variant/20"
            id="downloadCycleCsvBtn"
            type="button"
            onClick={handleExportCsv}
          >
            <span className="material-symbols-outlined text-[18px]">download</span> Export Cycle CSV
          </button>
        </div>
      </div>

      {/* Cycle Vital Metrics Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm">
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col border border-outline-variant/15">
          <span className="font-label-caps text-label-caps uppercase text-outline">Leap Years in Cycle</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-numerical-display text-numerical-display text-primary font-bold">97</span>
            <span className="text-body-sm text-on-surface-variant">/ 400 years</span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Exactly 24.25% of all years</span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col border border-outline-variant/15">
          <span className="font-label-caps text-label-caps uppercase text-outline">Common Years</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-numerical-display text-numerical-display text-on-surface font-bold">303</span>
            <span className="text-body-sm text-on-surface-variant">/ 400 years</span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">75.75% of calendar</span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col border border-outline-variant/15">
          <span className="font-label-caps text-label-caps uppercase text-outline">Total Days in Cycle</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-numerical-display text-numerical-display text-on-surface font-bold">146,097</span>
            <span className="text-body-sm text-on-surface-variant">days</span>
          </div>
          <span className="font-body-sm text-body-sm text-secondary font-medium mt-1">
            Exactly 20,871 weeks (divisible by 7)
          </span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col border border-outline-variant/15">
          <span className="font-label-caps text-label-caps uppercase text-outline">Average Gregorian Year</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-numerical-display text-numerical-display text-on-surface font-bold">365.2425</span>
            <span className="text-body-sm text-on-surface-variant">days</span>
          </div>
          <span className="font-body-sm text-body-sm text-outline mt-1">
            Only drifts by 26 seconds per year from Earth&apos;s seasons
          </span>
        </div>
      </div>

      {/* Interactive 400-Year Matrix Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-md border border-outline-variant/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex flex-wrap items-center gap-space-xs">
            <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold" htmlFor="cycleBaseYear">
              Showing 400 Years:
            </label>
            <select
              className="px-space-sm py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
              id="cycleBaseYear"
              value={baseYear}
              onChange={(e) => setBaseYear(parseInt(e.target.value, 10))}
            >
              <option value="2001">2001 – 2400 (Current 400-Yr Epoch)</option>
              <option value="1601">1601 – 2000 (Early Modern Epoch)</option>
              <option value="2401">2401 – 2800 (Future Epoch)</option>
              <option value="1201">1201 – 1600 (Proleptic Medieval Epoch)</option>
            </select>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5" id="cycleFilterGroup">
            <button
              className={`px-space-xs py-1 rounded text-body-sm font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
              onClick={() => setFilter('all')}
            >
              All 400
            </button>
            <button
              className={`px-space-xs py-1 rounded text-body-sm font-semibold transition-colors ${
                filter === 'leap'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
              onClick={() => setFilter('leap')}
            >
              Leap Years (97)
            </button>
            <button
              className={`px-space-xs py-1 rounded text-body-sm font-semibold transition-colors ${
                filter === 'common'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
              onClick={() => setFilter('common')}
            >
              Common (303)
            </button>
            <button
              className={`px-space-xs py-1 rounded text-body-sm font-semibold transition-colors ${
                filter === 'centuries'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
              onClick={() => setFilter('centuries')}
            >
              Centuries (4)
            </button>
          </div>
        </div>

        {/* Legend / count bar */}
        <div className="flex items-center justify-between gap-space-sm flex-wrap">
          <span className="text-body-sm text-on-surface-variant font-data-mono">
            Displaying <span className="font-bold text-on-surface" id="cycleCountDisplay">{filteredYears.length}</span> years in cycle
          </span>
          <div className="flex items-center gap-space-xs text-[12px] text-outline flex-wrap">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-primary"></span> Leap (29d)
            </span>
            <span className="inline-flex items-center gap-1 ml-2">
              <span className="inline-block w-3 h-3 rounded bg-surface-container-high border border-outline-variant/20"></span> Common (28d)
            </span>
            <span className="inline-flex items-center gap-1 ml-2">
              <span className="inline-block w-3 h-3 rounded bg-tertiary-container"></span> Century Leap (÷400)
            </span>
          </div>
        </div>

        {/* Visual Matrix Grid */}
        <div
          className="grid grid-cols-10 sm:grid-cols-20 gap-1 max-h-[380px] overflow-y-auto p-2 bg-surface-container-low rounded-lg scroll-smooth border border-outline-variant/10"
          id="cycleMatrix"
        >
          {filteredYears.map((item) => {
            let bgClass = 'bg-surface-container-high text-on-surface-variant';
            if (item.isDiv400) {
              bgClass = 'bg-tertiary-container text-on-tertiary-container font-bold';
            } else if (item.isLeap) {
              bgClass = 'bg-primary text-on-primary font-semibold';
            }

            const isCurrentInspected = inspectedYear === item.year;

            return (
              <div
                key={item.year}
                className={`h-7 rounded flex items-center justify-center text-[10px] font-data-mono cursor-pointer transition-all hover:scale-110 hover:z-10 shadow-xs select-none ${bgClass} ${
                  isCurrentInspected ? 'ring-2 ring-offset-1 ring-primary' : ''
                }`}
                title={`${item.year}: ${item.isLeap ? 'Leap Year (366d)' : 'Common Year (365d)'}`}
                onMouseEnter={() => setInspectedYear(item.year)}
                onClick={() => onSelectYear(item.year)}
              >
                {String(item.year).slice(-2)}
              </div>
            );
          })}
        </div>

        {/* Selected Year Inspector Bar */}
        <div
          className="p-space-sm rounded-lg bg-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs border border-outline-variant/15"
          id="matrixInspector"
        >
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">analytics</span>
            <div className="flex flex-col">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                Selected Year Inspector: <span className="font-bold text-primary" id="inspectorYear">{inspectedYear}</span>
              </span>
              <span className="text-body-sm text-on-surface-variant" id="inspectorDetails">
                {getInspectorDescription()}
              </span>
            </div>
          </div>
          <button
            className="px-space-xs py-1 rounded bg-surface-container-lowest hover:bg-primary/10 text-primary text-body-sm font-semibold self-start sm:self-center border border-outline-variant/20 transition-all shadow-xs"
            id="inspectLoadBtn"
            type="button"
            onClick={() => onSelectYear(inspectedYear)}
          >
            Check This Year ↑
          </button>
        </div>
      </div>
    </section>
  );
}
