'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ambientSoundEngine,
  SOUNDSCAPE_TRACKS,
  type SoundscapeId,
} from './ambientSoundEngine';

interface PresetItem {
  name: string;
  focus: number;
  short: number;
  long: number;
  icon: string;
  label: string;
}

const PRESETS: PresetItem[] = [
  { name: 'Classic Pomodoro', focus: 25, short: 5, long: 15, icon: 'pace', label: 'Classic Pomodoro (25/5)' },
  { name: '52/17 Desk Method', focus: 52, short: 17, long: 30, icon: 'query_stats', label: '52/17 Desk Method' },
  { name: '90-Min Deep Focus', focus: 90, short: 20, long: 35, icon: 'waves', label: '90-Min Deep Focus' },
  { name: '45/15 Study Cycle', focus: 45, short: 15, long: 25, icon: 'menu_book', label: '45/15 Study Cycle' },
  { name: '60/10 Sprint', focus: 60, short: 10, long: 20, icon: 'bolt', label: '60/10 Focus Sprint' },
  { name: 'Exam Revision', focus: 50, short: 10, long: 30, icon: 'school', label: 'Exam Revision (50/10)' },
  { name: 'Focused Work Block', focus: 90, short: 20, long: 30, icon: 'schedule', label: 'Focused Work Block (90/20)' },
  { name: 'Custom Timer', focus: 25, short: 5, long: 15, icon: 'tune', label: 'Custom Timer' },
];

export default function FocusAndBreakTimerClient() {
  // Timer State
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [focusDuration, setFocusDuration] = useState<number>(25 * 60);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(5 * 60);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15 * 60);
  const [longBreakInterval, setLongBreakInterval] = useState<number>(4);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [activePreset, setActivePreset] = useState<string>('Classic Pomodoro');

  // Interactive Task Bar
  const [taskInput, setTaskInput] = useState<string>('Drafting High-Impact Strategy Document');
  const [taskCategory, setTaskCategory] = useState<string>('Writing');

  // Diagnostics & Metrics
  const [completedFocusCount, setCompletedFocusCount] = useState<number>(9);
  const [totalFocusSecondsToday, setTotalFocusSecondsToday] = useState<number>(3 * 3600 + 45 * 60);
  const [distractionsCount, setDistractionsCount] = useState<number>(2);
  const [streakDays] = useState<number>(14);

  // Settings & Toggles
  const [autoStartBreaks, setAutoStartBreaks] = useState<boolean>(false);
  const [autoStartFocus, setAutoStartFocus] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Custom Settings Inputs
  const [customFocusMins, setCustomFocusMins] = useState<number>(25);
  const [customShortBreakMins, setCustomShortBreakMins] = useState<number>(5);
  const [customLongBreakMins, setCustomLongBreakMins] = useState<number>(15);
  const [customCycleCount, setCustomCycleCount] = useState<number>(4);

  // UI Micro-states
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [distractionButtonBumping, setDistractionButtonBumping] = useState<boolean>(false);

  // 3 Calm Focus Music Soundscapes State (Work, Study, Rest)
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeId>('none');
  const [soundVolume, setSoundVolume] = useState<number>(60); // 0 to 100
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoPlayMusicWithTimer, setAutoPlayMusicWithTimer] = useState<boolean>(false);
  const [autoSwitchTrackForBreak, setAutoSwitchTrackForBreak] = useState<boolean>(true);

  // History log for CSV export
  const [sessionHistory, setSessionHistory] = useState<Array<{
    task: string;
    category: string;
    durationMins: number;
    timestamp: string;
  }>>([
    { task: 'Quarterly Strategic Roadmap', category: 'Writing', durationMins: 25, timestamp: '10:15 AM' },
    { task: 'Algorithmic Optimization & Profiling', category: 'Coding', durationMins: 50, timestamp: '11:20 AM' },
    { task: 'Competitive Product Architecture Teardown', category: 'Research', durationMins: 45, timestamp: '01:40 PM' },
  ]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play soft synthesized Web Audio chime without external MP3 dependencies
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.5); // D6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.15);
      osc1.stop(now + 0.9);
      osc2.stop(now + 0.9);

      setTimeout(() => {
        try {
          if (ctx.state !== 'closed') {
            ctx.close().catch(() => {});
          }
        } catch {
          // Ignored
        }
      }, 1100);
    } catch {
      // AudioContext blocked by browser policy
    }
  }, [soundEnabled]);

  const getCurrentTargetDuration = useCallback(() => {
    if (mode === 'focus') return focusDuration;
    if (mode === 'shortBreak') return shortBreakDuration;
    return longBreakDuration;
  }, [mode, focusDuration, shortBreakDuration, longBreakDuration]);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Format Hours and Minutes
  const formatHoursMinutes = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Switch modes
  const switchMode = useCallback(
    (newMode: 'focus' | 'shortBreak' | 'longBreak', autoStart = false) => {
      setMode(newMode);
      setIsRunning(autoStart);
      if (newMode === 'focus') {
        setRemainingSeconds(focusDuration);
        if (autoSwitchTrackForBreak && activeSoundscape !== 'none') {
          const workTrack: SoundscapeId =
            taskCategory === 'Studying' ? 'study_rain' : 'deep_work';
          const vol = isMuted ? 0 : soundVolume / 100;
          ambientSoundEngine.play(workTrack, vol);
          setActiveSoundscape(workTrack);
        }
      } else if (newMode === 'shortBreak') {
        setRemainingSeconds(shortBreakDuration);
        if (autoSwitchTrackForBreak && activeSoundscape !== 'none') {
          const vol = isMuted ? 0 : soundVolume / 100;
          ambientSoundEngine.play('zen_recharge', vol);
          setActiveSoundscape('zen_recharge');
        }
      } else {
        setRemainingSeconds(longBreakDuration);
        if (autoSwitchTrackForBreak && activeSoundscape !== 'none') {
          const vol = isMuted ? 0 : soundVolume / 100;
          ambientSoundEngine.play('zen_recharge', vol);
          setActiveSoundscape('zen_recharge');
        }
      }
    },
    [
      focusDuration,
      shortBreakDuration,
      longBreakDuration,
      autoSwitchTrackForBreak,
      activeSoundscape,
      taskCategory,
      isMuted,
      soundVolume,
    ]
  );

  // Handle countdown complete
  const handleTimerComplete = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    playChime();

    if (mode === 'focus') {
      // Record completed focus session
      setCompletedFocusCount((prev) => prev + 1);
      setTotalFocusSecondsToday((prev) => prev + focusDuration);

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSessionHistory((prev) => [
        {
          task: taskInput.trim() || 'General Deep Work',
          category: taskCategory,
          durationMins: Math.round(focusDuration / 60),
          timestamp: timeStr,
        },
        ...prev,
      ]);

      if (currentCycle >= longBreakInterval) {
        setCurrentCycle(1);
        switchMode('longBreak', autoStartBreaks);
      } else {
        setCurrentCycle((c) => c + 1);
        switchMode('shortBreak', autoStartBreaks);
      }
    } else {
      // Break complete -> back to focus
      switchMode('focus', autoStartFocus);
    }
  }, [
    mode,
    playChime,
    focusDuration,
    taskInput,
    taskCategory,
    currentCycle,
    longBreakInterval,
    autoStartBreaks,
    autoStartFocus,
    switchMode,
  ]);

  // Main countdown ticker loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, handleTimerComplete]);

  // Synchronize browser tab title
  useEffect(() => {
    const timeStr = formatTime(remainingSeconds);
    const modeLabel = mode === 'focus' ? 'Focus' : 'Break';
    document.title = `(${timeStr}) ${modeLabel} — SolveIt Focus Timer`;
  }, [remainingSeconds, mode]);

  // Distraction Click
  const handleNoteDistraction = () => {
    setDistractionsCount((d) => d + 1);
    setDistractionButtonBumping(true);
    setTimeout(() => setDistractionButtonBumping(false), 200);
  };

  // Soundscape Player Handlers
  const handleToggleSoundscape = (id: SoundscapeId) => {
    if (activeSoundscape === id) {
      ambientSoundEngine.stop();
      setActiveSoundscape('none');
    } else {
      const vol = isMuted ? 0 : soundVolume / 100;
      ambientSoundEngine.play(id, vol);
      setActiveSoundscape(id);
    }
  };

  const handleStopSoundscape = () => {
    ambientSoundEngine.stop();
    setActiveSoundscape('none');
  };

  const handleVolumeChange = (newVol: number) => {
    setSoundVolume(newVol);
    if (isMuted && newVol > 0) setIsMuted(false);
    ambientSoundEngine.setVolume(newVol / 100);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      ambientSoundEngine.setVolume(soundVolume / 100);
    } else {
      setIsMuted(true);
      ambientSoundEngine.setVolume(0);
    }
  };

  // Cleanup soundscape engine on component unmount
  useEffect(() => {
    return () => {
      ambientSoundEngine.stop();
    };
  }, []);

  // Toggle Play / Pause with optional Soundscape auto-sync
  const handleToggle = () => {
    setIsRunning((prev) => {
      const willRun = !prev;
      if (willRun) {
        if (autoPlayMusicWithTimer && activeSoundscape === 'none') {
          const track: SoundscapeId =
            mode === 'focus'
              ? taskCategory === 'Studying'
                ? 'study_rain'
                : 'deep_work'
              : 'zen_recharge';
          const vol = isMuted ? 0 : soundVolume / 100;
          ambientSoundEngine.play(track, vol);
          setActiveSoundscape(track);
        }
      } else {
        if (autoPlayMusicWithTimer && activeSoundscape !== 'none') {
          ambientSoundEngine.stop();
          setActiveSoundscape('none');
        }
      }
      return willRun;
    });
  };

  // Reset Countdown
  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(getCurrentTargetDuration());
  };

  // Skip Phase
  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      const confirmSkip = window.confirm('Skip to the next phase of your focus cadence?');
      if (confirmSkip) {
        handleTimerComplete();
      }
    } else {
      handleTimerComplete();
    }
  };

  // Preset Selection
  const handleSelectPreset = (preset: PresetItem) => {
    if (preset.name === 'Custom Timer') {
      setDetailsOpen(true);
      setActivePreset('Custom Timer');
      return;
    }

    setActivePreset(preset.name);
    setFocusDuration(preset.focus * 60);
    setShortBreakDuration(preset.short * 60);
    setLongBreakDuration(preset.long * 60);

    setCustomFocusMins(preset.focus);
    setCustomShortBreakMins(preset.short);
    setCustomLongBreakMins(preset.long);

    setMode('focus');
    setIsRunning(false);
    setRemainingSeconds(preset.focus * 60);
  };

  // Apply Custom settings
  const handleApplyCustomSettings = () => {
    const f = Math.max(1, Math.min(180, customFocusMins || 25));
    const s = Math.max(1, Math.min(60, customShortBreakMins || 5));
    const l = Math.max(1, Math.min(90, customLongBreakMins || 15));
    const c = Math.max(1, Math.min(10, customCycleCount || 4));

    setFocusDuration(f * 60);
    setShortBreakDuration(s * 60);
    setLongBreakDuration(l * 60);
    setLongBreakInterval(c);

    setActivePreset('Custom Timer');
    setMode('focus');
    setIsRunning(false);
    setRemainingSeconds(f * 60);
  };

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ['SolveIt Productivity Export', new Date().toISOString().split('T')[0]],
      ['Total Focus Time Today', formatHoursMinutes(totalFocusSecondsToday)],
      ['Total Sprints Completed', completedFocusCount],
      ['Distractions Logged', distractionsCount],
      ['Deep Work Score', deepWorkScore],
      [],
      ['Task Name', 'Category', 'Duration (Mins)', 'Logged Timestamp'],
    ];

    sessionHistory.forEach((item) => {
      rows.push([
        `"${item.task.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        `${item.durationMins} mins`,
        `"${item.timestamp}"`,
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SolveIt_Focus_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Summary
  const handleCopySummary = () => {
    const summaryText = `SolveIt Daily Focus Report:
• Focus Time: ${formatHoursMinutes(totalFocusSecondsToday)}
• Completed Sprints: ${completedFocusCount}
• Deep Work Score: ${deepWorkScore}/100
• Interruptions: ${distractionsCount}
• Current Streak: ${streakDays} Days 🔥
Generated via SolveItCalculator.com`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2000);
      });
    }
  };

  // Share Progress
  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'SolveIt Focus & Break Timer',
        text: `I've logged ${formatHoursMinutes(totalFocusSecondsToday)} of deep work today across ${completedFocusCount} sprints with SolveIt!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopySummary();
    }
  };

  // Ring Calculation
  const targetDuration = getCurrentTargetDuration();
  const fraction = targetDuration > 0 ? (targetDuration - remainingSeconds) / targetDuration : 0;
  const fullCircleCircumference = 2 * Math.PI * 44; // ~276.46
  const strokeOffset = fullCircleCircumference * (1 - Math.min(Math.max(fraction, 0), 1));
  const percentComplete = Math.round(fraction * 100);

  // Dynamic deep work score
  const deepWorkScore = Math.max(
    65,
    Math.min(100, Math.round(98 - distractionsCount * 2.5 + completedFocusCount * 0.4))
  );

  const remainingUntilLong = longBreakInterval - currentCycle + 1;

  return (
    <main className="w-full pt-0 bg-surface min-h-screen">
      <div className="flex flex-col w-full">
        {/* Top Ambient Glow */}
        <div className="relative w-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-tr from-primary/10 via-secondary-container/20 to-transparent blur-3xl pointer-events-none rounded-full" />
        </div>

        {/* Breadcrumb Navigation & Status Bar */}
        <section className="max-w-max-width-canvas mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pt-space-md pb-space-xs">
          <div className="flex flex-wrap items-center justify-between gap-space-sm text-body-sm text-on-surface-variant">
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </Link>
              <span className="text-outline-variant">/</span>
              <Link className="hover:text-primary transition-colors" href="/time-date">
                Time &amp; Date Calculators
              </Link>
              <span className="text-outline-variant">/</span>
              <span aria-current="page" className="text-on-surface font-medium">
                Focus &amp; Break Timer
              </span>
            </nav>
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full text-body-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-data-mono text-xs text-on-surface">
                Private Session • No Sign-Up Needed • Runs in Browser
              </span>
            </div>
          </div>
        </section>

        {/* Hero & Value Proposition */}
        <section className="max-w-max-width-canvas mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pt-space-md pb-space-lg">
          <div className="flex flex-col gap-space-sm max-w-3xl">
            <div className="inline-flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full w-fit">
              <span className="material-symbols-outlined text-primary text-[15px]">timer</span>
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                Online Focus &amp; Study Timer
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
                100% Free &amp; Private
              </span>
            </div>
            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight">
              Focus &amp; Break Timer
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Boost concentration, avoid burnout, and get more done with easy timed focus sessions, break reminders, and daily habit tracking.
            </p>
            {/* Trust Badges Strip */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-space-md pt-space-xs text-body-sm text-on-surface-variant font-medium">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                <span>100% Free &amp; Private</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">pace</span>
                <span>Proven Pomodoro &amp; Study Rhythms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-[18px]">checklist</span>
                <span>Built-In Distraction Counter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">volume_up</span>
                <span>Gentle Chime Alerts</span>
              </div>
            </div>
          </div>
        </section>

        {/* Method Preset Selector Ribbon */}
        <section className="max-w-max-width-canvas mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pb-space-lg">
          <div className="bg-surface-container-low p-space-sm rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2 px-space-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                POPULAR TIMER PRESETS
              </span>
              <span className="text-body-sm text-on-surface-variant/80 hidden sm:inline">
                Click any timer style to get started
              </span>
            </div>
            <div className="flex flex-wrap gap-space-xs" id="presetButtonsContainer">
              {PRESETS.map((preset) => {
                const isActive = activePreset === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`preset-btn px-space-sm py-1.5 rounded-lg font-body-sm text-body-sm transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high font-medium'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{preset.icon}</span>
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Primary Interactive Split Station */}
        <section className="max-w-max-width-canvas mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pb-space-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* LEFT COLUMN: Main Timer Station (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              {/* Timer Card */}
              <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg sm:p-space-xl flex flex-col relative overflow-hidden">
                {/* Mode Tabs */}
                <div className="flex items-center justify-between border-b pb-space-md mb-space-md border-transparent">
                  <div className="inline-flex p-1 bg-surface-container-low rounded-lg gap-1" role="tablist">
                    <button
                      id="tabFocus"
                      role="tab"
                      aria-selected={mode === 'focus'}
                      type="button"
                      onClick={() => switchMode('focus')}
                      className={`tab-mode px-space-md py-1.5 rounded font-body-sm text-body-sm transition-all ${
                        mode === 'focus'
                          ? 'bg-primary text-on-primary font-semibold shadow-sm'
                          : 'font-medium text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Focus <span>({Math.round(focusDuration / 60)}m)</span>
                    </button>
                    <button
                      id="tabShortBreak"
                      role="tab"
                      aria-selected={mode === 'shortBreak'}
                      type="button"
                      onClick={() => switchMode('shortBreak')}
                      className={`tab-mode px-space-md py-1.5 rounded font-body-sm text-body-sm transition-all ${
                        mode === 'shortBreak'
                          ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                          : 'font-medium text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Short Break <span>({Math.round(shortBreakDuration / 60)}m)</span>
                    </button>
                    <button
                      id="tabLongBreak"
                      role="tab"
                      aria-selected={mode === 'longBreak'}
                      type="button"
                      onClick={() => switchMode('longBreak')}
                      className={`tab-mode px-space-md py-1.5 rounded font-body-sm text-body-sm transition-all ${
                        mode === 'longBreak'
                          ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                          : 'font-medium text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Long Break <span>({Math.round(longBreakDuration / 60)}m)</span>
                    </button>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <span
                      id="cycleIndicatorBadge"
                      className="bg-surface-container px-space-xs py-1 rounded font-data-mono text-xs font-semibold text-primary"
                    >
                      Cycle {currentCycle} of {longBreakInterval}
                    </span>
                  </div>
                </div>

                {/* Active Task Bar */}
                <div className="mb-space-md flex flex-col sm:flex-row gap-space-xs">
                  <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                      edit_note
                    </span>
                    <input
                      id="taskInput"
                      type="text"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="What task are you executing right now?"
                      className="w-full bg-surface-container-low rounded-lg pl-9 pr-3 py-2 text-body-sm text-on-surface font-medium focus:outline-none focus:bg-surface-container transition-all"
                    />
                  </div>
                  <select
                    id="taskCategorySelect"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="bg-surface-container-low rounded-lg px-3 py-2 text-body-sm text-on-surface font-medium focus:outline-none transition-all"
                  >
                    <option value="Writing">✍️ Writing</option>
                    <option value="Coding">💻 Coding</option>
                    <option value="Studying">📚 Studying</option>
                    <option value="Design">🎨 Design</option>
                    <option value="Research">🔬 Research</option>
                    <option value="Finance">📊 Finance</option>
                    <option value="Admin">⚡ Admin</option>
                  </select>
                </div>

                {/* Circular Radial Display & Numerical Timer */}
                <div className="py-space-md flex flex-col items-center justify-center relative">
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle
                        className="text-surface-container"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="44"
                        stroke="currentColor"
                        strokeWidth="6"
                      />
                      <circle
                        id="timerProgressCircle"
                        className="text-primary transition-all duration-1000 ease-linear"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="44"
                        stroke="currentColor"
                        strokeDasharray="276.46"
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        strokeWidth="6"
                      />
                    </svg>

                    {/* Central Numerical Ticker */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span
                        id="timerCountdown"
                        className="font-numerical-display text-[56px] sm:text-[64px] font-bold text-on-surface leading-none tracking-tight select-all mb-space-xs"
                      >
                        {formatTime(remainingSeconds)}
                      </span>
                      <div className="flex items-center gap-1.5 py-0.5">
                        <span
                          id="sessionStatusDot"
                          className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0"
                        />
                        <span
                          id="timerStatusLabel"
                          className="font-data-mono text-xs font-semibold uppercase tracking-wider text-on-surface-variant leading-normal"
                        >
                          {isRunning
                            ? mode === 'focus'
                              ? 'Deep Work in Progress'
                              : 'Restorative Pause Active'
                            : 'Ready to Focus'}
                        </span>
                      </div>
                      <div
                        id="intervalProgressPercent"
                        className="text-body-sm font-data-mono text-outline leading-normal mt-0.5"
                      >
                        {percentComplete}% Complete
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls Section */}
                <div className="pt-space-md flex flex-wrap items-center justify-center gap-space-sm">
                  <button
                    id="btnToggleTimer"
                    type="button"
                    onClick={handleToggle}
                    className="w-full sm:w-auto min-w-[160px] px-space-xl py-3 rounded-xl font-headline-md text-headline-md font-semibold text-on-primary bg-primary hover:bg-primary-container shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[24px]" id="btnToggleIcon">
                      {isRunning ? 'pause' : 'play_arrow'}
                    </span>
                    <span id="btnToggleText">
                      {isRunning
                        ? mode === 'focus'
                          ? 'Pause Sprint'
                          : 'Pause Break'
                        : mode === 'focus'
                        ? 'Start Focus'
                        : 'Start Break'}
                    </span>
                  </button>
                  <button
                    id="btnSkipTimer"
                    type="button"
                    onClick={handleSkip}
                    className="px-space-md py-3 rounded-xl font-body-md text-body-md font-semibold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[20px]">skip_next</span>
                    <span>Next Phase</span>
                  </button>
                  <button
                    id="btnDistraction"
                    type="button"
                    title="Log an unexpected urge or notification interruption"
                    onClick={handleNoteDistraction}
                    className={`px-space-md py-3 rounded-xl font-body-md text-body-md font-semibold text-tertiary bg-tertiary-fixed hover:bg-tertiary-fixed-dim transition-transform duration-150 flex items-center gap-1.5 shadow-sm ${
                      distractionButtonBumping ? 'scale-95' : ''
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">warning_amber</span>
                    <span>
                      Note Distraction (<span id="distractionQuickCount">{distractionsCount}</span>)
                    </span>
                  </button>
                  <button
                    id="btnResetTimer"
                    type="button"
                    title="Reset Current Countdown"
                    onClick={handleReset}
                    className="p-3 rounded-xl text-on-surface-variant bg-surface-container-low hover:bg-surface-container hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                  </button>
                </div>

                {/* Next Milestone Indicator */}
                <div className="mt-space-lg pt-space-sm bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">hotel_class</span>
                    <span>
                      Next Reward:{' '}
                      <strong className="text-on-surface font-semibold" id="nextRewardText">
                        {Math.round(longBreakDuration / 60)}-minute Long Break in {remainingUntilLong} session
                        {remainingUntilLong > 1 ? 's' : ''}
                      </strong>
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-1">
                    <div
                      id="dot1"
                      className={`w-2.5 h-2.5 rounded-full ${
                        1 < currentCycle
                          ? 'bg-primary'
                          : 1 === currentCycle
                          ? 'bg-secondary animate-pulse'
                          : 'bg-outline-variant'
                      }`}
                    />
                    <div
                      id="dot2"
                      className={`w-2.5 h-2.5 rounded-full ${
                        2 < currentCycle
                          ? 'bg-primary'
                          : 2 === currentCycle
                          ? 'bg-secondary animate-pulse'
                          : 'bg-outline-variant'
                      }`}
                    />
                    <div
                      id="dot3"
                      className={`w-2.5 h-2.5 rounded-full ${
                        3 < currentCycle
                          ? 'bg-primary'
                          : 3 === currentCycle
                          ? 'bg-secondary animate-pulse'
                          : 'bg-outline-variant'
                      }`}
                    />
                    <div
                      id="dot4"
                      className={`w-2.5 h-2.5 rounded-full ${
                        4 < currentCycle
                          ? 'bg-primary'
                          : 4 === currentCycle
                          ? 'bg-secondary animate-pulse'
                          : 'bg-outline-variant'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 3 Calm Music Soundscapes Station for Work, Study & Recharge */}
              <div
                id="calmFocusAudioStation"
                className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md sm:p-space-lg border border-outline-variant/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">headphones</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-body-md font-bold text-on-surface">
                          Calm Focus Music &amp; Soundscapes
                        </h2>
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-surface-container text-primary">
                          3 Ambient Tracks
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant text-xs mt-0.5">
                        Procedural binaural alpha, study rain &amp; ocean bowls • 100% ad-free &amp; runs offline
                      </p>
                    </div>
                  </div>

                  {/* Live Status Indicator & Stop Button */}
                  {activeSoundscape !== 'none' ? (
                    <div className="flex items-center gap-2 bg-primary/10 text-primary px-space-sm py-1.5 rounded-full text-xs font-semibold">
                      <span className="flex items-center gap-0.5 h-3">
                        <span className="w-1 bg-primary rounded-full animate-bounce h-3" />
                        <span className="w-1 bg-primary rounded-full animate-bounce h-2 [animation-delay:0.15s]" />
                        <span className="w-1 bg-primary rounded-full animate-bounce h-3 [animation-delay:0.3s]" />
                      </span>
                      <span>
                        Playing: {SOUNDSCAPE_TRACKS.find((t) => t.id === activeSoundscape)?.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleStopSoundscape}
                        className="ml-1 text-primary hover:text-primary/70 transition-colors flex items-center"
                        title="Stop Ambient Soundscape"
                        aria-label="Stop Ambient Soundscape"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-on-surface-variant font-medium bg-surface-container-low px-2.5 py-1 rounded-full">
                      Audio Inactive
                    </span>
                  )}
                </div>

                {/* 3 Calm Music Tracks Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  {SOUNDSCAPE_TRACKS.map((track) => {
                    const isSelected = activeSoundscape === track.id;
                    return (
                      <button
                        key={track.id}
                        id={`btnTrack-${track.id}`}
                        type="button"
                        onClick={() => handleToggleSoundscape(track.id)}
                        className={`p-3.5 rounded-xl text-left transition-all duration-200 flex flex-col justify-between border cursor-pointer ${
                          isSelected
                            ? 'bg-surface-container-high border-primary ring-2 ring-primary/20 shadow-sm'
                            : 'bg-surface-container-low/60 hover:bg-surface-container-low border-outline-variant/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                track.category === 'Work'
                                  ? 'bg-primary/10 text-primary'
                                  : track.category === 'Study'
                                  ? 'bg-secondary/10 text-secondary'
                                  : 'bg-emerald-500/10 text-emerald-600'
                              }`}
                            >
                              {track.category}
                            </span>
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                                isSelected
                                  ? 'bg-primary text-on-primary scale-105 shadow-sm'
                                  : 'bg-surface-container text-on-surface-variant hover:text-primary'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {isSelected ? 'pause' : 'play_arrow'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 font-semibold text-on-surface text-body-sm">
                            <span className="material-symbols-outlined text-[18px] text-primary">
                              {track.icon}
                            </span>
                            <span>{track.name}</span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                            {track.tagline}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                          <span
                            className={`font-medium ${
                              isSelected ? 'text-primary font-bold' : 'text-on-surface-variant'
                            }`}
                          >
                            {isSelected ? '● Playing' : 'Click to Play'}
                          </span>
                          <span className="text-primary font-semibold text-[10px]">
                            {track.category === 'Work'
                              ? '10Hz Alpha'
                              : track.category === 'Study'
                              ? 'Rain & Chime'
                              : '432Hz Bowls'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Volume & Smart Sync Controls Dock */}
                <div className="mt-space-md pt-space-sm border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-space-md text-body-sm">
                  {/* Master Volume Slider */}
                  <div className="flex items-center gap-2.5 min-w-[190px]">
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="text-on-surface-variant hover:text-on-surface transition-colors"
                      title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                      aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isMuted || soundVolume === 0
                          ? 'volume_off'
                          : soundVolume < 50
                          ? 'volume_down'
                          : 'volume_up'}
                      </span>
                    </button>
                    <input
                      id="inputSoundscapeVolume"
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : soundVolume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                      className="w-24 sm:w-32 h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                      aria-label="Soundscape Volume Level"
                    />
                    <span className="font-data-mono text-xs text-on-surface-variant w-8">
                      {isMuted ? '0%' : `${soundVolume}%`}
                    </span>
                  </div>

                  {/* Automation Preferences */}
                  <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 text-xs text-on-surface-variant">
                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-on-surface transition-colors">
                      <input
                        id="chkAutoPlayMusic"
                        type="checkbox"
                        checked={autoPlayMusicWithTimer}
                        onChange={(e) => setAutoPlayMusicWithTimer(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-primary focus:ring-0"
                      />
                      <span>Auto-play when sprint starts</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-on-surface transition-colors">
                      <input
                        id="chkAutoSwitchBreakMusic"
                        type="checkbox"
                        checked={autoSwitchTrackForBreak}
                        onChange={(e) => setAutoSwitchTrackForBreak(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-primary focus:ring-0"
                      />
                      <span>Switch to Zen Recharge during breaks</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Interval & Preference Customizer (Expandable Panel) */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md">
                <details
                  className="group cursor-pointer"
                  open={detailsOpen}
                  onToggle={(e) => setDetailsOpen(e.currentTarget.open)}
                >
                  <summary className="list-none flex items-center justify-between font-body-md font-semibold text-on-surface">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                      <span>Timer Settings &amp; Sound Options</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="mt-space-md pt-space-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-sm">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="inputFocusMins">
                        Focus (Minutes)
                      </label>
                      <input
                        id="inputFocusMins"
                        type="number"
                        min="1"
                        max="180"
                        value={customFocusMins}
                        onChange={(e) => setCustomFocusMins(parseInt(e.target.value, 10) || 1)}
                        className="bg-surface-container-low rounded-lg px-3 py-2 font-data-mono text-body-md text-on-surface font-semibold focus:outline-none focus:bg-surface-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="inputShortBreakMins">
                        Short Break (Mins)
                      </label>
                      <input
                        id="inputShortBreakMins"
                        type="number"
                        min="1"
                        max="60"
                        value={customShortBreakMins}
                        onChange={(e) => setCustomShortBreakMins(parseInt(e.target.value, 10) || 1)}
                        className="bg-surface-container-low rounded-lg px-3 py-2 font-data-mono text-body-md text-on-surface font-semibold focus:outline-none focus:bg-surface-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="inputLongBreakMins">
                        Long Break (Mins)
                      </label>
                      <input
                        id="inputLongBreakMins"
                        type="number"
                        min="1"
                        max="90"
                        value={customLongBreakMins}
                        onChange={(e) => setCustomLongBreakMins(parseInt(e.target.value, 10) || 1)}
                        className="bg-surface-container-low rounded-lg px-3 py-2 font-data-mono text-body-md text-on-surface font-semibold focus:outline-none focus:bg-surface-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="inputLongBreakInterval">
                        Sessions / Cycle
                      </label>
                      <input
                        id="inputLongBreakInterval"
                        type="number"
                        min="1"
                        max="10"
                        value={customCycleCount}
                        onChange={(e) => setCustomCycleCount(parseInt(e.target.value, 10) || 1)}
                        className="bg-surface-container-low rounded-lg px-3 py-2 font-data-mono text-body-md text-on-surface font-semibold focus:outline-none focus:bg-surface-container"
                      />
                    </div>
                  </div>
                  {/* Toggles */}
                  <div className="mt-space-md pt-space-sm flex flex-wrap items-center justify-between gap-space-md text-body-sm text-on-surface">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        id="chkAutoStartBreaks"
                        type="checkbox"
                        checked={autoStartBreaks}
                        onChange={(e) => setAutoStartBreaks(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-0"
                      />
                      <span>Auto-start Break countdown</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        id="chkAutoStartFocus"
                        type="checkbox"
                        checked={autoStartFocus}
                        onChange={(e) => setAutoStartFocus(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-0"
                      />
                      <span>Auto-start next Focus block</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        id="chkSoundChime"
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={(e) => setSoundEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-0"
                      />
                      <span>Play Sound Chime at interval end</span>
                    </label>
                    <button
                      id="btnApplyCustomIntervals"
                      type="button"
                      onClick={handleApplyCustomSettings}
                      className="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-semibold transition-colors"
                    >
                      Apply Custom Settings
                    </button>
                  </div>
                </details>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Session Analytics & Health Dashboard (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              {/* Deep Work Score Card */}
              <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    TODAY&apos;S PRODUCTIVITY
                  </span>
                  <span className="bg-primary-fixed text-on-primary-fixed-variant px-space-xs py-0.5 rounded font-label-caps text-label-caps font-bold">
                    STATE: HIGH FOCUS
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-body-sm text-on-surface-variant">Focus Score</div>
                    <div className="font-numerical-display text-numerical-display text-primary flex items-baseline gap-1">
                      <span id="deepWorkScore">{deepWorkScore}</span>
                      <span className="text-headline-md text-on-surface-variant font-normal">/ 100</span>
                    </div>
                  </div>
                  <div className="w-24 h-10">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                      <path
                        className="text-primary"
                        d="M0,35 Q20,28 40,25 T80,10 T100,5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <circle className="fill-primary animate-ping" cx="100" cy="5" r="4" />
                      <circle className="fill-primary" cx="100" cy="5" r="3" />
                    </svg>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                  Great concentration pace! You are maintaining strong focus with minimal distractions.
                </p>
              </div>

              {/* Metric Cards 2x2 Grid */}
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
                  <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">timelapse</span>
                    <span className="font-label-caps text-label-caps uppercase">Focus Today</span>
                  </div>
                  <div
                    id="statTotalFocusTime"
                    className="font-data-mono text-headline-md text-on-surface font-semibold"
                  >
                    {formatHoursMinutes(totalFocusSecondsToday)}
                  </div>
                  <div className="text-body-sm text-on-surface-variant mt-1">Goal: 4h (94% achieved)</div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
                  <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                    <span className="font-label-caps text-label-caps uppercase">Completed</span>
                  </div>
                  <div
                    id="statCompletedSessions"
                    className="font-data-mono text-headline-md text-on-surface font-semibold"
                  >
                    {completedFocusCount} Sprints
                  </div>
                  <div className="text-body-sm text-on-surface-variant mt-1">Across 3 projects</div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
                  <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">emergency</span>
                    <span className="font-label-caps text-label-caps uppercase">Distractions</span>
                  </div>
                  <div
                    id="statDistractions"
                    className="font-data-mono text-headline-md text-tertiary font-semibold"
                  >
                    {distractionsCount} Interruptions
                  </div>
                  <div className="text-body-sm text-tertiary/90 mt-1">Low friction impact</div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
                  <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">
                      local_fire_department
                    </span>
                    <span className="font-label-caps text-label-caps uppercase">Focus Streak</span>
                  </div>
                  <div
                    id="statStreakDays"
                    className="font-data-mono text-headline-md text-on-surface font-semibold"
                  >
                    {streakDays} Days 🔥
                  </div>
                  <div className="text-body-sm text-on-surface-variant mt-1">Personal record pace</div>
                </div>
              </div>

              {/* Burnout Prevention & Fatigue Diagnostic */}
              <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface uppercase font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">spa</span>
                    FOCUS &amp; BREAK BALANCE
                  </span>
                  <span className="text-body-sm font-data-mono text-emerald-700 font-semibold bg-surface-container-lowest px-2 py-0.5 rounded">
                    Healthy Zone
                  </span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full w-[82%]" title="82% Focus Time" />
                  <div className="bg-secondary-container h-full w-[18%]" title="18% Break Restorative Time" />
                </div>
                <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
                  <span>
                    Focus vs. Rest Ratio: <strong className="text-on-surface font-data-mono">4.8 to 1</strong> (Healthy Pace)
                  </span>
                  <span>
                    Rest Time: <strong className="text-on-surface font-data-mono">18%</strong>
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant leading-tight">
                  Your pacing is balanced. Taking regular short breaks keeps your mind energized throughout the day.
                </p>
              </div>

              {/* Action Export Tools */}
              <div className="flex flex-wrap items-center gap-space-xs pt-space-2xs">
                <button
                  id="btnExportCSV"
                  type="button"
                  onClick={handleExportCSV}
                  className="flex-1 px-space-sm py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Export CSV</span>
                </button>
                <button
                  id="btnCopySummary"
                  type="button"
                  onClick={handleCopySummary}
                  className="flex-1 px-space-sm py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedSummary ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                </button>
                <button
                  id="btnShareProgress"
                  type="button"
                  onClick={handleShare}
                  className="px-space-sm py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Why Choose SolveIt Focus Timer vs. Other Apps */}
        <section className="max-w-max-width-canvas mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pb-space-2xl">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg sm:p-space-xl">
            <div className="max-w-3xl mb-space-lg">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                HOW WE COMPARE
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                Why Choose SolveIt Focus Timer vs. Other Apps
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Enjoy a clean, distraction-free timer with zero ads, no account required, and complete privacy.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-space-md">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono font-bold flex items-center justify-center mb-space-xs text-sm">
                    1
                  </div>
                  <h3 className="font-body-md font-semibold text-on-surface mb-1">Pick Your Timer</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Choose Classic 25/5 for quick tasks, or 50 to 90 minutes for deep creative work.
                  </p>
                </div>
                <span className="text-xs font-data-mono text-primary mt-3 font-medium">Step 01 / Preset</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono font-bold flex items-center justify-center mb-space-xs text-sm">
                    2
                  </div>
                  <h3 className="font-body-md font-semibold text-on-surface mb-1">Clear Distractions</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Mute phone alerts, close unnecessary tabs, and set out the single task you want to finish.
                  </p>
                </div>
                <span className="text-xs font-data-mono text-primary mt-3 font-medium">Step 02 / Silence</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono font-bold flex items-center justify-center mb-space-xs text-sm">
                    3
                  </div>
                  <h3 className="font-body-md font-semibold text-on-surface mb-1">Focus on One Task</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Press &quot;Start Focus&quot;. Dedicate your full energy to your active task until the chime sounds.
                  </p>
                </div>
                <span className="text-xs font-data-mono text-primary mt-3 font-medium">Step 03 / Sprint</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono font-bold flex items-center justify-center mb-space-xs text-sm">
                    4
                  </div>
                  <h3 className="font-body-md font-semibold text-on-surface mb-1">Take a Real Break</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Step away from your screen. Grab water, stretch, take a brief walk, or look out a window.
                  </p>
                </div>
                <span className="text-xs font-data-mono text-primary mt-3 font-medium">Step 04 / Rest</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono font-bold flex items-center justify-center mb-space-xs text-sm">
                    5
                  </div>
                  <h3 className="font-body-md font-semibold text-on-surface mb-1">Review Your Day</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Check your Focus Score, see completed sprints, and celebrate your daily progress.
                  </p>
                </div>
                <span className="text-xs font-data-mono text-primary mt-3 font-medium">Step 05 / Review</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Featured Snippet 5-Step Guide */}
        <section className="max-w-max-width-canvas mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pb-space-2xl">
          <div className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl">
            <div className="max-w-3xl mb-space-lg">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                Quick Mastery Workflow
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                How to Master Deep Work in 5 Simple Steps
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Harnessing sustained cognitive endurance requires deliberate execution. Follow this battle-tested protocol to produce elite results without burning out.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-space-md">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono font-bold flex items-center justify-center mb-space-xs text-sm">
                    1
                  </div>
                  <h3 className="font-body-md font-semibold text-on-surface mb-1">Select Interval Cadence</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Choose Classic 25/5 for tight sprints, or 90-Min Ultradian for heavy creative flow.
                  </p>
                </div>
                <span className="text-xs font-data-mono text-primary mt-3 font-medium">Step 01 / Preset</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono font-bold flex items-center justify-center mb-space-xs text-sm">
                    2
                  </div>
                  <h3 className="font-body-md font-semibold text-on-surface mb-1">Eradicate Friction</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Silence chat apps, clear browser tabs, and isolate your singular work objective.
                  </p>
                </div>
                <span className="text-xs font-data-mono text-primary mt-3 font-medium">Step 02 / Silence</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono font-bold flex items-center justify-center mb-space-xs text-sm">
                    3
                  </div>
                  <h3 className="font-body-md font-semibold text-on-surface mb-1">Execute Timed Sprint</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Hit &quot;Start Focus&quot;. Commit solely to the active task until the final chime triggers.
                  </p>
                </div>
                <span className="text-xs font-data-mono text-primary mt-3 font-medium">Step 03 / Sprint</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono font-bold flex items-center justify-center mb-space-xs text-sm">
                    4
                  </div>
                  <h3 className="font-body-md font-semibold text-on-surface mb-1">Take True Active Rest</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Step completely away from monitors. Walk, hydrate, stretch, or practice box breathing.
                  </p>
                </div>
                <span className="text-xs font-data-mono text-primary mt-3 font-medium">Step 04 / Rest</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono font-bold flex items-center justify-center mb-space-xs text-sm">
                    5
                  </div>
                  <h3 className="font-body-md font-semibold text-on-surface mb-1">Inspect Diagnostics</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Review your Deep Work Score, distraction timestamps, and adjust fatigue ratios.
                  </p>
                </div>
                <span className="text-xs font-data-mono text-primary mt-3 font-medium">Step 05 / Calibrate</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: 8 Real-World High-Cognition Scenarios */}
        <section className="max-w-max-width-canvas mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pb-space-2xl">
          <div className="text-center max-w-2xl mx-auto mb-space-xl">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
              Practical Applications
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
              Engineered for Every High-Cognition Discipline
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              See how specialized professionals adapt SolveIt&apos;s interval engine to achieve sustained deep work mastery.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Scenario 1 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[22px]">school</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface">University Exam Revision</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  <strong>Method:</strong> 50/10 Cycle. Ideal for active recall flashcards, practice questions, and retaining complex biomedical or legal taxonomy.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-transparent text-xs font-data-mono text-primary font-medium">
                Optimal: 4 Blocks / Day
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[22px]">code</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface">Software Engineering Sprints</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  <strong>Method:</strong> 90/20 Flow. Solves complex algorithmic challenges without interrupting cognitive compiler loops or memory traces.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-transparent text-xs font-data-mono text-primary font-medium">
                Optimal: 3 Blocks / Day
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface">Freelance Billable Tracking</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  <strong>Method:</strong> 52/17 Desk. Precise tracking of client-specific tasks with instant CSV export to match invoice billing logs.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-transparent text-xs font-data-mono text-primary font-medium">
                Optimal: 6 Blocks / Day
              </div>
            </div>

            {/* Scenario 4 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[22px]">edit_note</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface">Novel &amp; Editorial Drafting</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  <strong>Method:</strong> 60/10 Sprint. Eliminates the internal editor during 1,000-word sprints, protecting immersion and narrative tone.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-transparent text-xs font-data-mono text-primary font-medium">
                Optimal: 4 Blocks / Day
              </div>
            </div>

            {/* Scenario 5 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[22px]">video_camera_front</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface">Meeting Recovery Buffer</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  <strong>Method:</strong> 25/5 Classic. Decompresses Zoom fatigue with structured non-screen intervals before re-entering analytical output.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-transparent text-xs font-data-mono text-primary font-medium">
                Optimal: 5 Blocks / Day
              </div>
            </div>

            {/* Scenario 6 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface">Strategic Executive Planning</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  <strong>Method:</strong> 90-Min Ultradian. Focuses leadership attention on high-leverage quarterly roadmaps, hiring matrices, and pitch decks.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-transparent text-xs font-data-mono text-primary font-medium">
                Optimal: 2 Blocks / Day
              </div>
            </div>

            {/* Scenario 7 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[22px]">biotech</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface">Literature Meta-Review</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  <strong>Method:</strong> 45/15 Study Cycle. Provides ample break time to digest complex statistical methodology between reading academic papers.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-transparent text-xs font-data-mono text-primary font-medium">
                Optimal: 5 Blocks / Day
              </div>
            </div>

            {/* Scenario 8 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[22px]">translate</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface">Language Acquisition</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  <strong>Method:</strong> 25/5 Pomodoro. Ideal for intense grammar drills and spaced repetition card decks before auditory memory fatigue sets in.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-transparent text-xs font-data-mono text-primary font-medium">
                Optimal: 3 Blocks / Day
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Head-to-Head Comparison Table */}
        <section className="max-w-max-width-canvas mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pb-space-2xl">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg sm:p-space-xl">
            <div className="max-w-3xl mb-space-lg">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                Independent Architecture Evaluation
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                SolveIt Focus Timer vs. Alternative Workbenches
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Why professionals choose SolveIt over intrusive mobile phone alarms, ad-cluttered web countdowns, and paywalled subscription apps.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase">
                    <th className="py-3 px-4 rounded-l">Features</th>
                    <th className="py-3 px-4 text-primary font-bold">SolveIt Focus Timer</th>
                    <th className="py-3 px-4">Phone Clock / Alarm</th>
                    <th className="py-3 px-4">Basic Timer Websites</th>
                    <th className="py-3 px-4 rounded-r">Paid Focus Apps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-transparent text-on-surface">
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold">Client-Side In-Browser Execution</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Yes, Runs in Browser</span>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">Yes</td>
                    <td className="py-3.5 px-4 text-tertiary">Has Ad Trackers</td>
                    <td className="py-3.5 px-4 text-tertiary">Requires Account</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold">No Annoying Ads or Popups</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">block</span>
                      <span>100% Ad-Free</span>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-700 font-medium">Ad-Free</td>
                    <td className="py-3.5 px-4 text-error font-medium">Cluttered with Ads</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">Upgrade Popups</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold">Ready-to-Use Timer Presets</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>8 Free Presets</span>
                    </td>
                    <td className="py-3.5 px-4 text-outline">Manual Setup</td>
                    <td className="py-3.5 px-4 text-outline">25-Min Only</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">Requires Paid Plan</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold">Distraction Counter</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>1-Click Tracker</span>
                    </td>
                    <td className="py-3.5 px-4 text-outline">No</td>
                    <td className="py-3.5 px-4 text-outline">No</td>
                    <td className="py-3.5 px-4 text-outline">App-Switch Only</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold">Free Data Download (CSV)</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>Instant Free Export</span>
                    </td>
                    <td className="py-3.5 px-4 text-outline">None</td>
                    <td className="py-3.5 px-4 text-outline">Rare / No</td>
                    <td className="py-3.5 px-4 text-tertiary">Paid Subscription</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 5: 15 Comprehensive FAQs */}
        <section className="max-w-max-width-canvas mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pb-space-2xl">
          <div className="max-w-3xl mb-space-lg">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
              Expert Knowledge Base
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
              Frequently Asked Questions
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Everything you need to know about timeboxing, attention preservation, interval calibration, and cognitive science.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* FAQ 1 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                What is the most effective focus timer interval?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                There is no universal interval for all tasks. For intense cognitive drafting and software debugging, the <strong>90-minute ultradian rhythm</strong> or <strong>52/17 desk method</strong> works best to accommodate complex working memory. For repetitive or resistant tasks, the <strong>Classic 25-minute Pomodoro</strong> provides the lowest barrier to entry.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                What should I do during a 5-minute short break?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Practice deliberate <em>optic and cognitive rest</em>. Stand up from your desk, stretch your spine, drink a full glass of water, look at objects 20 feet away to relax eye lenses, or do light breathing exercises. Avoid checking email, text messages, or algorithmic social media.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                How does the &quot;Log Distraction&quot; button help my focus?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Psychologists identify that an unfulfilled impulse creates mental tension (the Zeigarnik effect). Clicking &quot;Log Distraction (+1)&quot; acknowledges the distraction intention in 0.5 seconds, satisfies your brain&apos;s urge to switch, and allows you to return to your sprint with zero browser tab jumping.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                Is this timer completely private and safe to use at work?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Yes, 100%. SolveIt executes all calculations entirely within your client&apos;s web browser sandbox using vanilla JavaScript. No task titles, times, or diagnostic metrics are transmitted to any remote servers, satisfying strict corporate compliance and confidential NDA requirements.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                What is the 52/17 productivity rule?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                A landmark study conducted by the Draugiem Group tracked elite knowledge workers and found that the top 10% most productive individuals worked with 100% dedicated sprint intensity for 52 consecutive minutes, followed by 17 minutes of total, non-screen rest.
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                How is the Deep Work Score calculated?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Our algorithm balances completion rate against distraction penalties. Each uninterrupted sprint completed elevates your baseline score, while logged interruptions reduce the flow score based on estimated resumption lag (averaging 4.2 penalty points per distraction event).
              </p>
            </div>

            {/* FAQ 7 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                Does this focus timer work offline?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Yes. Once this page is loaded in your browser tab, the timer engine, chime generator (Web Audio API), and session logs will continue running seamlessly even if you disconnect from Wi-Fi or turn on Airplane Mode.
              </p>
            </div>

            {/* FAQ 8 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                How many Pomodoro sprints should I do in a single day?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Most humans have between 3 to 4 hours of true deep cognitive focus per day. This equates to 8 to 10 standard 25-minute Pomodoros or 2 to 3 full 90-minute ultradian cycles. Pushing beyond this frequently triggers diminishing analytical returns.
              </p>
            </div>

            {/* FAQ 9 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                What should I do if an urgent interruption happens mid-sprint?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Apply the &quot;Inform, Negotiate, Schedule&quot; rule: tell the requester you are in a timed block, negotiate to respond in 15 minutes, or hit &quot;Pause&quot; on the timer. If the issue is critical, click &quot;Log Distraction&quot; and reset the block once resolved.
              </p>
            </div>

            {/* FAQ 10 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                Can this timer assist individuals with ADHD?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Absolutely. People with ADHD frequently experience &quot;time blindness.&quot; The large high-contrast visual countdown and circular progress ring make the passage of time concrete and visible, preventing unintentional hyper-focus exhaustion and task paralysis.
              </p>
            </div>

            {/* FAQ 11 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                How does the long break interval work?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                By default, after every 4 completed focus sprints, the timer automatically awards a 15 to 30-minute long break. This allows glycogen and neurotransmitter replenishment before starting your next 4-cycle sprint cluster.
              </p>
            </div>

            {/* FAQ 12: Calm Music Soundscapes */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                How do the 3 calm focus soundscapes (Deep Work, Study Rain, Zen Recharge) boost concentration?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                SolveIt provides 3 procedural ambient soundscapes: (1) <strong>Deep Work Flow</strong> utilizes 10Hz binaural alpha-wave entrainment with warm drone pads to induce sustained focus; (2) <strong>Study &amp; Memory</strong> pairs soft acoustic rain noise with pentatonic chimes to mask erratic background noises; and (3) <strong>Zen Recharge</strong> provides 7-second oceanic breath swells with 432Hz Tibetan singing bowl harmonics to trigger parasympathetic relaxation during breaks.
              </p>
            </div>

            {/* FAQ 13 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                Can I customize the sound alerts or run silently?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Yes. Open the &quot;Timer Settings &amp; Sound Options&quot; drawer to toggle sound alerts on or off. Our alert uses a synthetic pleasant chime tone generated in real-time through the Web Audio synthesizer, requiring zero heavy audio downloads.
              </p>
            </div>

            {/* FAQ 13 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                What is the Focus-to-Break Ratio (FBR)?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                FBR measures how many minutes of deep work you execute for every minute of restorative rest. A ratio around 4.8:1 to 5:1 indicates sustainable productivity. Anything above 7:1 warns of imminent afternoon burnout.
              </p>
            </div>

            {/* FAQ 14 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                How do I export my productivity reports for client billing?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Click the &quot;Export CSV&quot; button in the Live Analytics station. A structured spreadsheet file formatted with task labels, categories, exact elapsed minutes, and distraction counts will immediately download to your device.
              </p>
            </div>

            {/* FAQ 15 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <h3 className="font-body-md font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                Can I keep this tab open in the background?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Yes! The timer updates your browser tab&apos;s title in real time (e.g. &quot;(24:12) Focus — SolveIt&quot;), allowing you to see your remaining time at a glance without switching away from your active work document.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Programmatic Dedicated Trackers & Contextual Links */}
        <section className="max-w-max-width-canvas mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pb-space-3xl">
          <div className="bg-surface-container-low rounded-xl p-space-lg">
            <div className="flex items-center gap-2 mb-space-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
              <h3 className="font-body-md font-semibold text-on-surface">
                Explore Related High-Precision Calculators &amp; Timers
              </h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              SolveIt provides a comprehensive collection of completely private computational instruments for time management, finance, and engineering:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-xs">
              <Link
                href="/time-date/event-countdown"
                className="p-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded-lg text-body-sm text-on-surface font-medium transition-colors flex flex-col gap-1"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">hourglass_top</span>
                <span>Event Countdown</span>
              </Link>
              <Link
                href="/focus-and-break-timer"
                className="p-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded-lg text-body-sm text-on-surface font-medium transition-colors flex flex-col gap-1"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">menu_book</span>
                <span>Study Sprint Timer</span>
              </Link>
              <Link
                href="/time-date/90-minute-ultradian-rhythm-planner"
                className="p-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded-lg text-body-sm text-on-surface font-medium transition-colors flex flex-col gap-1"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                <span>Ultradian Deep Work</span>
              </Link>
              <Link
                href="/time-date"
                className="p-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded-lg text-body-sm text-on-surface font-medium transition-colors flex flex-col gap-1"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                <span>Billable Work Hours</span>
              </Link>
              <Link
                href="/time-date/date-difference"
                className="p-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded-lg text-body-sm text-on-surface font-medium transition-colors flex flex-col gap-1"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                <span>Date Difference Tool</span>
              </Link>
              <Link
                href="/time-date"
                className="p-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded-lg text-body-sm text-on-surface font-medium transition-colors flex flex-col gap-1"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">public</span>
                <span>Time Zone Sync Engine</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
