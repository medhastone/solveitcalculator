'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TimeToolDefinition } from '@/lib/time-date/types';
import { chimeSynthesizer } from '@/lib/time-date/audio';
import { generateIcsFile } from '@/lib/time-date/ics';
import { Calendar, Volume2, VolumeX, Maximize2, Minimize2, Download, Sparkles } from 'lucide-react';

interface Props {
  tool: TimeToolDefinition;
}

export default function UniversalCountdown({ tool }: Props) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [eventName, setEventName] = useState(tool.countdownDefaultName || tool.name);

  // Compute default target date based on tool metadata
  const initialTargetDate = useMemo(() => {
    const now = new Date();

    if (tool.countdownTargetTime) {
      // Intra-day target (e.g. "15:00:00")
      const [h, m, s] = tool.countdownTargetTime.split(':').map((p) => parseInt(p, 10) || 0);
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s || 0);
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1); // target next day
      }
      return target;
    }

    if (tool.countdownTargetMonth !== undefined && tool.countdownTargetDay !== undefined) {
      // Annual holiday target
      let target = new Date(now.getFullYear(), tool.countdownTargetMonth, tool.countdownTargetDay, 0, 0, 0);
      if (target.getTime() <= now.getTime()) {
        target = new Date(now.getFullYear() + 1, tool.countdownTargetMonth, tool.countdownTargetDay, 0, 0, 0);
      }
      return target;
    }

    // Default target: 30 days ahead at noon
    const def = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    def.setHours(12, 0, 0, 0);
    return def;
  }, [tool.countdownTargetTime, tool.countdownTargetMonth, tool.countdownTargetDay]);

  const [targetDateStr, setTargetDateStr] = useState(() => {
    const d = initialTargetDate;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    totalMs: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, totalMs: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const chimePlayedRef = useRef(false);

  useEffect(() => {
    const targetMs = new Date(targetDateStr).getTime();

    const interval = setInterval(() => {
      const nowMs = Date.now();
      const diff = targetMs - nowMs;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, totalMs: 0 });
        if (!chimePlayedRef.current) {
          setHasFinished(true);
          if (soundEnabled) {
            chimeSynthesizer.playChime();
          }
          chimePlayedRef.current = true;
        }
      } else {
        chimePlayedRef.current = false;
        setHasFinished(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((diff % 1000) / 10);

        setTimeLeft({ days, hours, minutes, seconds, milliseconds, totalMs: diff });
      }
    }, 45);

    return () => clearInterval(interval);
  }, [targetDateStr, soundEnabled]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleExportIcs = () => {
    generateIcsFile({
      title: eventName,
      description: `Countdown reminder for ${eventName} created on SolveItCalculator.com`,
      startDate: new Date(targetDateStr),
    });
  };

  return (
    <div
      ref={containerRef}
      className={`bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden mb-10 transition-all ${
        isFullscreen ? 'p-8 sm:p-16 flex flex-col justify-center min-h-screen' : 'p-6 sm:p-8'
      }`}
    >
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">
            {eventName}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
            title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={handleExportIcs}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Add to Calendar (.ics)</span>
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Big Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center my-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="text-4xl sm:text-6xl lg:text-7xl font-bold font-mono text-white tabular-nums tracking-tight">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 mt-2">
            Days
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="text-4xl sm:text-6xl lg:text-7xl font-bold font-mono text-white tabular-nums tracking-tight">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 mt-2">
            Hours
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="text-4xl sm:text-6xl lg:text-7xl font-bold font-mono text-white tabular-nums tracking-tight">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 mt-2">
            Minutes
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="text-4xl sm:text-6xl lg:text-7xl font-bold font-mono text-indigo-400 tabular-nums tracking-tight">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 mt-2">
            Seconds
          </div>
        </div>
      </div>

      {hasFinished && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center text-emerald-400 font-semibold my-4 animate-pulse">
          Event reached! The countdown has arrived.
        </div>
      )}

      {/* Target Date Customizer */}
      {!isFullscreen && (
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Target Date & Time
            </label>
            <input
              type="datetime-local"
              value={targetDateStr}
              onChange={(e) => setTargetDateStr(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
