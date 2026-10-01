'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Breadcrumbs from '../../../components/Breadcrumbs';

interface CycleBlock {
  index: number;
  type: 'focus' | 'rest' | 'meal';
  name: string;
  startMinutes: number;
  endMinutes: number;
  startTimeFormatted: string;
  endTimeFormatted: string;
  durationMinutes: number;
  suggestedTasks: string;
  neurobiology: string;
  userTask: string;
}

interface ChronotypePreset {
  id: string;
  name: string;
  icon: string;
  defaultWake: string;
  description: string;
  optimalPeakWindow: string;
}

const CHRONOTYPE_PRESETS: ChronotypePreset[] = [
  {
    id: 'lark',
    name: 'Early Lark (Lion)',
    icon: 'wb_sunny',
    defaultWake: '06:00',
    description: 'Awakens naturally early. First peak focus occurs in early morning, tapering in mid-afternoon.',
    optimalPeakWindow: '07:30 – 11:30 AM',
  },
  {
    id: 'third-bird',
    name: 'Third Bird (Bear)',
    icon: 'schedule',
    defaultWake: '07:00',
    description: 'Tracks the solar cycle. Peak cognitive alertness arrives mid-to-late morning.',
    optimalPeakWindow: '09:00 AM – 1:00 PM',
  },
  {
    id: 'night-owl',
    name: 'Night Owl (Wolf)',
    icon: 'dark_mode',
    defaultWake: '08:30',
    description: 'Slower morning cortisol curve; deep cognitive momentum peaks late afternoon & evening.',
    optimalPeakWindow: '11:30 AM – 3:30 PM & 6:00 – 9:00 PM',
  },
];

const FAQS = [
  {
    q: 'What is a 90-minute ultradian rhythm?',
    a: 'Pioneered by sleep researcher Dr. Nathaniel Kleitman (the co-discoverer of REM sleep), the Basic Rest-Activity Cycle (BRAC) is an innate human biological oscillation lasting approximately 90 to 120 minutes. During the day, the brain moves through rhythmic cycles of high-frequency beta/gamma brainwave alertness followed by a 15–20 minute refractory dip where the nervous system signals for mental and physiological rest.',
  },
  {
    q: 'Why does working beyond 90 minutes cause brain fog and fatigue?',
    a: 'When you force continuous concentration past 90 minutes without a break, your sympathetic nervous system exhausts its available neurotransmitters (dopamine, acetylcholine, and noradrenaline). The brain attempts to compensate by pumping stress hormones (cortisol and adrenaline), which creates jitteriness, cognitive tunnel vision, elevated error rates, and severe afternoon burnout.',
  },
  {
    q: 'How does the 90-minute Ultradian Method differ from Pomodoro (25/5)?',
    a: 'The 25/5 Pomodoro technique is exceptional for overcoming task aversion, administrative triage, and rapid repetitive tasks. However, complex cognitive disciplines—such as software architecture, novel writing, mathematical modeling, and strategic design—require 15 to 25 minutes simply to load complex working memory into consciousness. A 25-minute cutoff frequently halts flow state mid-thought. The 90-minute ultradian cycle allows deep immersed work followed by genuine nervous system decompression.',
  },
  {
    q: 'What should I do during the 20-minute refractory rest phase?',
    a: 'To maximize cognitive replenishment, engage in physiological rest that disengages prefrontal focus: walk without looking at your smartphone, perform Non-Sleep Deep Rest (NSDR), practice box breathing, hydrate, or gaze into the distance (panoramic vision) to relax optical nerve convergence.',
  },
  {
    q: 'How many 90-minute ultradian blocks can a human execute in one day?',
    a: 'Empirical research on deliberate practice conducted by Dr. K. Anders Ericsson showed that elite performers (world-class violinists, Grandmaster chess players, and top athletes) max out at 3 to 4 high-intensity 90-minute deliberate practice sessions per day (roughly 4.5 hours of true deep work). Expecting 8 continuous hours of peak cognitive focus violates human neurobiology.',
  },
];

export default function UltradianRhythmClient() {
  // Input parameters
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [firstBlockDelay, setFirstBlockDelay] = useState<number>(60); // minutes after waking before 1st deep block
  const [focusDuration, setFocusDuration] = useState<number>(90); // 90 min
  const [restDuration, setRestDuration] = useState<number>(20); // 20 min
  const [totalCycles, setTotalCycles] = useState<number>(4);
  const [lunchDuration, setLunchDuration] = useState<number>(50); // lunch break after cycle 2
  const [chronotype, setChronotype] = useState<string>('third-bird');
  
  // Custom user task inputs stored per block
  const [customTasks, setCustomTasks] = useState<Record<number, string>>({});
  
  // Real-time clock & Active timer state
  // Deterministic initial timestamp for SSR
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState<number>(() => 9 * 60 + 15); // 09:15 AM
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerRemainingSeconds, setTimerRemainingSeconds] = useState<number>(90 * 60);
  const [activeTimerMode, setActiveTimerMode] = useState<'focus' | 'rest'>('focus');
  const [timerSessionName, setTimerSessionName] = useState<string>('Cycle 1 Focus');
  const [copyStatus, setCopyStatus] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Audio chime via Web Audio API (Zero external assets needed)
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // AudioContext disallowed before gesture
    }
  };

  // Sync real-world clock on client mount
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerRemainingSeconds((prev) => {
        if (prev <= 1) {
          playChime();
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Handle chronotype change
  const handleSelectChronotype = (cId: string) => {
    setChronotype(cId);
    const found = CHRONOTYPE_PRESETS.find((p) => p.id === cId);
    if (found) {
      setWakeTime(found.defaultWake);
    }
  };

  // Compute all Ultradian Cycles for the day
  const schedule: CycleBlock[] = useMemo(() => {
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);
    const wakeMinutes = (wakeH || 7) * 60 + (wakeM || 0);

    const blocks: CycleBlock[] = [];
    let currentMin = wakeMinutes + firstBlockDelay;

    const formatTime = (min: number) => {
      const normalized = ((min % 1440) + 1440) % 1440;
      const h24 = Math.floor(normalized / 60);
      const m = normalized % 60;
      const period = h24 >= 12 ? 'PM' : 'AM';
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
      return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
    };

    const FOCUS_SUGGESTIONS = [
      {
        name: 'Peak 1: Deep Analytical Architecture',
        tasks: 'High working memory tasks: complex software code, algorithmic problem solving, original manuscript drafting, or core financial models.',
        neurobiology: 'Peak prefrontal dopamine and acetylcholine. Cortisol Awakening Response (CAR) provides maximal alert bandwidth.',
      },
      {
        name: 'Peak 2: Strategic Synthesis & Execution',
        tasks: 'Complex synthesis, editorial revisions, client advisory documents, or high-stakes structural decisions.',
        neurobiology: 'Sustained sympathetic focus. Prefrontal glucose metabolism is prime; ideal for high-leverage execution.',
      },
      {
        name: 'Peak 3: Collaborative Ideation & Design',
        tasks: 'Team problem solving, design iteration, creative brainstorming, high-touch code reviews, or strategic negotiations.',
        neurobiology: 'Post-prandial alertness recovery. Brain shifts toward associative, divergent creative thinking.',
      },
      {
        name: 'Peak 4: Tactical Closeout & Planning',
        tasks: 'Documentation, system administration, review of tomorrow’s critical path, or low-resistance project polish.',
        neurobiology: 'Late-day ultradian crest. Working memory begins tapering; best used for consolidation and systematic closure.',
      },
      {
        name: 'Peak 5: Evening Reflection / Creative Hobby',
        tasks: 'Low-stress creative writing, conceptual reading, language practice, or deliberate hobby study.',
        neurobiology: 'Adenosine buildup begins. Focus shifts toward contemplative or relaxed analytical processing.',
      },
    ];

    const REST_SUGGESTIONS = [
      'NSDR / 15-minute meditative stillness, hydration, and natural sunlight exposure.',
      'Active physical reset: brisk walking, postural decompression, gentle stretching, no screen exposure.',
      'Sensory decompression: panoramic horizon viewing, eye relaxation, and conscious deep nasal breathing.',
      'Workstation shutdown ritual, light hydration, and psychological boundary separation.',
    ];

    for (let c = 1; c <= totalCycles; c++) {
      // Focus Block
      const focusStart = currentMin;
      const focusEnd = currentMin + focusDuration;
      const meta = FOCUS_SUGGESTIONS[(c - 1) % FOCUS_SUGGESTIONS.length];

      blocks.push({
        index: c,
        type: 'focus',
        name: `Cycle ${c}: ${meta.name}`,
        startMinutes: focusStart,
        endMinutes: focusEnd,
        startTimeFormatted: formatTime(focusStart),
        endTimeFormatted: formatTime(focusEnd),
        durationMinutes: focusDuration,
        suggestedTasks: meta.tasks,
        neurobiology: meta.neurobiology,
        userTask: customTasks[c] || '',
      });

      currentMin = focusEnd;

      // Rest / Recovery block
      if (c < totalCycles) {
        // After cycle 2, inject lunch recovery
        if (c === 2) {
          const mealEnd = currentMin + lunchDuration;
          blocks.push({
            index: c,
            type: 'meal',
            name: `Midday Metabolic Reset & Lunch`,
            startMinutes: currentMin,
            endMinutes: mealEnd,
            startTimeFormatted: formatTime(currentMin),
            endTimeFormatted: formatTime(mealEnd),
            durationMinutes: lunchDuration,
            suggestedTasks: 'Nutrient-dense whole-food lunch, 15-minute outdoor walk in natural daylight, zero high-stress work screens.',
            neurobiology: 'Digestion activates parasympathetic vagal brake. Walking reduces glucose spike and restores alertness for Peak 3.',
            userTask: '',
          });
          currentMin = mealEnd;
        } else {
          const restEnd = currentMin + restDuration;
          blocks.push({
            index: c,
            type: 'rest',
            name: `Refractory Recovery Pause`,
            startMinutes: currentMin,
            endMinutes: restEnd,
            startTimeFormatted: formatTime(currentMin),
            endTimeFormatted: formatTime(restEnd),
            durationMinutes: restDuration,
            suggestedTasks: REST_SUGGESTIONS[(c - 1) % REST_SUGGESTIONS.length],
            neurobiology: 'Brain shifts into alpha/theta oscillations. Adenosine clearout and replenishment of prefrontal neurotransmitters.',
            userTask: '',
          });
          currentMin = restEnd;
        }
      }
    }

    return blocks;
  }, [wakeTime, firstBlockDelay, focusDuration, restDuration, totalCycles, lunchDuration, customTasks]);

  // Identify currently active cycle based on client time
  const activeBlock = useMemo(() => {
    return schedule.find(
      (b) => currentTimeMinutes >= b.startMinutes && currentTimeMinutes < b.endMinutes
    );
  }, [schedule, currentTimeMinutes]);

  // Quick preset loader for active timer
  const startTimerForBlock = (block: CycleBlock) => {
    setActiveTimerMode(block.type === 'focus' ? 'focus' : 'rest');
    setTimerSessionName(block.name);
    setTimerRemainingSeconds(block.durationMinutes * 60);
    setTimerRunning(true);
    // Smooth scroll to timer section
    const timerElem = document.getElementById('active-ultradian-timer');
    if (timerElem) {
      timerElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Copy schedule to clipboard
  const handleCopySchedule = () => {
    const lines = [
      `90-MINUTE ULTRADIAN RHYTHM PLANNER — DAILY SCHEDULE`,
      `Wake Time: ${wakeTime} | Focus Blocks: ${focusDuration}m | Recovery: ${restDuration}m`,
      `------------------------------------------------------------`,
      ...schedule.map((b) => {
        const customNote = b.userTask ? ` | Task: ${b.userTask}` : '';
        return `[${b.startTimeFormatted} - ${b.endTimeFormatted}] (${b.durationMinutes}m) ${b.name.toUpperCase()}${customNote}`;
      }),
      `------------------------------------------------------------`,
      `Generated by SolveIt Calculators: https://ais-dev-dsvk4qs4l6kbll5jfioudl-360469277331.asia-east1.run.app/time-date/90-minute-ultradian-rhythm-planner`,
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopyStatus('Schedule Copied to Clipboard!');
      setTimeout(() => setCopyStatus(''), 3000);
    });
  };

  // Generate .ics calendar file for import into Google Calendar / Apple Calendar
  const handleExportIcs = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SolveIt Calculators//Ultradian Rhythm Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ].join('\r\n');

    schedule.forEach((block, idx) => {
      const startH = String(Math.floor(block.startMinutes / 60)).padStart(2, '0');
      const startM = String(block.startMinutes % 60).padStart(2, '0');
      const endH = String(Math.floor(block.endMinutes / 60)).padStart(2, '0');
      const endM = String(block.endMinutes % 60).padStart(2, '0');

      const dtStart = `${y}${m}${d}T${startH}${startM}00`;
      const dtEnd = `${y}${m}${d}T${endH}${endM}00`;

      const summary = block.userTask ? `${block.name}: ${block.userTask}` : block.name;
      const desc = `${block.suggestedTasks.replace(/,/g, '\\,')} \\n\\nNeurobiology: ${block.neurobiology.replace(/,/g, '\\,')}`;

      icsContent += '\r\n' + [
        'BEGIN:VEVENT',
        `UID:ultradian-${Date.now()}-${idx}@solveit.com`,
        `DTSTAMP:${y}${m}${d}T000000Z`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${desc}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
      ].join('\r\n');
    });

    icsContent += '\r\nEND:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ultradian-rhythm-schedule-${y}-${m}-${d}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format seconds to mm:ss
  const formatTimerClock = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface text-on-surface pt-0">
      {/* 1. Contextual Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Time & Date', href: '/time-date' },
          { label: '90-Minute Ultradian Rhythm Planner' },
        ]}
        badge="Kleitman BRAC Engine"
        rightContent={
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-data-mono font-semibold">
            Peak Focus: 90m
          </span>
        }
      />

      {/* 2. Suite Mode Switcher */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant/20 px-gutter-mobile md:px-gutter-desktop py-2.5">
        <div className="max-w-max-width-canvas mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Link
            href="/time-date/90-minute-ultradian-rhythm-planner"
            className="px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap bg-primary text-on-primary font-medium shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            Ultradian Rhythm Planner
          </Link>
          <Link
            href="/focus-and-break-timer"
            className="px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">timer</span>
            Focus &amp; Break Timers (Pomodoro / 52-17)
          </Link>
          <Link
            href="/time-date/work-hours"
            className="px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            Work Hours &amp; Timesheets
          </Link>
          <Link
            href="/time-date/event-countdown"
            className="px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
            Event Countdown
          </Link>
          <Link
            href="/time-date/time-calculator"
            className="px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            Time Arithmetic
          </Link>
        </div>
      </section>

      {/* 3. Hero Header & Overview */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant/30 py-space-xl px-gutter-mobile md:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-data-mono text-xs font-semibold uppercase tracking-wider mb-space-xs">
              <span className="material-symbols-outlined text-[15px]">electric_bolt</span>
              Human Chronobiology &amp; Deliberate Practice
            </div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              90-Minute Ultradian Rhythm Planner
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs max-w-2xl leading-relaxed">
              Align your deep cognitive work with Dr. Nathaniel Kleitman&apos;s natural 90-minute Basic Rest-Activity Cycle (BRAC). Schedule high-alertness focus waves, protect 20-minute refractory pauses, and prevent cognitive exhaustion.
            </p>
          </div>

          {/* Quick Metrics Header Card */}
          <div className="bg-surface-container p-space-md rounded-2xl border border-outline-variant/40 flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase font-bold">Planned Deep Focus</span>
              <span className="font-data-mono text-sm font-bold text-primary">
                {(totalCycles * focusDuration) / 60}h 00m
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (totalCycles / 4) * 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
              <span>{totalCycles} Deep Cycles</span>
              <span>{totalCycles - 1} Recovery Breaks</span>
            </div>
            <div className="pt-2 border-t border-outline-variant/20 flex gap-2">
              <button
                onClick={handleCopySchedule}
                className="flex-1 py-1.5 px-3 rounded-lg bg-surface-container-highest hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                Copy Plan
              </button>
              <button
                onClick={handleExportIcs}
                className="flex-1 py-1.5 px-3 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">calendar_add_on</span>
                .ICS Export
              </button>
            </div>
            {copyStatus && (
              <span className="text-center text-[11px] font-bold text-emerald-600 animate-pulse">
                {copyStatus}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 4. Main Interactive Control Panel & Dashboard */}
      <main className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-2xl">
        
        {/* Chronotype Preset Bar */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-headline-md text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">bedtime</span>
                Step 1: Select Your Chronotype
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Your circadian baseline dictates your cortisol awakening response and optimal peak focus windows.
              </p>
            </div>
            <span className="text-xs font-data-mono text-outline font-semibold">Cortisol Synchronization</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {CHRONOTYPE_PRESETS.map((preset) => {
              const isSelected = chronotype === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectChronotype(preset.id)}
                  className={`p-space-md rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary/5 border-primary shadow-xs ring-2 ring-primary/20'
                      : 'bg-surface-container-low border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`material-symbols-outlined text-[24px] ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {preset.icon}
                      </span>
                      <span className={`text-[11px] font-data-mono px-2 py-0.5 rounded font-bold ${
                        isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        Wake: {preset.defaultWake}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-on-surface mb-1">{preset.name}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                      {preset.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] font-medium text-primary">
                    <span>Prime Window:</span>
                    <span className="font-semibold">{preset.optimalPeakWindow}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Configuration Controls Matrix */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-headline-md text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                Step 2: Calibrate Your Rhythm Parameters
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Fine-tune cycle lengths, recovery buffers, and daily capacity to match your energy architecture.
              </p>
            </div>
            <button
              onClick={() => {
                setWakeTime('07:00');
                setFirstBlockDelay(60);
                setFocusDuration(90);
                setRestDuration(20);
                setTotalCycles(4);
                setLunchDuration(50);
              }}
              className="text-xs text-outline hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              Reset to Kleitman Standard (90/20)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Wake Up Time */}
            <div className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col justify-between">
              <label htmlFor="wakeTimeInput" className="font-label-caps text-xs text-on-surface-variant font-bold uppercase mb-1 block">
                Wake-Up Time
              </label>
              <input
                id="wakeTimeInput"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-surface-container-highest px-3 py-2 rounded-lg font-data-mono font-bold text-base text-on-surface border border-outline-variant/40 focus:outline-hidden focus:border-primary"
              />
              <span className="text-[11px] text-outline mt-1.5">First light exposure baseline</span>
            </div>

            {/* First Block Delay */}
            <div className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col justify-between">
              <label htmlFor="wakeLagSelect" className="font-label-caps text-xs text-on-surface-variant font-bold uppercase mb-1 block">
                Post-Wake Delay (CAR)
              </label>
              <select
                id="wakeLagSelect"
                value={firstBlockDelay}
                onChange={(e) => setFirstBlockDelay(Number(e.target.value))}
                className="w-full bg-surface-container-highest px-3 py-2 rounded-lg font-data-mono font-bold text-sm text-on-surface border border-outline-variant/40 focus:outline-hidden focus:border-primary"
              >
                <option value={45}>45 min (Fast Launch)</option>
                <option value={60}>60 min (Recommended CAR)</option>
                <option value={90}>90 min (Extended Morning)</option>
                <option value={120}>120 min (Workout + Breakfast)</option>
              </select>
              <span className="text-[11px] text-outline mt-1.5">Allows cortisol peak &amp; hydration</span>
            </div>

            {/* Focus Duration */}
            <div className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col justify-between">
              <label htmlFor="focusDurationSelect" className="font-label-caps text-xs text-on-surface-variant font-bold uppercase mb-1 block">
                Focus Wave Duration
              </label>
              <select
                id="focusDurationSelect"
                value={focusDuration}
                onChange={(e) => setFocusDuration(Number(e.target.value))}
                className="w-full bg-surface-container-highest px-3 py-2 rounded-lg font-data-mono font-bold text-sm text-on-surface border border-outline-variant/40 focus:outline-hidden focus:border-primary"
              >
                <option value={75}>75 Minutes (Shorter Cycle)</option>
                <option value={90}>90 Minutes (Kleitman Standard)</option>
                <option value={100}>100 Minutes (Extended Flow)</option>
                <option value={110}>110 Minutes (Upper Physiological Limit)</option>
              </select>
              <span className="text-[11px] text-outline mt-1.5">Full prefrontal cognitive ascent</span>
            </div>

            {/* Total Daily Cycles */}
            <div className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col justify-between">
              <label htmlFor="totalCyclesSelect" className="font-label-caps text-xs text-on-surface-variant font-bold uppercase mb-1 block">
                Daily Focus Cycles
              </label>
              <select
                id="totalCyclesSelect"
                value={totalCycles}
                onChange={(e) => setTotalCycles(Number(e.target.value))}
                className="w-full bg-surface-container-highest px-3 py-2 rounded-lg font-data-mono font-bold text-sm text-on-surface border border-outline-variant/40 focus:outline-hidden focus:border-primary"
              >
                <option value={2}>2 Cycles (3.0h Deep Work)</option>
                <option value={3}>3 Cycles (4.5h Deliberate Practice)</option>
                <option value={4}>4 Cycles (6.0h Full Pro Day)</option>
                <option value={5}>5 Cycles (7.5h Maximum Capacity)</option>
              </select>
              <span className="text-[11px] text-outline mt-1.5">Elite limit: 3-4 blocks/day</span>
            </div>
          </div>
        </section>

        {/* 5. Real-Time Active Cycle Tracker & Interactive Chronometer */}
        <section id="active-ultradian-timer" className="bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-low p-space-lg rounded-3xl border border-outline-variant/40 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
            {/* Left Status */}
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-data-mono font-bold">
                  {activeBlock ? 'CURRENT LIVE CYCLE' : 'CURRENT STATUS'}
                </span>
                <span className="text-xs text-on-surface-variant font-data-mono">
                  Real Time: {String(Math.floor(currentTimeMinutes / 60)).padStart(2, '0')}:{String(currentTimeMinutes % 60).padStart(2, '0')}
                </span>
              </div>

              <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                {activeBlock ? activeBlock.name : 'Outside Scheduled Ultradian Window'}
              </h2>

              <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
                {activeBlock
                  ? activeBlock.suggestedTasks
                  : 'You are currently outside your scheduled daytime ultradian blocks. Rest, unwind, and prepare your nervous system for tomorrow.'}
              </p>

              {activeBlock && (
                <div className="mt-4 p-3 rounded-xl bg-surface-container-highest/60 border border-outline-variant/30 flex items-start gap-2.5 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">neurology</span>
                  <span><strong>Neurobiology:</strong> {activeBlock.neurobiology}</span>
                </div>
              )}
            </div>

            {/* Right Live Chronometer Widget */}
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col items-center justify-center min-w-[280px] sm:min-w-[320px]">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${timerRunning ? 'bg-emerald-500 animate-ping' : 'bg-outline'}`}></span>
                <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-on-surface">
                  {timerSessionName}
                </span>
              </div>

              <div suppressHydrationWarning className="font-data-mono text-5xl sm:text-6xl font-extrabold text-primary tracking-tight my-2">
                {formatTimerClock(timerRemainingSeconds)}
              </div>

              <span className="text-[11px] text-on-surface-variant font-data-mono uppercase mb-4">
                {activeTimerMode === 'focus' ? 'Ascending Beta/Gamma Focus' : 'Vagal Parasympathetic Recovery'}
              </span>

              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    timerRunning
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-primary hover:bg-primary/90 text-on-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {timerRunning ? 'pause' : 'play_arrow'}
                  </span>
                  {timerRunning ? 'Pause' : 'Start Timer'}
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerRemainingSeconds(focusDuration * 60);
                  }}
                  className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold transition-colors"
                  title="Reset to 90 min"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Visual Ultradian Sinusoidal Waveform (The Kleitman Curve) */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-headline-md text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">show_chart</span>
                The Kleitman Sinusoidal Waveform
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Visual representation of ascending sympathetic alertness peaks and parasympathetic refractory troughs.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-data-mono">
              <span className="flex items-center gap-1 text-primary">
                <span className="w-3 h-1.5 bg-primary rounded-xs"></span> Peak Focus Wave (90m)
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-3 h-1.5 bg-emerald-500 rounded-xs"></span> Refractory Recovery (20m)
              </span>
            </div>
          </div>

          {/* SVG Wave Visualization */}
          <div className="w-full bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 overflow-x-auto">
            <svg viewBox="0 0 1000 220" className="w-full min-w-[700px] h-48 select-none">
              {/* Baseline center line */}
              <line x1="40" y1="120" x2="960" y2="120" stroke="currentColor" strokeDasharray="4 4" className="text-outline-variant" />
              <text x="45" y="115" className="text-[10px] fill-outline font-data-mono">Alertness Equilibrium</text>
              <text x="45" y="45" className="text-[10px] fill-primary font-bold font-data-mono">Sympathetic Peak (Beta/Gamma)</text>
              <text x="45" y="195" className="text-[10px] fill-emerald-600 font-bold font-data-mono">Parasympathetic Vagal Trough</text>

              {/* Dynamic Oscillating Curve */}
              {schedule.map((block, i) => {
                if (block.type === 'focus') {
                  const x1 = 120 + i * 90;
                  const xMid = x1 + 45;
                  const x2 = x1 + 90;
                  return (
                    <g key={`wave-${block.index}`}>
                      {/* Sinusoidal peak */}
                      <path
                        d={`M ${x1} 120 Q ${xMid} 30 ${x2} 120`}
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      {/* Peak Marker Tag */}
                      <circle cx={xMid} cy={30} r={5} fill="#0284c7" />
                      <text x={xMid} y={20} textAnchor="middle" className="text-[11px] font-bold fill-on-surface font-data-mono">
                        Cycle {block.index} ({block.startTimeFormatted.split(' ')[0]})
                      </text>
                    </g>
                  );
                } else {
                  const x1 = 120 + (i - 1) * 90 + 90;
                  const xMid = x1 + 25;
                  const x2 = x1 + 50;
                  return (
                    <g key={`rest-wave-${i}`}>
                      {/* Trough */}
                      <path
                        d={`M ${x1} 120 Q ${xMid} 185 ${x2} 120`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray="3 3"
                        strokeLinecap="round"
                      />
                      <circle cx={xMid} cy={185} r={4} fill="#10b981" />
                      <text x={xMid} y={205} textAnchor="middle" className="text-[10px] font-medium fill-emerald-600 font-data-mono">
                        Rest ({block.durationMinutes}m)
                      </text>
                    </g>
                  );
                }
              })}
            </svg>
          </div>
        </section>

        {/* 7. Complete Daily Schedule Timeline & Actionable Matrix */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-headline-md text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
                Step 3: Your Personalized Daily Timeline
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Assign custom objectives to each block, launch timers directly, and execute with surgical focus.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySchedule}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                Copy Text
              </button>
              <button
                onClick={handleExportIcs}
                className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                Add to Calendar (.ics)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {schedule.map((block) => {
              const isFocus = block.type === 'focus';
              const isMeal = block.type === 'meal';
              const isCurrent = activeBlock?.startMinutes === block.startMinutes;

              return (
                <div
                  key={`${block.type}-${block.index}-${block.startMinutes}`}
                  className={`p-space-md rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'bg-primary/5 border-primary shadow-xs ring-2 ring-primary/20'
                      : isFocus
                      ? 'bg-surface-container-low/70 border-outline-variant/30 hover:border-outline-variant'
                      : isMeal
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : 'bg-emerald-500/5 border-emerald-500/30'
                  }`}
                >
                  {/* Left Column: Time & Badge */}
                  <div className="flex items-center gap-3 shrink-0 min-w-[200px]">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isFocus
                        ? 'bg-primary text-on-primary'
                        : isMeal
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {isFocus ? 'bolt' : isMeal ? 'restaurant' : 'self_improvement'}
                      </span>
                    </div>

                    <div>
                      <div className="font-data-mono text-xs font-bold text-on-surface">
                        {block.startTimeFormatted} – {block.endTimeFormatted}
                      </div>
                      <span className={`text-[10px] font-data-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isFocus
                          ? 'bg-primary/10 text-primary'
                          : isMeal
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-emerald-600/10 text-emerald-600'
                      }`}>
                        {block.durationMinutes} min {isFocus ? 'Focus' : isMeal ? 'Meal' : 'Recovery'}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Description & Interactive Task Input */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-on-surface truncate">
                        {block.name}
                      </h3>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-data-mono font-bold uppercase">
                          Active Now
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                      {block.suggestedTasks}
                    </p>

                    {isFocus && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Assign your specific task for this cycle (e.g. Write chapter 3 draft)..."
                          value={customTasks[block.index] || ''}
                          onChange={(e) =>
                            setCustomTasks((prev) => ({
                              ...prev,
                              [block.index]: e.target.value,
                            }))
                          }
                          className="w-full bg-surface-container-highest/80 px-3 py-1.5 rounded-lg text-xs text-on-surface border border-outline-variant/30 focus:outline-hidden focus:border-primary placeholder:text-outline"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startTimerForBlock(block)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">timer</span>
                      Launch Timer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. Comparison Matrix: Pomodoro vs 52/17 vs 90-Minute Ultradian */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <h2 className="font-headline-md text-xl font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">compare_arrows</span>
            Protocol Comparison: When to Use Which Cadence
          </h2>
          <p className="text-body-sm text-on-surface-variant mb-6">
            Different cognitive workloads require tailored cadence structures. Use this reference to match your work style.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface">
                  <th className="p-3 font-bold">Cadence Method</th>
                  <th className="p-3 font-bold">Work / Rest Ratio</th>
                  <th className="p-3 font-bold">Optimal Task Profile</th>
                  <th className="p-3 font-bold">Neurological Rationale</th>
                  <th className="p-3 font-bold">Recommended Tool</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface-variant">
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="p-3 font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-red-500 text-[18px]">timer</span>
                    Classic Pomodoro
                  </td>
                  <td className="p-3 font-data-mono font-semibold">25 min / 5 min</td>
                  <td className="p-3">Email triage, invoices, repetitive grading, high-friction initiation.</td>
                  <td className="p-3">Low barrier to entry; destroys task initiation resistance via artificial scarcity.</td>
                  <td className="p-3">
                    <Link href="/focus-and-break-timer" className="text-primary hover:underline font-semibold">
                      Pomodoro Timer &rarr;
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="p-3 font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-500 text-[18px]">desk</span>
                    52 / 17 Desk Method
                  </td>
                  <td className="p-3 font-data-mono font-semibold">52 min / 17 min</td>
                  <td className="p-3">Business management, code reviews, collaborative sprints, reports.</td>
                  <td className="p-3">Discovered by Draugiem Group tracking top 10% productive knowledge workers.</td>
                  <td className="p-3">
                    <Link href="/focus-and-break-timer" className="text-primary hover:underline font-semibold">
                      52/17 Desk Timer &rarr;
                    </Link>
                  </td>
                </tr>
                <tr className="bg-primary/5 hover:bg-primary/10 transition-colors">
                  <td className="p-3 font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                    90-Min Ultradian Cycle
                  </td>
                  <td className="p-3 font-data-mono font-semibold text-primary">90 min / 20 min</td>
                  <td className="p-3 font-medium text-on-surface">Deep software architecture, mathematics, book drafting, strategic executive synthesis.</td>
                  <td className="p-3">Synchronizes directly with Nathaniel Kleitman&apos;s biological BRAC oscillation and prefrontal neurotransmitter limits.</td>
                  <td className="p-3 font-bold text-primary">
                    Active Module
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 9. Scientific Deep Dive & Academic Literature */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <h2 className="font-headline-md text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">menu_book</span>
            The Science Behind the 90-Minute Basic Rest-Activity Cycle
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg text-body-sm text-on-surface-variant leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-on-surface">1. Discovery of the BRAC (Kleitman, 1963)</h3>
              <p>
                Dr. Nathaniel Kleitman, universally acknowledged as the father of modern sleep research, discovered that the human brain cycles through alternating REM and non-REM stages roughly every 90 minutes. Crucially, Kleitman demonstrated that this 90-minute oscillation does not terminate upon waking: it continues unabated throughout the day as the <strong>Basic Rest-Activity Cycle (BRAC)</strong>.
              </p>
              <p>
                During the ascending 90-minute phase, your brain exhibits synchronized high-frequency beta and gamma waves, elevated cerebral oxygenation, and sharp working memory. At the conclusion of this window, the sympathetic nervous system downregulates, initiating a 15–20 minute refractory restorative phase.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-base text-on-surface">2. Deliberate Practice &amp; The 4-Hour Ceiling</h3>
              <p>
                In his seminal 1993 study on expertise, psychologist Dr. K. Anders Ericsson studied elite violinists at the Berlin Conservatory of Music. The data revealed that top-tier violinists did not practice continuously. Instead, they structured their day around <strong>90-minute uninterrupted practice blocks</strong>, separated by 20–30 minute restorative naps or walks, rarely exceeding 3.5 to 4.5 hours of total daily deliberate practice.
              </p>
              <p>
                Pushing beyond 4 deliberate 90-minute blocks triggers diminishing cognitive returns and prefrontal receptor saturation, precipitating systemic mental fatigue and elevated burnout risks.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/30">
            <h4 className="font-label-caps text-xs font-bold uppercase text-on-surface-variant mb-2">Key References &amp; Clinical Literature</h4>
            <ul className="text-xs text-outline space-y-1">
              <li>• Kleitman, N. (1963). <em>Sleep and Wakefulness</em>. University of Chicago Press.</li>
              <li>• Rossi, E. L. (1991). <em>The 20-Minute Break: Using the New Science of Ultradian Rhythms</em>. Tarcher/Putnam.</li>
              <li>• Ericsson, K. A., Krampe, R. T., &amp; Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. <em>Psychological Review</em>, 100(3), 363–406.</li>
              <li>• Lavie, P. (1985). Ultradian rhythms in alertness and sleepiness. <em>Sleep: Journal of Sleep Research &amp; Sleep Medicine</em>.</li>
            </ul>
          </div>
        </section>

        {/* 10. Frequently Asked Questions (FAQ Accordion) */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <h2 className="font-headline-md text-xl font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">help_outline</span>
            Frequently Asked Questions
          </h2>
          <p className="text-body-sm text-on-surface-variant mb-6">
            Answers to common questions about ultradian biology, timer execution, and cognitive performance.
          </p>

          <div className="divide-y divide-outline-variant/20">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm sm:text-base text-on-surface hover:text-primary transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-[20px] text-outline shrink-0">
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-3 text-body-sm text-on-surface-variant leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 11. Cross-Tool Directory Recommendations */}
        <section className="bg-surface-container-low p-space-lg rounded-2xl border border-outline-variant/30">
          <h3 className="font-headline-md text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
            Explore Related Time &amp; Productivity Tools
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
            <Link
              href="/focus-and-break-timer"
              className="p-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded-xl border border-outline-variant/20 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-primary text-[22px] mb-1">timer</span>
                <div className="font-bold text-sm text-on-surface">Focus &amp; Break Timers</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Classic Pomodoro (25/5) &amp; 52/17 desk rhythms.</div>
              </div>
              <span className="text-xs font-semibold text-primary mt-2">Open Tool &rarr;</span>
            </Link>

            <Link
              href="/time-date/work-hours"
              className="p-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded-xl border border-outline-variant/20 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-secondary text-[22px] mb-1">badge</span>
                <div className="font-bold text-sm text-on-surface">Work Hours &amp; Timesheets</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Track daily shift hours and lunch deductions.</div>
              </div>
              <span className="text-xs font-semibold text-primary mt-2">Open Tool &rarr;</span>
            </Link>

            <Link
              href="/time-date/event-countdown"
              className="p-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded-xl border border-outline-variant/20 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-tertiary text-[22px] mb-1">hourglass_top</span>
                <div className="font-bold text-sm text-on-surface">Event Countdown</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Real-time chronometer for milestones &amp; launches.</div>
              </div>
              <span className="text-xs font-semibold text-primary mt-2">Open Tool &rarr;</span>
            </Link>

            <Link
              href="/time-date"
              className="p-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded-xl border border-outline-variant/20 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-primary text-[22px] mb-1">apps</span>
                <div className="font-bold text-sm text-on-surface">Time &amp; Date Suite</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Explore all 27+ chronometry &amp; calendar tools.</div>
              </div>
              <span className="text-xs font-semibold text-primary mt-2">Browse All &rarr;</span>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
