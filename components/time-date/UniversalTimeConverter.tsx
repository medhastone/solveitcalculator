'use client';

import React, { useState, useMemo } from 'react';
import { TimeToolDefinition } from '@/lib/time-date/types';
import {
  convertTimeUnit,
  TIME_UNIT_LABELS,
  TIME_UNIT_FACTORS,
  format24To12,
  format12To24,
  formatToMilitary,
  decimalHoursToHms,
  hmsToDecimalHours,
} from '@/lib/time-date/calculations';
import { ArrowRightLeft, Copy, Check, Sparkles } from 'lucide-react';

interface Props {
  tool: TimeToolDefinition;
}

export default function UniversalTimeConverter({ tool }: Props) {
  const [copied, setCopied] = useState(false);

  // Unit converter state
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>(tool.fromUnit || 'hours');
  const [toUnit, setToUnit] = useState<string>(tool.toUnit || 'minutes');

  // Format converter states
  const [time24, setTime24] = useState('14:30');
  const [time12Hours, setTime12Hours] = useState(2);
  const [time12Minutes, setTime12Minutes] = useState(30);
  const [time12Period, setTime12Period] = useState<'AM' | 'PM'>('PM');
  const [decimalHours, setDecimalHours] = useState(7.75);
  const [hmsHours, setHmsHours] = useState(7);
  const [hmsMinutes, setHmsMinutes] = useState(45);
  const [hmsSeconds, setHmsSeconds] = useState(0);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const conversionResult = useMemo(() => {
    if (tool.calculatorType === 'unit-converter' || tool.calculatorType === 'pair-converter') {
      const converted = convertTimeUnit(inputValue, fromUnit, toUnit);
      const formattedConverted =
        converted < 0.0001 && converted > 0
          ? converted.toExponential(4)
          : Number(converted.toFixed(6)).toLocaleString(undefined, { maximumFractionDigits: 6 });

      return {
        primary: `${formattedConverted} ${TIME_UNIT_LABELS[toUnit] || toUnit}`,
        secondary: `${inputValue} ${TIME_UNIT_LABELS[fromUnit] || fromUnit} = ${formattedConverted} ${TIME_UNIT_LABELS[toUnit] || toUnit}`,
        copyValue: `${inputValue} ${fromUnit} = ${formattedConverted} ${toUnit}`,
        details: [
          { label: 'Input Value', value: `${inputValue} ${fromUnit}` },
          { label: 'Converted Output', value: `${formattedConverted} ${toUnit}` },
          { label: 'Equivalent in Seconds', value: `${(inputValue * TIME_UNIT_FACTORS[fromUnit]).toLocaleString()} s` },
          { label: 'Conversion Ratio', value: `1 ${fromUnit} = ${(TIME_UNIT_FACTORS[fromUnit] / TIME_UNIT_FACTORS[toUnit]).toFixed(6)} ${toUnit}` },
        ],
      };
    }

    if (tool.formatType === '24-to-12') {
      const res = format24To12(time24);
      return {
        primary: res.formatted12,
        secondary: `24-Hour: ${time24} -> 12-Hour: ${res.formatted12}`,
        copyValue: res.formatted12,
        details: [
          { label: '24-Hour Time', value: time24 },
          { label: '12-Hour Standard', value: res.formatted12 },
          { label: 'Time of Day', value: res.period === 'AM' ? 'Morning / Ante Meridiem' : 'Afternoon/Evening / Post Meridiem' },
        ],
      };
    }

    if (tool.formatType === '12-to-24') {
      const res = format12To24(time12Hours, time12Minutes, time12Period);
      return {
        primary: `${res} (24-Hour)`,
        secondary: `${time12Hours}:${String(time12Minutes).padStart(2, '0')} ${time12Period} = ${res}`,
        copyValue: res,
        details: [
          { label: '12-Hour Time', value: `${time12Hours}:${String(time12Minutes).padStart(2, '0')} ${time12Period}` },
          { label: '24-Hour Notation', value: res },
          { label: 'ISO 8601 Format', value: `${res}:00` },
        ],
      };
    }

    if (tool.formatType === 'military') {
      const res = formatToMilitary(time24);
      return {
        primary: res.military,
        secondary: `Spoken Phonetics: "${res.phonetic}"`,
        copyValue: res.military,
        details: [
          { label: 'Military Format', value: res.military },
          { label: 'Spoken Military Phonetic', value: res.phonetic },
          { label: 'Standard AM/PM', value: format24To12(time24).formatted12 },
        ],
      };
    }

    if (tool.formatType === 'decimal-to-hms') {
      const res = decimalHoursToHms(decimalHours);
      return {
        primary: res.formatted,
        secondary: `${decimalHours} decimal hours = ${res.hours}h ${res.minutes}m ${res.seconds}s`,
        copyValue: res.formatted,
        details: [
          { label: 'Hours', value: `${res.hours} hrs` },
          { label: 'Minutes', value: `${res.minutes} mins` },
          { label: 'Seconds', value: `${res.seconds} secs` },
          { label: 'HH:MM:SS', value: `${String(res.hours).padStart(2, '0')}:${String(res.minutes).padStart(2, '0')}:${String(res.seconds).padStart(2, '0')}` },
        ],
      };
    }

    if (tool.formatType === 'hms-to-decimal' || tool.formatType === 'hms-to-min' || tool.formatType === 'hms-to-sec') {
      const dec = hmsToDecimalHours(hmsHours, hmsMinutes, hmsSeconds);
      const totalMin = Number((dec * 60).toFixed(2));
      const totalSec = Math.round(dec * 3600);

      const primary =
        tool.formatType === 'hms-to-min'
          ? `${totalMin.toLocaleString()} Total Minutes`
          : tool.formatType === 'hms-to-sec'
          ? `${totalSec.toLocaleString()} Total Seconds`
          : `${dec.toFixed(4)} Decimal Hours`;

      return {
        primary,
        secondary: `${hmsHours}h ${hmsMinutes}m ${hmsSeconds}s`,
        copyValue: primary,
        details: [
          { label: 'Decimal Hours', value: `${dec.toFixed(4)} hrs` },
          { label: 'Total Minutes', value: `${totalMin} min` },
          { label: 'Total Seconds', value: `${totalSec.toLocaleString()} s` },
        ],
      };
    }

    return {
      primary: 'Ready',
      secondary: '',
      copyValue: '',
      details: [],
    };
  }, [
    tool.calculatorType,
    tool.formatType,
    inputValue,
    fromUnit,
    toUnit,
    time24,
    time12Hours,
    time12Minutes,
    time12Period,
    decimalHours,
    hmsHours,
    hmsMinutes,
    hmsSeconds,
  ]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-10">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-base">
            {tool.name}
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Bidirectional Conversion</span>
      </div>

      <div className="p-6 md:p-8">
        {/* Controls based on converter type */}
        {(tool.calculatorType === 'unit-converter' || tool.calculatorType === 'pair-converter') && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-8">
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                From
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-medium"
                >
                  {Object.entries(TIME_UNIT_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-center py-2">
              <button
                type="button"
                onClick={swapUnits}
                className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
                title="Swap Units"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                To
              </label>
              <div className="space-y-2">
                <div className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-lg tabular-nums">
                  {conversionResult.primary.split(' ')[0]}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-medium"
                >
                  {Object.entries(TIME_UNIT_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {(tool.formatType === '24-to-12' || tool.formatType === 'military') && (
          <div className="max-w-md mb-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Enter 24-Hour Time (HH:MM)
            </label>
            <input
              type="time"
              value={time24}
              onChange={(e) => setTime24(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        )}

        {tool.formatType === '12-to-24' && (
          <div className="grid grid-cols-3 gap-3 max-w-md mb-8">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Hours</label>
              <input
                type="number"
                min="1"
                max="12"
                value={time12Hours}
                onChange={(e) => setTime12Hours(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-center text-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={time12Minutes}
                onChange={(e) => setTime12Minutes(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-center text-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">AM / PM</label>
              <select
                value={time12Period}
                onChange={(e) => setTime12Period(e.target.value as 'AM' | 'PM')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium text-center text-lg"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        )}

        {tool.formatType === 'decimal-to-hms' && (
          <div className="max-w-md mb-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Enter Decimal Hours (e.g. 7.75)
            </label>
            <input
              type="number"
              step="0.01"
              value={decimalHours}
              onChange={(e) => setDecimalHours(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        )}

        {(tool.formatType === 'hms-to-decimal' || tool.formatType === 'hms-to-min' || tool.formatType === 'hms-to-sec') && (
          <div className="grid grid-cols-3 gap-3 max-w-md mb-8">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Hours</label>
              <input
                type="number"
                min="0"
                value={hmsHours}
                onChange={(e) => setHmsHours(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-center text-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={hmsMinutes}
                onChange={(e) => setHmsMinutes(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-center text-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={hmsSeconds}
                onChange={(e) => setHmsSeconds(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-center text-lg"
              />
            </div>
          </div>
        )}

        {/* Highlight Result Card */}
        <div className="bg-slate-950 text-white rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Converted Result
            </span>
            <button
              type="button"
              onClick={() => handleCopy(conversionResult.copyValue)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Result'}</span>
            </button>
          </div>

          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mb-1 tabular-nums">
            {conversionResult.primary}
          </div>
          <div className="text-sm text-slate-400 font-medium mb-6">
            {conversionResult.secondary}
          </div>

          {conversionResult.details.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
              {conversionResult.details.map((item, i) => (
                <div key={i} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-xs text-slate-400 mb-0.5">{item.label}</div>
                  <div className="text-sm font-semibold font-mono text-slate-100 tabular-nums">{item.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
