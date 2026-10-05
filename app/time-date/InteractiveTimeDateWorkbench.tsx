'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Globe,
  Calendar,
  Clock,
  Cpu,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Search,
} from 'lucide-react';
import { WORLD_CLOCK_CITIES, WorldClockCity } from './timeDateCategoryData';

export default function InteractiveTimeDateWorkbench() {
  const [activeTab, setActiveTab] = useState<'world-clock' | 'date-math' | 'unix-epoch'>('world-clock');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [citySearch, setCitySearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Date Math State
  const [startDateStr, setStartDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDateStr, setEndDateStr] = useState<string>(
    new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [addOp, setAddOp] = useState<'add' | 'subtract'>('add');
  const [addDaysVal, setAddDaysStr] = useState<string>('14');

  // Unix Epoch State
  const [customEpochInput, setCustomEpochInput] = useState<string>('');

  // Clock Ticker Effect
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered cities for world clock grid
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return WORLD_CLOCK_CITIES;
    const q = citySearch.toLowerCase();
    return WORLD_CLOCK_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.timezone.toLowerCase().includes(q) ||
        c.iana.toLowerCase().includes(q)
    );
  }, [citySearch]);

  // Format time for a city
  const formatCityTime = useCallback(
    (city: WorldClockCity) => {
      if (!currentTime) return { timeStr: '--:--:--', dateStr: 'Loading...' };
      try {
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: city.iana,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: city.iana,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        return {
          timeStr: timeFormatter.format(currentTime),
          dateStr: dateFormatter.format(currentTime),
        };
      } catch {
        return { timeStr: currentTime.toLocaleTimeString(), dateStr: currentTime.toLocaleDateString() };
      }
    },
    [currentTime]
  );

  // Date Math Calculation Results
  const dateMathResult = useMemo(() => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { diffDays: 0, businessDays: 0, weeks: 0, text: 'Invalid date input' };
    }

    const diffMs = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(diffMs / (1000 * 3600 * 24));
    const weeks = (diffDays / 7).toFixed(1);

    // Business Days calculation (excluding Sat/Sun)
    let businessDays = 0;
    const cur = new Date(Math.min(start.getTime(), end.getTime()));
    const target = new Date(Math.max(start.getTime(), end.getTime()));
    while (cur < target) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) {
        businessDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return {
      diffDays,
      businessDays,
      weeks,
      hours: diffDays * 24,
      minutes: diffDays * 24 * 60,
    };
  }, [startDateStr, endDateStr]);

  // Add / Subtract Days Result Date
  const addSubtractResult = useMemo(() => {
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return 'Invalid date';
    const amount = parseInt(addDaysVal, 10) || 0;
    const result = new Date(start);
    if (addOp === 'add') {
      result.setDate(result.getDate() + amount);
    } else {
      result.setDate(result.getDate() - amount);
    }
    return result.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [startDateStr, addDaysVal, addOp]);

  // Epoch conversions
  const currentEpochSeconds = currentTime ? Math.floor(currentTime.getTime() / 1000) : 0;
  const currentEpochMs = currentTime ? currentTime.getTime() : 0;

  const parsedCustomEpoch = useMemo(() => {
    if (!customEpochInput.trim()) return null;
    const num = parseInt(customEpochInput, 10);
    if (isNaN(num)) return 'Invalid number';
    const date = num > 1e11 ? new Date(num) : new Date(num * 1000);
    if (isNaN(date.getTime())) return 'Invalid date timestamp';
    return {
      utc: date.toUTCString(),
      iso: date.toISOString(),
      local: date.toLocaleString(),
    };
  }, [customEpochInput]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden transition-colors">
      {/* 1. Workbench Mode Tab Selector */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              <Clock className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              Interactive World Clock & Date-Math Workbench
            </h2>
          </div>
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800/40 shrink-0 self-start sm:self-auto">
            ISO 8601 Calibrated
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('world-clock')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'world-clock'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                : 'bg-white dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Mode 1: World Clock & Timezones</span>
          </button>

          <button
            onClick={() => setActiveTab('date-math')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'date-math'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                : 'bg-white dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mode 2: Instant Date-Math Solver</span>
          </button>

          <button
            onClick={() => setActiveTab('unix-epoch')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'unix-epoch'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                : 'bg-white dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Mode 3: POSIX Unix Epoch Converter</span>
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT STAGE */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* MODE 1: WORLD CLOCK & MULTI-TIMEZONE GRID */}
        {activeTab === 'world-clock' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Global City Clocks & Real-Time Timezones
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live synchronized ticking clocks for major international business, financial, and technology hubs.
                </p>
              </div>

              {/* City Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Filter cities..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* World Clock Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredCities.map((city) => {
                const { timeStr, dateStr } = formatCityTime(city);
                return (
                  <div
                    key={city.id}
                    className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{city.flag}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {city.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {city.country}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
                        {city.timezone}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="text-lg sm:text-xl font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                          {timeStr}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {dateStr}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(`${city.name}: ${timeStr} (${dateStr})`, `wc_${city.id}`)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shrink-0"
                        title="Copy city clock time"
                      >
                        {copiedKey === `wc_${city.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 2: INSTANT DATE-MATH SOLVER */}
        {activeTab === 'date-math' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SUB-SECTION A: ELAPSED DURATION BETWEEN 2 DATES */}
              <div className="p-5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Elapsed Duration Between Dates
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="start-date-input" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Start Date
                    </label>
                    <input
                      id="start-date-input"
                      type="date"
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date-input" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      End Date
                    </label>
                    <input
                      id="end-date-input"
                      type="date"
                      value={endDateStr}
                      onChange={(e) => setEndDateStr(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono"
                    />
                  </div>
                </div>

                {/* Duration Output Grid */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Total Calendar Days:</span>
                    <span className="font-mono tabular-nums font-bold text-lg text-blue-600 dark:text-blue-400">
                      {dateMathResult.diffDays} Days
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Business Days (Mon–Fri):</span>
                    <span className="font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                      {dateMathResult.businessDays} Working Days
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-2">
                    <span className="text-slate-500 dark:text-slate-400">In Weeks / Hours:</span>
                    <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {dateMathResult.weeks} Weeks ({dateMathResult.hours} Hours)
                    </span>
                  </div>
                </div>
              </div>

              {/* SUB-SECTION B: ADD OR SUBTRACT DAYS TO DATE */}
              <div className="p-5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Add or Subtract N Days to Date
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="add-op-select" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Operation
                    </label>
                    <select
                      id="add-op-select"
                      value={addOp}
                      onChange={(e) => setAddOp(e.target.value as 'add' | 'subtract')}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-semibold"
                    >
                      <option value="add">Add (+)</option>
                      <option value="subtract">Subtract (-)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="add-days-input" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Number of Days
                    </label>
                    <input
                      id="add-days-input"
                      type="number"
                      min="1"
                      value={addDaysVal}
                      onChange={(e) => setAddDaysStr(e.target.value)}
                      placeholder="e.g. 14, 30, 90..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono"
                    />
                  </div>
                </div>

                {/* Add/Subtract Result Display */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                    Calculated Target Date:
                  </span>
                  <div className="text-base sm:text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                    {addSubtractResult}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: POSIX UNIX EPOCH CONVERTER */}
        {activeTab === 'unix-epoch' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    POSIX Unix Epoch Timestamp Ticker
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live ticking counter of seconds elapsed since 1970-01-01 00:00:00 UTC.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(currentEpochSeconds.toString(), 'epoch_sec')}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/40 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{currentEpochSeconds}</span>
                </button>
              </div>

              {/* Ticker Display Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
                    Current Epoch (Seconds):
                  </span>
                  <div className="text-xl sm:text-2xl font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                    {currentEpochSeconds}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
                    Current Epoch (Milliseconds):
                  </span>
                  <div className="text-xl sm:text-2xl font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                    {currentEpochMs}
                  </div>
                </div>
              </div>

              {/* Custom Epoch Input */}
              <div className="space-y-3 pt-2">
                <label htmlFor="custom-epoch-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Convert Custom Epoch Timestamp to Date:
                </label>
                <div className="flex gap-2">
                  <input
                    id="custom-epoch-input"
                    type="text"
                    value={customEpochInput}
                    onChange={(e) => setCustomEpochInput(e.target.value)}
                    placeholder="e.g. 1770000000..."
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono"
                  />
                  <button
                    onClick={() => setCustomEpochInput(currentEpochSeconds.toString())}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700"
                  >
                    Paste Now
                  </button>
                </div>

                {parsedCustomEpoch && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs font-mono">
                    {typeof parsedCustomEpoch === 'string' ? (
                      <span className="text-red-500">{parsedCustomEpoch}</span>
                    ) : (
                      <>
                        <div className="text-blue-600 dark:text-blue-400 font-bold">
                          ISO 8601: {parsedCustomEpoch.iso}
                        </div>
                        <div className="text-slate-700 dark:text-slate-300">
                          UTC: {parsedCustomEpoch.utc}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          Local: {parsedCustomEpoch.local}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
