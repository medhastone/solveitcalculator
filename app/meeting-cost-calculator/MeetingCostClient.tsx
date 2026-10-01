'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface AttendeeRole {
  id: string;
  name: string;
  count: number;
  salary: number; // annual
  rateType: 'annual' | 'hourly';
}

export default function MeetingCostClient() {
  const [meetingTitle, setMeetingTitle] = useState('Weekly All-Hands & Strategy Sync');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [weeksPerYear, setWeeksPerYear] = useState(50);
  const [currency, setCurrency] = useState('$');

  // Live timer simulation state
  const [isLiveRunning, setIsLiveRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [roles, setRoles] = useState<AttendeeRole[]>([
    { id: '1', name: 'Engineering Lead / Architect', count: 2, salary: 165000, rateType: 'annual' },
    { id: '2', name: 'Senior Software Engineers', count: 5, salary: 140000, rateType: 'annual' },
    { id: '3', name: 'Product Manager', count: 1, salary: 135000, rateType: 'annual' },
    { id: '4', name: 'UX Designer', count: 1, salary: 110000, rateType: 'annual' },
    { id: '5', name: 'Engineering Director / VP', count: 1, salary: 210000, rateType: 'annual' },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLiveRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLiveRunning]);

  // Hourly rate calculation assuming 2,080 working hours/year (40 hrs/wk * 52 wks)
  const stats = useMemo(() => {
    const totalAttendees = roles.reduce((sum, r) => sum + r.count, 0);

    let totalHourlyCost = 0;
    roles.forEach((r) => {
      const hourly = r.rateType === 'annual' ? r.salary / 2080 : r.salary;
      totalHourlyCost += hourly * r.count;
    });

    const costPerMinute = totalHourlyCost / 60;
    const costPerSecond = totalHourlyCost / 3600;
    const meetingCost = (durationMinutes / 60) * totalHourlyCost;
    const liveCost = elapsedSeconds * costPerSecond;

    let occurrencesPerYear = 1;
    if (frequency === 'daily') occurrencesPerYear = 5 * weeksPerYear;
    else if (frequency === 'weekly') occurrencesPerYear = weeksPerYear;
    else if (frequency === 'biweekly') occurrencesPerYear = Math.floor(weeksPerYear / 2);
    else if (frequency === 'monthly') occurrencesPerYear = 12;

    const annualCost = occurrencesPerYear * meetingCost;
    const annualHoursSpent = occurrencesPerYear * (durationMinutes / 60) * totalAttendees;

    return {
      totalAttendees,
      totalHourlyCost,
      costPerMinute,
      costPerSecond,
      meetingCost,
      liveCost,
      annualCost,
      occurrencesPerYear,
      annualHoursSpent,
    };
  }, [roles, durationMinutes, frequency, weeksPerYear, elapsedSeconds]);

  const addRole = () => {
    const newId = String(Date.now());
    setRoles((prev) => [
      ...prev,
      { id: newId, name: 'Team Member', count: 1, salary: 85000, rateType: 'annual' },
    ]);
  };

  const removeRole = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRole = (id: string, updates: Partial<AttendeeRole>) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-4 pb-16 font-body-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/time-date" className="hover:text-primary transition-colors">Time &amp; Date</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">Meeting Cost Calculator</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            Financial Workday Metrology
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mb-3">
            Meeting Cost Calculator
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl">
            Estimate meeting costs from attendee count, compensation, and duration. Compare one-time or recurring meeting scenarios before scheduling.
          </p>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Controls & Attendee List */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Meeting Parameters Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center justify-between">
                <span>Meeting Parameters</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-mono">Currency:</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="text-xs bg-surface-container border border-outline-variant/40 rounded-lg px-2 py-1 font-mono font-bold"
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="CA$">CAD ($)</option>
                    <option value="A$">AUD ($)</option>
                    <option value="₹">INR (₹)</option>
                  </select>
                </div>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Meeting Title / Topic
                  </label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    step="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Recurrence Cadence
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface"
                  >
                    <option value="once">One-time Meeting</option>
                    <option value="daily">Daily Standup (5x / week)</option>
                    <option value="weekly">Weekly Team Sync (1x / week)</option>
                    <option value="biweekly">Bi-weekly Sprint Planning</option>
                    <option value="monthly">Monthly Department Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Active Working Weeks / Year
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={weeksPerYear}
                    onChange={(e) => setWeeksPerYear(Math.min(52, Math.max(1, parseInt(e.target.value) || 50)))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface"
                  />
                </div>
              </div>
            </div>

            {/* Attendee Roles Breakdown */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-on-surface">
                  Attendee Roster &amp; Compensation
                </h2>
                <button
                  type="button"
                  onClick={addRole}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-lg transition-colors"
                >
                  + Add Role / Group
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-medium uppercase tracking-wider text-on-surface-variant mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        value={role.name}
                        onChange={(e) => updateRole(role.id, { name: e.target.value })}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-2.5 py-1.5 text-xs text-on-surface"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-medium uppercase tracking-wider text-on-surface-variant mb-1">
                        People
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={role.count}
                        onChange={(e) => updateRole(role.id, { count: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-2.5 py-1.5 text-xs text-on-surface font-mono"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-medium uppercase tracking-wider text-on-surface-variant mb-1">
                        Avg {role.rateType === 'annual' ? 'Annual Salary' : 'Hourly Rate'} ({currency})
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          step={role.rateType === 'annual' ? '5000' : '5'}
                          value={role.salary}
                          onChange={(e) => updateRole(role.id, { salary: Math.max(0, parseFloat(e.target.value) || 0) })}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-2.5 py-1.5 text-xs text-on-surface font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => updateRole(role.id, { rateType: role.rateType === 'annual' ? 'hourly' : 'annual', salary: role.rateType === 'annual' ? Math.round(role.salary / 2080) : role.salary * 2080 })}
                          className="text-[10px] uppercase font-mono px-1.5 py-1 bg-surface-container rounded border border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                        >
                          {role.rateType === 'annual' ? '/yr' : '/hr'}
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeRole(role.id)}
                        disabled={roles.length <= 1}
                        className="text-on-surface-variant hover:text-error transition-colors p-1 disabled:opacity-30"
                        aria-label="Remove role"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Calculations & Real-Time Ticking Ticker */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Real-Time Live Meeting Ticker */}
            <div className="bg-gradient-to-br from-primary/10 via-surface-container-lowest to-surface-container-lowest border border-primary/20 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary font-mono">
                  Live Meeting Cost Ticker
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-on-surface-variant">
                  <span className={`w-2 h-2 rounded-full ${isLiveRunning ? 'bg-primary animate-ping' : 'bg-outline'}`} />
                  {isLiveRunning ? 'RUNNING' : 'STOPPED'}
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-mono font-bold text-on-surface mb-2 tracking-tight">
                {currency}{stats.liveCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs font-mono text-on-surface-variant mb-5">
                Elapsed: {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s ({stats.totalAttendees} attendees accumulating {currency}{stats.costPerSecond.toFixed(3)}/sec)
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsLiveRunning(!isLiveRunning)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isLiveRunning
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-primary hover:bg-primary/90 text-on-primary'
                  }`}
                >
                  {isLiveRunning ? 'Pause Live Ticker' : 'Start Live Meeting Ticker'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLiveRunning(false);
                    setElapsedSeconds(0);
                  }}
                  className="py-2.5 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl border border-outline-variant/30 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Total Metric Summary Cards */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h2 className="text-base font-semibold text-on-surface">Financial Impact Summary</h2>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                  Single Session Cost ({durationMinutes} mins)
                </div>
                <div className="text-2xl font-bold font-mono text-primary">
                  {currency}{stats.meetingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-on-surface-variant mt-1 font-mono">
                  {currency}{stats.costPerMinute.toFixed(2)}/min • {stats.totalAttendees} total attendees
                </div>
              </div>

              {frequency !== 'once' && (
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                    Annual Projected Cost ({frequency})
                  </div>
                  <div className="text-2xl font-bold font-mono text-error">
                    {currency}{stats.annualCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-on-surface-variant mt-1 font-mono">
                    {stats.occurrencesPerYear} sessions/yr • {stats.annualHoursSpent.toLocaleString()} total human-hours
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/20 text-center">
                  <div className="text-[11px] text-on-surface-variant">Combined Hourly Rate</div>
                  <div className="text-sm font-bold font-mono text-on-surface mt-0.5">
                    {currency}{stats.totalHourlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}/hr
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/20 text-center">
                  <div className="text-[11px] text-on-surface-variant">Cost per Attendee</div>
                  <div className="text-sm font-bold font-mono text-on-surface mt-0.5">
                    {currency}{(stats.meetingCost / (stats.totalAttendees || 1)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
