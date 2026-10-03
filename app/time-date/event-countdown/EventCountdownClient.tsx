'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

interface SavedEvent {
  id: string;
  name: string;
  targetDate: string;
  targetTime: string;
  category: string;
  emoji: string;
  badge: string;
  color: string;
  createdAt: string;
  notificationsEnabled?: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  atZero: boolean;
  oneHour: boolean;
  twentyFourHours: boolean;
  sevenDays: boolean;
  thirtyDays: boolean;
  milestones: boolean;
  sound: boolean;
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  atZero: true,
  oneHour: true,
  twentyFourHours: true,
  sevenDays: false,
  thirtyDays: false,
  milestones: true,
  sound: true,
};

const DEFAULT_SAVED_EVENTS: SavedEvent[] = [
  {
    id: '1',
    name: 'Q4 Product Launch',
    targetDate: '2025-08-20',
    targetTime: '09:00',
    category: 'business',
    emoji: '🚀',
    badge: 'Active',
    color: 'primary',
    createdAt: '2024-11-01',
    notificationsEnabled: true,
  },
  {
    id: '2',
    name: 'Summer Trip to Kyoto',
    targetDate: '2025-06-14',
    targetTime: '10:00',
    category: 'travel',
    emoji: '⛩️',
    badge: 'Vacation',
    color: 'secondary',
    createdAt: '2024-12-01',
    notificationsEnabled: true,
  },
  {
    id: '3',
    name: "Alex & Sarah's Wedding",
    targetDate: '2025-10-30',
    targetTime: '16:00',
    category: 'wedding',
    emoji: '💍',
    badge: 'Wedding',
    color: 'tertiary',
    createdAt: '2025-01-01',
    notificationsEnabled: false,
  },
  {
    id: '4',
    name: "New Year's Eve 2026",
    targetDate: '2025-12-31',
    targetTime: '23:59',
    category: 'milestone',
    emoji: '🎆',
    badge: 'Annual',
    color: 'primary-container',
    createdAt: '2025-01-01',
    notificationsEnabled: true,
  },
];

type ModeType = 'countdown' | 'since' | 'annual' | 'business';
type ColorTheme = 'blue' | 'sky' | 'amber' | 'rose';

export default function EventCountdownClient() {
  const [mounted, setMounted] = useState(false);

  // Form inputs state
  const [eventName, setEventName] = useState('Q4 Global Product Launch Sprint');
  const [category, setCategory] = useState('business');
  const [timeZone, setTimeZone] = useState('auto');
  const [mode, setMode] = useState<ModeType>('countdown');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('blue');

  // Dates state
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 142);
    return d.toISOString().split('T')[0];
  });
  const [targetTime, setTargetTime] = useState('09:00');
  const [baselineDate, setBaselineDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 250);
    return d.toISOString().split('T')[0];
  });

  // Slider interactive states
  const [workHoursPerDay, setWorkHoursPerDay] = useState(8);
  const [timelineSliderDays, setTimelineSliderDays] = useState(142);

  // Toggles
  const [skipWeekends, setSkipWeekends] = useState(true);
  const [repeatAnnual, setRepeatAnnual] = useState(false);
  const [soundAlert, setSoundAlert] = useState(true);

  // Notification Engine State
  const [notificationPermission, setNotificationPermission] = useState<
    'default' | 'granted' | 'denied' | 'unsupported'
  >('default');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATION_SETTINGS
  );
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [testNotifSuccess, setTestNotifSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [sentNotificationKeys, setSentNotificationKeys] = useState<string[]>([]);

  // Active preset
  const [activePreset, setActivePreset] = useState<string>('launch');

  // Live timer tick
  const [now, setNow] = useState<Date>(() => new Date());

  // Saved countdowns
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(DEFAULT_SAVED_EVENTS);

  // UI feedback & modals
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('travel');
  const [newEventEmoji, setNewEventEmoji] = useState('🎉');
  const [newEventNotifications, setNewEventNotifications] = useState(true);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const showNotificationToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('solveit_saved_countdowns');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedEvents(parsed);
        }
      }
    } catch {
      // Ignore localStorage read errors
    }

    try {
      const storedSettings = localStorage.getItem('solveit_countdown_notification_settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (parsed && typeof parsed === 'object') {
          setNotificationSettings(parsed);
        }
      }
    } catch {
      // Ignore localStorage read errors
    }

    try {
      const storedKeys = localStorage.getItem('solveit_sent_notifications');
      if (storedKeys) {
        const parsed = JSON.parse(storedKeys);
        if (Array.isArray(parsed)) {
          setSentNotificationKeys(parsed);
        }
      }
    } catch {
      // Ignore
    }

    // Check browser notification support
    if (typeof window !== 'undefined') {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
        if (Notification.permission === 'granted') {
          setNotificationSettings((prev) => ({ ...prev, enabled: true }));
        }
      } else {
        setNotificationPermission('unsupported');
      }

      // Check URL parameters for shared countdowns
      const params = new URLSearchParams(window.location.search);
      const titleParam = params.get('title');
      const dateParam = params.get('date');
      const timeParam = params.get('time');
      const tzParam = params.get('tz');
      if (titleParam) setEventName(decodeURIComponent(titleParam));
      if (dateParam) setTargetDate(dateParam);
      if (timeParam) setTargetTime(timeParam);
      if (tzParam) setTimeZone(tzParam);
    }
  }, []);

  // Update live clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync saved countdowns to localStorage
  const persistSavedEvents = (events: SavedEvent[]) => {
    setSavedEvents(events);
    try {
      localStorage.setItem('solveit_saved_countdowns', JSON.stringify(events));
    } catch {
      // Ignore write errors
    }
  };

  const persistNotificationSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    try {
      localStorage.setItem('solveit_countdown_notification_settings', JSON.stringify(settings));
    } catch {
      // Ignore write errors
    }
  };

  // Helper to play celebration chime
  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio not permitted without user gesture
    }
  }, []);

  // Send local browser notification
  const sendLocalNotification = useCallback(
    (title: string, body: string, tag?: string) => {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      if (notificationSettings.sound || soundAlert) {
        playChime();
      }

      try {
        const notif = new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: tag || `solveit-${Date.now()}`,
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (e) {
        console.error('Error creating Notification', e);
      }
    },
    [notificationSettings.sound, soundAlert, playChime]
  );

  // Request notification permission from user
  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      showNotificationToast('Browser notifications are not supported on this device.');
      return false;
    }
    try {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
      if (result === 'granted') {
        const updated = { ...notificationSettings, enabled: true };
        persistNotificationSettings(updated);
        showNotificationToast('🔔 Notifications enabled! Countdown alerts are now synchronized.');
        sendLocalNotification(
          '🔔 SolveIt Countdown Alerts Synced',
          `You will receive timely alerts for "${eventName || 'your countdown'}"!`,
          'solveit-sync-welcome'
        );
        return true;
      } else if (result === 'denied') {
        const updated = { ...notificationSettings, enabled: false };
        persistNotificationSettings(updated);
        showNotificationToast('Notification permission was blocked in browser site settings.');
        return false;
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
    return false;
  };

  // Trigger test notification
  const handleTestNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showNotificationToast('Notifications are not supported in this browser.');
      return;
    }
    if (Notification.permission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }
    sendLocalNotification(
      `⏳ Test Alert: ${eventName || 'Event Countdown'}`,
      `Countdown test alert triggered successfully! Tracking is live in your browser.`,
      'test-countdown-alert'
    );
    setTestNotifSuccess(true);
    setTimeout(() => setTestNotifSuccess(false), 3000);
    showNotificationToast('Test notification sent! Check your system notification banner.');
  };

  // Toggle notification for an individual saved event
  const handleToggleSavedEventNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (notificationPermission !== 'granted') {
      requestNotificationPermission().then((granted) => {
        if (granted) {
          const updated = savedEvents.map((ev) =>
            ev.id === id ? { ...ev, notificationsEnabled: !ev.notificationsEnabled } : ev
          );
          persistSavedEvents(updated);
        }
      });
      return;
    }

    const updated = savedEvents.map((ev) =>
      ev.id === id ? { ...ev, notificationsEnabled: !ev.notificationsEnabled } : ev
    );
    persistSavedEvents(updated);
    const targetEv = updated.find((ev) => ev.id === id);
    if (targetEv?.notificationsEnabled) {
      showNotificationToast(`🔔 Notifications enabled for "${targetEv.name}"`);
    } else {
      showNotificationToast(`🔕 Notifications muted for "${targetEv?.name || 'event'}"`);
    }
  };

  // Calculate target Date object safely
  const targetDateTime = useMemo(() => {
    if (!targetDate) return new Date();
    try {
      const parts = targetDate.split('-');
      if (parts.length < 3) return new Date();
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (isNaN(year) || isNaN(month) || isNaN(day)) return new Date();
      
      const timeParts = (targetTime || '00:00').split(':');
      const hours = parseInt(timeParts[0] || '0', 10) || 0;
      const minutes = parseInt(timeParts[1] || '0', 10) || 0;

      if (mode === 'annual' || repeatAnnual) {
        const currentYear = now.getFullYear();
        let testDate = new Date(currentYear, month - 1, day, hours, minutes, 0);
        if (isNaN(testDate.getTime())) return new Date();
        if (testDate.getTime() < now.getTime()) {
          testDate = new Date(currentYear + 1, month - 1, day, hours, minutes, 0);
        }
        return isNaN(testDate.getTime()) ? new Date() : testDate;
      }

      const res = new Date(year, month - 1, day, hours, minutes, 0);
      return isNaN(res.getTime()) ? new Date() : res;
    } catch {
      return new Date();
    }
  }, [targetDate, targetTime, repeatAnnual, mode, now]);

  // Diff calculations
  const diffMs = useMemo(() => {
    if (!targetDateTime || isNaN(targetDateTime.getTime())) return 0;
    return targetDateTime.getTime() - now.getTime();
  }, [targetDateTime, now]);

  const isPast = mode === 'since' ? false : diffMs <= 0;

  // Breakdown metrics
  const absDiff = Math.abs(diffMs);
  const countDays = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const countHours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
  const countMins = Math.floor((absDiff / (1000 * 60)) % 60);
  const countSecs = Math.floor((absDiff / 1000) % 60);

  const totalHours = Math.floor(absDiff / (1000 * 60 * 60));
  const totalWeeks = (absDiff / (1000 * 60 * 60 * 24 * 7)).toFixed(1);
  const totalMonths = (absDiff / (1000 * 60 * 60 * 24 * 30.4375)).toFixed(2);
  const totalSecs = Math.floor(absDiff / 1000);

  // Business days calculation
  const { businessDays, weekendDays, totalWorkingHours, workingWeeks } = useMemo(() => {
    if (!targetDateTime || isNaN(targetDateTime.getTime())) {
      return { businessDays: 0, weekendDays: 0, totalWorkingHours: 0, workingWeeks: '0.0' };
    }
    const isTargetInFuture = targetDateTime.getTime() >= now.getTime();
    const start = isTargetInFuture ? new Date(now.getTime()) : new Date(targetDateTime.getTime());
    const end = isTargetInFuture ? new Date(targetDateTime.getTime()) : new Date(now.getTime());

    let bDays = 0;
    let wDays = 0;
    const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const targetDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    while (cur <= targetDay) {
      const dayOfWeek = cur.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        wDays++;
      } else {
        bDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return {
      businessDays: bDays,
      weekendDays: wDays,
      totalWorkingHours: Math.round(bDays * workHoursPerDay),
      workingWeeks: (bDays / 5).toFixed(1),
    };
  }, [now, targetDateTime, workHoursPerDay]);

  // Progress Bar
  const progressPct = useMemo(() => {
    const baseDateObj = new Date(baselineDate);
    const base = isNaN(baseDateObj.getTime()) ? now.getTime() - 86400000 * 30 : baseDateObj.getTime();
    const tgt = !targetDateTime || isNaN(targetDateTime.getTime()) ? now.getTime() + 86400000 * 30 : targetDateTime.getTime();
    const current = now.getTime();
    const totalDuration = tgt - base;
    if (totalDuration <= 0) return '100.0';
    const elapsed = current - base;
    const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    return pct.toFixed(1);
  }, [baselineDate, targetDateTime, now]);

  // Play sound if hit zero
  useEffect(() => {
    if (soundAlert && absDiff < 1000 && isPast) {
      playChime();
    }
  }, [soundAlert, absDiff, isPast, playChime]);

  // Synchronized Notification Background Engine
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted' || !notificationSettings.enabled) return;

    const checkAndDispatchNotification = (
      id: string,
      name: string,
      targetDt: Date,
      isPrimary: boolean
    ) => {
      if (!targetDt || isNaN(targetDt.getTime())) return;
      const diff = targetDt.getTime() - now.getTime();
      const diffSeconds = Math.floor(diff / 1000);
      let isoDate = 'event';
      try {
        isoDate = targetDt.toISOString().slice(0, 10);
      } catch {
        isoDate = 'date';
      }
      const prefix = `notif_${id}_${isoDate}`;

      // 1. T-0 (Event reached)
      if (notificationSettings.atZero && diff <= 0 && diff > -60000) {
        const key = `${prefix}_zero`;
        setSentNotificationKeys((prev) => {
          if (prev.includes(key)) return prev;
          const nextKeys = [...prev, key];
          try {
            localStorage.setItem('solveit_sent_notifications', JSON.stringify(nextKeys));
          } catch {}
          sendLocalNotification(
            `🎉 Event Arrived: ${name}`,
            `The countdown for "${name}" has reached zero! It's time!`,
            key
          );
          return nextKeys;
        });
      }

      // 2. 1 Hour Left (3600 seconds)
      if (notificationSettings.oneHour && diffSeconds <= 3600 && diffSeconds > 3540) {
        const key = `${prefix}_1h`;
        setSentNotificationKeys((prev) => {
          if (prev.includes(key)) return prev;
          const nextKeys = [...prev, key];
          try {
            localStorage.setItem('solveit_sent_notifications', JSON.stringify(nextKeys));
          } catch {}
          sendLocalNotification(
            `⏳ 1 Hour Left: ${name}`,
            `"${name}" starts in 1 hour (${Math.round(diffSeconds / 60)} minutes remaining)!`,
            key
          );
          return nextKeys;
        });
      }

      // 3. 24 Hours (1 Day) Left
      if (notificationSettings.twentyFourHours && diffSeconds <= 86400 && diffSeconds > 86340) {
        const key = `${prefix}_24h`;
        setSentNotificationKeys((prev) => {
          if (prev.includes(key)) return prev;
          const nextKeys = [...prev, key];
          try {
            localStorage.setItem('solveit_sent_notifications', JSON.stringify(nextKeys));
          } catch {}
          sendLocalNotification(
            `📅 1 Day Left: ${name}`,
            `"${name}" is tomorrow! Get ready.`,
            key
          );
          return nextKeys;
        });
      }

      // 4. 7 Days Left
      if (notificationSettings.sevenDays && diffSeconds <= 604800 && diffSeconds > 604740) {
        const key = `${prefix}_7d`;
        setSentNotificationKeys((prev) => {
          if (prev.includes(key)) return prev;
          const nextKeys = [...prev, key];
          try {
            localStorage.setItem('solveit_sent_notifications', JSON.stringify(nextKeys));
          } catch {}
          sendLocalNotification(
            `🗓️ 1 Week Remaining: ${name}`,
            `Only 7 days until "${name}". Check your milestones!`,
            key
          );
          return nextKeys;
        });
      }
    };

    // Check active primary event
    checkAndDispatchNotification('primary', eventName, targetDateTime, true);

    // Check all saved events with notifications enabled
    savedEvents.forEach((ev) => {
      if (ev && ev.notificationsEnabled && ev.targetDate) {
        try {
          const evDate = new Date(`${ev.targetDate}T${ev.targetTime || '09:00'}:00`);
          if (!isNaN(evDate.getTime())) {
            checkAndDispatchNotification(ev.id, ev.name, evDate, false);
          }
        } catch {}
      }
    });
  }, [
    now,
    notificationSettings,
    targetDateTime,
    eventName,
    savedEvents,
    sendLocalNotification,
  ]);

  // Quick Preset Click Handler
  const handleSelectPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    const currYear = now.getFullYear();
    let newTarget = new Date();
    let title = '';
    let cat = 'milestone';

    if (presetKey === 'newyear') {
      newTarget = new Date(currYear + 1, 0, 1, 0, 0, 0);
      title = `New Year ${currYear + 1} Celebration`;
      cat = 'milestone';
    } else if (presetKey === 'christmas') {
      newTarget = new Date(currYear, 11, 25, 0, 0, 0);
      if (newTarget.getTime() < now.getTime()) {
        newTarget.setFullYear(currYear + 1);
      }
      title = 'Christmas Morning';
      cat = 'milestone';
    } else if (presetKey === 'summer') {
      newTarget = new Date(currYear, 5, 21, 0, 0, 0);
      if (newTarget.getTime() < now.getTime()) {
        newTarget.setFullYear(currYear + 1);
      }
      title = 'Summer Vacation';
      cat = 'travel';
    } else if (presetKey === 'launch') {
      newTarget.setDate(now.getDate() + 90);
      newTarget.setHours(9, 0, 0, 0);
      title = 'Q4 Global Product Launch Sprint';
      cat = 'business';
    } else if (presetKey === 'wedding') {
      newTarget.setDate(now.getDate() + 180);
      newTarget.setHours(16, 0, 0, 0);
      title = 'Wedding Day Celebration';
      cat = 'wedding';
    } else if (presetKey === 'retirement') {
      newTarget.setFullYear(currYear + 2);
      title = 'Retirement Celebration';
      cat = 'milestone';
    } else if (presetKey === 'marathon') {
      newTarget.setDate(now.getDate() + 65);
      title = 'Paris Marathon';
      cat = 'milestone';
    }

    const y = newTarget.getFullYear();
    const m = String(newTarget.getMonth() + 1).padStart(2, '0');
    const d = String(newTarget.getDate()).padStart(2, '0');
    setTargetDate(`${y}-${m}-${d}`);
    setTargetTime(`${String(newTarget.getHours()).padStart(2, '0')}:${String(newTarget.getMinutes()).padStart(2, '0')}`);
    setEventName(title);
    setCategory(cat);
  };

  // Quick Offset handler
  const handleAddDays = (daysToAdd: number) => {
    const d = new Date(targetDate || now);
    d.setDate(d.getDate() + daysToAdd);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setTargetDate(`${y}-${m}-${day}`);
    setActivePreset('');
  };

  // Reset to default
  const handleReset = () => {
    const d = new Date();
    d.setDate(d.getDate() + 142);
    setTargetDate(d.toISOString().split('T')[0]);
    setTargetTime('09:00');
    setEventName('Q4 Global Product Launch Sprint');
    setCategory('business');
    setTimeZone('auto');
    setMode('countdown');
    setSkipWeekends(true);
    setRepeatAnnual(false);
    setColorTheme('blue');
    setActivePreset('launch');
  };

  // Save current countdown to list
  const handleSaveCurrentEvent = () => {
    const categoryEmojis: Record<string, string> = {
      travel: '✈️',
      wedding: '💍',
      birthday: '🎂',
      milestone: '🌱',
      business: '🚀',
      exams: '📚',
    };
    const newEvent: SavedEvent = {
      id: Date.now().toString(),
      name: eventName || 'Untitled Event',
      targetDate,
      targetTime,
      category,
      emoji: categoryEmojis[category] || '📅',
      badge: category.charAt(0).toUpperCase() + category.slice(1),
      color: colorTheme === 'sky' ? 'secondary' : colorTheme === 'amber' ? 'tertiary' : 'primary',
      createdAt: new Date().toISOString().split('T')[0],
      notificationsEnabled: true,
    };
    const updated = [newEvent, ...savedEvents.filter((e) => e.name !== newEvent.name)];
    persistSavedEvents(updated);
    showNotificationToast(`Saved "${newEvent.name}" to your countdown watchlist!`);
  };

  // Delete saved event
  const handleDeleteSavedEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedEvents.filter((item) => item.id !== id);
    persistSavedEvents(updated);
  };

  // Load saved event into editor
  const handleLoadSavedEvent = (ev: SavedEvent) => {
    setEventName(ev.name);
    setTargetDate(ev.targetDate);
    setTargetTime(ev.targetTime || '09:00');
    setCategory(ev.category || 'milestone');
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Copy ticker text
  const handleCopyTicker = () => {
    const text = `${countDays} Days, ${String(countHours).padStart(2, '0')} Hours, ${String(countMins).padStart(2, '0')} Mins, ${String(countSecs).padStart(2, '0')} Secs ${isPast ? 'since' : 'left until'} ${eventName}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  // Add to Calendar (.ics export)
  const handleExportICS = () => {
    try {
      const parts = targetDate.split('-');
      if (parts.length < 3) return;
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      const [hh, mm] = (targetTime || '09:00').split(':').map((v) => parseInt(v, 10) || 0);
      const startDateObj = new Date(y, m - 1, d, hh, mm, 0);
      if (isNaN(startDateObj.getTime())) return;
      const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000); // 1 hour event

      const formatICSDate = (dt: Date) => {
        return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SolveIt Calculator//Event Countdown//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:solveit-countdown-${Date.now()}@solveitcalculator.com`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(startDateObj)}`,
        `DTEND:${formatICSDate(endDateObj)}`,
        `SUMMARY:${eventName || 'Countdown Event'}`,
        `DESCRIPTION:Countdown event created on SolveIt Calculator. Track your progress at https://solveitcalculator.com/time-date/event-countdown/`,
        `URL:https://solveitcalculator.com/time-date/event-countdown/`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${(eventName || 'event').replace(/\s+/g, '_')}_countdown.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Error generating .ics', e);
    }
  };

  // Share Link
  const handleShareLink = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('title', eventName);
    url.searchParams.set('date', targetDate);
    url.searchParams.set('time', targetTime);
    if (timeZone !== 'auto') url.searchParams.set('tz', timeZone);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    });
  };

  // Add custom event dialog submission
  const handleAddCustomEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName || !newEventDate) return;

    const newEv: SavedEvent = {
      id: Date.now().toString(),
      name: newEventName,
      targetDate: newEventDate,
      targetTime: '09:00',
      category: newEventCategory,
      emoji: newEventEmoji || '🎉',
      badge: newEventCategory.charAt(0).toUpperCase() + newEventCategory.slice(1),
      color: 'primary',
      createdAt: new Date().toISOString().split('T')[0],
      notificationsEnabled: newEventNotifications,
    };
    const updated = [newEv, ...savedEvents];
    persistSavedEvents(updated);
    setAddModalOpen(false);
    setNewEventName('');
    setNewEventDate('');
    showNotificationToast(`Added "${newEv.name}" to your countdown watchlist!`);
  };

  // Format target display badge
  const targetDateDisplay = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return targetDateTime.toLocaleDateString('en-US', options);
  }, [targetDateTime]);

  // Checkpoints computation (25%, 50%, 75%, 90%, 100%)
  const checkpoints = useMemo(() => {
    const base = new Date(baselineDate).getTime();
    const tgt = targetDateTime.getTime();
    const totalSpan = tgt - base;

    const getCheckpointInfo = (fraction: number, label: string, title: string, desc: string, icon: string) => {
      const cpTime = new Date(base + totalSpan * fraction);
      const isPassed = now.getTime() >= cpTime.getTime();
      const dateStr = cpTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const daysDiff = Math.ceil((cpTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        label,
        title,
        desc,
        icon,
        isPassed,
        dateStr,
        daysDiff,
        fraction,
      };
    };

    return [
      getCheckpointInfo(0.25, '25% HORIZON', 'Early Planning Completed', 'Venue, key dates, or core goal outlined and established.', 'check_circle'),
      getCheckpointInfo(0.5, '50% MIDPOINT', 'Halfway Check-in', 'Review bookings, tasks, and budget to keep everything smoothly on track.', 'check_circle'),
      getCheckpointInfo(0.75, '75% UPCOMING', 'Final Preparations', 'Confirm details, invitations, travel tickets, and supplier appointments.', 'hourglass_top'),
      getCheckpointInfo(0.9, '90% SPRINT', 'Final Week Countdown', 'Final checklist, pack bags, last-minute review, and rest up.', 'flag'),
      getCheckpointInfo(1.0, '100% TARGET', 'Event Day Has Arrived!', 'Celebrate, launch, or enjoy your special day with friends and family.', 'celebration'),
    ];
  }, [baselineDate, targetDateTime, now]);

  // Color theme classes mapping
  const colorThemeStyles = {
    blue: {
      text: 'text-primary',
      bg: 'bg-primary',
      bgContainer: 'bg-primary-container',
      textContainer: 'text-on-primary-container',
      gradient: 'from-primary to-secondary-container',
      ring: 'ring-primary',
    },
    sky: {
      text: 'text-secondary',
      bg: 'bg-secondary',
      bgContainer: 'bg-secondary-fixed',
      textContainer: 'text-on-secondary-fixed',
      gradient: 'from-secondary to-primary-container',
      ring: 'ring-secondary',
    },
    amber: {
      text: 'text-tertiary-container',
      bg: 'bg-tertiary-container',
      bgContainer: 'bg-tertiary-fixed',
      textContainer: 'text-on-tertiary-fixed',
      gradient: 'from-tertiary-container to-tertiary',
      ring: 'ring-tertiary-container',
    },
    rose: {
      text: 'text-error',
      bg: 'bg-error',
      bgContainer: 'bg-error-container',
      textContainer: 'text-on-error-container',
      gradient: 'from-error to-tertiary-container',
      ring: 'ring-error',
    },
  }[colorTheme];

  return (
    <main className="w-full pt-0 bg-surface min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant/10">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-sm">
          <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <Link className="hover:text-primary transition-colors" href="/time-date">
              Time &amp; Date Calculators
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-on-surface font-medium">Event Countdown Calculator</span>
          </nav>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* Top Ambient Glow Aura */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-gradient-to-tr from-primary/10 via-secondary-container/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Hero Header & Trust Badges */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-xl">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-md">
              {/* Pre-title Pill */}
              <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container-high shadow-sm text-primary">
                <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                  ONLINE EVENT COUNTDOWN TIMER
                </span>
              </div>

              <h1 className="font-headline-lg text-headline-lg md:font-display-hero md:text-display-hero text-on-surface tracking-tight font-bold">
                Event Countdown Calculator
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Create a live countdown for any upcoming event, wedding, vacation, exam, birthday, or personal milestone. Track days, hours, and minutes left with progress bars and celebration checkpoints.
              </p>

              {/* Trust Pills Row */}
              <div className="flex flex-wrap items-center justify-center gap-space-xs pt-space-2xs text-on-surface-variant">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest rounded-full shadow-sm text-on-surface border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[15px] text-primary">lock</span>
                  <span className="font-body-sm text-body-sm font-medium">100% Free &amp; Private — No Account Needed</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest rounded-full shadow-sm text-on-surface border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[15px] text-secondary">timer</span>
                  <span className="font-body-sm text-body-sm font-medium">Instant Live Countdown (Down to the Second)</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest rounded-full shadow-sm text-on-surface border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[15px] text-primary">public</span>
                  <span className="font-body-sm text-body-sm font-medium">Automatic Time Zone &amp; Leap Year Support</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest rounded-full shadow-sm text-on-surface border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[15px] text-tertiary">bookmark</span>
                  <span className="font-body-sm text-body-sm font-medium">Save &amp; Bookmark Countdowns on Your Device</span>
                </div>
              </div>

              {/* Quick Event Preset Chips */}
              <div className="w-full pt-space-sm flex flex-col items-center">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-space-xs font-semibold">
                  Quick Presets
                </span>
                <div className="flex flex-wrap justify-center gap-space-xs" id="quick-preset-container">
                  {[
                    { id: 'newyear', emoji: '🎆', name: `New Year ${now.getFullYear() + 1}` },
                    { id: 'christmas', emoji: '🎄', name: 'Christmas' },
                    { id: 'summer', emoji: '🏖️', name: 'Summer Vacation' },
                    { id: 'launch', emoji: '🚀', name: 'Product Launch Sprint' },
                    { id: 'wedding', emoji: '💍', name: 'Wedding Day' },
                    { id: 'retirement', emoji: '🌴', name: 'Retirement Celebration' },
                    { id: 'marathon', emoji: '🏃', name: 'Paris Marathon' },
                  ].map((preset) => {
                    const isActive = activePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`preset-btn px-3 py-1.5 rounded-full transition-all font-body-sm text-body-sm font-medium shadow-sm flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-primary-container text-on-primary-container font-semibold ring-2 ring-primary-container'
                            : 'bg-surface-container-low text-on-surface hover:bg-surface-container-highest'
                        }`}
                      >
                        <span>{preset.emoji}</span>
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Notification Permission & Sync Alert Banner */}
        {!bannerDismissed && (
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop mb-space-md w-full">
            <div
              className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
                notificationPermission === 'granted' && notificationSettings.enabled
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                  : notificationPermission === 'denied'
                  ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
                  : 'bg-primary-container/30 border-primary/20 text-on-surface'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    notificationPermission === 'granted' && notificationSettings.enabled
                      ? 'bg-emerald-500 text-white'
                      : notificationPermission === 'denied'
                      ? 'bg-amber-500 text-white'
                      : 'bg-primary text-on-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {notificationPermission === 'granted' && notificationSettings.enabled
                      ? 'notifications_active'
                      : notificationPermission === 'denied'
                      ? 'notifications_off'
                      : 'add_alert'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-sm text-[15px] font-semibold">
                      {notificationPermission === 'granted' && notificationSettings.enabled
                        ? 'Countdown Notifications Synced & Active'
                        : notificationPermission === 'denied'
                        ? 'Notifications Blocked in Browser'
                        : 'Sync Countdown Notifications with Your Device'}
                    </h3>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        notificationPermission === 'granted' && notificationSettings.enabled
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                          : notificationPermission === 'denied'
                          ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                          : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {notificationPermission === 'granted' && notificationSettings.enabled
                        ? 'Active Sync'
                        : notificationPermission === 'denied'
                        ? 'Permission Denied'
                        : 'Instant Setup'}
                    </span>
                  </div>
                  <p className="text-sm opacity-90 mt-0.5 max-w-2xl">
                    {notificationPermission === 'granted' && notificationSettings.enabled
                      ? 'Live browser alerts are enabled for your target date, milestones (25%, 50%, 75%), and T-0 celebration.'
                      : notificationPermission === 'denied'
                      ? 'Notification permissions were denied. To enable alerts, click the lock icon in your browser address bar and allow notifications.'
                      : 'Never miss an event! Enable browser notification permissions to get alerts when milestones are reached and when your timer hits zero.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {notificationPermission !== 'granted' ? (
                  <button
                    type="button"
                    onClick={requestNotificationPermission}
                    className="px-4 py-2 bg-primary hover:bg-on-primary-fixed-variant text-on-primary rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">notifications</span>
                    <span>Enable Notifications</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleTestNotification}
                      className="px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container rounded-lg text-xs font-semibold shadow-sm transition-colors border border-outline-variant/20 flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">send</span>
                      <span>{testNotifSuccess ? 'Sent!' : 'Test Notification'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotificationModalOpen(true)}
                      className="px-3 py-1.5 bg-primary-container text-on-primary-container hover:opacity-90 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">settings</span>
                      <span>Settings</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setBannerDismissed(true)}
                  title="Dismiss banner"
                  className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Interactive Workbench & Live Results Dashboard */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-2xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Left Column: Inputs & Configuration Panel (5 cols) */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col gap-space-md border border-outline-variant/20">
              {/* Header */}
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
                  </span>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface leading-tight font-semibold">
                      Event Details &amp; Settings
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Configure target date, time, and countdown options
                    </p>
                  </div>
                </div>
              </div>

              {/* Calculation Mode Segmented Slider Control */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">tune</span>
                    <span>Calculation Mode</span>
                  </label>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {mode === 'countdown'
                      ? '⏳ Standard Countdown'
                      : mode === 'since'
                      ? '⏱️ Elapsed Countup'
                      : mode === 'annual'
                      ? '🔄 Annual Rollover'
                      : '💼 Working Days & Hours'}
                  </span>
                </div>

                {/* Sliding Segmented Pill Switcher */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/20 shadow-inner">
                  {[
                    {
                      id: 'countdown',
                      label: 'Countdown',
                      sub: 'Days until event',
                      icon: 'hourglass_top',
                    },
                    {
                      id: 'since',
                      label: 'Time Since',
                      sub: 'Elapsed countup',
                      icon: 'history',
                    },
                    {
                      id: 'annual',
                      label: 'Annual',
                      sub: 'Anniversary repeat',
                      icon: 'event_repeat',
                    },
                    {
                      id: 'business',
                      label: 'Work Days',
                      sub: 'Excl. weekends',
                      icon: 'work',
                    },
                  ].map((tab) => {
                    const isActive = mode === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          const newMode = tab.id as ModeType;
                          setMode(newMode);
                          if (newMode === 'annual') {
                            setRepeatAnnual(true);
                          }
                          if (newMode === 'business') {
                            setSkipWeekends(true);
                          }
                          // Gracefully adjust dates if switching between past/future modes
                          const curr = new Date();
                          const targetObj = new Date(targetDate);
                          if (newMode === 'since' && targetObj.getTime() > curr.getTime()) {
                            const pastDate = new Date();
                            pastDate.setDate(curr.getDate() - 90);
                            setTargetDate(pastDate.toISOString().split('T')[0]);
                            setTimelineSliderDays(-90);
                          } else if ((newMode === 'countdown' || newMode === 'business') && targetObj.getTime() < curr.getTime()) {
                            const futDate = new Date();
                            futDate.setDate(curr.getDate() + 90);
                            setTargetDate(futDate.toISOString().split('T')[0]);
                            setTimelineSliderDays(90);
                          }
                        }}
                        className={`py-2 px-2.5 rounded-lg flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          isActive
                            ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold border border-primary/20 scale-[1.02]'
                            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                          <span className="text-xs font-semibold">{tab.label}</span>
                        </div>
                        <span className="text-[10px] opacity-75 hidden sm:inline-block leading-tight">
                          {tab.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Mode Explanation Insight Banner */}
                <div className="text-[12px] px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center gap-2 border border-outline-variant/15">
                  <span className="material-symbols-outlined text-[15px] text-primary shrink-0">info</span>
                  <span>
                    {mode === 'countdown' && 'Calculates exact days, hours, and seconds remaining until your target moment.'}
                    {mode === 'since' && 'Calculates live elapsed duration since a past milestone, founding date, or anniversary.'}
                    {mode === 'annual' && 'Automatically rolls forward to the next annual occurrence every year upon completion.'}
                    {mode === 'business' && 'Counts only Monday–Friday working days and calculates billable work hours.'}
                  </span>
                </div>
              </div>

              {/* Event Name Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-body-sm text-body-sm font-medium text-on-surface" htmlFor="event-name">
                    {mode === 'since' ? 'Past Milestone / Event Title' : 'Event Name or Title'}
                  </label>
                  <span className="font-body-sm text-body-sm text-outline font-data-mono">
                    {eventName.length} / 60
                  </span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                    label
                  </span>
                  <input
                    id="event-name"
                    type="text"
                    maxLength={60}
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder={mode === 'since' ? 'e.g. Company Founded / Wedding Day' : 'e.g. Summer Vacation to Kyoto'}
                    className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/20"
                  />
                </div>
              </div>

              {/* Category & Time Zone Pair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-medium text-on-surface" htmlFor="event-category">
                    Category
                  </label>
                  <select
                    id="event-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/20"
                  >
                    <option value="travel">✈️ Vacation &amp; Travel</option>
                    <option value="wedding">💍 Wedding</option>
                    <option value="birthday">🎂 Birthday</option>
                    <option value="milestone">🌱 Milestone</option>
                    <option value="business">💼 Business</option>
                    <option value="exams">📚 Exams</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-medium text-on-surface" htmlFor="event-tz">
                    Time Zone (Local)
                  </label>
                  <select
                    id="event-tz"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm font-data-mono text-data-mono border border-outline-variant/20 text-[13px]"
                  >
                    <option value="auto">Auto: America/New_York (Local)</option>
                    <option value="UTC">UTC (Universal Time)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PT)</option>
                    <option value="America/Chicago">America/Chicago (CT)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="Europe/Paris">Europe/Paris (CET)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                  </select>
                </div>
              </div>

              {/* Target Date & Event Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-medium text-on-surface" htmlFor="target-date">
                    {mode === 'since' ? 'Milestone Date (Past)' : 'Target Date'}
                  </label>
                  <input
                    id="target-date"
                    type="date"
                    value={targetDate}
                    onChange={(e) => {
                      setTargetDate(e.target.value);
                      setActivePreset('');
                      try {
                        const d = new Date(e.target.value);
                        if (!isNaN(d.getTime())) {
                          const diff = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                          setTimelineSliderDays(diff);
                        }
                      } catch {
                        // ignore
                      }
                    }}
                    className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-medium text-on-surface" htmlFor="target-time">
                    Event Time
                  </label>
                  <input
                    id="target-time"
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/20"
                  />
                </div>
              </div>

              {/* Interactive Timeline Horizon Slider */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px] text-primary">linear_scale</span>
                    <span className="text-xs font-semibold text-on-surface">
                      {mode === 'since' ? 'Elapsed Horizon Slider' : 'Timeline Horizon Slider'}
                    </span>
                  </div>
                  <span className="font-data-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {mode === 'since'
                      ? `${Math.abs(timelineSliderDays)} Days Ago`
                      : `+${Math.max(1, timelineSliderDays)} Days Ahead`}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="365"
                  value={Math.abs(timelineSliderDays) || (mode === 'since' ? 90 : 30)}
                  onChange={(e) => {
                    const days = parseInt(e.target.value, 10);
                    const newOffset = mode === 'since' ? -days : days;
                    setTimelineSliderDays(newOffset);
                    const d = new Date(now);
                    d.setDate(d.getDate() + newOffset);
                    setTargetDate(d.toISOString().split('T')[0]);
                    setActivePreset('');
                  }}
                  className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-data-mono">
                  <span>{mode === 'since' ? '1 Day Ago' : 'Tomorrow (+1d)'}</span>
                  <span>{mode === 'since' ? '90 Days Ago' : '+90 Days (3 mo)'}</span>
                  <span>{mode === 'since' ? '180 Days Ago' : '+180 Days (6 mo)'}</span>
                  <span>{mode === 'since' ? '1 Year Ago' : '+1 Year (365d)'}</span>
                </div>
              </div>

              {/* Business Mode Working Hours Slider */}
              {mode === 'business' && (
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-on-surface block">
                          Workday Hours Slider
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          Set productive work hours per business day
                        </span>
                      </div>
                    </div>
                    <span className="font-data-mono text-xs font-bold text-primary bg-surface-container-lowest px-2.5 py-1 rounded-md shadow-sm border border-primary/20">
                      {workHoursPerDay} hrs / day
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="16"
                    step="0.5"
                    value={workHoursPerDay}
                    onChange={(e) => setWorkHoursPerDay(parseFloat(e.target.value))}
                    className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                  />

                  {/* Preset Shift Pills */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { val: 4, label: '4h Part-Time' },
                      { val: 7.5, label: '7.5h Standard' },
                      { val: 8, label: '8h Full-Time' },
                      { val: 10, label: '10h Overtime' },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setWorkHoursPerDay(preset.val)}
                        className={`py-1 text-[11px] font-medium rounded-md text-center transition-colors cursor-pointer border ${
                          workHoursPerDay === preset.val
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-outline-variant/20'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-1 pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs font-data-mono text-on-surface">
                    <span>
                      Total Work Hours: <strong className="text-primary font-bold">{totalWorkingHours.toLocaleString()} hrs</strong>
                    </span>
                    <span>
                      Shifts: <strong className="text-on-surface font-semibold">{businessDays} days</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Add Days */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                  Quick Add Days
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddDays(7)}
                    className="offset-btn py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-data-mono text-data-mono rounded-lg transition-colors text-center shadow-sm border border-outline-variant/20 cursor-pointer"
                  >
                    +7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddDays(30)}
                    className="offset-btn py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-data-mono text-data-mono rounded-lg transition-colors text-center shadow-sm border border-outline-variant/20 cursor-pointer"
                  >
                    +30 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddDays(90)}
                    className="offset-btn py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-data-mono text-data-mono rounded-lg transition-colors text-center shadow-sm border border-outline-variant/20 cursor-pointer"
                  >
                    +90 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddDays(365)}
                    className="offset-btn py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-data-mono text-data-mono rounded-lg transition-colors text-center shadow-sm border border-outline-variant/20 cursor-pointer"
                  >
                    +1 Year
                  </button>
                </div>
              </div>

              {/* Friendly Options Toggles */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors shadow-sm border border-outline-variant/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                    <div>
                      <span className="font-body-sm text-body-sm text-on-surface font-medium block">
                        Count only business days (skip weekends)
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Excludes Saturdays and Sundays from the countdown
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={skipWeekends}
                    onChange={(e) => setSkipWeekends(e.target.checked)}
                    className="w-4 h-4 rounded text-primary accent-primary shrink-0 ml-2 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors shadow-sm border border-outline-variant/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">event_repeat</span>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">
                      Repeat every year on this date (Anniversary mode)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={repeatAnnual}
                    onChange={(e) => setRepeatAnnual(e.target.checked)}
                    className="w-4 h-4 rounded text-primary accent-primary shrink-0 ml-2 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors shadow-sm border border-outline-variant/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">volume_up</span>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">
                      Play chime audio when countdown completes
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundAlert}
                    onChange={(e) => setSoundAlert(e.target.checked)}
                    className="w-4 h-4 rounded text-primary accent-primary shrink-0 ml-2 cursor-pointer"
                  />
                </label>
              </div>

              {/* Notification Engine & Device Synchronization Card */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                    </span>
                    <div>
                      <h3 className="font-headline-sm text-sm font-semibold text-on-surface">
                        Browser Notification Sync
                      </h3>
                      <span className="text-[11px] text-on-surface-variant block">
                        Get live system alerts for this countdown
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      notificationPermission === 'granted' && notificationSettings.enabled
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                        : notificationPermission === 'denied'
                        ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {notificationPermission === 'granted' && notificationSettings.enabled
                      ? '● Synced'
                      : notificationPermission === 'denied'
                      ? '● Blocked'
                      : '○ Disabled'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-outline-variant/10">
                  {notificationPermission !== 'granted' ? (
                    <button
                      type="button"
                      onClick={requestNotificationPermission}
                      className="flex-1 py-1.5 px-3 bg-primary text-on-primary hover:bg-on-primary-fixed-variant rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">notifications</span>
                      <span>Ask Notification Permission</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...notificationSettings,
                            enabled: !notificationSettings.enabled,
                          };
                          persistNotificationSettings(updated);
                          showNotificationToast(
                            updated.enabled
                              ? '🔔 Countdown notifications active'
                              : '🔕 Countdown notifications paused'
                          );
                        }}
                        className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          notificationSettings.enabled
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {notificationSettings.enabled ? 'notifications_active' : 'notifications_off'}
                        </span>
                        <span>{notificationSettings.enabled ? 'Syncing Active' : 'Resume Sync'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTestNotification}
                        className="py-1.5 px-2.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded-lg text-xs font-medium shadow-sm transition-colors border border-outline-variant/20 flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">send</span>
                        <span>{testNotifSuccess ? 'Sent!' : 'Test Alert'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNotificationModalOpen(true)}
                        title="Configure Milestones & Alerts"
                        className="py-1.5 px-2 bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded-lg text-xs font-medium shadow-sm transition-colors border border-outline-variant/20 flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">tune</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Theme Color Accent */}
              <div className="flex items-center justify-between pt-space-2xs">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  Theme Color Accent:
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    title="Blue"
                    onClick={() => setColorTheme('blue')}
                    className={`w-6 h-6 rounded-full bg-primary transition-transform cursor-pointer ${
                      colorTheme === 'blue' ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'hover:scale-110'
                    }`}
                  />
                  <button
                    type="button"
                    title="Sky"
                    onClick={() => setColorTheme('sky')}
                    className={`w-6 h-6 rounded-full bg-secondary transition-transform cursor-pointer ${
                      colorTheme === 'sky' ? 'ring-2 ring-secondary ring-offset-2 scale-110' : 'hover:scale-110'
                    }`}
                  />
                  <button
                    type="button"
                    title="Amber"
                    onClick={() => setColorTheme('amber')}
                    className={`w-6 h-6 rounded-full bg-tertiary-container transition-transform cursor-pointer ${
                      colorTheme === 'amber' ? 'ring-2 ring-tertiary-container ring-offset-2 scale-110' : 'hover:scale-110'
                    }`}
                  />
                  <button
                    type="button"
                    title="Rose"
                    onClick={() => setColorTheme('rose')}
                    className={`w-6 h-6 rounded-full bg-error transition-transform cursor-pointer ${
                      colorTheme === 'rose' ? 'ring-2 ring-error ring-offset-2 scale-110' : 'hover:scale-110'
                    }`}
                  />
                </div>
              </div>

              {/* Primary Action Trigger Panel */}
              <div className="pt-space-xs flex flex-col sm:flex-row gap-space-xs">
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="flex-1 bg-primary text-on-primary py-2.5 px-space-md rounded-lg font-body-sm text-body-sm font-semibold hover:bg-on-primary-fixed-variant transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>Start Live Countdown</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveCurrentEvent}
                  className="bg-surface-container-high text-on-surface hover:bg-surface-variant py-2.5 px-space-md rounded-lg font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                  <span>Save Countdown</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset to Defaults"
                  className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant py-2.5 px-3 rounded-lg font-body-sm text-body-sm transition-colors flex items-center justify-center cursor-pointer border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live Countdown & Progress Dashboard (7 cols, Sticky) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md lg:sticky lg:top-20">
              {/* Live Big Display Card */}
              <div className="bg-surface-container-lowest rounded-xl shadow-lg p-space-lg flex flex-col gap-space-md overflow-hidden relative border border-outline-variant/20">
                {/* Event Status Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-2.5 w-2.5 rounded-full ${
                        mode === 'since'
                          ? 'bg-emerald-500 animate-pulse'
                          : isPast
                          ? 'bg-error'
                          : `${colorThemeStyles.bg} animate-pulse`
                      }`}
                    />
                    <span className={`font-label-caps text-label-caps uppercase tracking-wider font-semibold ${colorThemeStyles.text}`}>
                      {mode === 'since'
                        ? 'TIME ELAPSED (COUNTUP)'
                        : mode === 'business'
                        ? 'WORKING DAYS & HOURS COUNTDOWN'
                        : mode === 'annual'
                        ? 'NEXT ANNUAL RECURRENCE'
                        : isPast
                        ? 'EVENT PASSED'
                        : 'LIVE COUNTDOWN'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-data-mono text-data-mono text-on-surface-variant text-[13px]" id="live-target-badge">
                      {mode === 'since' ? 'Milestone' : 'Target'}: {targetDateDisplay} • {targetTime} Local
                    </span>
                  </div>
                </div>

                {/* Main Event Title Display */}
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold truncate">
                    {eventName || (mode === 'since' ? 'Past Milestone' : 'Untitled Countdown')}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {mode === 'since'
                      ? 'Live countup of elapsed time since your milestone'
                      : mode === 'business'
                      ? `Calculated for ${businessDays} working days at ${workHoursPerDay} hrs/day (excl. weekends)`
                      : mode === 'annual'
                      ? 'Automatic yearly anniversary countdown tracker'
                      : 'Accurately calculated down to the second in your local time'}
                  </p>
                </div>

                {/* Giant Digital Countdown Display Grid */}
                <div className="grid grid-cols-4 gap-space-xs sm:gap-space-sm py-space-xs text-center" suppressHydrationWarning>
                  {/* Days Unit */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col items-center justify-center shadow-sm border border-outline-variant/10">
                    <span className={`font-numerical-display-mobile sm:font-numerical-display text-numerical-display-mobile sm:text-numerical-display font-bold tracking-tight ${colorThemeStyles.text}`} suppressHydrationWarning>
                      {countDays}
                    </span>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant mt-1 font-semibold">
                      {mode === 'since' ? 'Days Since' : mode === 'business' ? 'Days Left' : 'Days'}
                    </span>
                  </div>

                  {/* Hours Unit */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col items-center justify-center shadow-sm border border-outline-variant/10">
                    <span className="font-numerical-display-mobile sm:font-numerical-display text-numerical-display-mobile sm:text-numerical-display text-on-surface font-bold tracking-tight" suppressHydrationWarning>
                      {String(countHours).padStart(2, '0')}
                    </span>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant mt-1 font-semibold">
                      Hours
                    </span>
                  </div>

                  {/* Minutes Unit */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col items-center justify-center shadow-sm border border-outline-variant/10">
                    <span className="font-numerical-display-mobile sm:font-numerical-display text-numerical-display-mobile sm:text-numerical-display text-on-surface font-bold tracking-tight" suppressHydrationWarning>
                      {String(countMins).padStart(2, '0')}
                    </span>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant mt-1 font-semibold">
                      Minutes
                    </span>
                  </div>

                  {/* Seconds Unit */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col items-center justify-center shadow-sm border border-outline-variant/10">
                    <span className="font-numerical-display-mobile sm:font-numerical-display text-numerical-display-mobile sm:text-numerical-display text-tertiary font-bold tracking-tight" suppressHydrationWarning>
                      {String(countSecs).padStart(2, '0')}
                    </span>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant mt-1 font-semibold">
                      Seconds
                    </span>
                  </div>
                </div>

                {/* Sub-Metrics Bar */}
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-wrap items-center justify-between gap-y-2 text-on-surface-variant font-data-mono text-data-mono text-[13px] border border-outline-variant/10" suppressHydrationWarning>
                  <span>
                    <strong className="text-on-surface font-semibold" suppressHydrationWarning>{totalWeeks}</strong> Weeks
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span>
                    <strong className="text-on-surface font-semibold" suppressHydrationWarning>{totalMonths}</strong> Months
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span>
                    <strong className="text-on-surface font-semibold" suppressHydrationWarning>{totalHours.toLocaleString()}</strong> Total Hours
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span>
                    <strong className="text-on-surface font-semibold" suppressHydrationWarning>{totalSecs.toLocaleString()}</strong> Seconds
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-2 pt-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">
                      {mode === 'since' ? 'Milestone Timeline:' : 'Time Passed:'}{' '}
                      <span className={`${colorThemeStyles.text} font-bold`}>{progressPct}%</span> Complete
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {baselineDate} → {targetDate}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden shadow-inner p-0.5">
                    <div
                      className={`h-full bg-gradient-to-r ${colorThemeStyles.gradient} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(0, parseFloat(progressPct)))}%` }}
                    />
                  </div>
                </div>

                {/* Two Helpful Insight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-2xs">
                  {mode === 'business' ? (
                    <>
                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-sm border border-outline-variant/15">
                        <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                            Total Work Hours
                          </span>
                          <span className="font-body-md text-body-md font-bold text-on-surface">
                            {totalWorkingHours.toLocaleString()} Work Hours
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Based on {workHoursPerDay} hrs/workday
                          </span>
                        </div>
                      </div>

                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-sm border border-outline-variant/15">
                        <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-on-secondary-fixed text-[20px]">work</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                            Business Days Left
                          </span>
                          <span className="font-body-md text-body-md font-bold text-on-surface">
                            {businessDays} Business Days ({workingWeeks} wks)
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Excludes {weekendDays} weekend days off
                          </span>
                        </div>
                      </div>
                    </>
                  ) : mode === 'since' ? (
                    <>
                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-sm border border-outline-variant/15">
                        <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-on-secondary-fixed text-[20px]">history</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                            Milestone Elapsed
                          </span>
                          <span className="font-body-md text-body-md font-bold text-on-surface">
                            {countDays} Days Elapsed
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            {totalWeeks} weeks • {totalMonths} months ago
                          </span>
                        </div>
                      </div>

                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-sm border border-outline-variant/15">
                        <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                            Streak / Anniversary
                          </span>
                          <span className="font-body-md text-body-md font-bold text-on-surface">
                            {totalHours.toLocaleString()} Total Hours
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Continuous real-time countup
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-sm border border-outline-variant/15">
                        <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-on-secondary-fixed text-[20px]">
                            trending_up
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                            Countdown Progress
                          </span>
                          <span className="font-body-md text-body-md font-bold text-on-surface">
                            {progressPct}% Ready
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            In the final stretch of your timeline
                          </span>
                        </div>
                      </div>

                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-sm border border-outline-variant/15">
                        <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-[20px]">work</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                            Working Days Left
                          </span>
                          <span className="font-body-md text-body-md font-bold text-on-surface">
                            {businessDays} Business Days
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Excludes {weekendDays} weekend days
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Bar */}
                <div className="pt-space-xs border-t border-outline-variant/10 flex flex-wrap items-center justify-between gap-space-xs">
                  <button
                    type="button"
                    onClick={handleCopyTicker}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg font-body-sm text-body-sm text-on-surface transition-colors shadow-sm cursor-pointer border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copyFeedback ? 'check' : 'content_copy'}
                    </span>
                    <span>{copyFeedback ? 'Copied!' : 'Copy Countdown'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportICS}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg font-body-sm text-body-sm text-on-surface transition-colors shadow-sm cursor-pointer border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                    <span>Add to Calendar (.ics)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg font-body-sm text-body-sm text-on-surface transition-colors shadow-sm cursor-pointer border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {shareFeedback ? 'check' : 'share'}
                    </span>
                    <span>{shareFeedback ? 'Link Copied!' : 'Share Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmbedModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg font-body-sm text-body-sm text-on-surface transition-colors shadow-sm cursor-pointer border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">code</span>
                    <span>Embed on Website</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Saved Countdowns Watchlist */}
        <section className="w-full bg-surface-container-low py-space-2xl border-y border-outline-variant/10">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-xs pb-space-lg">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                  Your Personal Events
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  My Saved Countdowns
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Track birthdays, vacations, weddings, and milestones all in one place — saved privately in your browser.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-lowest hover:bg-surface-container-high rounded-lg font-body-sm text-body-sm text-primary font-semibold shadow-sm transition-colors border border-outline-variant/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>+ Add Another Event</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {savedEvents.map((ev) => {
                const eventDateObj = new Date(`${ev.targetDate}T${ev.targetTime || '09:00'}:00`);
                const diffTime = eventDateObj.getTime() - now.getTime();
                const dLeft = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
                const passed = diffTime < 0;

                return (
                  <div
                    key={ev.id}
                    onClick={() => handleLoadSavedEvent(ev)}
                    className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-space-sm relative overflow-hidden group border border-outline-variant/20 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <span className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                        {ev.emoji}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-semibold">
                          {passed ? 'Passed' : ev.badge}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleToggleSavedEventNotification(ev.id, e)}
                          title={
                            ev.notificationsEnabled
                              ? 'Notifications synced (Click to mute)'
                              : 'Notifications muted (Click to sync)'
                          }
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            ev.notificationsEnabled
                              ? 'text-primary hover:text-primary/70'
                              : 'text-outline hover:text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {ev.notificationsEnabled ? 'notifications_active' : 'notifications_off'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSavedEvent(ev.id, e)}
                          title="Delete saved event"
                          className="opacity-0 group-hover:opacity-100 text-outline hover:text-error transition-opacity p-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface line-clamp-1 font-semibold">
                        {ev.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant font-data-mono">
                        Target: {ev.targetDate}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-on-surface font-bold font-data-mono">
                          {passed ? 'Event Passed' : `${dLeft} Days Left`}
                        </span>
                        <span className="text-on-surface-variant">
                          {passed ? '100%' : 'Active'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: passed ? '100%' : '65%' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Milestones & Event Roadmap */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
          <div className="flex flex-col gap-space-xs pb-space-lg">
            <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
              Stay On Schedule
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
              Event Milestones &amp; Preparation Checklist
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Stay organized and stress-free with step-by-step milestones to help you prepare before the big day arrives.
            </p>
          </div>

          {/* Timeline Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-space-sm">
            {checkpoints.map((cp, idx) => {
              const isCurrent = !cp.isPassed && (idx === 0 || checkpoints[idx - 1].isPassed);

              return (
                <div
                  key={cp.label}
                  className={`p-space-md rounded-xl shadow-sm flex flex-col justify-between space-y-space-sm border ${
                    isCurrent
                      ? 'bg-surface-container-lowest shadow-md border-primary-container'
                      : cp.isPassed
                      ? 'bg-surface-container-lowest border-outline-variant/20'
                      : 'bg-surface-container-lowest opacity-90 border-outline-variant/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-label-caps text-label-caps px-2 py-0.5 rounded font-bold ${
                        isCurrent
                          ? 'bg-primary-container text-on-primary-container'
                          : cp.isPassed
                          ? 'bg-surface-container-high text-on-surface'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {cp.label}
                    </span>
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        cp.isPassed
                          ? 'text-primary'
                          : isCurrent
                          ? 'text-primary animate-pulse'
                          : 'text-outline'
                      }`}
                    >
                      {cp.isPassed ? 'check_circle' : cp.icon}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-[17px]">
                      {cp.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 text-[13px]">
                      {cp.desc}
                    </p>
                  </div>

                  <div className="pt-space-xs font-data-mono text-data-mono text-[12px]">
                    {cp.isPassed ? (
                      <span className="text-on-surface-variant">Passed: {cp.dateStr}</span>
                    ) : isCurrent ? (
                      <span className="text-primary font-semibold">Target: {cp.dateStr} (In {cp.daysDiff}d)</span>
                    ) : (
                      <span className="text-on-surface-variant">Target: {cp.dateStr}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Plain-Language Step-by-Step Guide (SEO & Featured Snippet) */}
        <section className="w-full bg-surface-container-low py-space-3xl border-t border-outline-variant/10">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-2xl">
            {/* 4-Step Featured Snippet Card */}
            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md border border-outline-variant/20">
              <div className="flex flex-col gap-space-xs pb-space-md">
                <div className="inline-flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                    Easy How-To Guide
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  How to Count Down to Any Event in 4 Easy Steps
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-data-mono font-bold flex items-center justify-center">
                    01
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Choose Your Event
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Name your event and pick your goal, celebration, or deadline.
                  </p>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-data-mono font-bold flex items-center justify-center">
                    02
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Pick Date &amp; Time
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Select the target day and time; your local time zone is detected automatically.
                  </p>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-data-mono font-bold flex items-center justify-center">
                    03
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Track in Real Time
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Watch days, hours, minutes, and seconds tick down live down to the second.
                  </p>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-data-mono font-bold flex items-center justify-center">
                    04
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Share &amp; Set Reminders
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Save the countdown to your phone calendar or share the link with friends and family.
                  </p>
                </div>
              </div>
            </div>

            {/* Clear & Transparent Countdown Formulas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-center">
              <div className="space-y-space-sm">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                  How It Works
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  How Countdown Time is Calculated
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Simple, transparent formulas explaining how days, hours, and leap years are accurately tracked.
                </p>

                <div className="space-y-2 pt-space-xs">
                  <div className="p-3 bg-surface-container rounded-lg font-data-mono text-data-mono text-on-surface border border-outline-variant/10">
                    <span className="text-primary font-semibold">Days Left</span> = (Target Event Date − Today&apos;s Date) in Days
                  </div>
                  <div className="p-3 bg-surface-container rounded-lg font-data-mono text-data-mono text-on-surface border border-outline-variant/10">
                    <span className="text-primary font-semibold">Total Hours Remaining</span> = (Days Left × 24) + Remaining Hours
                  </div>
                  <div className="p-3 bg-surface-container rounded-lg font-data-mono text-data-mono text-on-surface border border-outline-variant/10">
                    <span className="text-primary font-semibold">Progress %</span> = (Time Already Passed ÷ Total Timeline Duration) × 100
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-md border border-outline-variant/20">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span className="material-symbols-outlined">verified</span>
                  <span className="font-body-md text-body-md font-semibold">Leap Year &amp; Calendar Accuracy</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Leap years happen every 4 years and add February 29th (366 days total). Century years like 2100 are not leap years unless divisible by 400. SolveIt Calculator automatically handles leap years, month length differences, and daylight saving time transitions so your countdown never drifts.
                </p>
                <div className="bg-surface-container-low p-4 rounded-lg font-body-sm text-body-sm text-on-surface leading-relaxed border border-outline-variant/10">
                  <p className="font-medium text-primary mb-1">Guaranteed Precision:</p>
                  <p className="text-on-surface-variant">
                    Whether counting across daylight saving time changes in spring and autumn, or through multi-year anniversary milestones, your timer remains accurate to the exact second.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Reliable, transparent timing for personal events and professional milestones.</span>
                </div>
              </div>
            </div>

            {/* 8 Real-World Countdown Scenarios */}
            <div className="space-y-space-md">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                  Practical Applications
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  8 Real-World Countdown Scenarios
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  How people and teams count down to meaningful moments:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {[
                  { emoji: '💍', title: 'Wedding Planning', desc: 'Keep bridal party, venue preparations, caterers, and floral deliveries perfectly timed.' },
                  { emoji: '🌴', title: 'Vacation & Travel', desc: 'Count down to holiday departure, flight check-ins, and hotel arrival dates.' },
                  { emoji: '🚀', title: 'Product Launch Deadlines', desc: 'Coordinate team tasks, marketing campaigns, and go-live launch dates.' },
                  { emoji: '📚', title: 'Exams & Certifications', desc: 'Pace your study schedule for the CFA, Bar Exam, MCAT, or university finals.' },
                  { emoji: '📈', title: 'Retirement & FIRE', desc: 'Celebrate reaching financial independence and your planned retirement transition day.' },
                  { emoji: '👶', title: 'Baby Due Date & Pregnancy', desc: 'Track your 40-week pregnancy journey, nursery setup, and baby shower timelines.' },
                  { emoji: '📑', title: 'Contract & Lease Renewals', desc: 'Stay ahead of apartment leases, insurance expirations, and subscription renewals.' },
                  { emoji: '🛂', title: 'Visa & Travel Day Limits', desc: 'Monitor tourist visa periods like the Schengen 90-day rule to travel with peace of mind.' },
                ].map((item) => (
                  <div key={item.title} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-2xs border border-outline-variant/20">
                    <div className="text-2xl">{item.emoji}</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-[17px]">
                      {item.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Matrix Table */}
            <div className="space-y-space-md">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                  Feature Comparison
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  SolveIt vs Alternative Countdown Methods
                </h2>
              </div>

              <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-x-auto border border-outline-variant/20">
                <table className="w-full text-left border-collapse font-body-sm text-body-sm">
                  <thead>
                    <tr className="bg-surface-container text-on-surface border-b border-outline-variant/20">
                      <th className="p-4 font-semibold">Feature / Benefit</th>
                      <th className="p-4 font-semibold text-primary">SolveIt Calculator</th>
                      <th className="p-4 font-semibold text-on-surface-variant">Phone Clock / Alarm</th>
                      <th className="p-4 font-semibold text-on-surface-variant">Paper Calendar</th>
                      <th className="p-4 font-semibold text-on-surface-variant">Excel Spreadsheets</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 font-medium">Second-by-Second Live Timer</td>
                      <td className="p-4 text-primary font-semibold">Yes (Real-time live)</td>
                      <td className="p-4 text-on-surface-variant">Minutes only</td>
                      <td className="p-4 text-on-surface-variant">Days only</td>
                      <td className="p-4 text-on-surface-variant">Requires manual refresh</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 font-medium">Milestone Progress Bar</td>
                      <td className="p-4 text-primary font-semibold">Visual percentage bar</td>
                      <td className="p-4 text-on-surface-variant">None</td>
                      <td className="p-4 text-on-surface-variant">Manual drawing</td>
                      <td className="p-4 text-on-surface-variant">Requires complex formulas</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 font-medium">Working Days Exclusion</td>
                      <td className="p-4 text-primary font-semibold">1-Click Toggle</td>
                      <td className="p-4 text-on-surface-variant">No</td>
                      <td className="p-4 text-on-surface-variant">Manual cross-out</td>
                      <td className="p-4 text-on-surface-variant">Complex formulas needed</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 font-medium">100% Privacy (Zero Tracking)</td>
                      <td className="p-4 text-primary font-semibold">100% In-Browser Private</td>
                      <td className="p-4 text-on-surface-variant">Linked to cloud account</td>
                      <td className="p-4 text-on-surface-variant">Private (Physical)</td>
                      <td className="p-4 text-on-surface-variant">Varies (Cloud SaaS)</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 font-medium">Add to Google/Apple Calendar</td>
                      <td className="p-4 text-primary font-semibold">Instant .ICS Export</td>
                      <td className="p-4 text-on-surface-variant">Manual entry</td>
                      <td className="p-4 text-on-surface-variant">None</td>
                      <td className="p-4 text-on-surface-variant">Requires complex scripts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Frequently Asked Questions (FAQ) */}
            <div className="space-y-space-md">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                  Frequently Asked Questions
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  Time &amp; Countdown FAQs
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm" id="faq-container">
                {[
                  {
                    q: 'How does daylight saving time affect my countdown?',
                    a: 'SolveIt Calculator automatically takes daylight saving time transitions into account based on your selected time zone. Whether clocks "spring forward" or "fall back" between today and your event, your countdown stays accurate to the exact minute and second.',
                  },
                  {
                    q: 'Does this countdown tool save any of my personal event information?',
                    a: 'No. All countdown calculations and saved event lists are stored 100% privately in your web browser. No dates, titles, or personal details are ever transmitted or stored on external servers.',
                  },
                  {
                    q: 'Can I count only business days instead of total calendar days?',
                    a: 'Yes! Simply turn on the "Count only business days (skip weekends)" option in the settings. The calculator will automatically exclude all Saturdays and Sundays so you know your exact working days left.',
                  },
                  {
                    q: 'What happens when the countdown hits zero?',
                    a: 'When the timer reaches zero, a celebration screen appears, and an optional sound or notification is played if you enabled it. The timer will then automatically count days elapsed since your big day arrived.',
                  },
                  {
                    q: 'Can I embed this countdown timer on my website or blog?',
                    a: 'Yes. Click the "Embed on Website" button under your live countdown to copy a clean, responsive code snippet that works smoothly on WordPress, Squarespace, Wix, Notion, or custom HTML sites.',
                  },
                  {
                    q: 'Can I share my live countdown link with friends, family, or coworkers?',
                    a: 'Yes! Click "Share Link" to generate a direct link. The event name and date are encoded securely in the URL link itself, allowing recipients to view your live countdown instantly on any device without creating an account.',
                  },
                ].map((faq, i) => (
                  <div
                    key={faq.q}
                    className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20"
                  >
                    <h4 className="font-headline-md text-headline-md text-on-surface font-semibold text-[17px]">
                      {faq.q}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant pt-2 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dedicated Hubs Direct Links */}
            <div className="space-y-space-sm">
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                Dedicated Hubs
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Popular Event Trackers
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-xs">
                {[
                  { emoji: '🎆', name: `New Year ${now.getFullYear() + 1}`, preset: 'newyear' },
                  { emoji: '🎄', name: 'Christmas Day', preset: 'christmas' },
                  { emoji: '💍', name: 'Wedding Day', preset: 'wedding' },
                  { emoji: '🏖️', name: 'Vacation Timer', preset: 'summer' },
                  { emoji: '🌴', name: 'Retirement Day', preset: 'retirement' },
                  { emoji: '📅', name: 'Days Until Date', preset: 'launch' },
                ].map((hub) => (
                  <button
                    key={hub.name}
                    type="button"
                    onClick={() => {
                      handleSelectPreset(hub.preset);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className="p-3 bg-surface-container-lowest hover:bg-surface-container rounded-lg text-center font-body-sm text-body-sm text-on-surface shadow-sm transition-colors block border border-outline-variant/20 cursor-pointer"
                  >
                    <div className="text-xl mb-1">{hub.emoji}</div>
                    <div className="font-semibold">{hub.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contextual Internal Linking Grid */}
            <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm space-y-space-sm border border-outline-variant/20">
              <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Explore Related Temporal Calculators
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-xs font-body-sm text-body-sm">
                <Link className="text-primary hover:underline flex items-center gap-1" href="/time-date/days-between-dates">
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  <span>Date Difference Calculator</span>
                </Link>
                <Link className="text-primary hover:underline flex items-center gap-1" href="/time-date/add-subtract-time">
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  <span>Add / Subtract Time</span>
                </Link>
                <Link className="text-primary hover:underline flex items-center gap-1" href="/time-date/work-hours">
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  <span>Work Hours &amp; Payroll</span>
                </Link>
                <Link className="text-primary hover:underline flex items-center gap-1" href="/time-date/time-zone-overlap">
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  <span>Time Zone Sync</span>
                </Link>
                <Link className="text-primary hover:underline flex items-center gap-1" href="/time-date/plan-a-project-calculator">
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  <span>Project Planner</span>
                </Link>
                <Link className="text-primary hover:underline flex items-center gap-1" href="/time-date/age-calculator">
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  <span>Age Calculator</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Embed Modal Dialog */}
      {embedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-lg w-full p-6 flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">code</span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Embed Countdown Widget
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEmbedModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Paste this responsive HTML iframe snippet into your website, WordPress, Notion, or blog to display your live countdown:
            </p>

            <textarea
              readOnly
              rows={4}
              value={`<iframe src="https://solveitcalculator.com/time-date/event-countdown/?title=${encodeURIComponent(eventName)}&date=${targetDate}&time=${targetTime}" width="100%" height="450" frameborder="0" style="border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;"></iframe>`}
              className="w-full bg-surface-container font-data-mono text-data-mono text-xs p-3 rounded-lg border border-outline-variant/20 focus:outline-none select-all"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEmbedModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `<iframe src="https://solveitcalculator.com/time-date/event-countdown/?title=${encodeURIComponent(eventName)}&date=${targetDate}&time=${targetTime}" width="100%" height="450" frameborder="0" style="border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;"></iframe>`
                  );
                  setEmbedCopied(true);
                  setTimeout(() => setEmbedCopied(false), 2000);
                }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {embedCopied ? 'check' : 'content_copy'}
                </span>
                <span>{embedCopied ? 'Copied Snippet!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Event Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCustomEventSubmit}
            className="bg-surface-container-lowest rounded-xl shadow-xl max-w-md w-full p-6 flex flex-col gap-4 border border-outline-variant/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">add_circle</span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Add New Event to Watchlist
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body-sm text-body-sm font-medium text-on-surface">Event Title</label>
              <input
                type="text"
                required
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                placeholder="e.g. Trip to Hawaii, Graduation Day"
                className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2 rounded-lg border border-outline-variant/20 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-body-sm text-body-sm font-medium text-on-surface">Event Date</label>
                <input
                  type="date"
                  required
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono px-3 py-2 rounded-lg border border-outline-variant/20 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body-sm text-body-sm font-medium text-on-surface">Emoji Icon</label>
                <select
                  value={newEventEmoji}
                  onChange={(e) => setNewEventEmoji(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2 rounded-lg border border-outline-variant/20 focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="🎉">🎉 Celebration</option>
                  <option value="🏖️">🏖️ Vacation</option>
                  <option value="💍">💍 Wedding</option>
                  <option value="🎂">🎂 Birthday</option>
                  <option value="🚀">🚀 Launch</option>
                  <option value="📚">📚 Exam</option>
                  <option value="🌴">🌴 Retirement</option>
                  <option value="👶">👶 Baby</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer border border-outline-variant/15">
              <input
                type="checkbox"
                checked={newEventNotifications}
                onChange={(e) => setNewEventNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
              <span className="font-body-sm text-body-sm text-on-surface">
                Enable synchronized browser alerts for this event
              </span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Add Event</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notification Settings Modal */}
      {notificationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-lg w-full p-6 flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                </span>
                <div>
                  <h3 className="font-headline-md text-base font-semibold text-on-surface">
                    Notification &amp; Alert Settings
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Configure when and how your browser alerts you
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotificationModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Main Master Switch */}
            <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/15">
              <div>
                <span className="font-body-sm text-body-sm font-semibold text-on-surface block">
                  Master Notification Sync
                </span>
                <span className="text-xs text-on-surface-variant">
                  {notificationPermission === 'granted'
                    ? 'Browser permissions active'
                    : 'Requires browser permission acceptance'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.enabled}
                onChange={(e) => {
                  const updated = { ...notificationSettings, enabled: e.target.checked };
                  persistNotificationSettings(updated);
                  if (e.target.checked && notificationPermission !== 'granted') {
                    requestNotificationPermission();
                  }
                }}
                className="w-5 h-5 rounded text-primary accent-primary cursor-pointer"
              />
            </div>

            {/* Alert Thresholds Checklist */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                Alert Triggers &amp; Intervals
              </span>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">celebration</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    When countdown reaches zero (T-0 Event Day)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.atZero}
                  onChange={(e) =>
                    persistNotificationSettings({
                      ...notificationSettings,
                      atZero: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    1 Hour before event begins
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.oneHour}
                  onChange={(e) =>
                    persistNotificationSettings({
                      ...notificationSettings,
                      oneHour: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">today</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    24 Hours (1 Day) before event
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.twentyFourHours}
                  onChange={(e) =>
                    persistNotificationSettings({
                      ...notificationSettings,
                      twentyFourHours: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">calendar_view_week</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    7 Days (1 Week) before event
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.sevenDays}
                  onChange={(e) =>
                    persistNotificationSettings({
                      ...notificationSettings,
                      sevenDays: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">flag</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Milestone checkpoints (25%, 50%, 75%, 90%)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.milestones}
                  onChange={(e) =>
                    persistNotificationSettings({
                      ...notificationSettings,
                      milestones: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">volume_up</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Play chime sound with notifications
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.sound}
                  onChange={(e) =>
                    persistNotificationSettings({
                      ...notificationSettings,
                      sound: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
              </label>
            </div>

            {/* Test & Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
              <button
                type="button"
                onClick={handleTestNotification}
                className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold shadow-sm transition-colors border border-outline-variant/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">send</span>
                <span>{testNotifSuccess ? 'Test Sent!' : 'Send Test Alert'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNotificationModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-body-sm text-body-sm font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating System Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-surface-container-lowest text-on-surface px-4 py-3 rounded-xl shadow-2xl border border-outline-variant/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-primary text-[22px]">info</span>
          <p className="text-xs font-medium leading-snug flex-1">{toastMessage}</p>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </main>
  );
}
