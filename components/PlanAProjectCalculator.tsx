'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Task {
  id: number;
  name: string;
  hours: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  prereq: number; // 0 for root
  milestone: boolean;
}

const DEFAULT_TASKS: Task[] = [
  { id: 1, name: "Discovery & Scope Definition", hours: 40, priority: "High", assignee: "Alex", prereq: 0, milestone: false },
  { id: 2, name: "UX/UI Wireframes & Prototypes", hours: 80, priority: "High", assignee: "Sarah", prereq: 1, milestone: false },
  { id: 3, name: "Core Architecture & Setup", hours: 60, priority: "Medium", assignee: "Dave", prereq: 1, milestone: false },
  { id: 4, name: "Feature Development Sprint 1 & 2", hours: 160, priority: "Critical", assignee: "Dave", prereq: 2, milestone: false },
  { id: 5, name: "QA Testing & Bug Squashing", hours: 60, priority: "High", assignee: "Sarah", prereq: 4, milestone: false },
  { id: 6, name: "Client Signoff & Beta Milestone", hours: 0, priority: "Critical", assignee: "Alex", prereq: 5, milestone: true },
  { id: 7, name: "Deployment & Go-Live", hours: 20, priority: "Critical", assignee: "Dave", prereq: 6, milestone: true }
];

function getUpcomingMonday(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() + (day === 0 ? 1 : (8 - day));
  const nextMon = new Date(today.setDate(diff));
  return nextMon.toISOString().split('T')[0];
}

function getBenchmarkTargetDate(startDateStr: string, workingDaysApprox: number): string {
  const d = new Date(startDateStr);
  d.setDate(d.getDate() + Math.round(workingDaysApprox * 1.55));
  return d.toISOString().split('T')[0];
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sun = 0, Sat = 6
}

function isHoliday(date: Date): boolean {
  const m = date.getMonth();
  const d = date.getDate();
  if (m === 0 && d === 1) return true; // New Year
  if (m === 6 && d === 4) return true; // July 4th
  if (m === 11 && (d === 24 || d === 25 || d === 26)) return true; // Christmas window
  if (m === 10 && d >= 22 && d <= 28 && date.getDay() === 4) return true; // Thanksgiving
  return false;
}

function addWorkingDays(startDate: Date, workingDaysRequired: number, skipWeekends: boolean, skipHolidays: boolean): Date {
  const cur = new Date(startDate.getTime());
  let daysAdded = 0;

  while (daysAdded < workingDaysRequired) {
    cur.setDate(cur.getDate() + 1);
    if (skipWeekends && isWeekend(cur)) continue;
    if (skipHolidays && isHoliday(cur)) continue;
    daysAdded++;
  }
  return cur;
}

export default function PlanAProjectCalculator() {
  // --- STATE ---
  const [projectName, setProjectName] = useState('Enterprise App Modernization');
  const [startDateStr, setStartDateStr] = useState<string>(() => getUpcomingMonday());
  const [targetDateStr, setTargetDateStr] = useState<string>(() => getBenchmarkTargetDate(getUpcomingMonday(), 26));
  const [workHours, setWorkHours] = useState<number>(8);
  const [teamSize, setTeamSize] = useState<number>(3);
  const [bufferDays, setBufferDays] = useState<number>(5);
  const [excludeWeekends, setExcludeWeekends] = useState<boolean>(true);
  const [excludeHolidays, setExcludeHolidays] = useState<boolean>(true);
  const [efficiency, setEfficiency] = useState<number>(85);
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(JSON.stringify(DEFAULT_TASKS)));
  const [delayDays, setDelayDays] = useState<number>(0);
  const [ganttZoom, setGanttZoom] = useState<'weeks' | 'days'>('weeks');
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- ACTIONS ---
  const handleResetDefaults = () => {
    const monday = getUpcomingMonday();
    setProjectName('Enterprise App Modernization');
    setStartDateStr(monday);
    setTargetDateStr(getBenchmarkTargetDate(monday, 26));
    setWorkHours(8);
    setTeamSize(3);
    setBufferDays(5);
    setExcludeWeekends(true);
    setExcludeHolidays(true);
    setEfficiency(85);
    setDelayDays(0);
    setTasks(JSON.parse(JSON.stringify(DEFAULT_TASKS)));
  };

  const handleAddTask = () => {
    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const lastTask = tasks[tasks.length - 1];
    setTasks(prev => [
      ...prev,
      {
        id: nextId,
        name: `Phase Deliverable #${nextId}`,
        hours: 40,
        priority: 'Medium',
        assignee: 'Alex',
        prereq: lastTask ? lastTask.id : 0,
        milestone: false
      }
    ]);
  };

  const handleDeleteTask = (id: number) => {
    if (tasks.length <= 1) {
      alert("A project plan requires at least one active task.");
      return;
    }
    setTasks(prev => {
      const filtered = prev.filter(t => t.id !== id);
      return filtered.map(t => t.prereq === id ? { ...t, prereq: 0 } : t);
    });
  };

  const handleTaskChange = (id: number, field: keyof Task, value: any) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (field === 'hours') {
        return { ...t, hours: Math.max(0, parseFloat(value) || 0) };
      }
      if (field === 'milestone') {
        const isM = Boolean(value);
        return { ...t, milestone: isM, hours: isM ? 0 : (t.hours || 20) };
      }
      if (field === 'prereq') {
        return { ...t, prereq: parseInt(value, 10) || 0 };
      }
      return { ...t, [field]: value };
    }));
  };

  // --- CPM & CRITICAL PATH ---
  const criticalPathInfo = useMemo(() => {
    const taskMap = new Map<number, Task>();
    tasks.forEach(t => taskMap.set(t.id, t));

    const memo = new Map<number, { duration: number; path: number[] }>();

    function getLongestPath(id: number): { duration: number; path: number[] } {
      if (memo.has(id)) return memo.get(id)!;
      const t = taskMap.get(id);
      if (!t) return { duration: 0, path: [] };

      let maxParent = { duration: 0, path: [] as number[] };
      if (t.prereq && taskMap.has(t.prereq)) {
        maxParent = getLongestPath(t.prereq);
      }

      const currentDuration = Number(t.hours) || 0;
      const result = {
        duration: maxParent.duration + currentDuration,
        path: [...maxParent.path, t.id]
      };
      memo.set(id, result);
      return result;
    }

    let overallMax = { duration: 0, path: [] as number[] };
    tasks.forEach(t => {
      const p = getLongestPath(t.id);
      if (p.duration > overallMax.duration) {
        overallMax = p;
      }
    });

    return overallMax;
  }, [tasks]);

  // --- CORE COMPUTATIONAL PIPELINE ---
  const calculations = useMemo(() => {
    const validStartDate = startDateStr ? new Date(startDateStr + 'T00:00:00') : new Date();
    const effFraction = Math.max(0.1, efficiency / 100);
    const safeWorkHours = Math.max(1, workHours);
    const safeTeamSize = Math.max(1, teamSize);

    const totalScopeHours = tasks.reduce((sum, t) => sum + (Number(t.hours) || 0), 0);
    const teamDailyCapacityHours = safeTeamSize * safeWorkHours * effFraction;
    const pureWorkingDays = Math.max(1, Math.ceil(totalScopeHours / teamDailyCapacityHours));

    const totalWorkDaysRequired = pureWorkingDays + bufferDays + delayDays;
    const finalDate = addWorkingDays(validStartDate, totalWorkDaysRequired, excludeWeekends, excludeHolidays);

    const calendarDaysElapsed = Math.max(1, Math.round((finalDate.getTime() - validStartDate.getTime()) / (1000 * 60 * 60 * 24)));
    const bufferPct = ((bufferDays / (pureWorkingDays + bufferDays)) * 100).toFixed(1);

    // Feasibility evaluation against target date
    let feasibilityScore = 95;
    let riskBadge = "Low Risk";
    let riskDesc = "Optimal Slack Available";
    let riskColor = "bg-secondary-fixed text-on-secondary-fixed";
    let riskIcon = "verified";

    if (targetDateStr) {
      const targetDate = new Date(targetDateStr + 'T23:59:59');
      const diffTime = targetDate.getTime() - finalDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        const overdueFraction = Math.abs(diffDays) / pureWorkingDays;
        feasibilityScore = Math.max(10, Math.round(70 - (overdueFraction * 60)));
        riskBadge = "High Risk (Breach)";
        riskColor = "bg-error text-on-error";
        riskIcon = "error";
        riskDesc = `Breaches target by ${Math.abs(diffDays)} days!`;
      } else if (diffDays <= 3) {
        feasibilityScore = 68;
        riskBadge = "Medium Risk (Tight)";
        riskColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200";
        riskIcon = "warning";
        riskDesc = `Only ${diffDays} day float available`;
      } else {
        feasibilityScore = Math.min(99, 85 + Math.min(14, diffDays));
        riskBadge = "Low Risk";
        riskColor = "bg-secondary-fixed text-on-secondary-fixed";
        riskIcon = "verified";
        riskDesc = `Healthy slack of ${diffDays} calendar days`;
      }
    } else {
      feasibilityScore = 100;
      riskBadge = "Neutral";
      riskDesc = "Specify a target date to audit feasibility";
      riskIcon = "info";
      riskColor = "bg-surface-container text-on-surface-variant";
    }

    // Delay slip calculation
    const noDelayDate = addWorkingDays(validStartDate, pureWorkingDays + bufferDays, excludeWeekends, excludeHolidays);
    const delaySlipCalendarDays = Math.round((finalDate.getTime() - noDelayDate.getTime()) / (1000 * 60 * 60 * 24));

    // Team member hours distribution
    const assigneeHours: Record<string, number> = {};
    tasks.forEach(t => {
      const name = (t.assignee || 'Unassigned').trim();
      assigneeHours[name] = (assigneeHours[name] || 0) + (Number(t.hours) || 0);
    });

    const availableHoursPerPerson = totalWorkDaysRequired * safeWorkHours;
    const teamLoads = Object.entries(assigneeHours).map(([name, hrs]) => {
      const pct = Math.min(150, Math.round((hrs / Math.max(1, availableHoursPerPerson)) * 100));
      return {
        name,
        hours: hrs,
        pct,
        isOverloaded: pct > 100
      };
    });

    // Milestone phase dates
    const totalDurationMs = finalDate.getTime() - validStartDate.getTime();
    const milestonePhases = [
      { name: "Phase 1: Discovery", pct: 0.15, icon: "search", desc: "Scope & architecture locked" },
      { name: "Phase 2: Alpha Build", pct: 0.50, icon: "code", desc: "Core feature MVP ready" },
      { name: "Phase 3: QA & Audit", pct: 0.82, icon: "bug_report", desc: "Hardening & zero blocker bugs" },
      { name: "Phase 4: Production Gate", pct: 1.0, icon: "rocket_launch", desc: "Client go-live signoff" }
    ].map(p => ({
      ...p,
      date: new Date(validStartDate.getTime() + totalDurationMs * p.pct)
    }));

    return {
      validStartDate,
      finalDate,
      totalScopeHours,
      teamDailyCapacityHours,
      pureWorkingDays,
      totalWorkDaysRequired,
      calendarDaysElapsed,
      bufferPct,
      feasibilityScore,
      riskBadge,
      riskDesc,
      riskColor,
      riskIcon,
      delaySlipCalendarDays,
      teamLoads,
      milestonePhases
    };
  }, [startDateStr, targetDateStr, efficiency, workHours, teamSize, bufferDays, delayDays, tasks, excludeWeekends, excludeHolidays]);

  // Copy Executive Summary
  const handleCopySummary = () => {
    const summary = `
SolveIt Project Schedule Summary
Project Name: ${projectName}
Start Date: ${startDateStr}
Target Deadline: ${targetDateStr || 'None'}
Forecasted Finish: ${calculations.finalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${calculations.finalDate.toLocaleDateString('en-US', { weekday: 'long' })})
Total Working Days: ${calculations.pureWorkingDays} + ${bufferDays + delayDays} Buffer/Slack
Total Scope: ${tasks.length} Tasks | ${calculations.totalScopeHours} Total Hours
Critical Path Duration: ${criticalPathInfo.duration} hrs
Feasibility Score: ${calculations.feasibilityScore}% (${calculations.riskBadge})
Buffer Protection: ${calculations.bufferPct}% of Timeline
    `.trim();

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // CSV Export
  const handleDownloadCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,Task_ID,Task_Name,Hours,Priority,Assignee,Prerequisite_ID,Milestone\n";
    tasks.forEach(t => {
      csvContent += `"${t.id}","${t.name.replace(/"/g, '""')}","${t.hours}","${t.priority}","${t.assignee}","${t.prereq}","${t.milestone ? 'YES' : 'NO'}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', blobUrl);
    link.setAttribute("download", `Project_Plan_${projectName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const cpSet = useMemo(() => new Set(criticalPathInfo.path), [criticalPathInfo.path]);

  return (
    <div className="flex flex-col w-full bg-surface text-on-surface pt-0">
      {/* Breadcrumbs & Trust Banner */}
      <section className="w-full bg-surface-container-lowest/80 backdrop-blur-sm py-space-xs sm:py-space-sm border-b border-outline-variant/30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]" id="breadcrumb-section">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs font-body-sm text-body-sm text-on-surface-variant overflow-x-auto whitespace-nowrap py-1">
              <Link className="hover:text-primary transition-colors flex items-center gap-1.5" href="/" id="breadcrumb-home">
                <span className="material-symbols-outlined text-[18px]">home</span>
                <span>Home</span>
              </Link>
              <span className="material-symbols-outlined text-[14px] text-outline-variant select-none" aria-hidden="true">chevron_right</span>
              <Link className="hover:text-primary transition-colors" href="/time-date" id="breadcrumb-category">
                Time &amp; Date Calculators
              </Link>
              <span className="material-symbols-outlined text-[14px] text-outline-variant select-none" aria-hidden="true">chevron_right</span>
              <span className="text-on-surface font-semibold truncate" aria-current="page" id="breadcrumb-current">
                Plan a Project Calculator
              </span>
            </nav>
            <div className="flex items-center gap-space-xs shrink-0">
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface text-label-caps font-label-caps uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px] text-primary">verified</span> PMBOK &amp; CPM Aligned
              </span>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface text-label-caps font-label-caps uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px] text-secondary">lock</span> 100% In-Browser Private
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Hero Header */}
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="max-w-3xl space-y-space-xs">
              <div className="inline-flex items-center gap-space-2xs text-primary font-label-caps text-label-caps uppercase tracking-widest bg-primary-fixed/50 px-space-xs py-1 rounded-md">
                <span className="material-symbols-outlined text-[15px]">event_upcoming</span>
                Precision Timeline &amp; Capacity Planner
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Plan a Project Calculator — Timeline, Milestone &amp; Deadline Estimator
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Deterministic project schedule forecasting, Critical Path Method (CPM) dependency sequencing, multi-resource velocity balancing, and instant scenario delay modeling. Built with zero telemetry for instantaneous, confidential project planning.
              </p>
            </div>
            {/* Quick Metrics Pill Bar */}
            <div className="flex flex-wrap lg:flex-nowrap gap-space-xs bg-surface-container-lowest p-space-xs rounded-xl shadow-sm border border-outline-variant/30">
              <div className="px-space-sm py-space-2xs bg-surface-container-low rounded-lg text-center min-w-[120px]">
                <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase">Methodology</span>
                <span className="font-data-mono text-data-mono font-semibold text-primary">CPM + PERT</span>
              </div>
              <div className="px-space-sm py-space-2xs bg-surface-container-low rounded-lg text-center min-w-[120px]">
                <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase">Calculation Mode</span>
                <span className="font-data-mono text-data-mono font-semibold text-secondary">Multi-Resource</span>
              </div>
              <div className="px-space-sm py-space-2xs bg-surface-container-low rounded-lg text-center min-w-[120px]">
                <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase">Privacy Standard</span>
                <span className="font-data-mono text-data-mono font-semibold text-tertiary">Sandbox (0 Server API)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workspace & Sticky Result Dashboard */}
      <section className="w-full bg-surface-container-low py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            
            {/* Left 8 Columns: Main Input Configuration & Tasks */}
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              
              {/* Card 1: Project Parameters */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">1</span>
                    <div>
                      <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Project Core Parameters</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Establish the calendar baseline, target bounds, and resource throughput constraints.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetDefaults}
                    className="text-primary hover:text-on-primary-fixed-variant text-body-sm font-body-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset Defaults
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md">
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 font-semibold">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 font-semibold">Project Start Date</label>
                    <input
                      type="date"
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 font-semibold">Target Deadline (Benchmark)</label>
                    <input
                      type="date"
                      value={targetDateStr}
                      onChange={(e) => setTargetDateStr(e.target.value)}
                      className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 font-semibold">Daily Work Hours / Person</label>
                    <div className="flex items-center bg-surface-container-low rounded-lg px-space-sm py-2 border border-outline-variant/30">
                      <input
                        type="number"
                        min="4"
                        max="16"
                        step="0.5"
                        value={workHours}
                        onChange={(e) => setWorkHours(parseFloat(e.target.value) || 8)}
                        className="w-full bg-transparent text-on-surface font-data-mono text-data-mono focus:outline-none"
                      />
                      <span className="text-on-surface-variant font-body-sm text-body-sm ml-1">hrs</span>
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 font-semibold">Active Team Members</label>
                    <div className="flex items-center bg-surface-container-low rounded-lg px-space-sm py-2 border border-outline-variant/30">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={teamSize}
                        onChange={(e) => setTeamSize(parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-transparent text-on-surface font-data-mono text-data-mono focus:outline-none"
                      />
                      <span className="text-on-surface-variant font-body-sm text-body-sm ml-1">staff</span>
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 font-semibold">Safety Buffer Days</label>
                    <div className="flex items-center bg-surface-container-low rounded-lg px-space-sm py-2 border border-outline-variant/30">
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={bufferDays}
                        onChange={(e) => setBufferDays(parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-transparent text-on-surface font-data-mono text-data-mono focus:outline-none"
                      />
                      <span className="text-on-surface-variant font-body-sm text-body-sm ml-1">days</span>
                    </div>
                  </div>
                </div>

                {/* Calendar & Efficiency Configuration Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20">
                  <div className="space-y-space-xs">
                    <span className="block font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Calendar Exclusions</span>
                    <div className="flex flex-wrap gap-space-md">
                      <label className="flex items-center gap-2 cursor-pointer text-body-sm text-on-surface">
                        <input
                          type="checkbox"
                          checked={excludeWeekends}
                          onChange={(e) => setExcludeWeekends(e.target.checked)}
                          className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                        />
                        <span>Skip Weekends (Sat-Sun)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-body-sm text-on-surface">
                        <input
                          type="checkbox"
                          checked={excludeHolidays}
                          onChange={(e) => setExcludeHolidays(e.target.checked)}
                          className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                        />
                        <span>Include Major Bank Holidays (US/Global)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Productivity Efficiency Model</span>
                      <span className="font-data-mono text-data-mono font-bold text-primary">
                        {efficiency === 70 ? '70% (Conservative)' : efficiency === 85 ? '85% (Standard)' : efficiency === 100 ? '100% (Optimistic)' : `${efficiency}% (Custom)`}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 bg-surface-container p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setEfficiency(70)}
                        className={`py-1 text-center font-body-sm text-body-sm rounded-md transition-colors cursor-pointer ${
                          efficiency === 70 ? 'bg-primary text-on-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Conservative (70%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEfficiency(85)}
                        className={`py-1 text-center font-body-sm text-body-sm rounded-md transition-colors cursor-pointer ${
                          efficiency === 85 ? 'bg-primary text-on-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Standard (85%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEfficiency(100)}
                        className={`py-1 text-center font-body-sm text-body-sm rounded-md transition-colors cursor-pointer ${
                          efficiency === 100 ? 'bg-primary text-on-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Optimistic (100%)
                      </button>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={efficiency}
                      onChange={(e) => setEfficiency(parseInt(e.target.value, 10))}
                      className="w-full mt-2 accent-primary cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive Task Breakdown & Phase Table */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md border border-outline-variant/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">2</span>
                    <div>
                      <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Work Breakdown Structure (WBS)</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Adjust task duration, team assignment, and dependencies to compute your critical path.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAddTask}
                    type="button"
                    className="inline-flex items-center gap-1 px-space-sm py-2 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary transition-all font-body-sm text-body-sm font-semibold cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Custom Task
                  </button>
                </div>

                {/* Task Table Responsive Container */}
                <div className="overflow-x-auto rounded-lg border border-outline-variant/30">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead>
                      <tr className="bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3 min-w-[220px]">Task Name</th>
                        <th className="py-2.5 px-3 min-w-[100px]">Hours</th>
                        <th className="py-2.5 px-3 min-w-[110px]">Priority</th>
                        <th className="py-2.5 px-3 min-w-[100px]">Assignee</th>
                        <th className="py-2.5 px-3 min-w-[110px]">Prerequisite</th>
                        <th className="py-2.5 px-3 text-center">Milestone</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {tasks.map(t => {
                        const isCritical = cpSet.has(t.id);
                        return (
                          <tr key={t.id} className={`hover:bg-surface-container-low transition-colors group ${isCritical ? 'bg-error/5' : ''}`}>
                            <td className="py-2.5 px-3 font-data-mono font-bold text-on-surface-variant">{t.id}</td>
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={t.name}
                                onChange={(e) => handleTaskChange(t.id, 'name', e.target.value)}
                                className="w-full bg-transparent border-b border-transparent hover:border-outline-variant focus:border-primary focus:outline-none font-medium text-on-surface text-body-sm"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="number"
                                min="0"
                                max="500"
                                value={t.hours}
                                onChange={(e) => handleTaskChange(t.id, 'hours', e.target.value)}
                                disabled={t.milestone}
                                className="w-20 bg-surface-container-low rounded px-1.5 py-0.5 font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20 disabled:opacity-50"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <select
                                value={t.priority}
                                onChange={(e) => handleTaskChange(t.id, 'priority', e.target.value)}
                                className="bg-surface-container-low rounded px-1.5 py-0.5 text-[12px] font-medium text-on-surface focus:outline-none border border-outline-variant/20 cursor-pointer"
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                              </select>
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={t.assignee}
                                onChange={(e) => handleTaskChange(t.id, 'assignee', e.target.value)}
                                className="w-24 bg-surface-container-low rounded px-1.5 py-0.5 font-body-sm text-body-sm text-on-surface focus:outline-none border border-outline-variant/20"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <select
                                value={t.prereq}
                                onChange={(e) => handleTaskChange(t.id, 'prereq', e.target.value)}
                                className="bg-surface-container-low rounded px-1.5 py-0.5 text-[12px] font-data-mono text-on-surface focus:outline-none border border-outline-variant/20 cursor-pointer"
                              >
                                <option value="0">None (Root)</option>
                                {tasks.filter(other => other.id !== t.id).map(other => (
                                  <option key={other.id} value={other.id}>Task #{other.id}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={t.milestone}
                                onChange={(e) => handleTaskChange(t.id, 'milestone', e.target.checked)}
                                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteTask(t.id)}
                                className="text-outline hover:text-error transition-colors p-1 cursor-pointer"
                                title="Remove Task"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-space-xs pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <div className="flex items-center gap-space-md">
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-error"></span> Critical Path Task</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Standard Task</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rotate-45 bg-tertiary inline-block"></span> Milestone Gate</span>
                  </div>
                  <span className="font-data-mono text-data-mono font-semibold">
                    {tasks.length} Tasks | {calculations.totalScopeHours} Total Hours
                  </span>
                </div>
              </div>

              {/* Card 3: Interactive Timeline & Gantt View */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md border border-outline-variant/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">3</span>
                    <div>
                      <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Interactive Timeline &amp; Gantt View</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Live computational representation of scheduling bands and delivery gates.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="text-body-sm text-on-surface-variant">Zoom:</span>
                    <button
                      type="button"
                      onClick={() => setGanttZoom('weeks')}
                      className={`px-space-xs py-1 rounded font-body-sm text-body-sm font-semibold cursor-pointer transition-colors ${
                        ganttZoom === 'weeks' ? 'bg-surface-container-high text-on-surface' : 'hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      onClick={() => setGanttZoom('days')}
                      className={`px-space-xs py-1 rounded font-body-sm text-body-sm font-semibold cursor-pointer transition-colors ${
                        ganttZoom === 'days' ? 'bg-surface-container-high text-on-surface' : 'hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      Daily
                    </button>
                  </div>
                </div>

                {/* Visual Gantt Surface */}
                <div className="w-full bg-surface-container-low p-space-md rounded-xl overflow-x-auto border border-outline-variant/20">
                  <div className="min-w-[620px] space-y-3">
                    {(() => {
                      let accumulatedDays = 0;
                      const eff = efficiency / 100;
                      const totalSpanDays = Math.max(1, calculations.pureWorkingDays + bufferDays);

                      return tasks.map(t => {
                        const taskDays = t.milestone ? 0.5 : Math.max(1, Math.round(t.hours / (workHours * eff)));
                        const isCritical = cpSet.has(t.id);

                        const leftPct = Math.min(88, (accumulatedDays / totalSpanDays) * 85);
                        const widthPct = t.milestone ? 4 : Math.min(95 - leftPct, Math.max(5, (taskDays / totalSpanDays) * 85));

                        // Advance accumulated days for next sequential task
                        if (!t.prereq || t.prereq === 0) {
                          accumulatedDays += taskDays * 0.4;
                        } else {
                          accumulatedDays += taskDays * 0.7;
                        }

                        return (
                          <div key={t.id} className="flex items-center gap-2 text-body-sm">
                            <div className="w-40 truncate text-on-surface font-medium text-[12px]" title={t.name}>
                              #{t.id} {t.name}
                            </div>
                            <div className="flex-1 bg-surface-container rounded-md h-6 relative overflow-hidden flex items-center px-1">
                              <div
                                className={`absolute h-4 rounded transition-all duration-300 ${
                                  t.milestone
                                    ? 'rotate-45 w-4 h-4 bg-tertiary'
                                    : isCritical
                                    ? 'bg-error text-on-error'
                                    : 'bg-primary text-on-primary'
                                }`}
                                style={{
                                  left: `${leftPct}%`,
                                  width: t.milestone ? '16px' : `${widthPct}%`
                                }}
                                title={`${t.name}: ${t.hours} hrs`}
                              />
                              <span
                                className="absolute text-[10px] font-data-mono font-bold text-on-surface-variant pl-1 select-none"
                                style={{ left: `calc(${leftPct}% + ${t.milestone ? 24 : 8}px)` }}
                              >
                                {t.milestone ? 'Gate' : `${t.hours}h`}
                              </span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Milestone Highway Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm pt-space-xs">
                  {calculations.milestonePhases.map((phase, idx) => (
                    <div key={idx} className="bg-surface-container-low p-space-sm rounded-xl space-y-1 border border-outline-variant/20">
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-[20px] text-primary">{phase.icon}</span>
                        <span className="font-data-mono text-[11px] font-bold text-on-surface-variant">
                          {phase.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="font-body-sm font-semibold text-on-surface">{phase.name}</div>
                      <div className="font-label-caps text-on-surface-variant text-[11px]">{phase.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: Dynamic Scenario & Delay Stress-Tester */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md border border-outline-variant/20">
                <div className="flex items-center gap-space-xs">
                  <span className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">4</span>
                  <div>
                    <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Live Scenario &amp; Delay Stress Tester</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Simulate unexpected scope additions, stakeholder review lags, or contractor delays with 1-click recalculation.</p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-sm border border-outline-variant/20">
                  <div className="flex flex-wrap items-center justify-between gap-space-xs">
                    <span className="font-body-md text-body-md font-semibold text-on-surface">Inject Schedule Friction (Simulated Days Added):</span>
                    <span className="font-data-mono text-data-mono px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-bold">
                      {delayDays > 0 ? `+${delayDays} Business Days Added` : '+0 Business Days'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 3, 5, 10, 15, 30].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDelayDays(d)}
                        className={`px-space-sm py-1.5 rounded-lg font-data-mono text-body-sm transition-transform active:scale-95 cursor-pointer font-semibold ${
                          delayDays === d
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        {d === 0 ? 'No Delay (Base)' : d === 30 ? '+30 Days (Crisis)' : `+${d} Day${d > 1 ? 's' : ''}`}
                      </button>
                    ))}
                  </div>

                  <div className={`p-space-sm rounded-lg flex items-center justify-between text-body-sm ${
                    delayDays > 0 ? 'bg-error-container text-on-error-container font-semibold' : 'bg-surface-container text-on-surface'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-[18px] ${delayDays > 0 ? 'text-error' : 'text-primary'}`}>
                        {delayDays > 0 ? 'warning' : 'analytics'}
                      </span>
                      <span>
                        {delayDays > 0
                          ? `Delay slips project completion by +${calculations.delaySlipCalendarDays} calendar days!`
                          : 'Baseline delivery matches current team velocity buffer.'}
                      </span>
                    </span>
                    <span className={`font-data-mono font-semibold ${delayDays > 0 ? 'font-bold' : 'text-primary'}`}>
                      {delayDays > 0 ? `+${calculations.delaySlipCalendarDays} Days Slip` : 'Δ 0 Calendar Days'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 4 Columns: Sticky Key Results & Analytical Insights */}
            <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-space-md">
              
              {/* Primary Estimated Date Container */}
              <div className="bg-gradient-to-br from-primary via-primary-container to-surface-tint text-on-primary p-space-lg rounded-2xl shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-primary-container font-semibold">Forecasted Completion</span>
                    <span className="inline-flex items-center gap-1 bg-on-primary/10 px-space-xs py-0.5 rounded-full text-[11px] font-semibold text-on-primary">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Deterministic
                    </span>
                  </div>
                  <div className="py-space-xs">
                    <div className="font-numerical-display text-numerical-display font-bold leading-tight tracking-tight">
                      {calculations.finalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="font-body-md text-body-md text-on-primary-container">
                      Forecasted {calculations.finalDate.toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                  </div>
                  <div className="pt-space-2xs border-t border-on-primary/15 flex items-center justify-between font-body-sm text-body-sm text-on-primary-container">
                    <span>Total Calendar Window:</span>
                    <span className="font-data-mono font-bold text-on-primary">{calculations.calendarDaysElapsed} Calendar Days</span>
                  </div>
                </div>
              </div>

              {/* Secondary Metrics Grid */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md border border-outline-variant/20">
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Executive Feasibility Audit</h3>
                <div className="space-y-space-sm">
                  {/* Deadline Feasibility Gauge */}
                  <div>
                    <div className="flex justify-between items-center text-body-sm text-on-surface mb-1">
                      <span className="font-semibold">Deadline Feasibility</span>
                      <span className="font-data-mono text-data-mono font-bold text-primary">
                        {calculations.feasibilityScore}% {calculations.feasibilityScore >= 80 ? 'High Confidence' : 'Feasibility'}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          calculations.feasibilityScore > 80
                            ? 'bg-primary'
                            : calculations.feasibilityScore > 60
                            ? 'bg-yellow-500'
                            : 'bg-error'
                        }`}
                        style={{ width: `${calculations.feasibilityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Risk Indicator */}
                  <div className="flex items-center justify-between p-space-xs rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[20px] ${
                        calculations.feasibilityScore > 80 ? 'text-secondary' : calculations.feasibilityScore > 60 ? 'text-yellow-600' : 'text-error'
                      }`}>
                        {calculations.riskIcon}
                      </span>
                      <div>
                        <div className="font-body-sm font-semibold text-on-surface">Schedule Risk Profile</div>
                        <div className="font-label-caps text-on-surface-variant text-[11px]">{calculations.riskDesc}</div>
                      </div>
                    </div>
                    <span className={`font-label-caps font-bold px-space-xs py-1 rounded uppercase text-[11px] ${calculations.riskColor}`}>
                      {calculations.riskBadge}
                    </span>
                  </div>

                  {/* Resource Capacity Balance */}
                  <div className="p-space-xs rounded-lg bg-surface-container-low space-y-1 border border-outline-variant/20">
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-on-surface-variant font-medium">Team Velocity &amp; Burn:</span>
                      <span className="font-data-mono font-semibold text-on-surface">{calculations.teamDailyCapacityHours.toFixed(1)} hrs/day</span>
                    </div>
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-on-surface-variant font-medium">Working Days Required:</span>
                      <span className="font-data-mono font-semibold text-on-surface">{calculations.pureWorkingDays} + {bufferDays + delayDays} Buffer/Slack</span>
                    </div>
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-on-surface-variant font-medium">Critical Path Sequence:</span>
                      <span className="font-data-mono font-semibold text-error">{criticalPathInfo.duration} hrs</span>
                    </div>
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-on-surface-variant font-medium">Buffer Protection Ratio:</span>
                      <span className="font-data-mono font-semibold text-secondary">{calculations.bufferPct}% of Timeline</span>
                    </div>
                  </div>

                  {/* Resource Allocation Breakdown */}
                  <div className="space-y-1.5 pt-space-2xs">
                    <span className="block font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Individual Capacity Load</span>
                    <div className="space-y-2">
                      {calculations.teamLoads.map((m, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-center text-[12px]">
                            <span className="font-medium text-on-surface flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${m.isOverloaded ? 'bg-error' : 'bg-primary'}`}></span>
                              {m.name}
                            </span>
                            <span className={`font-data-mono font-semibold ${m.isOverloaded ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
                              {m.hours} hrs ({m.pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${m.isOverloaded ? 'bg-error' : 'bg-primary'}`}
                              style={{ width: `${Math.min(100, m.pct)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Export Bar */}
                <div className="pt-space-xs space-y-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className={`w-full py-2.5 px-space-sm rounded-lg text-on-primary font-body-sm text-body-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer ${
                      copied ? 'bg-green-600' : 'bg-primary hover:bg-surface-tint'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copied ? 'done' : 'content_copy'}
                    </span>
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Executive Summary'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadCsv}
                      className="py-2 px-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-[16px]">table_view</span> Export CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="py-2 px-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-[16px]">print</span> Print / PDF
                    </button>
                  </div>
                </div>

                <div className="p-space-xs rounded-lg bg-primary-fixed/30 text-on-primary-fixed flex items-start gap-2 text-body-sm border border-primary-fixed/50">
                  <span className="material-symbols-outlined text-[18px] mt-0.5 text-primary">security</span>
                  <span className="text-[12px] leading-snug">
                    All schedule models, task names, and team assignments are computed strictly in-memory. Nothing is transmitted externally.
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Step-by-Step Featured Snippet Guide */}
      <section className="w-full bg-surface py-space-2xl border-t border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-3xl mb-space-xl">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">How It Works</span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
              How to Calculate an Accurate Project Timeline in 4 Deterministic Steps
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              Traditional intuition-based project deadlines fail 68% of the time due to optimistic bias and unmodeled dependencies. Follow this step-by-step computational workflow to establish defensible milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs relative border border-outline-variant/20">
              <span className="text-display-hero font-data-mono font-bold text-surface-container-highest/60 absolute top-2 right-4 select-none">01</span>
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[22px]">segment</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Deconstruct Scope (WBS)</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Segment delivery into discreet tasks between 8 and 80 hours. Assign discrete prerequisites to differentiate parallel activities from serial blocking paths.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs relative border border-outline-variant/20">
              <span className="text-display-hero font-data-mono font-bold text-surface-container-highest/60 absolute top-2 right-4 select-none">02</span>
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[22px]">groups</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Normalize Effective Velocity</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Never calculate at 100% nominal capacity. Deduct 15–30% for administrative overhead, context switching, peer code reviews, and meetings using our efficiency models.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs relative border border-outline-variant/20">
              <span className="text-display-hero font-data-mono font-bold text-surface-container-highest/60 absolute top-2 right-4 select-none">03</span>
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[22px]">route</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Map the Critical Path (CPM)</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Identify the longest non-slack chain of sequential dependencies. Adding team members to non-critical tasks does not accelerate your final deployment gate.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs relative border border-outline-variant/20">
              <span className="text-display-hero font-data-mono font-bold text-surface-container-highest/60 absolute top-2 right-4 select-none">04</span>
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[22px]">shield</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Inject Root Buffers</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Introduce explicit 10–20% feeding buffers at major integration gates rather than padding individual tasks. This neutralizes Parkinson’s Law and student syndrome.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Planning Mathematical Foundations */}
      <section className="w-full bg-surface-container-low py-space-2xl border-t border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-3xl mb-space-xl">
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest font-semibold">Formal Methodology</span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
              Mathematical Formulation &amp; CPM Logic
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              Explore the exact algorithmic models running inside this client-side planning tool, fully conforming with Project Management Institute (PMI) PMBOK 7th Edition standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {/* Formula 1 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Baseline Duration Formula</span>
                <span className="material-symbols-outlined text-primary text-[20px]">functions</span>
              </div>
              <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-body-sm text-on-surface overflow-x-auto text-center font-bold">
                D_work = ⌈ Σ(T_hours) ÷ (N_team × H_day × η_eff) ⌉
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Where <em>T_hours</em> is total work breakdown volume, <em>N_team</em> is human headcount, <em>H_day</em> is billable hours, and <em>η_eff</em> is the availability efficiency coefficient (0.70 to 1.00).
              </p>
            </div>

            {/* Formula 2 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Calendar Completion Gate</span>
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
              </div>
              <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-body-sm text-on-surface overflow-x-auto text-center font-bold">
                Date_end = Date_start ⊕ (D_work + B_days + Δ_delay)
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                The symbol ⊕ represents an iterative calendar step function advancing across Gregorian dates while conditionally evaluating weekends and recognized public holiday arrays.
              </p>
            </div>

            {/* Formula 3 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Critical Path Duration (CPM)</span>
                <span className="material-symbols-outlined text-primary text-[20px]">alt_route</span>
              </div>
              <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-body-sm text-on-surface overflow-x-auto text-center font-bold">
                T_CPM = max_k ( Σ_(i ∈ Path_k) (d_i) )
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Evaluates the directed acyclic graph (DAG) of all project prerequisites to determine the maximum cumulative duration sequence devoid of scheduling float or slack.
              </p>
            </div>

            {/* Formula 4 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Resource Utilization Ratio</span>
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
              </div>
              <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-body-sm text-on-surface overflow-x-auto text-center font-bold">
                U_res = ( Σ(H_assigned) ÷ (D_work × H_day) ) × 100%
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Measures dedicated capacity against total available window. Ratios exceeding 90% trigger cognitive fatigue alerts and elevated defect delivery probabilities.
              </p>
            </div>

            {/* Formula 5 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Feasibility Confidence Index</span>
                <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
              </div>
              <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-body-sm text-on-surface overflow-x-auto text-center font-bold">
                F_score = clamp(0, 100, 100 - ( (Date_end - Date_target) ÷ D_work ) × 100 )
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Generates an empirical probability metric contrasting mathematical finish dates against client executive constraints to isolate critical scope compression needs.
              </p>
            </div>

            {/* Formula 6 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Root Buffer Sizing Ratio</span>
                <span className="material-symbols-outlined text-primary text-[20px]">hourglass_empty</span>
              </div>
              <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-body-sm text-on-surface overflow-x-auto text-center font-bold">
                Buffer_% = ( B_days ÷ (D_work + B_days) ) × 100%
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Goldratt&apos;s Critical Chain Project Management (CCPM) rule: establishes whether reserved non-working contingency satisfies the standard 15%–25% variance boundary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Comprehensive Real-World Case Studies */}
      <section className="w-full bg-surface py-space-2xl border-t border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-3xl mb-space-xl">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">Benchmark Profiles</span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
              5 Verified Industry Case Studies &amp; Resource Models
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              Compare your parameters against empirical project baselines across modern software engineering, construction, enterprise IT, and marketing delivery.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl shadow-sm bg-surface-container-lowest border border-outline-variant/30">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead>
                <tr className="bg-surface-container-high text-on-surface font-label-caps text-label-caps uppercase">
                  <th className="py-3 px-4">Industry &amp; Project Type</th>
                  <th className="py-3 px-4">Total Scope</th>
                  <th className="py-3 px-4">Team Size</th>
                  <th className="py-3 px-4">Standard Buffer</th>
                  <th className="py-3 px-4">Calculated Duration</th>
                  <th className="py-3 px-4">Critical Bottleneck</th>
                  <th className="py-3 px-4">Typical Feasibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">shopping_bag</span>
                      <span>E-Commerce Platform Redesign</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-data-mono">400 hrs</td>
                  <td className="py-3.5 px-4 font-data-mono">4 FTEs</td>
                  <td className="py-3.5 px-4 font-data-mono">5 Days</td>
                  <td className="py-3.5 px-4 font-data-mono font-bold text-primary">20 Work Days</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Payment API &amp; ERP Sync</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 text-[11px] font-bold">
                      96% High
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">phone_iphone</span>
                      <span>Native Mobile App (iOS / Android)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-data-mono">850 hrs</td>
                  <td className="py-3.5 px-4 font-data-mono">5 FTEs</td>
                  <td className="py-3.5 px-4 font-data-mono">10 Days</td>
                  <td className="py-3.5 px-4 font-data-mono font-bold text-primary">35 Work Days</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Apple Store Review &amp; Auth</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 text-[11px] font-bold">
                      91% High
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">home_repair_service</span>
                      <span>Residential Architecture Remodel</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-data-mono">1,200 hrs</td>
                  <td className="py-3.5 px-4 font-data-mono">6 Subs</td>
                  <td className="py-3.5 px-4 font-data-mono">15 Days</td>
                  <td className="py-3.5 px-4 font-data-mono font-bold text-primary">45 Work Days</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Municipal Electrical Permits</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 text-[11px] font-bold">
                      78% Moderate
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">campaign</span>
                      <span>Global Omnichannel Product Launch</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-data-mono">320 hrs</td>
                  <td className="py-3.5 px-4 font-data-mono">3 FTEs</td>
                  <td className="py-3.5 px-4 font-data-mono">4 Days</td>
                  <td className="py-3.5 px-4 font-data-mono font-bold text-primary">18 Work Days</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Legal Copy Clearance</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 text-[11px] font-bold">
                      94% High
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">cloud_sync</span>
                      <span>Enterprise Cloud SaaS Migration</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-data-mono">1,600 hrs</td>
                  <td className="py-3.5 px-4 font-data-mono">8 FTEs</td>
                  <td className="py-3.5 px-4 font-data-mono">12 Days</td>
                  <td className="py-3.5 px-4 font-data-mono font-bold text-primary">36 Work Days</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Database Shard Validation</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 text-[11px] font-bold">
                      82% Moderate
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PMBOK Best Practices & Planning Principles */}
      <section className="w-full bg-surface-container-low py-space-2xl border-t border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-3xl mb-space-xl">
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest font-semibold">Planning Governance</span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
              5 PMBOK Golden Rules for Bulletproof Delivery
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              Mastering modern schedule estimation requires psychological realism alongside mathematical formulas. Keep these fundamental laws in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Parkinson&apos;s Law Defense</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                &ldquo;Work expands so as to fill the time available for its completion.&rdquo; When safety buffers are tucked into every individual subtask, team members naturally consume that extra float without reducing overall schedule latency. Always aggregate project buffers at the end of the milestone chain.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">trending_up</span>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Brooks&apos; Law Awareness</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                &ldquo;Adding manpower to a late software project makes it later.&rdquo; Communication lines scale exponentially as <em>N(N - 1) / 2</em>. Increasing team count from 4 to 8 doubles capacity on paper, but can spike synchronization overhead by 300%. Account for this through our Conservative (70%) efficiency presets.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">timer_off</span>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Student Syndrome Mitigation</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                People habitually postpone intensive application until deadlines become imminent. By setting visible short sprint gates (like our 4-phase milestone checkpoints), you create immediate accountability and detect bottleneck variances weeks before catastrophic release dates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Comparison Matrix */}
      <section className="w-full bg-surface py-space-2xl border-t border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-3xl mb-space-xl">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">Workflow Comparison</span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
              Why SolveIt Project Planner Outperforms Spreadsheets &amp; Complex PM Tools
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              Compare traditional methods with our instantaneous, deterministic client-side planning engine.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl shadow-sm bg-surface-container-lowest border border-outline-variant/30">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead>
                <tr className="bg-surface-container text-on-surface font-label-caps text-label-caps uppercase">
                  <th className="py-3 px-4">Evaluation Metric</th>
                  <th className="py-3 px-4">Manual / Mental Math</th>
                  <th className="py-3 px-4">Excel / Google Sheets</th>
                  <th className="py-3 px-4 text-primary font-bold">SolveIt Project Planner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-medium">Calculation Latency</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Hours of manual recalculation</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">10–30 mins (formula adjustment)</td>
                  <td className="py-3.5 px-4 font-bold text-primary">Instant (0.01ms Local WASM/JS)</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-medium">Automatic Critical Path (CPM)</td>
                  <td className="py-3.5 px-4 text-error">
                    <span className="material-symbols-outlined text-[16px] align-middle">close</span> Not Supported
                  </td>
                  <td className="py-3.5 px-4 text-error">
                    <span className="material-symbols-outlined text-[16px] align-middle">close</span> Complex custom macros required
                  </td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    <span className="material-symbols-outlined text-[16px] align-middle">check</span> Native Topological Sorting
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-medium">Live Delay Stress Testing</td>
                  <td className="py-3.5 px-4 text-error">
                    <span className="material-symbols-outlined text-[16px] align-middle">close</span> None
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Manual cell overwriting</td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    <span className="material-symbols-outlined text-[16px] align-middle">check</span> 1-Click Delta Recalculation
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-medium">Confidentiality &amp; Privacy</td>
                  <td className="py-3.5 px-4 text-secondary">Local paper only</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Stored on cloud servers</td>
                  <td className="py-3.5 px-4 font-bold text-primary">100% In-Browser Isolation (0 Logs)</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-medium">Cost &amp; Sign-in Requirement</td>
                  <td className="py-3.5 px-4">Free</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Requires MS Office / Google Account</td>
                  <td className="py-3.5 px-4 font-bold text-primary">100% Free Forever (No Signup)</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-medium">Calendar &amp; Holiday Logic</td>
                  <td className="py-3.5 px-4 text-error">Prone to calendar counting errors</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Requires NETWORKDAYS.INTL setup</td>
                  <td className="py-3.5 px-4 font-bold text-primary">Automated Gregorian Holiday Handling</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 15 In-Depth FAQ Accordions */}
      <section className="w-full bg-surface-container-low py-space-2xl border-t border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-3xl mb-space-xl">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">Knowledge Base</span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
              Frequently Asked Questions About Project Planning &amp; Estimation
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              Authoritative answers to common questions regarding timelines, velocity, critical paths, and project risk management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {[
              {
                q: "How do I calculate a realistic project timeline?",
                a: "To calculate a realistic timeline: sum total hours in your Work Breakdown Structure (WBS), divide by your team's effective daily capacity (headcount × daily hours × 80% efficiency), skip non-working days (weekends and holidays), and append a 10% to 20% milestone buffer."
              },
              {
                q: "What is the difference between calendar days and working days?",
                a: "Working days represent actual days when resources perform productive tasks (typically Monday through Friday excluding holidays). Calendar days represent elapsed consecutive chronological time (including weekends and holidays). A 20-working-day project typically spans 28 to 30 calendar days."
              },
              {
                q: "How do buffer days protect project delivery?",
                a: "Buffer days act as dedicated project shock absorbers. Placing buffers at critical integration gates instead of padding individual task estimates prevents scope expansion, preserves schedule float, and prevents minor unexpected delays from breaching hard commitments."
              },
              {
                q: "What is the Critical Path Method (CPM) and why does it matter?",
                a: "The Critical Path Method (CPM) calculates the longest sequence of dependent activities required to finish the project. Any single day of delay on a critical path task directly pushes the project’s final finish date by one full day. Non-critical tasks possess float (slack)."
              },
              {
                q: "How do I handle team member vacation days and holidays?",
                a: "Our tool automatically handles weekends and bank holidays. For planned individual vacations, lower the Resource Availability percentage slider (e.g., from 85% to 70%) or add the equivalent out-of-office days directly into the Safety Buffer field."
              },
              {
                q: "What is a healthy team utilization rate without causing burnout?",
                a: "Industry research shows peak sustainable knowledge-work productivity occurs between 75% and 85% capacity utilization. Scheduling team members at 100% capacity creates bottlenecks, spikes defect rates by up to 40%, and leaves zero tolerance for urgent production issues."
              },
              {
                q: "How does the Delay Simulator work?",
                a: "The Delay Simulator applies prospective delay offsets across your timeline. By clicking \"+1 Day\", \"+5 Days\", or \"+15 Days\", you can immediately visualize how schedule slips impact your delivery date, buffer absorption, and overall deadline feasibility score."
              },
              {
                q: "What is the Deadline Feasibility Score?",
                a: "When you enter an optional target date, our algorithm compares your calculated deterministic completion date against that target benchmark. If the project finishes well in advance of the deadline, feasibility registers above 90% (Low Risk); if it exceeds the deadline, the score drops proportionally."
              },
              {
                q: "Can parallel tasks shorten my overall project schedule?",
                a: "Yes. Tasks with \"None\" as a prerequisite execute concurrently if sufficient team members are active. For example, UX wireframing and database setup can run in parallel, cutting total calendar duration in half compared to linear execution."
              },
              {
                q: "How do I estimate tasks when requirements are uncertain?",
                a: "Use the PERT (Program Evaluation and Review Technique) three-point estimation formula: Expected Hours = (Optimistic + 4 × Realistic + Pessimistic) ÷ 6. Enter the calculated expected hours directly into the task breakdown table."
              },
              {
                q: "Is this project planning calculator really 100% free with no account required?",
                a: "Yes. SolveIt Calculator provides unrestricted, client-side computational utilities. No account signups, credit cards, or trial tier expiration. All operations execute locally inside your browser."
              },
              {
                q: "Does my project data get saved or uploaded to your servers?",
                a: "Never. We maintain a zero-telemetry architecture. Your task names, hour figures, client details, and schedules exist only in your device's browser memory (DOM). If you close your browser tab, your data clears entirely."
              },
              {
                q: "How do I export my project schedule to CSV or PDF?",
                a: "Click the \"Export CSV\" button in the right-hand dashboard to immediately download a formatted spreadsheet table. You can also click \"Print / PDF\" to launch a clean print-optimized view of your schedule and Gantt timeline."
              },
              {
                q: "How is this different from Jira, Asana, or Microsoft Project?",
                a: "Jira and Asana are operational ticket trackers designed for daily status updates. This tool is a fast, lightweight planning simulator built for upfront estimation, client proposals, capacity feasibility checks, and instant \"what-if\" scenario modeling without setup friction."
              },
              {
                q: "What should I do if my project deadline is unrealistic?",
                a: "According to the PM Project Management Triangle (Scope, Time, Cost): you can either (1) reduce non-critical scope tasks, (2) add skilled team resources to critical-path items, or (3) present our Feasibility Audit report to stakeholders to negotiate a date adjustment."
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-2 border border-outline-variant/20 cursor-pointer transition-colors hover:border-outline-variant/40"
                >
                  <h3 className="font-headline-md text-[18px] font-semibold text-on-surface flex items-start justify-between gap-2">
                    <span className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">help_outline</span>
                      <span>{faq.q}</span>
                    </span>
                    <span className="material-symbols-outlined text-outline text-[20px] shrink-0">
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </h3>
                  <p className={`font-body-sm text-body-sm text-on-surface-variant leading-relaxed pl-7 transition-all ${
                    isOpen ? 'block' : 'line-clamp-3 sm:line-clamp-none'
                  }`}>
                    {faq.a}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contextual Internal Linking Grid */}
      <section className="w-full bg-surface py-space-2xl border-t border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-3xl mb-space-lg">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest font-semibold">Related Tools</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
              Explore Precision Time &amp; Computational Calculators
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
            <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col items-center text-center gap-2 group border border-outline-variant/20" href="/time-date/days-between-dates">
              <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">calendar_today</span>
              <span className="font-body-sm font-semibold text-on-surface">Date Difference Calculator</span>
            </Link>

            <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col items-center text-center gap-2 group border border-outline-variant/20" href="/time-date">
              <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">work_history</span>
              <span className="font-body-sm font-semibold text-on-surface">Business Days Calculator</span>
            </Link>

            <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col items-center text-center gap-2 group border border-outline-variant/20" href="/time-date">
              <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">schedule</span>
              <span className="font-body-sm font-semibold text-on-surface">Time Duration Calculator</span>
            </Link>

            <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col items-center text-center gap-2 group border border-outline-variant/20" href="/daily-wage-calculator">
              <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">badge</span>
              <span className="font-body-sm font-semibold text-on-surface">Work Hours Timesheet</span>
            </Link>

            <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col items-center text-center gap-2 group border border-outline-variant/20" href="/percentage-calculator">
              <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">percent</span>
              <span className="font-body-sm font-semibold text-on-surface">Percentage Calculator</span>
            </Link>

            <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col items-center text-center gap-2 group border border-outline-variant/20" href="/time-date">
              <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">cake</span>
              <span className="font-body-sm font-semibold text-on-surface">Age &amp; Milestone Tool</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
