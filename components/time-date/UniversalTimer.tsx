'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TimeToolDefinition } from '@/lib/time-date/types';
import { chimeSynthesizer } from '@/lib/time-date/audio';
import { Play, Pause, RotateCcw, Flag, Volume2, VolumeX, Maximize2, Minimize2, Sparkles } from 'lucide-react';

interface Props {
  tool: TimeToolDefinition;
}

export default function UniversalTimer({ tool }: Props) {
  const isStopwatch = tool.calculatorType === 'stopwatch';
  const defaultSeconds = tool.presetSeconds || 300; // 5 min default

  // Timer states
  const [totalSeconds, setTotalSeconds] = useState(defaultSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Stopwatch states
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [laps, setLaps] = useState<{ lap: number; split: number; total: number }[]>([]);

  // Custom inputs
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(Math.floor(defaultSeconds / 60));
  const [customSecs, setCustomSecs] = useState(defaultSeconds % 60);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopwatchRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer countdown effect
  useEffect(() => {
    if (isStopwatch) return;

    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (soundEnabled) {
              chimeSynthesizer.playAlarm();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isStopwatch, soundEnabled]);

  // Stopwatch effect
  useEffect(() => {
    if (!isStopwatch) return;

    if (isRunning) {
      startTimeRef.current = performance.now();
      const updateStopwatch = () => {
        const now = performance.now();
        setStopwatchMs(accumulatedRef.current + (now - startTimeRef.current));
        stopwatchRef.current = requestAnimationFrame(updateStopwatch);
      };
      stopwatchRef.current = requestAnimationFrame(updateStopwatch);
    } else {
      if (stopwatchRef.current) {
        cancelAnimationFrame(stopwatchRef.current);
      }
      accumulatedRef.current = stopwatchMs;
    }

    return () => {
      if (stopwatchRef.current) cancelAnimationFrame(stopwatchRef.current);
    };
  }, [isRunning, isStopwatch, stopwatchMs]);

  const handleStartPause = () => {
    if (!isRunning && remainingSeconds === 0 && !isStopwatch) {
      setRemainingSeconds(totalSeconds);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (isStopwatch) {
      setStopwatchMs(0);
      accumulatedRef.current = 0;
      setLaps([]);
    } else {
      setRemainingSeconds(totalSeconds);
    }
  };

  const handleLap = () => {
    if (!isStopwatch) return;
    const currentTotal = stopwatchMs;
    const lastLapTotal = laps.length > 0 ? laps[laps.length - 1].total : 0;
    const split = currentTotal - lastLapTotal;
    setLaps([...laps, { lap: laps.length + 1, split, total: currentTotal }]);
  };

  const applyCustomDuration = () => {
    const sec = customHours * 3600 + customMinutes * 60 + customSecs;
    if (sec > 0) {
      setIsRunning(false);
      setTotalSeconds(sec);
      setRemainingSeconds(sec);
    }
  };

  const formatStopwatchTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
  };

  const formatTimerTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

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

  return (
    <div
      ref={containerRef}
      className={`bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden mb-10 transition-all ${
        isFullscreen ? 'p-8 sm:p-16 flex flex-col justify-center min-h-screen' : 'p-6 sm:p-8'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">
            {tool.name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {!isStopwatch && (
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
              title={soundEnabled ? 'Mute Alarm' : 'Unmute Alarm'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          )}
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

      {/* Main Display */}
      <div className="text-center my-6">
        <div className="text-6xl sm:text-8xl lg:text-9xl font-bold font-mono text-white tabular-nums tracking-tight">
          {isStopwatch ? formatStopwatchTime(stopwatchMs) : formatTimerTime(remainingSeconds)}
        </div>

        {/* Progress Bar for Timer */}
        {!isStopwatch && (
          <div className="w-full max-w-xl mx-auto bg-slate-800 h-2.5 rounded-full overflow-hidden mt-6">
            <div
              className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
              style={{
                width: `${totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4 my-6">
        <button
          type="button"
          onClick={handleStartPause}
          className={`flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        {isStopwatch && isRunning && (
          <button
            type="button"
            onClick={handleLap}
            className="flex items-center gap-2 px-5 sm:px-6 py-3.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-sm text-slate-200 transition-all"
          >
            <Flag className="w-4 h-4 text-indigo-400" />
            <span>Lap</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-5 sm:px-6 py-3.5 bg-slate-900 hover:bg-slate-800 rounded-xl font-semibold text-sm text-slate-300 transition-all border border-slate-800"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Lap Table for Stopwatch */}
      {isStopwatch && laps.length > 0 && (
        <div className="max-w-md mx-auto mt-6 bg-slate-900 rounded-xl p-4 border border-slate-800 max-h-48 overflow-y-auto">
          <table className="w-full text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 pb-2">
                <th className="text-left py-1">Lap #</th>
                <th className="text-right py-1">Split Time</th>
                <th className="text-right py-1">Total Time</th>
              </tr>
            </thead>
            <tbody>
              {laps.slice().reverse().map((lap) => (
                <tr key={lap.lap} className="border-b border-slate-800/40 py-1 font-mono">
                  <td className="py-1.5 text-slate-400">Lap {lap.lap}</td>
                  <td className="text-right py-1.5 text-indigo-400">{formatStopwatchTime(lap.split)}</td>
                  <td className="text-right py-1.5 text-slate-200">{formatStopwatchTime(lap.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Duration Setter for Custom Timer */}
      {!isStopwatch && !isFullscreen && tool.calculatorType === 'custom-timer' && (
        <div className="mt-8 pt-6 border-t border-slate-800 max-w-lg mx-auto">
          <label className="block text-xs font-semibold text-slate-400 mb-3 text-center">
            Set Custom Timer Duration
          </label>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1 text-center">Hours</label>
              <input
                type="number"
                min="0"
                max="99"
                value={customHours}
                onChange={(e) => setCustomHours(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-center font-mono text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 text-center">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-center font-mono text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 text-center">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={customSecs}
                onChange={(e) => setCustomSecs(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-center font-mono text-slate-200"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={applyCustomDuration}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-indigo-400 rounded-lg border border-slate-800 transition-colors"
          >
            Apply Custom Duration
          </button>
        </div>
      )}
    </div>
  );
}
