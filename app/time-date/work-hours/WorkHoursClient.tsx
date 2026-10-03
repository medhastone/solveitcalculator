'use client';

import React, { useState, useMemo } from 'react';
import { RotateCcw, Clock, DollarSign, Calendar } from 'lucide-react';
import CalculatorBreakdownTabs from '@/components/calculator/CalculatorBreakdownTabs';
import CalculatorVisualChart, { ChartBarData } from '@/components/calculator/CalculatorVisualChart';

interface DayShift {
  name: string;
  enabled: boolean;
  inTime: string;
  outTime: string;
  breakMins: number;
}

export default function WorkHoursClient() {
  const [hourlyWage, setHourlyWage] = useState<number>(25.0);
  const [shifts, setShifts] = useState<DayShift[]>([
    { name: 'Monday', enabled: true, inTime: '08:00', outTime: '17:00', breakMins: 45 },
    { name: 'Tuesday', enabled: true, inTime: '08:00', outTime: '17:00', breakMins: 45 },
    { name: 'Wednesday', enabled: true, inTime: '08:00', outTime: '17:00', breakMins: 45 },
    { name: 'Thursday', enabled: true, inTime: '08:00', outTime: '17:00', breakMins: 45 },
    { name: 'Friday', enabled: true, inTime: '08:00', outTime: '17:00', breakMins: 45 },
    { name: 'Saturday', enabled: false, inTime: '09:00', outTime: '14:00', breakMins: 0 },
    { name: 'Sunday', enabled: false, inTime: '09:00', outTime: '14:00', breakMins: 0 }
  ]);

  const payrollResults = useMemo(() => {
    let totalMins = 0;
    const dailyBreakdowns: { day: string; hours: number; formatted: string }[] = [];

    shifts.forEach((s) => {
      if (!s.enabled) return;
      const [inH, inM] = s.inTime.split(':').map(Number);
      const [outH, outM] = s.outTime.split(':').map(Number);

      let diff = outH * 60 + outM - (inH * 60 + inM);
      if (diff < 0) diff += 24 * 60; // overnight shift
      const netMins = Math.max(0, diff - s.breakMins);
      totalMins += netMins;

      const decHours = netMins / 60;
      const h = Math.floor(netMins / 60);
      const m = netMins % 60;
      dailyBreakdowns.push({
        day: s.name,
        hours: Number(decHours.toFixed(2)),
        formatted: `${h}h ${m}m (${decHours.toFixed(2)} hrs)`
      });
    });

    const totalDecHours = totalMins / 60;
    const regularHours = Math.min(40, totalDecHours);
    const overtimeHours = Math.max(0, totalDecHours - 40);

    const regularPay = regularHours * hourlyWage;
    const overtimePay = overtimeHours * hourlyWage * 1.5;
    const totalGrossPay = regularPay + overtimePay;

    const chartData: ChartBarData[] = dailyBreakdowns.map((d) => ({
      label: d.day,
      value: d.hours,
      formattedValue: `${d.hours} hrs`
    }));

    return {
      totalDecHours,
      totalHoursStr: `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`,
      regularHours,
      overtimeHours,
      regularPay,
      overtimePay,
      totalGrossPay,
      dailyBreakdowns,
      chartData
    };
  }, [shifts, hourlyWage]);

  const updateShift = (idx: number, field: keyof DayShift, val: any) => {
    setShifts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleReset = () => {
    setHourlyWage(25.0);
    setShifts([
      { name: 'Monday', enabled: true, inTime: '08:00', outTime: '17:00', breakMins: 45 },
      { name: 'Tuesday', enabled: true, inTime: '08:00', outTime: '17:00', breakMins: 45 },
      { name: 'Wednesday', enabled: true, inTime: '08:00', outTime: '17:00', breakMins: 45 },
      { name: 'Thursday', enabled: true, inTime: '08:00', outTime: '17:00', breakMins: 45 },
      { name: 'Friday', enabled: true, inTime: '08:00', outTime: '17:00', breakMins: 45 },
      { name: 'Saturday', enabled: false, inTime: '09:00', outTime: '14:00', breakMins: 0 },
      { name: 'Sunday', enabled: false, inTime: '09:00', outTime: '14:00', breakMins: 0 }
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Timesheet Shift Schedule
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Base Rate:</span>
                <div className="relative w-24">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                  <input
                    type="number"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-5 pr-1 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {shifts.map((s, idx) => (
              <div
                key={s.name}
                className={`p-2.5 rounded-lg border text-xs flex flex-wrap items-center justify-between gap-3 transition-colors ${
                  s.enabled
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <label className="flex items-center gap-2 font-medium text-white w-24 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.enabled}
                    onChange={(e) => updateShift(idx, 'enabled', e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{s.name}</span>
                </label>

                {s.enabled ? (
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 text-[11px]">In:</span>
                      <input
                        type="time"
                        value={s.inTime}
                        onChange={(e) => updateShift(idx, 'inTime', e.target.value)}
                        className="px-1.5 py-1 rounded bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 text-[11px]">Out:</span>
                      <input
                        type="time"
                        value={s.outTime}
                        onChange={(e) => updateShift(idx, 'outTime', e.target.value)}
                        className="px-1.5 py-1 rounded bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 text-[11px]">Break:</span>
                      <input
                        type="number"
                        min="0"
                        max="180"
                        step="5"
                        value={s.breakMins}
                        onChange={(e) => updateShift(idx, 'breakMins', Number(e.target.value))}
                        className="w-12 px-1 py-1 rounded bg-slate-950 border border-slate-700 text-white font-mono text-xs text-center"
                      />
                      <span className="text-slate-500 text-[11px]">m</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-500 italic text-xs">Day Off</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Primary Gross Pay Hero */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-900/40 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              Gross Weekly Payroll
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mb-1">
              ${payrollResults.totalGrossPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Total weekly compensation for {payrollResults.totalDecHours.toFixed(2)} decimal hours.
            </p>

            <div className="space-y-2 text-xs border-t border-slate-800/80 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Total Work Time:</span>
                <span className="font-mono text-white font-bold">{payrollResults.totalHoursStr} ({payrollResults.totalDecHours.toFixed(2)} hrs)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Regular Pay (40 hrs @ ${hourlyWage}/hr):</span>
                <span className="font-mono text-slate-300">${payrollResults.regularPay.toFixed(2)}</span>
              </div>
              {payrollResults.overtimeHours > 0 && (
                <div className="flex items-center justify-between text-amber-300 font-medium">
                  <span>Overtime Pay ({payrollResults.overtimeHours.toFixed(2)} hrs @ ${hourlyWage * 1.5}/hr):</span>
                  <span className="font-mono font-bold">+${payrollResults.overtimePay.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            Computed under US FLSA 40-hour overtime rules.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <CalculatorBreakdownTabs
        summaryContent={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Regular Hours</span>
              <span className="text-xl font-bold font-mono text-white">{payrollResults.regularHours.toFixed(2)} hrs</span>
              <span className="text-[11px] text-slate-500 block mt-1">Base rate hours</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Overtime Hours</span>
              <span className="text-xl font-bold font-mono text-amber-300">{payrollResults.overtimeHours.toFixed(2)} hrs</span>
              <span className="text-[11px] text-slate-500 block mt-1">1.5× wage multiplier</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Average Shift Length</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {payrollResults.dailyBreakdowns.length > 0
                  ? (payrollResults.totalDecHours / payrollResults.dailyBreakdowns.length).toFixed(2)
                  : 0}{' '}
                hrs
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Across active shifts</span>
            </div>
          </div>
        }
        chartContent={
          <CalculatorVisualChart
            title="Daily Net Shift Hours Worked"
            data={payrollResults.chartData}
            primaryLabel="Hours Worked"
            currency={false}
          />
        }
        tableContent={
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Day of Week</th>
                  <th className="py-2.5 px-3">Decimal Hours</th>
                  <th className="py-2.5 px-3">Standard Time Format</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {payrollResults.dailyBreakdowns.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 font-semibold text-white">{row.day}</td>
                    <td className="py-2.5 px-3 text-indigo-300">{row.hours} hrs</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.formatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      />
    </div>
  );
}
