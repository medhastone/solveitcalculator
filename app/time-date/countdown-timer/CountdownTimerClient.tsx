'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface EventPreset {
  name: string;
  emoji: string;
  getTargetDate: () => Date;
}

const PRESETS: EventPreset[] = [
  {
    name: "New Year's Day",
    emoji: '🎆',
    getTargetDate: () => {
      const now = new Date();
      return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
    },
  },
  {
    name: 'Christmas Day',
    emoji: '🎄',
    getTargetDate: () => {
      const now = new Date();
      let year = now.getFullYear();
      let target = new Date(year, 11, 25, 0, 0, 0);
      if (now.getTime() > target.getTime()) {
        target = new Date(year + 1, 11, 25, 0, 0, 0);
      }
      return target;
    },
  },
  {
    name: 'Halloween',
    emoji: '🎃',
    getTargetDate: () => {
      const now = new Date();
      let year = now.getFullYear();
      let target = new Date(year, 9, 31, 0, 0, 0);
      if (now.getTime() > target.getTime()) {
        target = new Date(year + 1, 9, 31, 0, 0, 0);
      }
      return target;
    },
  },
  {
    name: 'Independence Day',
    emoji: '🎇',
    getTargetDate: () => {
      const now = new Date();
      let year = now.getFullYear();
      let target = new Date(year, 6, 4, 0, 0, 0);
      if (now.getTime() > target.getTime()) {
        target = new Date(year + 1, 6, 4, 0, 0, 0);
      }
      return target;
    },
  },
  {
    name: 'Summer Solstice',
    emoji: '☀️',
    getTargetDate: () => {
      const now = new Date();
      let year = now.getFullYear();
      let target = new Date(year, 5, 21, 0, 0, 0);
      if (now.getTime() > target.getTime()) {
        target = new Date(year + 1, 5, 21, 0, 0, 0);
      }
      return target;
    },
  },
];

export default function CountdownTimerClient() {
  const [mounted, setMounted] = useState(false);
  const [utcTime, setUtcTime] = useState<Date | null>(null);

  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };

  const [eventName, setEventName] = useState("New Year's Day");
  const [targetDateStr, setTargetDateStr] = useState('2026-01-01');
  const [targetTimeStr, setTargetTimeStr] = useState('00:00');
  const [nowTime, setNowTime] = useState<number>(0);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const nextNY = new Date(new Date().getFullYear() + 1, 0, 1);
      const y = nextNY.getFullYear();
      const m = String(nextNY.getMonth() + 1).padStart(2, '0');
      const d = String(nextNY.getDate()).padStart(2, '0');
      setTargetDateStr(`${y}-${m}-${d}`);
      setNowTime(Date.now());
    }, 0);

    const interval = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const countdown = useMemo(() => {
    if (!targetDateStr || !nowTime) return null;

    const [y, m, d] = targetDateStr.split('-').map(Number);
    const [h, min] = (targetTimeStr || '00:00').split(':').map(Number);

    const targetDate = new Date(y, m - 1, d, h || 0, min || 0, 0);
    const diffMs = targetDate.getTime() - nowTime;

    const isPast = diffMs < 0;
    const absMs = Math.abs(diffMs);

    const totalSeconds = Math.floor(absMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const days = totalDays;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    // Calculate Working Business Days (Monday-Friday) remaining
    let workingDays = 0;
    if (!isPast) {
      let curr = new Date(nowTime);
      curr.setHours(0, 0, 0, 0);
      const end = new Date(targetDate.getTime());
      end.setHours(0, 0, 0, 0);

      while (curr < end) {
        curr.setDate(curr.getDate() + 1);
        const dayOfWeek = curr.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          workingDays++;
        }
      }
    }

    return {
      isPast,
      days,
      hours,
      minutes,
      seconds,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      workingDays,
      targetDateFormatted: targetDate.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }, [targetDateStr, targetTimeStr, nowTime]);

  const applyPreset = (preset: EventPreset) => {
    const target = preset.getTargetDate();
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    const hh = String(target.getHours()).padStart(2, '0');
    const mm = String(target.getMinutes()).padStart(2, '0');

    setEventName(preset.name);
    setTargetDateStr(`${y}-${m}-${d}`);
    setTargetTimeStr(`${hh}:${mm}`);
    showToast(`Loaded ${preset.name} countdown`);
  };

  const handleCopy = () => {
    if (!countdown) return;
    const text = `⏳ Countdown to ${eventName}:
Target: ${countdown.targetDateFormatted}
Status: ${countdown.isPast ? 'Event has passed' : `${countdown.days} Days, ${countdown.hours} Hours, ${countdown.minutes} Mins, ${countdown.seconds} Secs remaining`}
Remaining Workdays: ${countdown.workingDays} days
Total Seconds: ${countdown.totalSeconds.toLocaleString()}s`;

    navigator.clipboard.writeText(text);
    showToast('Countdown summary copied!');
  };

  const faqs = [
    {
      q: 'How accurate is this real-time countdown timer?',
      a: 'The countdown uses native browser hardware timers re-synchronized every 1,000 milliseconds against UTC epoch timestamps. It eliminates accumulative browser throttling and remains synchronized even when your device switches tabs.',
    },
    {
      q: 'How does the business working days calculation work?',
      a: 'In addition to total calendar days, the engine calculates remaining working days by simulating a calendar traversal from the current instant to the target event, deducting every Saturday and Sunday.',
    },
    {
      q: 'Can I set a countdown for an event that is decades away (like retirement)?',
      a: 'Yes! The chronometer supports dates decades into the future. It accurately accounts for all Gregorian leap years, quarter changes, and daylight saving time adjustments across multi-year spans.',
    },
    {
      q: 'What happens when the countdown timer reaches zero?',
      a: 'Once the target timestamp is reached, the status updates seamlessly to show that the event has arrived and begins tracking elapsed time since the milestone occurred.',
    },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center font-body-md text-on-surface">
        <div className="animate-pulse font-label-caps text-label-caps text-outline">
          Synchronizing Atomic Countdown Chronometer...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md selection:bg-primary/20">
      <Header />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-lg font-body-sm flex items-center gap-2 border border-outline-variant/30 animate-fade-in">
          <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant/30 pt-space-xl pb-space-lg">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/time-date"
              className="font-label-caps text-label-caps text-outline hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Time & Date Suite
            </Link>
            <span className="text-outline-variant text-[12px]">•</span>
            <span className="font-label-caps text-label-caps text-primary font-semibold">Event Chronometer</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-surface font-bold">
                Event Countdown Timer & Days Until Calculator
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mt-1">
                Real-time chronometer counting down to holidays, birthdays, weddings, project milestones, and retirement in days, hours, minutes, and seconds.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container font-label-caps text-[12px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant/30 flex items-center gap-1.5"
                >
                  <span>{preset.emoji}</span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Work Area */}
      <main className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-xl flex-grow">
        {/* Main Countdown Display Hero Card */}
        {countdown && (
          <div className="bg-surface-container-lowest p-space-lg sm:p-space-2xl rounded-3xl border border-outline-variant/30 shadow-md space-y-space-xl text-center relative overflow-hidden">
            {/* Top Event Label */}
            <div className="max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-label-caps text-[12px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                {countdown.isPast ? 'Elapsed Since Event' : 'Live Event Countdown'}
              </div>
              <h2 className="font-headline-xl text-[36px] sm:text-[48px] font-bold text-on-surface tracking-tight leading-tight">
                {eventName}
              </h2>
              <p className="font-body-md text-on-surface-variant font-medium">
                Target: {countdown.targetDateFormatted}
              </p>
            </div>

            {/* Big 4-Tile Countdown Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md max-w-4xl mx-auto">
              <div className="bg-surface-container-low p-space-lg rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
                <div className="font-numerical-display text-[52px] sm:text-[72px] font-bold text-primary leading-none">
                  {countdown.days}
                </div>
                <span className="font-label-caps text-[12px] sm:text-[14px] text-outline uppercase font-bold tracking-wider mt-2">
                  Days
                </span>
              </div>

              <div className="bg-surface-container-low p-space-lg rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
                <div className="font-numerical-display text-[52px] sm:text-[72px] font-bold text-on-surface leading-none">
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <span className="font-label-caps text-[12px] sm:text-[14px] text-outline uppercase font-bold tracking-wider mt-2">
                  Hours
                </span>
              </div>

              <div className="bg-surface-container-low p-space-lg rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
                <div className="font-numerical-display text-[52px] sm:text-[72px] font-bold text-secondary leading-none">
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <span className="font-label-caps text-[12px] sm:text-[14px] text-outline uppercase font-bold tracking-wider mt-2">
                  Minutes
                </span>
              </div>

              <div className="bg-surface-container-low p-space-lg rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
                <div className="font-numerical-display text-[52px] sm:text-[72px] font-bold text-tertiary leading-none">
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <span className="font-label-caps text-[12px] sm:text-[14px] text-outline uppercase font-bold tracking-wider mt-2">
                  Seconds
                </span>
              </div>
            </div>

            {/* Granular Context Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm max-w-3xl mx-auto pt-space-md border-t border-outline-variant/20 text-[13px]">
              <div className="bg-surface-container p-2.5 rounded-xl">
                <span className="text-outline text-[11px] block font-semibold">Remaining Workdays</span>
                <span className="font-data-mono font-bold text-primary text-[15px]">{countdown.workingDays} Business Days</span>
              </div>
              <div className="bg-surface-container p-2.5 rounded-xl">
                <span className="text-outline text-[11px] block font-semibold">Total Hours</span>
                <span className="font-data-mono font-bold text-on-surface text-[15px]">{countdown.totalHours.toLocaleString()}h</span>
              </div>
              <div className="bg-surface-container p-2.5 rounded-xl">
                <span className="text-outline text-[11px] block font-semibold">Total Minutes</span>
                <span className="font-data-mono font-bold text-secondary text-[15px]">{countdown.totalMinutes.toLocaleString()}m</span>
              </div>
              <div className="bg-surface-container p-2.5 rounded-xl">
                <span className="text-outline text-[11px] block font-semibold">Total Seconds</span>
                <span className="font-data-mono font-bold text-tertiary text-[15px]">{countdown.totalSeconds.toLocaleString()}s</span>
              </div>
            </div>

            {/* Share / Copy Button */}
            <div className="flex justify-center">
              <button
                onClick={handleCopy}
                className="px-6 py-3 rounded-2xl bg-primary text-on-primary font-label-caps text-[13px] font-bold flex items-center gap-2 shadow-sm hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                Copy Shareable Countdown
              </button>
            </div>
          </div>
        )}

        {/* Custom Event Creator Controls */}
        <div className="bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-2xl border border-outline-variant/30 shadow-sm space-y-space-md max-w-4xl mx-auto">
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-space-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">edit_calendar</span>
            Customize Countdown Event
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div>
              <label className="font-label-caps text-[11px] text-on-surface uppercase block mb-1 font-semibold">
                Event Title
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low text-on-surface font-body-md text-[14px] rounded-xl border border-outline-variant/40"
                placeholder="e.g. Wedding, Vacation, Retirement"
              />
            </div>

            <div>
              <label className="font-label-caps text-[11px] text-on-surface uppercase block mb-1 font-semibold">
                Target Date
              </label>
              <input
                type="date"
                value={targetDateStr}
                onChange={(e) => setTargetDateStr(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low text-on-surface font-data-mono text-[14px] rounded-xl border border-outline-variant/40"
              />
            </div>

            <div>
              <label className="font-label-caps text-[11px] text-on-surface uppercase block mb-1 font-semibold">
                Target Time
              </label>
              <input
                type="time"
                value={targetTimeStr}
                onChange={(e) => setTargetTimeStr(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low text-on-surface font-data-mono text-[14px] rounded-xl border border-outline-variant/40"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Deep Google E-E-A-T Editorial Guides */}
      <section className="bg-surface-container-low border-t border-outline-variant/30 py-space-2xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-xl">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              Comprehensive Guide to Temporal Anticipation, Milestone Tracking, & Chronometry
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Counting down to future milestones activates psychological goal anticipation, increases productivity focus, and facilitates distributed event coordination across personal and organizational schedules.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mt-space-lg">
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30">
                <h3 className="font-headline-sm font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  Goal Gradient Effect & Motivation
                </h3>
                <p className="font-body-sm text-on-surface-variant mt-2">
                  First demonstrated by behavioral psychologist Clark Hull, the Goal Gradient hypothesis shows that effort and anticipation accelerate as individuals perceive proximity to a defined goal or target deadline. Visual countdown clocks serve as high-salience temporal anchors.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30">
                <h3 className="font-headline-sm font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">av_timer</span>
                  Chronometer Synchronization Standards
                </h3>
                <p className="font-body-sm text-on-surface-variant mt-2">
                  Browser-based countdown timers utilize high-resolution monotonic timestamps (e.g. <code>performance.now()</code> and UTC timestamps) to prevent inaccuracies caused by local clock skew, operating system sleep cycles, or tab hibernation.
                </p>
              </div>
            </div>

            {/* Interactive FAQ Accordion */}
            <div className="mt-space-xl">
              <h3 className="font-headline-md font-bold text-on-surface mb-space-md">
                Frequently Asked Questions (FAQ)
              </h3>
              <div className="space-y-space-sm">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left p-space-md flex justify-between items-center font-headline-sm text-[16px] font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-outline transition-transform duration-200">
                        {openFaq === idx ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="p-space-md pt-0 text-on-surface-variant font-body-md border-t border-outline-variant/15 text-[14px] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
