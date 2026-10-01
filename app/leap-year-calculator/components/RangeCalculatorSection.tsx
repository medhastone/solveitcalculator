'use client';

import React, { useState, useMemo } from 'react';
import { calculateRange } from '../utils';

interface RangeCalculatorSectionProps {
  onSelectYear: (year: number) => void;
}

export default function RangeCalculatorSection({ onSelectYear }: RangeCalculatorSectionProps) {
  const [startInput, setStartInput] = useState<string>('1900');
  const [endInput, setEndInput] = useState<string>('2100');
  const [calcRange, setCalcRange] = useState<{ start: number; end: number }>({
    start: 1900,
    end: 2100,
  });
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  const spanResult = useMemo(() => {
    return calculateRange(calcRange.start, calcRange.end);
  }, [calcRange]);

  const handleCalculate = () => {
    const s = parseInt(startInput, 10);
    const e = parseInt(endInput, 10);
    if (!isNaN(s) && !isNaN(e)) {
      setCalcRange({ start: s, end: e });
    }
  };

  const handleSwap = () => {
    const tempS = startInput;
    setStartInput(endInput);
    setEndInput(tempS);
    const s = parseInt(endInput, 10);
    const e = parseInt(tempS, 10);
    if (!isNaN(s) && !isNaN(e)) {
      setCalcRange({ start: s, end: e });
    }
  };

  const handlePreset = (preset: string) => {
    if (preset === 'next100') {
      const now = new Date().getFullYear();
      setStartInput(String(now));
      setEndInput(String(now + 100));
      setCalcRange({ start: now, end: now + 100 });
    } else {
      const [s, e] = preset.split(',').map(Number);
      setStartInput(String(s));
      setEndInput(String(e));
      setCalcRange({ start: s, end: e });
    }
  };

  const handleCopyList = () => {
    if (!spanResult.leapYears.length) return;
    const header = `Solveitcalculator.com • Leap Year Counter\nSpan: ${spanResult.startYear} to ${spanResult.endYear}\nTotal Leap Years: ${spanResult.leapCount}\nLeap Years List:\n`;
    const text = header + spanResult.leapYears.join(', ') + '\n\nVerified via https://solveitcalculator.com/leap-year-calculator/';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      });
    }
  };

  const handleExportCsv = () => {
    if (!spanResult.leapYears.length) return;
    let csv = 'LeapYear,DaysInFeb,DaysInYear,IsCenturyLeap\n';
    spanResult.leapYears.forEach((y) => {
      csv += `${y},29,366,${y % 400 === 0}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Leap_Years_${spanResult.startYear}_to_${spanResult.endYear}.csv`;
    link.click();
  };

  return (
    <section className="max-w-max-width-canvas mx-auto w-full flex flex-col gap-space-md" id="leap-year-range-counter">
      <div>
        <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
          EXPLORE MULTIPLE YEARS
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          Count Leap Years Between Two Years
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Find out how many leap years occur between any two dates and get a complete list.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-md border border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm items-end">
          <div className="flex flex-col gap-space-2xs">
            <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold" htmlFor="rangeStartYear">
              Start Year
            </label>
            <input
              className="px-space-sm py-2 rounded-lg bg-surface-container-low font-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/20"
              id="rangeStartYear"
              type="number"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            />
          </div>

          <div className="flex flex-col gap-space-2xs">
            <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold" htmlFor="rangeEndYear">
              End Year
            </label>
            <input
              className="px-space-sm py-2 rounded-lg bg-surface-container-low font-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/20"
              id="rangeEndYear"
              type="number"
              value={endInput}
              onChange={(e) => setEndInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            />
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-md text-body-md font-semibold transition-all shadow-sm flex items-center justify-center gap-1 h-[42px]"
              id="calcRangeBtn"
              type="button"
              onClick={handleCalculate}
            >
              <span className="material-symbols-outlined text-[20px]">date_range</span>
              Calculate Span
            </button>
            <button
              className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all border border-outline-variant/20 h-[42px] w-[42px] flex items-center justify-center"
              id="swapRangeBtn"
              title="Reverse Span"
              type="button"
              onClick={handleSwap}
            >
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </button>
          </div>
        </div>

        {/* Quick Span Presets */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">Presets:</span>
          <button
            className="range-preset-btn px-2 py-0.5 rounded bg-surface-container text-[12px] text-on-surface hover:text-primary transition-colors border border-outline-variant/10 font-medium"
            type="button"
            onClick={() => handlePreset('1900,2000')}
          >
            1900 – 2000 (20th C.)
          </button>
          <button
            className="range-preset-btn px-2 py-0.5 rounded bg-surface-container text-[12px] text-on-surface hover:text-primary transition-colors border border-outline-variant/10 font-medium"
            type="button"
            onClick={() => handlePreset('2000,2100')}
          >
            2000 – 2100 (21st C.)
          </button>
          <button
            className="range-preset-btn px-2 py-0.5 rounded bg-surface-container text-[12px] text-on-surface hover:text-primary transition-colors border border-outline-variant/10 font-medium"
            type="button"
            onClick={() => handlePreset('2000,2400')}
          >
            2000 – 2400 (Full Cycle)
          </button>
          <button
            className="range-preset-btn px-2 py-0.5 rounded bg-surface-container text-[12px] text-on-surface hover:text-primary transition-colors border border-outline-variant/10 font-medium"
            type="button"
            onClick={() => handlePreset('next100')}
          >
            Next 100 Years
          </button>
        </div>

        {/* Span Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">TOTAL YEARS</span>
            <span className="font-numerical-display text-[22px] font-bold text-on-surface mt-0.5" id="rangeTotalYears">
              {spanResult.totalYears} Years
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">LEAP YEARS</span>
            <span className="font-numerical-display text-[22px] font-bold text-primary mt-0.5" id="rangeLeapCount">
              {spanResult.leapCount} Leaps
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">COMMON YEARS</span>
            <span className="font-numerical-display text-[22px] font-bold text-on-surface mt-0.5" id="rangeCommonCount">
              {spanResult.commonCount} Common
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">EXTRA DAYS ADDED</span>
            <span className="font-numerical-display text-[22px] font-bold text-secondary mt-0.5" id="rangeDaysAdded">
              +{spanResult.extraDaysAdded} Days
            </span>
          </div>
        </div>

        {/* Output List and Export Controls */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
              ALL LEAP YEARS IN THIS PERIOD (<span id="rangeResultCounter">{spanResult.leapCount}</span> TOTAL)
            </span>
            <div className="flex items-center gap-space-xs">
              <button
                className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-1 border border-outline-variant/20 transition-colors"
                id="copyRangeListBtn"
                type="button"
                onClick={handleCopyList}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copyFeedback ? 'done' : 'copy_all'}
                </span>
                {copyFeedback ? 'Copied' : 'Copy List'}
              </button>
              <button
                className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-1 border border-outline-variant/20 transition-colors"
                id="exportRangeCsvBtn"
                type="button"
                onClick={handleExportCsv}
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span> CSV
              </button>
            </div>
          </div>

          <div
            className="p-space-sm rounded-lg bg-surface-container-lowest max-h-48 overflow-y-auto font-data-mono text-body-sm flex flex-wrap gap-2 text-on-surface border border-outline-variant/15"
            id="rangeResultsBox"
          >
            {spanResult.leapYears.map((yr) => (
              <span
                key={yr}
                className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface hover:bg-primary hover:text-on-primary cursor-pointer transition-colors shadow-xs"
                title={`Click to evaluate ${yr}`}
                onClick={() => onSelectYear(yr)}
              >
                {yr}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
