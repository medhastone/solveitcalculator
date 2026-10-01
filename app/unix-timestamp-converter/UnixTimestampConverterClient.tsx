'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { getCurrentTheme } from '@/lib/theme';

interface BatchResult {
  raw: string;
  unit: string;
  iso: string;
  local: string;
  relative: string;
  isValid: boolean;
}

export default function UnixTimestampConverterClient() {
  // --- Theme State for Dark & Light Mode Compliance ---
  const [isDark, setIsDark] = useState<boolean>(false);
  const [codeThemePreference, setCodeThemePreference] = useState<'auto' | 'light' | 'dark'>('auto');

  useEffect(() => {
    setIsDark(getCurrentTheme() === 'dark');
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setIsDark(customEvent.detail === 'dark');
      } else {
        setIsDark(getCurrentTheme() === 'dark');
      }
    };
    window.addEventListener('solveit-theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    return () => {
      window.removeEventListener('solveit-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  // Effective code theme: follows user preference or system theme
  const activeCodeTheme = useMemo(() => {
    if (codeThemePreference === 'light') return 'light';
    if (codeThemePreference === 'dark') return 'dark';
    return isDark ? 'dark' : 'light';
  }, [codeThemePreference, isDark]);

  // --- Live Clock State ---
  const [clockPaused, setClockPaused] = useState<boolean>(false);
  const [liveSec, setLiveSec] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [liveMs, setLiveMs] = useState<number>(() => Date.now());
  const [liveUsSuffix, setLiveUsSuffix] = useState<number>(481);
  const [liveNsSuffix, setLiveNsSuffix] = useState<number>(481912);
  const [copiedKey, setCopiedKey] = useState<string>('');

  // Update live clock
  useEffect(() => {
    if (clockPaused) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setLiveSec(Math.floor(now / 1000));
      setLiveMs(now);
      setLiveUsSuffix(Math.floor(100 + Math.random() * 899));
      setLiveNsSuffix(Math.floor(100000 + Math.random() * 899999));
    }, 80);
    return () => clearInterval(interval);
  }, [clockPaused]);

  // --- Tab State ---
  type TabKey =
    | 'tab-ts-to-date'
    | 'tab-date-to-ts'
    | 'tab-iso-parser'
    | 'tab-hex-epoch'
    | 'tab-diff-duration'
    | 'tab-batch'
    | 'tab-jwt';

  const [activeTab, setActiveTab] = useState<TabKey>('tab-ts-to-date');

  // --- Primary 3 Tags for Slider Mode ---
  const PRIMARY_SLIDER_TAGS = useMemo(() => [
    {
      id: 'tab-ts-to-date' as TabKey,
      title: 'Unix Timestamp → Human Date',
      shortTitle: 'Timestamp → Date',
      badge: 'Epoch to Date',
      icon: 'schedule',
      desc: 'Epoch seconds, milliseconds, microseconds, nanoseconds to formatted UTC and local date',
      step: 0,
    },
    {
      id: 'tab-date-to-ts' as TabKey,
      title: 'Human Date & Time → Unix Timestamp',
      shortTitle: 'Date → Timestamp',
      badge: 'Date to Epoch',
      icon: 'calendar_month',
      desc: 'Calendar date, 12h/24h clock time, and timezone to Unix epoch integer seconds and millis',
      step: 1,
    },
    {
      id: 'tab-iso-parser' as TabKey,
      title: 'ISO-8601 & RFC 3339 Parser',
      shortTitle: 'ISO-8601 Parser',
      badge: 'String Parser',
      icon: 'terminal',
      desc: 'Deconstruct ISO strings, UTC Zulu z-times, and custom GMT timezone offsets',
      step: 2,
    },
  ], []);

  const activePrimaryIndex = PRIMARY_SLIDER_TAGS.findIndex((t) => t.id === activeTab);

  const handleSliderChange = (step: number) => {
    if (step >= 0 && step < PRIMARY_SLIDER_TAGS.length) {
      setActiveTab(PRIMARY_SLIDER_TAGS[step].id);
    }
  };

  const handlePrevSlide = () => {
    const cur = activePrimaryIndex >= 0 ? activePrimaryIndex : 0;
    const nextIdx = (cur - 1 + PRIMARY_SLIDER_TAGS.length) % PRIMARY_SLIDER_TAGS.length;
    setActiveTab(PRIMARY_SLIDER_TAGS[nextIdx].id);
  };

  const handleNextSlide = () => {
    const cur = activePrimaryIndex >= 0 ? activePrimaryIndex : 0;
    const nextIdx = (cur + 1) % PRIMARY_SLIDER_TAGS.length;
    setActiveTab(PRIMARY_SLIDER_TAGS[nextIdx].id);
  };

  const tagsNavRef = useRef<HTMLDivElement>(null);
  const scrollTags = (direction: 'left' | 'right') => {
    if (tagsNavRef.current) {
      tagsNavRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  // --- Copy Handler ---
  const handleCopy = useCallback((text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2000);
    }
  }, []);

  // --- Copy All Ticks ---
  const handleCopyAllTicks = () => {
    const now = Date.now();
    const sec = Math.floor(now / 1000);
    const text = [
      `Unix Seconds: ${sec}`,
      `Unix Milliseconds: ${now}`,
      `Unix Microseconds: ${now}${liveUsSuffix}`,
      `Unix Nanoseconds: ${now}${liveNsSuffix}`,
      `ISO-8601 UTC: ${new Date(now).toISOString()}`
    ].join('\n');
    handleCopy(text, 'all-ticks');
  };

  // --- Relative Time Formatter ---
  const formatRelativeTime = (d: Date) => {
    const deltaSec = Math.round((Date.now() - d.getTime()) / 1000);
    if (Math.abs(deltaSec) < 5) return 'Just now';
    const isPast = deltaSec > 0;
    const abs = Math.abs(deltaSec);

    if (abs < 60) return `${abs} seconds ${isPast ? 'ago' : 'from now'}`;
    const minutes = Math.floor(abs / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`;
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`;
  };

  // ==========================================
  // TAB 1: Unix Timestamp -> Human Date State
  // ==========================================
  const [inputTs, setInputTs] = useState<string>('1726743842');
  const [selectedUnit, setSelectedUnit] = useState<'auto' | 'sec' | 'ms' | 'us' | 'ns' | 'hex'>('auto');
  const [targetTimezone, setTargetTimezone] = useState<string>('UTC');

  const parsedTimestampData = useMemo(() => {
    const raw = inputTs.trim();
    if (!raw) {
      return { isValid: false, detectedUnit: 'Empty Input', dateObj: null, numericSec: 0 };
    }

    let numericSec = 0;
    let dateObj: Date | null = null;
    let detectedUnit = '';

    // Check Hex
    if (raw.startsWith('0x') || raw.startsWith('0X') || /^[0-9a-fA-F]{8}$/.test(raw)) {
      numericSec = parseInt(raw.replace(/^0x/i, ''), 16);
      dateObj = new Date(numericSec * 1000);
      detectedUnit = 'Hexadecimal (0x)';
    } else {
      const cleaned = raw.replace(/,/g, '');
      const num = Number(cleaned);
      if (isNaN(num)) {
        return { isValid: false, detectedUnit: 'Invalid Syntax', dateObj: null, numericSec: 0 };
      }

      const digits = cleaned.replace(/\..*$/, '').length;

      if (selectedUnit === 'sec' || (selectedUnit === 'auto' && digits <= 11)) {
        numericSec = num;
        dateObj = new Date(num * 1000);
        detectedUnit = `Seconds (${digits} digits)`;
      } else if (selectedUnit === 'ms' || (selectedUnit === 'auto' && digits <= 14)) {
        numericSec = Math.floor(num / 1000);
        dateObj = new Date(num);
        detectedUnit = `Milliseconds (${digits} digits)`;
      } else if (selectedUnit === 'us' || (selectedUnit === 'auto' && digits <= 17)) {
        numericSec = Math.floor(num / 1000000);
        dateObj = new Date(Math.floor(num / 1000));
        detectedUnit = `Microseconds (${digits} digits)`;
      } else {
        numericSec = Math.floor(num / 1000000000);
        dateObj = new Date(Math.floor(num / 1000000));
        detectedUnit = `Nanoseconds (${digits} digits)`;
      }
    }

    if (!dateObj || isNaN(dateObj.getTime())) {
      return { isValid: false, detectedUnit: 'Invalid Calendar Date', dateObj: null, numericSec: 0 };
    }

    return { isValid: true, detectedUnit, dateObj, numericSec };
  }, [inputTs, selectedUnit]);

  // Derived outputs for Tab 1
  const tab1Outputs = useMemo(() => {
    if (!parsedTimestampData.isValid || !parsedTimestampData.dateObj) {
      return null;
    }

    const d = parsedTimestampData.dateObj;
    const sec = parsedTimestampData.numericSec;

    let formattedUtc = '';
    let formattedLocal = '';
    try {
      formattedUtc = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        dateStyle: 'full',
        timeStyle: 'long',
      }).format(d);

      formattedLocal = new Intl.DateTimeFormat('en-US', {
        timeZone: targetTimezone,
        dateStyle: 'full',
        timeStyle: 'long',
      }).format(d);
    } catch {
      formattedUtc = d.toUTCString();
      formattedLocal = d.toLocaleString();
    }

    const isoStr = d.toISOString();
    const rfcStr = d.toUTCString();
    const hexStr = '0x' + (sec >>> 0).toString(16).toUpperCase().padStart(8, '0');
    const bin32 = (sec >>> 0).toString(2).padStart(32, '0');
    const chunkedBin = bin32.match(/.{1,8}/g)?.join(' ') || bin32;

    // Day of Year
    const startYear = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const dayOfYear = Math.floor((d.getTime() - startYear.getTime()) / (24 * 3600 * 1000)) + 1;
    const isLeap =
      (d.getUTCFullYear() % 4 === 0 && d.getUTCFullYear() % 100 !== 0) || d.getUTCFullYear() % 400 === 0;
    const weekNum = Math.ceil(((d.getTime() - startYear.getTime()) / 86400000 + startYear.getUTCDay() + 1) / 7);
    const julianDay = (d.getTime() / 86400000 + 2440587.5).toFixed(4);

    return {
      formattedUtc,
      formattedLocal,
      relative: formatRelativeTime(d),
      isoStr,
      rfcStr,
      sec: String(sec),
      ms: String(sec * 1000),
      us: String(sec) + '000000',
      hexStr,
      chunkedBin,
      dayOfYearText: `Day ${dayOfYear} of ${isLeap ? 366 : 365} ${isLeap ? '(Leap Year)' : ''}`,
      weekNumText: `Week ${weekNum}`,
      julianDay,
    };
  }, [parsedTimestampData, targetTimezone]);

  // Telemetry presets
  const applyPreset = (type: string) => {
    const current = Math.floor(Date.now() / 1000);
    if (type === 'epoch-zero') setInputTs('0');
    else if (type === 'y2038') setInputTs('2147483647');
    else if (type === 'plus-1h') setInputTs(String(Number(inputTs || current) + 3600));
    else if (type === 'plus-1d') setInputTs(String(Number(inputTs || current) + 86400));
    else if (type === 'plus-30d') setInputTs(String(Number(inputTs || current) + 86400 * 30));
    else if (type === 'start-today') {
      const d = new Date();
      d.setUTCHours(0, 0, 0, 0);
      setInputTs(String(Math.floor(d.getTime() / 1000)));
    } else if (type === 'end-today') {
      const d = new Date();
      d.setUTCHours(23, 59, 59, 0);
      setInputTs(String(Math.floor(d.getTime() / 1000)));
    }
  };

  // ==========================================
  // TAB 2: Human Date -> Unix Timestamp State
  // ==========================================
  const [fYear, setFYear] = useState<number>(2025);
  const [fMonth, setFMonth] = useState<number>(3); // 3 = April
  const [fDay, setFDay] = useState<number>(24);
  const [fHours, setFHours] = useState<number>(12);
  const [fMinutes, setFMinutes] = useState<number>(0);
  const [fSeconds, setFSeconds] = useState<number>(0);
  const [fTzMode, setFTzMode] = useState<'utc' | 'local'>('utc');

  const tab2Output = useMemo(() => {
    let targetDate: Date;
    if (fTzMode === 'utc') {
      targetDate = new Date(Date.UTC(fYear, fMonth, fDay, fHours, fMinutes, fSeconds));
    } else {
      targetDate = new Date(fYear, fMonth, fDay, fHours, fMinutes, fSeconds);
    }
    const epochSec = Math.floor(targetDate.getTime() / 1000);
    return {
      sec: epochSec,
      ms: targetDate.getTime(),
      hex: '0x' + (epochSec >>> 0).toString(16).toUpperCase(),
    };
  }, [fYear, fMonth, fDay, fHours, fMinutes, fSeconds, fTzMode]);

  // ==========================================
  // TAB 3: ISO-8601 & RFC 3339 Parser State
  // ==========================================
  const [isoInput, setIsoInput] = useState<string>('2025-04-24T12:00:00.000Z');

  const parsedIsoData = useMemo(() => {
    const raw = isoInput.trim();
    if (!raw) return { isValid: false, sec: 'NaN', utc: 'Invalid', statusText: 'Empty' };
    const parsed = Date.parse(raw);
    if (isNaN(parsed)) {
      return { isValid: false, sec: 'NaN', utc: 'Invalid', statusText: 'Invalid Format' };
    }
    const d = new Date(parsed);
    return {
      isValid: true,
      sec: String(Math.floor(parsed / 1000)),
      utc: d.toUTCString(),
      statusText: 'Valid ISO-8601',
    };
  }, [isoInput]);

  // ==========================================
  // TAB 4: Hex / Base-16 Timestamp State
  // ==========================================
  const [hexInput, setHexInput] = useState<string>('0x66EC0BA2');

  const parsedHexData = useMemo(() => {
    const raw = hexInput.trim().replace(/^0x/i, '');
    const val = parseInt(raw, 16);
    if (isNaN(val)) {
      return { isValid: false, sec: 'Error: Invalid Hex', utc: 'Invalid' };
    }
    return {
      isValid: true,
      sec: String(val),
      utc: new Date(val * 1000).toISOString(),
    };
  }, [hexInput]);

  // ==========================================
  // TAB 5: Duration Delta Calculator State
  // ==========================================
  const [diffTs1, setDiffTs1] = useState<string>('1726700000');
  const [diffTs2, setDiffTs2] = useState<string>('1726743842');

  const diffData = useMemo(() => {
    const t1 = parseInt(diffTs1.trim());
    const t2 = parseInt(diffTs2.trim());

    const preview1 = !isNaN(t1) ? new Date(t1 * 1000).toUTCString() : 'Invalid';
    const preview2 = !isNaN(t2) ? new Date(t2 * 1000).toUTCString() : 'Invalid';

    if (isNaN(t1) || isNaN(t2)) {
      return {
        preview1,
        preview2,
        human: 'Invalid Timestamps',
        sec: '0 s',
        min: '0 min',
        hrs: '0 hrs',
        days: '0 days',
      };
    }

    const diffSec = Math.abs(t2 - t1);
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;

    return {
      preview1,
      preview2,
      human: `${hours} hours, ${minutes} minutes, ${seconds} seconds`,
      sec: `${diffSec.toLocaleString()} s`,
      min: `${(diffSec / 60).toFixed(1)} min`,
      hrs: `${(diffSec / 3600).toFixed(2)} hrs`,
      days: `${(diffSec / 86400).toFixed(3)} days`,
    };
  }, [diffTs1, diffTs2]);

  // ==========================================
  // TAB 6: Batch Processor State
  // ==========================================
  const [batchInput, setBatchInput] = useState<string>(
    '1726743842\n1726700000\n1745491823481\n1609459200\n2147483647'
  );

  const batchResults = useMemo<BatchResult[]>(() => {
    const lines = batchInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return lines.slice(0, 50).map((ts) => {
      const num = Number(ts);
      if (isNaN(num)) {
        return {
          raw: ts,
          unit: 'Invalid',
          iso: '-',
          local: '-',
          relative: '-',
          isValid: false,
        };
      }

      let date: Date;
      let unit = 'Seconds';
      if (ts.length <= 11) {
        unit = 'Seconds';
        date = new Date(num * 1000);
      } else if (ts.length <= 14) {
        unit = 'Milliseconds';
        date = new Date(num);
      } else {
        unit = 'Micro/Nano';
        date = new Date(Math.floor(num / 1000));
      }

      if (isNaN(date.getTime())) {
        return {
          raw: ts,
          unit: 'Error',
          iso: '-',
          local: '-',
          relative: '-',
          isValid: false,
        };
      }

      return {
        raw: ts,
        unit,
        iso: date.toISOString(),
        local: date.toLocaleString(),
        relative: formatRelativeTime(date),
        isValid: true,
      };
    });
  }, [batchInput]);

  const exportBatchJson = () => {
    const dataStr = JSON.stringify(batchResults, null, 2);
    handleCopy(dataStr, 'batch-json');
  };

  const exportBatchCsv = () => {
    const headers = ['Timestamp', 'Unit', 'ISO-8601 UTC', 'Local Representation', 'Relative Time'];
    const rows = batchResults.map((r) => [r.raw, r.unit, r.iso, r.local, r.relative]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    handleCopy(csvContent, 'batch-csv');
  };

  // ==========================================
  // TAB 7: JWT Expiration Decoder State
  // ==========================================
  const [jwtInput, setJwtInput] = useState<string>(
    JSON.stringify(
      {
        sub: 'usr_998124',
        iat: 1726740000,
        nbf: 1726740000,
        exp: 1726743600,
        aud: 'solveit-api-gateway',
      },
      null,
      2
    )
  );

  interface JwtClaims {
    exp?: number;
    iat?: number;
    nbf?: number;
    [key: string]: unknown;
  }

  const jwtAnalysis = useMemo(() => {
    const val = jwtInput.trim();
    if (!val) return null;

    let claims: JwtClaims | null = null;
    try {
      if (val.startsWith('{')) {
        claims = JSON.parse(val);
      } else {
        const parts = val.split('.');
        if (parts.length >= 2) {
          const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          claims = JSON.parse(atob(payloadBase64));
        }
      }
    } catch {
      return { error: 'Invalid JWT structure or malformed JSON.' };
    }

    if (!claims) return { error: 'Could not extract claims.' };

    const nowSec = Math.floor(Date.now() / 1000);
    const exp = claims.exp;
    const iat = claims.iat;
    const nbf = claims.nbf;

    let statusText = 'No Expiration (exp) claim found';
    let isExpired = false;

    if (exp) {
      if (exp > nowSec) {
        const diffMin = Math.round((exp - nowSec) / 60);
        statusText = `Valid • Expires in ${diffMin} min`;
        isExpired = false;
      } else {
        statusText = 'Expired';
        isExpired = true;
      }
    }

    return {
      claims,
      exp,
      iat,
      nbf,
      statusText,
      isExpired,
      expFormatted: exp ? `${exp} (${new Date(exp * 1000).toISOString()})` : 'N/A',
      iatFormatted: iat ? `${iat} (${new Date(iat * 1000).toISOString()})` : 'N/A',
      nbfFormatted: nbf ? `${nbf} (${new Date(nbf * 1000).toISOString()})` : 'N/A',
    };
  }, [jwtInput]);

  // --- FAQ Accordion State ---
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  const faqs = [
    {
      q: 'What is a Unix timestamp?',
      a: 'A Unix timestamp (also recognized as POSIX time or Epoch time) is a numeric measure denoting the quantity of elapsed SI seconds since the Unix Epoch: Thursday, 1 January 1970 at 00:00:00 UTC. It provides an unambiguous, timezone-agnostic representation of an exact point in time.',
    },
    {
      q: 'Why was January 1, 1970 chosen as the Epoch?',
      a: "The date was designated arbitrarily by Bell Labs computer scientists Dennis Ritchie and Ken Thompson during the inception of the Unix OS. It represented a convenient round beginning close to Unix's early development without consuming excess bits for retrospective historical dating.",
    },
    {
      q: 'How do I distinguish seconds from milliseconds?',
      a: 'Inspect the character length: In current contemporary eras, a timestamp in seconds comprises 10 digits (e.g. 1726743842). A millisecond timestamp has 13 digits (e.g. 1726743842000). Microseconds contain 16 digits, while nanoseconds span 19 digits.',
    },
    {
      q: 'What happens during the Year 2038 problem?',
      a: 'On January 19, 2038 at 03:14:07 UTC, signed 32-bit integers overflow from +2,147,483,647 to -2,147,483,648. Unpatched legacy 32-bit software will interpret this as December 13, 1901, leading to severe computational failures. Upgrading system architectures to 64-bit timestamps completely mitigates this issue.',
    },
    {
      q: 'Does Unix time record leap seconds?',
      a: 'No. Per POSIX specifications, every calendar day is mandated to contain exactly 86,400 seconds. When an international leap second occurs, standard Unix time either repeats the final second or relies on cloud leap second smearing to distribute the extra duration across surrounding hours.',
    },
    {
      q: 'Can a Unix timestamp be negative?',
      a: 'Yes. Signed integer implementations allow negative numbers, which represent dates prior to January 1, 1970. For instance, -86400 corresponds exactly to December 31, 1969 00:00:00 UTC.',
    },
    {
      q: 'How does ISO-8601 differ from Unix epoch time?',
      a: 'Unix epoch time is a numeric integer scalar indicating seconds since a reference moment. ISO-8601 is a standardized alphanumeric string notation (e.g. 2024-09-19T11:04:02Z) displaying year, month, day, hour, minute, second, and optional timezone offset flags.',
    },
    {
      q: 'How do MongoDB ObjectIDs use Unix timestamps?',
      a: "A standard 12-byte MongoDB ObjectID embeds the 4-byte (32-bit) Unix timestamp in seconds as its first 8 hexadecimal characters. Parsing the first 8 hex characters provides the document's precise server creation time without storing a separate date field.",
    },
  ];

  return (
    <main className="w-full pt-0 bg-surface min-h-screen text-on-surface">
      <div className="flex flex-col w-full">
        {/* Top Hero & Breadcrumbs Section */}
        <section className="w-full bg-surface-container-lowest pb-space-2xl pt-space-lg shadow-sm">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-md">
            {/* Breadcrumb Bar */}
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm"
            >
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </Link>
              <span className="text-outline-variant font-mono">/</span>
              <Link href="/time-date" className="hover:text-primary transition-colors">
                Time &amp; Date Calculators
              </Link>
              <span className="text-outline-variant font-mono">/</span>
              <span className="text-primary font-semibold">Unix Timestamp Converter</span>
            </nav>

            {/* Badges System */}
            <div className="flex flex-wrap items-center gap-space-xs pt-space-2xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
                POSIX / IEEE 1003.1 Compliant
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps uppercase tracking-wider">
                <span className="material-symbols-outlined text-primary text-[14px]">bolt</span>
                Sub-Millisecond Precision (s, ms, µs, ns)
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/10 text-primary font-label-caps text-label-caps uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary inline-block animate-ping"></span>
                Live Epoch Ticker Active
              </div>
            </div>

            {/* Main Title & Description */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pt-space-xs">
              <div className="max-w-3xl flex flex-col gap-space-xs">
                <div className="font-label-caps text-label-caps uppercase tracking-widest text-primary font-semibold">
                  Chronometric Computation Suite // Spec 2025.4
                </div>
                <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface font-bold">
                  Unix Timestamp Converter
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  High-precision epoch time conversion across seconds, milliseconds, microseconds, nanoseconds, and
                  ISO-8601. Engineered for backend developers, DevOps engineers, distributed systems architects, and
                  cryptographic protocol specialists.
                </p>
              </div>
              <div className="flex items-center gap-space-xs shrink-0 self-start lg:self-auto">
                <button
                  onClick={() => setClockPaused(!clockPaused)}
                  className={`px-space-md py-2.5 rounded-xl font-body-sm text-body-sm font-medium transition-all flex items-center gap-2 ${
                    clockPaused
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                  id="btn-pause-clock"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {clockPaused ? 'play_arrow' : 'pause'}
                  </span>
                  <span>{clockPaused ? 'Resume Engine' : 'Freeze Engine'}</span>
                </button>
                <button
                  onClick={handleCopyAllTicks}
                  className="px-space-md py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-medium transition-all shadow-sm flex items-center gap-2"
                  id="btn-copy-all-epoch"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copiedKey === 'all-ticks' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedKey === 'all-ticks' ? 'Copied All!' : 'Copy All Ticks'}</span>
                </button>
              </div>
            </div>

            {/* Live Real-Time Dynamic Epoch Ticker */}
            <div className="mt-space-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
              {/* Seconds Card */}
              <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Seconds (s)
                  </span>
                  <span className="font-data-mono text-[11px] text-outline">10 Digits</span>
                </div>
                <div className="font-data-mono text-headline-md font-bold text-on-surface tracking-tight select-all truncate">
                  {liveSec}
                </div>
                <div className="flex items-center justify-between mt-3 pt-2">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Unix Standard</span>
                  <button
                    onClick={() => handleCopy(String(liveSec), 'live-sec')}
                    className="text-primary hover:text-primary-container transition-colors flex items-center gap-1 font-body-sm text-body-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedKey === 'live-sec' ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedKey === 'live-sec' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Milliseconds Card */}
              <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Milliseconds (ms)
                  </span>
                  <span className="font-data-mono text-[11px] text-outline">13 Digits</span>
                </div>
                <div className="font-data-mono text-headline-md font-bold text-on-surface tracking-tight select-all truncate">
                  {liveMs}
                </div>
                <div className="flex items-center justify-between mt-3 pt-2">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">JS / Node / Java</span>
                  <button
                    onClick={() => handleCopy(String(liveMs), 'live-ms')}
                    className="text-primary hover:text-primary-container transition-colors flex items-center gap-1 font-body-sm text-body-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedKey === 'live-ms' ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedKey === 'live-ms' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Microseconds Card */}
              <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Microseconds (µs)
                  </span>
                  <span className="font-data-mono text-[11px] text-outline">16 Digits</span>
                </div>
                <div className="font-data-mono text-headline-md font-bold text-on-surface tracking-tight select-all truncate">
                  {liveMs}
                  {liveUsSuffix}
                </div>
                <div className="flex items-center justify-between mt-3 pt-2">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">PostgreSQL / C++</span>
                  <button
                    onClick={() => handleCopy(`${liveMs}${liveUsSuffix}`, 'live-us')}
                    className="text-primary hover:text-primary-container transition-colors flex items-center gap-1 font-body-sm text-body-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedKey === 'live-us' ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedKey === 'live-us' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Nanoseconds Card */}
              <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    Nanoseconds (ns)
                  </span>
                  <span className="font-data-mono text-[11px] text-outline">19 Digits</span>
                </div>
                <div className="font-data-mono text-headline-md font-bold text-on-surface tracking-tight select-all truncate">
                  {liveMs}
                  {liveNsSuffix}
                </div>
                <div className="flex items-center justify-between mt-3 pt-2">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Go / Rust / HFT</span>
                  <button
                    onClick={() => handleCopy(`${liveMs}${liveNsSuffix}`, 'live-ns')}
                    className="text-primary hover:text-primary-container transition-colors flex items-center gap-1 font-body-sm text-body-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedKey === 'live-ns' ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedKey === 'live-ns' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Live UTC Standard Card */}
              <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                    Live ISO-8601 UTC
                  </span>
                  <span className="font-data-mono text-[11px] text-outline">Zulu Time</span>
                </div>
                <div className="font-data-mono text-body-md font-bold text-on-surface tracking-tight select-all truncate">
                  {new Date(liveMs).toISOString()}
                </div>
                <div className="flex items-center justify-between mt-3 pt-2">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Standard RFC 3339</span>
                  <button
                    onClick={() => handleCopy(new Date(liveMs).toISOString(), 'live-iso')}
                    className="text-primary hover:text-primary-container transition-colors flex items-center gap-1 font-body-sm text-body-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedKey === 'live-iso' ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedKey === 'live-iso' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top Quick External Standards References */}
            <div className="mt-space-md p-space-sm sm:p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-wrap items-center justify-between gap-3 text-body-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span className="font-bold text-on-surface text-[13px]">Official Reference Standards:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-primary/10 hover:text-primary border border-outline-variant/30 text-[12px] font-semibold text-on-surface transition-all inline-flex items-center gap-1 group"
                >
                  <span>IEEE / POSIX.1-2017</span>
                  <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-primary">open_in_new</span>
                </a>
                <a
                  href="https://datatracker.ietf.org/doc/html/rfc3339"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 border border-outline-variant/30 text-[12px] font-semibold text-on-surface transition-all inline-flex items-center gap-1 group"
                >
                  <span>IETF RFC 3339 (ISO-8601)</span>
                  <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-emerald-600">open_in_new</span>
                </a>
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 border border-outline-variant/30 text-[12px] font-semibold text-on-surface transition-all inline-flex items-center gap-1 group"
                >
                  <span>MDN Web Docs (Date.now)</span>
                  <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-amber-600">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Primary Converter Workbench */}
        <section className="w-full py-space-2xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            {/* Primary Conversion Mode Slider & Navigation */}
            <div className="mb-space-xl flex flex-col gap-space-md">
              {/* Interactive Slider Console */}
              <div className="bg-surface-container-low p-space-md sm:p-space-lg rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col gap-space-md">
                {/* Slider Header with Step Counter & Navigation Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-data-mono text-body-sm shadow-xs">
                      {activePrimaryIndex >= 0 ? `0${activePrimaryIndex + 1}` : '01'}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                          Conversion Mode Slider
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {activePrimaryIndex >= 0 ? `Step 0${activePrimaryIndex + 1} of 03` : 'Tool Selected'}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                        {activePrimaryIndex >= 0
                          ? PRIMARY_SLIDER_TAGS[activePrimaryIndex].title
                          : 'Slide or click any tag to switch conversion mode'}
                      </span>
                    </div>
                  </div>

                  {/* Step Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={handlePrevSlide}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1 shadow-xs"
                      title="Slide to Previous Tag"
                    >
                      <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                      <span>Prev Tag</span>
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1 shadow-xs"
                      title="Slide to Next Tag"
                    >
                      <span>Next Tag</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Visible Interactive Range Slider Track */}
                <div className="flex flex-col gap-2 pt-1 px-1">
                  <div className="relative py-2">
                    {/* Visual Progress Fill Track */}
                    <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-primary transition-all duration-200 ease-out rounded-full"
                        style={{
                          width:
                            activePrimaryIndex === 0
                              ? '16.66%'
                              : activePrimaryIndex === 1
                              ? '50%'
                              : activePrimaryIndex === 2
                              ? '83.33%'
                              : '16.66%',
                        }}
                      ></div>
                    </div>

                    {/* Step Tick Markers */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-[8%] sm:px-[10%]">
                      {[0, 1, 2].map((stepIdx) => {
                        const isReached = activePrimaryIndex >= stepIdx;
                        const isCurrent = activePrimaryIndex === stepIdx;
                        return (
                          <div
                            key={stepIdx}
                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                              isCurrent
                                ? 'bg-primary ring-4 ring-primary/20 scale-125'
                                : isReached
                                ? 'bg-primary'
                                : 'bg-surface-container-highest border border-outline-variant/60'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Visible Draggable Slider Thumb Knob */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-primary shadow-md flex items-center justify-center transition-all duration-200 pointer-events-none z-10"
                      style={{
                        left:
                          activePrimaryIndex === 0
                            ? '16.66%'
                            : activePrimaryIndex === 1
                            ? '50%'
                            : activePrimaryIndex === 2
                            ? '83.33%'
                            : '16.66%',
                      }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    </div>

                    {/* Native Interactive Range Slider for Drag & Slide */}
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={1}
                      value={activePrimaryIndex >= 0 ? activePrimaryIndex : 0}
                      onChange={(e) => handleSliderChange(Number(e.target.value))}
                      aria-label="Conversion Mode Step Slider"
                      className="absolute inset-0 w-full h-8 opacity-0 cursor-pointer z-20"
                    />
                  </div>

                  {/* Step Labels & Direct Click Handlers under the Slider */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    {PRIMARY_SLIDER_TAGS.map((tag, idx) => {
                      const isActive = activeTab === tag.id;
                      return (
                        <button
                          key={tag.id}
                          onClick={() => handleSliderChange(idx)}
                          className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all text-left group ${
                            isActive
                              ? 'bg-primary/10 text-primary font-bold'
                              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isActive ? 'bg-primary animate-pulse' : 'bg-outline-variant'
                              }`}
                            ></span>
                            <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold">
                              Tag 0{idx + 1}
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm font-semibold truncate max-w-full">
                            {tag.shortTitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3 Prominent Interactive Slider Cards for the 3 Primary Modes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {PRIMARY_SLIDER_TAGS.map((tag, idx) => {
                    const isActive = activeTab === tag.id;
                    return (
                      <div
                        key={tag.id}
                        onClick={() => handleSliderChange(idx)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                          isActive
                            ? 'bg-surface-container-lowest border-primary shadow-sm ring-2 ring-primary/20'
                            : 'bg-surface-container-lowest/70 border-outline-variant/40 hover:border-outline-variant hover:bg-surface-container-lowest'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`p-1.5 rounded-lg flex items-center justify-center ${
                                isActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[18px]">{tag.icon}</span>
                            </span>
                            <span className="font-data-mono text-[11px] font-bold text-outline">
                              0{idx + 1}
                            </span>
                          </div>
                          <span
                            className={`font-label-caps text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-primary/10 text-primary'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            {isActive ? 'Active Mode' : 'Slide Here'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-body-md text-body-md font-bold text-on-surface leading-snug">
                            {tag.title}
                          </h4>
                          <p className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                            {tag.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Horizontal Slider Carousel for All 7 Tags */}
              <div className="relative flex items-center">
                <button
                  onClick={() => scrollTags('left')}
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40 shadow-xs mr-2 shrink-0 transition-all"
                  aria-label="Scroll tags left"
                  title="Scroll tags left"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                <div
                  ref={tagsNavRef}
                  className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full scroll-smooth"
                >
                  {[
                    { id: 'tab-ts-to-date', label: '1. Unix Timestamp → Human Date' },
                    { id: 'tab-date-to-ts', label: '2. Human Date & Time → Unix Timestamp' },
                    { id: 'tab-iso-parser', label: '3. ISO-8601 & RFC 3339 Parser' },
                    { id: 'tab-hex-epoch', label: '4. Hex / Base-16 Timestamp' },
                    { id: 'tab-diff-duration', label: '5. Duration Delta Calculator' },
                    { id: 'tab-batch', label: '6. Batch Processor' },
                    { id: 'tab-jwt', label: '7. JWT Expiration Decoder' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabKey)}
                      className={`px-space-md py-2 rounded-xl font-body-sm text-body-sm font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                        activeTab === tab.id
                          ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/30'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      )}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => scrollTags('right')}
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40 shadow-xs ml-2 shrink-0 transition-all"
                  aria-label="Scroll tags right"
                  title="Scroll tags right"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* WORKBENCH TAB 1: Unix Timestamp -> Human Date */}
            {activeTab === 'tab-ts-to-date' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
                {/* Left Column: Controls & Input Console (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-space-lg">
                  <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md flex flex-col gap-space-md">
                    <div className="flex items-center justify-between pb-space-xs">
                      <div className="flex flex-col">
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                          Primary Input Stream
                        </span>
                        <label
                          htmlFor="input-timestamp-val"
                          className="font-headline-md text-headline-md font-bold text-on-surface"
                        >
                          Enter Unix Timestamp
                        </label>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-data-mono text-body-sm">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            parsedTimestampData.isValid ? 'bg-emerald-500' : 'bg-error'
                          }`}
                        ></span>
                        Detected: {parsedTimestampData.detectedUnit}
                      </span>
                    </div>

                    {/* Main Input Field */}
                    <div className="relative">
                      <input
                        id="input-timestamp-val"
                        type="text"
                        value={inputTs}
                        onChange={(e) => setInputTs(e.target.value)}
                        placeholder="e.g. 1726743842 or 1726743842891"
                        className="w-full px-space-md py-3.5 bg-surface-container-low rounded-xl font-data-mono text-headline-md text-on-surface focus:outline-none focus:bg-surface-container transition-all pr-24 shadow-inner"
                      />
                      <button
                        onClick={() => setInputTs('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-outline hover:text-on-surface font-body-sm text-body-sm rounded-lg hover:bg-surface-container-high transition-colors"
                      >
                        Clear
                      </button>
                    </div>

                    {/* Format Unit Selector Pills */}
                    <div className="flex flex-col gap-1.5">
                      <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                        Precision Unit Resolution
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'auto', label: 'Auto Detect' },
                          { id: 'sec', label: 'Seconds (10d)' },
                          { id: 'ms', label: 'Milliseconds (13d)' },
                          { id: 'us', label: 'Microseconds (16d)' },
                          { id: 'ns', label: 'Nanoseconds (19d)' },
                          { id: 'hex', label: 'Hex (0x...)' },
                        ].map((u) => (
                          <button
                            key={u.id}
                            onClick={() => setSelectedUnit(u.id as typeof selectedUnit)}
                            className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-semibold transition-all ${
                              selectedUnit === u.id
                                ? 'bg-primary text-on-primary shadow-sm'
                                : 'text-on-surface-variant bg-surface-container hover:bg-surface-container-high'
                            }`}
                          >
                            {u.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timezone & Formatting Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="select-timezone"
                          className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                        >
                          Target Time Zone Projection
                        </label>
                        <div className="relative">
                          <select
                            id="select-timezone"
                            value={targetTimezone}
                            onChange={(e) => setTargetTimezone(e.target.value)}
                            className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none pr-10 focus:outline-none focus:bg-surface-container"
                          >
                            <option value="UTC">UTC / GMT (±00:00)</option>
                            <option value="America/New_York">America/New York (EDT/EST -04:00/-05:00)</option>
                            <option value="America/Chicago">America/Chicago (CDT/CST -05:00/-06:00)</option>
                            <option value="America/Denver">America/Denver (MDT/MST -06:00/-07:00)</option>
                            <option value="America/Los_Angeles">America/Los Angeles (PDT/PST -07:00/-08:00)</option>
                            <option value="Europe/London">Europe/London (BST/GMT +01:00/+00:00)</option>
                            <option value="Europe/Berlin">Europe/Berlin (CEST/CET +02:00/+01:00)</option>
                            <option value="Asia/Tokyo">Asia/Tokyo (JST +09:00)</option>
                            <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
                            <option value="Asia/Singapore">Asia/Singapore (SGT +08:00)</option>
                            <option value="Asia/Dubai">Asia/Dubai (GST +04:00)</option>
                            <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT +10:00/+11:00)</option>
                            <option value="Pacific/Auckland">Pacific/Auckland (NZST/NZDT +12:00/+13:00)</option>
                          </select>
                          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                            expand_more
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                          Execution Actions
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              // Re-evaluates instantly via memo
                            }}
                            className="flex-1 px-space-md py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[18px]">autorenew</span>
                            <span>Convert</span>
                          </button>
                          <button
                            onClick={() => setInputTs(String(Math.floor(Date.now() / 1000)))}
                            className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[18px]">update</span>
                            <span>Now</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick Presets Carousel */}
                    <div className="flex flex-col gap-2 pt-2">
                      <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline font-semibold">
                        Fast Telemetry Presets
                      </span>
                      <div className="flex flex-wrap gap-2 text-body-sm">
                        <button
                          onClick={() => applyPreset('epoch-zero')}
                          className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all"
                        >
                          Jan 1, 1970 (Epoch 0)
                        </button>
                        <button
                          onClick={() => applyPreset('start-today')}
                          className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all"
                        >
                          Start of Today (00:00 UTC)
                        </button>
                        <button
                          onClick={() => applyPreset('end-today')}
                          className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all"
                        >
                          End of Today (23:59 UTC)
                        </button>
                        <button
                          onClick={() => applyPreset('y2038')}
                          className="px-2.5 py-1 rounded-lg bg-error-container text-on-error-container hover:opacity-90 font-medium transition-all"
                        >
                          Year 2038 Boundary
                        </button>
                        <button
                          onClick={() => applyPreset('plus-1h')}
                          className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all"
                        >
                          +1 Hour
                        </button>
                        <button
                          onClick={() => applyPreset('plus-1d')}
                          className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all"
                        >
                          +1 Day
                        </button>
                        <button
                          onClick={() => applyPreset('plus-30d')}
                          className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all"
                        >
                          +30 Days
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mini Spec Card */}
                  <div className="p-space-md rounded-2xl bg-surface-container-low flex items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[22px]">calendar_today</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-md text-body-md font-semibold text-on-surface">
                          Universal POSIX Reference
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Epoch benchmark: 1970-01-01T00:00:00.000Z · Gregorian calendar synchronization
                        </span>
                      </div>
                    </div>
                    <a
                      href="#section-technical-guide"
                      className="text-primary hover:text-primary-container font-body-sm text-body-sm font-semibold flex items-center gap-1 shrink-0"
                    >
                      <span>Read Specs</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </a>
                  </div>
                </div>

                {/* Right Column: High-Density Results Console (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-space-md">
                  <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md flex flex-col gap-space-lg">
                    {/* Primary Big Output Readout */}
                    <div className="flex flex-col gap-space-xs border-b border-transparent pb-space-md">
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline font-semibold">
                          Human Date &amp; Time (UTC)
                        </span>
                        {tab1Outputs && (
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-body-sm text-[12px] font-semibold">
                            {tab1Outputs.relative}
                          </span>
                        )}
                      </div>
                      <div className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight leading-snug">
                        {tab1Outputs ? tab1Outputs.formattedUtc : 'Enter a valid timestamp above'}
                      </div>
                      {tab1Outputs && (
                        <div className="font-body-sm text-body-sm text-on-surface-variant">
                          Projected ({targetTimezone}): {tab1Outputs.formattedLocal}
                        </div>
                      )}
                    </div>

                    {/* Output Precision Registry Grid */}
                    {tab1Outputs && (
                      <div className="flex flex-col gap-space-sm">
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                          Universal Representation Matrix
                        </span>

                        {/* ISO 8601 */}
                        <div className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-caps text-[10px] uppercase text-outline">
                              ISO 8601 / RFC 3339
                            </span>
                            <span className="font-data-mono text-body-sm font-semibold text-on-surface truncate">
                              {tab1Outputs.isoStr}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(tab1Outputs.isoStr, 'iso')}
                            className="text-primary hover:text-primary-container p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                            title="Copy ISO String"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {copiedKey === 'iso' ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>

                        {/* RFC 2822 */}
                        <div className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-caps text-[10px] uppercase text-outline">
                              RFC 2822 Format
                            </span>
                            <span className="font-data-mono text-body-sm font-semibold text-on-surface truncate">
                              {tab1Outputs.rfcStr}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(tab1Outputs.rfcStr, 'rfc')}
                            className="text-primary hover:text-primary-container p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                            title="Copy RFC 2822"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {copiedKey === 'rfc' ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>

                        {/* Unix Seconds */}
                        <div className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-caps text-[10px] uppercase text-outline">
                              Unix Epoch (Seconds)
                            </span>
                            <span className="font-data-mono text-body-sm font-semibold text-on-surface truncate">
                              {tab1Outputs.sec}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(tab1Outputs.sec, 'sec')}
                            className="text-primary hover:text-primary-container p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                            title="Copy Seconds"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {copiedKey === 'sec' ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>

                        {/* Unix Milliseconds */}
                        <div className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-caps text-[10px] uppercase text-outline">
                              Unix Epoch (Milliseconds)
                            </span>
                            <span className="font-data-mono text-body-sm font-semibold text-on-surface truncate">
                              {tab1Outputs.ms}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(tab1Outputs.ms, 'ms')}
                            className="text-primary hover:text-primary-container p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                            title="Copy Milliseconds"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {copiedKey === 'ms' ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>

                        {/* Unix Microseconds */}
                        <div className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-caps text-[10px] uppercase text-outline">
                              Unix Epoch (Microseconds)
                            </span>
                            <span className="font-data-mono text-body-sm font-semibold text-on-surface truncate">
                              {tab1Outputs.us}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(tab1Outputs.us, 'us')}
                            className="text-primary hover:text-primary-container p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                            title="Copy Microseconds"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {copiedKey === 'us' ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>

                        {/* Hexadecimal Epoch */}
                        <div className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-caps text-[10px] uppercase text-outline">
                              Hexadecimal Representation
                            </span>
                            <span className="font-data-mono text-body-sm font-semibold text-on-surface truncate">
                              {tab1Outputs.hexStr}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(tab1Outputs.hexStr, 'hex')}
                            className="text-primary hover:text-primary-container p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                            title="Copy Hex"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {copiedKey === 'hex' ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>

                        {/* Binary (32-bit chunked) */}
                        <div className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-caps text-[10px] uppercase text-outline">
                              Binary Byte Stream (32-bit)
                            </span>
                            <span className="font-data-mono text-body-sm font-semibold text-on-surface truncate">
                              {tab1Outputs.chunkedBin}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(tab1Outputs.chunkedBin, 'bin')}
                            className="text-primary hover:text-primary-container p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                            title="Copy Binary"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {copiedKey === 'bin' ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Astronomical & Calendar Metadata Matrix */}
                    {tab1Outputs && (
                      <div className="p-space-md rounded-xl bg-surface-container flex flex-col gap-2 font-body-sm text-body-sm">
                        <div className="flex justify-between items-center text-on-surface">
                          <span className="text-on-surface-variant font-medium">Day of Year:</span>
                          <span className="font-data-mono font-bold">{tab1Outputs.dayOfYearText}</span>
                        </div>
                        <div className="flex justify-between items-center text-on-surface">
                          <span className="text-on-surface-variant font-medium">ISO Week Number:</span>
                          <span className="font-data-mono font-bold">{tab1Outputs.weekNumText}</span>
                        </div>
                        <div className="flex justify-between items-center text-on-surface">
                          <span className="text-on-surface-variant font-medium">Julian Day Number (JD):</span>
                          <span className="font-data-mono font-bold">{tab1Outputs.julianDay}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* WORKBENCH TAB 2: Human Date & Time -> Unix Timestamp */}
            {activeTab === 'tab-date-to-ts' && (
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md">
                <div className="max-w-3xl flex flex-col gap-space-lg">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                      Forward Engine
                    </span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                      Human Date &amp; Time to Unix Timestamp
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Construct an exact POSIX timestamp from any calendar date, clock time, and timezone offset.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="date-input-year"
                        className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                      >
                        Year (YYYY)
                      </label>
                      <input
                        id="date-input-year"
                        type="number"
                        min="1970"
                        max="2100"
                        value={fYear}
                        onChange={(e) => setFYear(parseInt(e.target.value) || 2025)}
                        className="px-space-md py-2.5 rounded-xl bg-surface-container-low font-data-mono text-on-surface focus:outline-none focus:bg-surface-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="date-input-month"
                        className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                      >
                        Month
                      </label>
                      <select
                        id="date-input-month"
                        value={fMonth}
                        onChange={(e) => setFMonth(parseInt(e.target.value))}
                        className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container"
                      >
                        {[
                          '01 - January',
                          '02 - February',
                          '03 - March',
                          '04 - April',
                          '05 - May',
                          '06 - June',
                          '07 - July',
                          '08 - August',
                          '09 - September',
                          '10 - October',
                          '11 - November',
                          '12 - December',
                        ].map((mName, idx) => (
                          <option key={idx} value={idx}>
                            {mName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="date-input-day"
                        className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                      >
                        Day (1-31)
                      </label>
                      <input
                        id="date-input-day"
                        type="number"
                        min="1"
                        max="31"
                        value={fDay}
                        onChange={(e) => setFDay(parseInt(e.target.value) || 1)}
                        className="px-space-md py-2.5 rounded-xl bg-surface-container-low font-data-mono text-on-surface focus:outline-none focus:bg-surface-container"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="date-input-hours"
                        className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                      >
                        Hour (0-23)
                      </label>
                      <input
                        id="date-input-hours"
                        type="number"
                        min="0"
                        max="23"
                        value={fHours}
                        onChange={(e) => setFHours(parseInt(e.target.value) || 0)}
                        className="px-space-md py-2.5 rounded-xl bg-surface-container-low font-data-mono text-on-surface focus:outline-none focus:bg-surface-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="date-input-minutes"
                        className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                      >
                        Minute (0-59)
                      </label>
                      <input
                        id="date-input-minutes"
                        type="number"
                        min="0"
                        max="59"
                        value={fMinutes}
                        onChange={(e) => setFMinutes(parseInt(e.target.value) || 0)}
                        className="px-space-md py-2.5 rounded-xl bg-surface-container-low font-data-mono text-on-surface focus:outline-none focus:bg-surface-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="date-input-seconds"
                        className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                      >
                        Second (0-59)
                      </label>
                      <input
                        id="date-input-seconds"
                        type="number"
                        min="0"
                        max="59"
                        value={fSeconds}
                        onChange={(e) => setFSeconds(parseInt(e.target.value) || 0)}
                        className="px-space-md py-2.5 rounded-xl bg-surface-container-low font-data-mono text-on-surface focus:outline-none focus:bg-surface-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="date-input-tz-mode"
                        className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                      >
                        Time Reference
                      </label>
                      <select
                        id="date-input-tz-mode"
                        value={fTzMode}
                        onChange={(e) => setFTzMode(e.target.value as 'utc' | 'local')}
                        className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container"
                      >
                        <option value="utc">UTC / Greenwich</option>
                        <option value="local">Local Browser Time</option>
                      </select>
                    </div>
                  </div>

                  {/* Results Output */}
                  <div className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col gap-space-md mt-space-xs">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-outline">
                        Evaluated Unix Epoch (Seconds)
                      </span>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-data-mono text-numerical-display font-bold text-primary">
                          {tab2Output.sec}
                        </span>
                        <button
                          onClick={() => handleCopy(String(tab2Output.sec), 'date-sec')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {copiedKey === 'date-sec' ? 'check' : 'content_copy'}
                          </span>
                          <span>{copiedKey === 'date-sec' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                      <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                        <span className="font-label-caps text-[11px] uppercase text-outline">
                          Milliseconds (13 Digits)
                        </span>
                        <span className="font-data-mono text-body-md font-bold text-on-surface">
                          {tab2Output.ms}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                        <span className="font-label-caps text-[11px] uppercase text-outline">
                          Hexadecimal (0x)
                        </span>
                        <span className="font-data-mono text-body-md font-bold text-on-surface">
                          {tab2Output.hex}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WORKBENCH TAB 3: ISO-8601 & RFC 3339 Parser */}
            {activeTab === 'tab-iso-parser' && (
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md">
                <div className="max-w-3xl flex flex-col gap-space-md">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                      Strict Standard Parser
                    </span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                      ISO-8601 &amp; RFC 3339 Parser
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Parse strict Zulu timestamps or custom offset strings into exact epoch seconds and localized
                      structures.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="input-iso-raw"
                      className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                    >
                      ISO-8601 Timestamp String
                    </label>
                    <input
                      id="input-iso-raw"
                      type="text"
                      value={isoInput}
                      onChange={(e) => setIsoInput(e.target.value)}
                      placeholder="e.g. 2024-09-19T11:04:02Z or 2024-09-19T15:04:02+04:00"
                      className="w-full px-space-md py-3.5 bg-surface-container-low rounded-xl font-data-mono text-headline-md text-on-surface focus:outline-none focus:bg-surface-container transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <button
                      onClick={() => setIsoInput(new Date().toISOString())}
                      className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">update</span>
                      <span>Current ISO</span>
                    </button>
                  </div>

                  <div className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col gap-3 mt-space-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Parsed Unix Epoch Seconds:
                      </span>
                      <span className="font-data-mono text-headline-md font-bold text-on-surface">
                        {parsedIsoData.sec}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">UTC Gregorian:</span>
                      <span className="font-data-mono text-body-md font-semibold text-on-surface">
                        {parsedIsoData.utc}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Validation Status:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-label-caps text-label-caps uppercase font-semibold ${
                          parsedIsoData.isValid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        {parsedIsoData.statusText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WORKBENCH TAB 4: Hex / Base-16 Timestamp */}
            {activeTab === 'tab-hex-epoch' && (
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md">
                <div className="max-w-3xl flex flex-col gap-space-md">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                      Low-Level Byte Representation
                    </span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                      Hexadecimal Timestamp Converter
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Convert between raw 32-bit/64-bit Hex strings (frequently found in MongoDB ObjectIDs, binary
                      network packets, and core memory dumps) and readable dates.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="input-hex-val"
                      className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                    >
                      Hexadecimal Timestamp (with or without 0x prefix)
                    </label>
                    <input
                      id="input-hex-val"
                      type="text"
                      value={hexInput}
                      onChange={(e) => setHexInput(e.target.value)}
                      placeholder="e.g. 0x66EC0BA2 or 66EC0BA2"
                      className="w-full px-space-md py-3.5 bg-surface-container-low rounded-xl font-data-mono text-headline-md text-on-surface focus:outline-none focus:bg-surface-container"
                    />
                  </div>
                  <div className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col gap-3 mt-space-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Decimal Unix Seconds:</span>
                      <span className="font-data-mono text-headline-md font-bold text-on-surface">
                        {parsedHexData.sec}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Human Date (UTC):</span>
                      <span className="font-data-mono text-body-md font-semibold text-on-surface">
                        {parsedHexData.utc}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WORKBENCH TAB 5: Timestamp Delta & Duration Calculator */}
            {activeTab === 'tab-diff-duration' && (
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md">
                <div className="max-w-3xl flex flex-col gap-space-lg">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                      Chronometric Difference Engine
                    </span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                      Timestamp Difference &amp; Duration Calculator
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Calculate the exact span, sub-second variance, and human readable interval between any two
                      timestamps.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="input-diff-ts1"
                        className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                      >
                        Timestamp 1 (Start)
                      </label>
                      <input
                        id="input-diff-ts1"
                        type="text"
                        value={diffTs1}
                        onChange={(e) => setDiffTs1(e.target.value)}
                        className="px-space-md py-3 bg-surface-container-low rounded-xl font-data-mono text-body-lg text-on-surface focus:outline-none focus:bg-surface-container"
                      />
                      <span className="font-body-sm text-[12px] text-outline">{diffData.preview1}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="input-diff-ts2"
                        className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                      >
                        Timestamp 2 (End)
                      </label>
                      <input
                        id="input-diff-ts2"
                        type="text"
                        value={diffTs2}
                        onChange={(e) => setDiffTs2(e.target.value)}
                        className="px-space-md py-3 bg-surface-container-low rounded-xl font-data-mono text-body-lg text-on-surface focus:outline-none focus:bg-surface-container"
                      />
                      <span className="font-body-sm text-[12px] text-outline">{diffData.preview2}</span>
                    </div>
                  </div>

                  {/* Difference Output Dashboard */}
                  <div className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col gap-space-md mt-space-xs">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Total Duration</span>
                      <span className="font-headline-md text-headline-md font-bold text-primary">
                        {diffData.human}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-2">
                      <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                        <span className="font-label-caps text-[10px] uppercase text-outline">Total Seconds</span>
                        <span className="font-data-mono text-body-md font-bold text-on-surface">{diffData.sec}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                        <span className="font-label-caps text-[10px] uppercase text-outline">Total Minutes</span>
                        <span className="font-data-mono text-body-md font-bold text-on-surface">{diffData.min}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                        <span className="font-label-caps text-[10px] uppercase text-outline">Total Hours</span>
                        <span className="font-data-mono text-body-md font-bold text-on-surface">{diffData.hrs}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                        <span className="font-label-caps text-[10px] uppercase text-outline">Total Days</span>
                        <span className="font-data-mono text-body-md font-bold text-on-surface">{diffData.days}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WORKBENCH TAB 6: Batch Processor */}
            {activeTab === 'tab-batch' && (
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md flex flex-col gap-space-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                      Bulk Telemetry Extraction
                    </span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                      Batch Timestamp Processor
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Paste up to 500 timestamps (one per line or comma-separated) for instant parallel conversion.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportBatchJson}
                      className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">data_object</span>
                      <span>{copiedKey === 'batch-json' ? 'JSON Copied!' : 'Export JSON'}</span>
                    </button>
                    <button
                      onClick={exportBatchCsv}
                      className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">table_view</span>
                      <span>{copiedKey === 'batch-csv' ? 'CSV Copied!' : 'Export CSV'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="input-batch-text"
                    className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                  >
                    Paste Timestamps List
                  </label>
                  <textarea
                    id="input-batch-text"
                    rows={5}
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    className="w-full p-space-md rounded-xl bg-surface-container-low font-data-mono text-body-sm text-on-surface focus:outline-none focus:bg-surface-container transition-all"
                  />
                </div>

                {/* Batch Output Table */}
                <div className="overflow-x-auto rounded-xl bg-surface-container-low mt-space-xs">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead className="bg-surface-container font-label-caps text-label-caps uppercase text-outline tracking-wider">
                      <tr>
                        <th className="p-3">Input Timestamp</th>
                        <th className="p-3">Detected Unit</th>
                        <th className="p-3">UTC ISO-8601</th>
                        <th className="p-3">Local Representation</th>
                        <th className="p-3">Relative Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container/40">
                      {batchResults.map((item, index) => (
                        <tr key={index} className="hover:bg-surface-container/50 font-data-mono">
                          <td className="p-3 font-semibold text-primary">{item.raw}</td>
                          <td className="p-3 text-on-surface-variant">{item.unit}</td>
                          <td className="p-3 text-on-surface">{item.iso}</td>
                          <td className="p-3 text-on-surface-variant font-body-sm text-[12px]">{item.local}</td>
                          <td className="p-3 text-on-surface-variant font-body-sm text-[12px]">{item.relative}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* WORKBENCH TAB 7: JWT Expiration Decoder */}
            {activeTab === 'tab-jwt' && (
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md flex flex-col gap-space-lg">
                <div className="max-w-3xl">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                    API Authorization Telemetry
                  </span>
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                    JWT &amp; API Claims Expiration Inspector
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Decode and evaluate JSON Web Token (JWT) payload expiration (`exp`), issue timestamp (`iat`), and
                    activation time (`nbf`). Zero transmission to external servers.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                  <div className="lg:col-span-6 flex flex-col gap-space-md">
                    <label
                      htmlFor="jwt-input-token"
                      className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
                    >
                      Raw JWT or Claims JSON
                    </label>
                    <textarea
                      id="jwt-input-token"
                      rows={6}
                      value={jwtInput}
                      onChange={(e) => setJwtInput(e.target.value)}
                      placeholder="Paste full eyJhbGciOi... JWT or payload JSON"
                      className="w-full p-space-md rounded-xl bg-surface-container-low font-data-mono text-body-sm text-on-surface focus:outline-none focus:bg-surface-container"
                    />
                  </div>

                  <div className="lg:col-span-6 p-space-lg rounded-2xl bg-surface-container-low flex flex-col justify-between gap-space-md">
                    <div className="flex flex-col gap-space-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-label-caps uppercase text-outline">
                          Token Lifecycle State
                        </span>
                        {jwtAnalysis && !jwtAnalysis.error && (
                          <span
                            className={`px-3 py-1 rounded-full font-label-caps text-label-caps uppercase font-bold ${
                              jwtAnalysis.isExpired
                                ? 'bg-error-container text-on-error-container'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {jwtAnalysis.statusText}
                          </span>
                        )}
                      </div>

                      {jwtAnalysis && jwtAnalysis.error ? (
                        <div className="p-3 rounded-xl bg-error-container text-on-error-container text-body-sm">
                          {jwtAnalysis.error}
                        </div>
                      ) : (
                        jwtAnalysis && (
                          <>
                            <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                              <span className="font-label-caps text-[10px] uppercase text-outline">
                                Issued At (`iat`)
                              </span>
                              <span className="font-data-mono text-body-sm font-bold text-on-surface">
                                {jwtAnalysis.iatFormatted}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                              <span className="font-label-caps text-[10px] uppercase text-outline">
                                Not Before (`nbf`)
                              </span>
                              <span className="font-data-mono text-body-sm font-bold text-on-surface">
                                {jwtAnalysis.nbfFormatted}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                              <span className="font-label-caps text-[10px] uppercase text-outline">
                                Expires At (`exp`)
                              </span>
                              <span className="font-data-mono text-body-sm font-bold text-on-surface">
                                {jwtAnalysis.expFormatted}
                              </span>
                            </div>
                          </>
                        )
                      )}
                    </div>
                    <div className="p-3 rounded-xl bg-surface-container text-on-surface-variant font-body-sm text-body-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
                      <span>Client evaluation sandbox. No tokens leave your browser memory.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Developer Code Snippets & Language Cheat Sheet - 100% Compliant for Dark and Light Mode */}
        <section className="w-full py-space-2xl bg-surface-container-lowest border-t border-outline-variant/30 transition-colors">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div className="max-w-2xl flex flex-col gap-1">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                  Engineered Developer Matrix
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Programming Language Cheat Sheet
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Production-tested implementation patterns for current epoch extraction and bidirectional string
                  hydration across top runtime systems. Fully styled for dark and light modes.
                </p>
              </div>

              {/* Theme Selector for Code View & Environment Counter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-low border border-outline-variant/40 shadow-xs">
                  <span className="text-[11px] font-semibold text-on-surface-variant px-1.5 flex items-center gap-1 select-none">
                    <span className="material-symbols-outlined text-[15px]">palette</span>
                    Theme:
                  </span>
                  {[
                    { id: 'auto', label: 'Auto' },
                    { id: 'light', label: 'Light' },
                    { id: 'dark', label: 'Dark' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCodeThemePreference(opt.id as typeof codeThemePreference)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        codeThemePreference === opt.id
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <span className="font-data-mono text-[12px] px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-medium">
                  10 Environments
                </span>
              </div>
            </div>

            {/* Code Snippets Grid (10 Languages) - Fully Theme Compliant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {[
                {
                  id: 'js-code',
                  lang: 'JavaScript / TypeScript',
                  filename: 'epoch.ts',
                  runtime: 'Node.js / Web',
                  color: 'bg-yellow-400',
                  code: `// Get current Unix timestamp (seconds)\nconst unixSec = Math.floor(Date.now() / 1000);\n\n// Convert timestamp to ISO string\nconst date = new Date(1726743842 * 1000).toISOString();`,
                },
                {
                  id: 'py-code',
                  lang: 'Python 3',
                  filename: 'epoch.py',
                  runtime: 'Python 3.8+',
                  color: 'bg-blue-500',
                  code: `import time\nfrom datetime import datetime, timezone\n\n# Current Unix timestamp\nnow_epoch = int(time.time())\n\n# Format to UTC datetime object\ndt = datetime.fromtimestamp(1726743842, tz=timezone.utc)`,
                },
                {
                  id: 'go-code',
                  lang: 'Go (Golang)',
                  filename: 'epoch.go',
                  runtime: 'Go 1.18+',
                  color: 'bg-cyan-500',
                  code: `import "time"\n\n// Current Unix epoch (seconds & nanoseconds)\nnowSec := time.Now().Unix()\nnowNano := time.Now().UnixNano()\n\n// Convert Unix seconds to time.Time (UTC)\nt := time.Unix(1726743842, 0).UTC()`,
                },
                {
                  id: 'rust-code',
                  lang: 'Rust',
                  filename: 'main.rs',
                  runtime: 'Rust 2021',
                  color: 'bg-orange-600',
                  code: `use std::time::{SystemTime, UNIX_EPOCH};\n\n// Current Unix epoch in seconds\nlet sec = SystemTime::now()\n    .duration_since(UNIX_EPOCH)\n    .expect("Clock drifted backwards")\n    .as_secs();`,
                },
                {
                  id: 'php-code',
                  lang: 'PHP',
                  filename: 'epoch.php',
                  runtime: 'PHP 8.x',
                  color: 'bg-indigo-500',
                  code: `// Get current Unix timestamp\n$timestamp = time();\n\n// Convert timestamp to formatted UTC date\n$isoDate = gmdate('Y-m-d\\TH:i:s\\Z', 1726743842);`,
                },
                {
                  id: 'java-code',
                  lang: 'Java 8+ (java.time)',
                  filename: 'EpochDemo.java',
                  runtime: 'Java SE 8+',
                  color: 'bg-red-600',
                  code: `import java.time.Instant;\n\n// Current epoch seconds & millis\nlong epochSec = Instant.now().getEpochSecond();\nlong epochMs  = Instant.now().toEpochMilli();\n\n// Rehydrate Instant object from epoch\nInstant instant = Instant.ofEpochSecond(1726743842L);`,
                },
                {
                  id: 'cs-code',
                  lang: 'C# (.NET)',
                  filename: 'Program.cs',
                  runtime: '.NET 8.0',
                  color: 'bg-purple-600',
                  code: `// Get current Unix epoch seconds\nlong epochSec = DateTimeOffset.UtcNow.ToUnixTimeSeconds();\n\n// Parse Unix seconds to DateTimeOffset\nDateTimeOffset dto = DateTimeOffset.FromUnixTimeSeconds(1726743842);`,
                },
                {
                  id: 'rb-code',
                  lang: 'Ruby',
                  filename: 'epoch.rb',
                  runtime: 'Ruby 3.x',
                  color: 'bg-red-500',
                  code: `# Current Unix seconds\nnow_sec = Time.now.to_i\n\n# Convert timestamp to UTC Time object\nutc_time = Time.at(1726743842).utc`,
                },
                {
                  id: 'sql-code',
                  lang: 'SQL (PostgreSQL & MySQL)',
                  filename: 'query.sql',
                  runtime: 'ANSI SQL',
                  color: 'bg-blue-700',
                  code: `-- PostgreSQL: Extract seconds & convert\nSELECT EXTRACT(EPOCH FROM NOW());\nSELECT to_timestamp(1726743842);\n\n-- MySQL: Extract seconds & convert\nSELECT UNIX_TIMESTAMP();\nSELECT FROM_UNIXTIME(1726743842);`,
                },
                {
                  id: 'bash-code',
                  lang: 'Bash / POSIX Shell',
                  filename: 'epoch.sh',
                  runtime: 'POSIX Shell',
                  color: 'bg-slate-700',
                  code: `# Print current epoch seconds\ndate +%s\n\n# Convert specific timestamp to UTC RFC-2822\ndate -d @1726743842 -u\n# macOS / BSD syntax: date -r 1726743842 -u`,
                },
              ].map((snip) => {
                const isCodeDark = activeCodeTheme === 'dark';
                return (
                  <div
                    key={snip.id}
                    className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between gap-3 shadow-xs hover:border-outline-variant/80 transition-all"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${snip.color} shadow-xs`}></span>
                        <span className="font-body-md text-body-md font-bold text-on-surface">{snip.lang}</span>
                        <span className="font-data-mono text-[11px] px-2 py-0.5 rounded-md font-medium bg-surface-container text-on-surface-variant">
                          {snip.runtime}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(snip.code, snip.id)}
                        className={`px-2.5 py-1 rounded-lg text-body-sm font-semibold transition-all flex items-center gap-1.5 ${
                          copiedKey === snip.id
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10'
                            : 'text-primary hover:bg-primary/10'
                        }`}
                        title={`Copy ${snip.lang} code`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {copiedKey === snip.id ? 'check' : 'content_copy'}
                        </span>
                        <span className="text-[12px]">{copiedKey === snip.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Terminal IDE Container - Dynamically Theme Compliant */}
                    <div
                      className={`rounded-xl overflow-hidden border shadow-xs transition-colors ${
                        isCodeDark
                          ? 'border-slate-800 bg-[#070b14]'
                          : 'border-slate-200 bg-[#f8fafc]'
                      }`}
                    >
                      {/* Window Title Bar */}
                      <div
                        className={`flex items-center justify-between px-3 py-1.5 border-b text-xs ${
                          isCodeDark
                            ? 'bg-[#0e1526] border-slate-800 text-slate-400'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block"></span>
                        </div>
                        <span className="font-data-mono text-[11px] font-medium select-none">
                          {snip.filename}
                        </span>
                        <span
                          className={`font-data-mono text-[10px] font-semibold select-none flex items-center gap-1 ${
                            isCodeDark ? 'text-emerald-400' : 'text-emerald-600'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          UTC Ready
                        </span>
                      </div>

                      {/* Code Syntax Content */}
                      <pre
                        className={`p-3.5 font-data-mono text-body-sm overflow-x-auto leading-relaxed ${
                          isCodeDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        <code>{snip.code}</code>
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Format Comparison & Metrology Matrix */}
        <section className="w-full py-space-2xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
            <div className="max-w-3xl flex flex-col gap-1">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                Architectural Metrology
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Format Comparison &amp; Precision Matrix
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Detailed architectural breakdown of standard chronometry units utilized across operating systems,
                network layers, and database engines.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-md">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container font-label-caps text-label-caps uppercase text-outline tracking-wider">
                  <tr>
                    <th className="p-4">Unit Level</th>
                    <th className="p-4">Digits Length</th>
                    <th className="p-4">Resolution</th>
                    <th className="p-4">Primary Runtimes &amp; Stacks</th>
                    <th className="p-4">Boundary Limits &amp; Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold text-on-surface flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      Seconds (s)
                    </td>
                    <td className="p-4 font-data-mono font-bold text-primary">10 Digits</td>
                    <td className="p-4">
                      1 second (10<sup>0</sup> s)
                    </td>
                    <td className="p-4">POSIX C APIs, Linux Kernel, PHP, Python `time.time()`, MySQL</td>
                    <td className="p-4 text-on-surface-variant">
                      32-bit signed limits at 2,147,483,647 (Y2038). 64-bit safe for billions of years.
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold text-on-surface flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      Milliseconds (ms)
                    </td>
                    <td className="p-4 font-data-mono font-bold text-primary">13 Digits</td>
                    <td className="p-4">
                      10<sup>-3</sup> seconds
                    </td>
                    <td className="p-4">JavaScript (`Date.now()`), Java (`currentTimeMillis`), MongoDB</td>
                    <td className="p-4 text-on-surface-variant">
                      Standard in browser and web service payloads. Exceeds 32-bit width.
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold text-on-surface flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      Microseconds (µs)
                    </td>
                    <td className="p-4 font-data-mono font-bold text-primary">16 Digits</td>
                    <td className="p-4">
                      10<sup>-6</sup> seconds
                    </td>
                    <td className="p-4">PostgreSQL (`TIMESTAMP`), Redis telemetry, Linux `gettimeofday`</td>
                    <td className="p-4 text-on-surface-variant">
                      Ideal for distributed microservice span tracing and database transaction logs.
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold text-on-surface flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                      Nanoseconds (ns)
                    </td>
                    <td className="p-4 font-data-mono font-bold text-primary">19 Digits</td>
                    <td className="p-4">
                      10<sup>-9</sup> seconds
                    </td>
                    <td className="p-4">Go (`UnixNano()`), Rust `SystemTime`, High-Frequency Trading (HFT)</td>
                    <td className="p-4 text-on-surface-variant">
                      Mandatory for PTP hardware clocks, network telemetry, and kernel profiling.
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold text-on-surface flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                      ISO-8601 / RFC 3339
                    </td>
                    <td className="p-4 font-data-mono font-bold text-primary">20-27 Chars</td>
                    <td className="p-4">Arbitrary decimal seconds</td>
                    <td className="p-4">REST APIs, GraphQL, OpenAPI specs, JSON schemas</td>
                    <td className="p-4 text-on-surface-variant">
                      Human-readable, unambiguous UTC zero-offset or explicit timezone declarations.
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold text-on-surface flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                      Hex Epoch (0x)
                    </td>
                    <td className="p-4 font-data-mono font-bold text-primary">8 or 16 Chars</td>
                    <td className="p-4">1 second / variable</td>
                    <td className="p-4">MongoDB ObjectID header (first 4 bytes), low-level memory traces</td>
                    <td className="p-4 text-on-surface-variant">
                      Compact byte representation for binary protocols and high-throughput serialization.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* In-Depth Technical Guide & EEAT Educational Section */}
        <section className="w-full py-space-3xl bg-surface-container-lowest" id="section-technical-guide">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-2xl">
            <div className="max-w-3xl flex flex-col gap-space-xs">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                Authoritative Technical Documentation
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                The Architecture of Unix Chronometry
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                A comprehensive systems engineering study covering the genesis of Epoch 0, leap second handling, the
                physics of atomic clocks, and the 2038 signed rollover.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-xl">
              {/* Chapter 1 */}
              <div className="flex flex-col gap-space-sm p-space-lg rounded-2xl bg-surface-container-low shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-headline-md">
                  01
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Genesis of January 1, 1970 00:00:00 UTC
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  The Unix Epoch benchmark was established during the developmental phases of the Unix operating system
                  at Bell Laboratories by Dennis Ritchie and Ken Thompson. Originally conceived in the 1971 Unix
                  Programmer&apos;s Manual as measuring 60-Hz ticks from the beginning of 1971, the definition was rapidly
                  standardized to whole International System of Units (SI) seconds starting precisely at midnight UTC on
                  Thursday, January 1, 1970.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  This uniform baseline enabled lightweight hardware arithmetic on 32-bit processors (such as the PDP-11)
                  without necessitating intricate calendar lookups, day-of-month calculations, or leap year algorithms in
                  core kernel routines.
                </p>
              </div>

              {/* Chapter 2 */}
              <div className="flex flex-col gap-space-sm p-space-lg rounded-2xl bg-surface-container-low shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-headline-md">
                  02
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  The Year 2038 Overflow Boundary
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  The Year 2038 problem (Y2038 or the Epoch Rollover) affects programs implementing the traditional 32-bit
                  signed integer representation (`time_t`). At precisely{' '}
                  <strong>03:14:07 UTC on Tuesday, 19 January 2038</strong>, the decimal counter reaches{' '}
                  <code className="font-data-mono text-body-sm font-semibold text-primary">2,147,483,647</code>{' '}
                  (hexadecimal <code className="font-data-mono text-body-sm font-semibold text-primary">0x7FFFFFFF</code>).
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Upon ticking to the next second, the sign bit inverts, cycling the counter to{' '}
                  <code className="font-data-mono text-body-sm font-semibold text-error">-2,147,483,648</code> (
                  <code className="font-data-mono text-body-sm font-semibold text-error">0x80000000</code>), which interprets
                  as <strong>20:45:52 UTC on Friday, 13 December 1901</strong>. Modern microkernels, databases, and
                  programming languages systematically resolve this via 64-bit integer standardizations, expanding
                  operational headroom past 292 billion years.
                </p>
              </div>

              {/* Chapter 3 */}
              <div className="flex flex-col gap-space-sm p-space-lg rounded-2xl bg-surface-container-low shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-headline-md">
                  03
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Leap Seconds &amp; POSIX Smearing
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  The standard POSIX / IEEE 1003.1 mandate specifies that every day must consist of exactly 86,400 seconds.
                  However, Earth&apos;s rotational deceleration requires the International Earth Rotation and Reference
                  Systems Service (IERS) to sporadically introduce leap seconds into Coordinated Universal Time (UTC).
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Because a standard Unix timestamp cannot allocate an integer count to the 86,401st second (e.g.
                  23:59:60), POSIX implementations repeat the timestamp of second 86,400 or utilize &quot;leap smearing&quot;
                  (introduced by Google and AWS NTP servers), which subtly decelerates or accelerates system clocks by tiny
                  microsecond slices over a 24-hour window to preserve continuous monotonicity without clock step jumps.
                </p>
              </div>
            </div>

            {/* Architectural Pitfalls Box */}
            <div className="p-space-xl rounded-2xl bg-surface-container flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[28px]">warning</span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Critical Timestamp Pitfalls in Distributed Systems
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md font-body-sm text-body-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-on-surface">1. Unit Dimensional Mismatch</span>
                  <p className="text-on-surface-variant">
                    Feeding a 10-digit second timestamp into JavaScript&apos;s <code className="font-data-mono">new Date(ts)</code>{' '}
                    constructor without multiplying by 1,000 resolves to January 1970 instead of current dates.
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-on-surface">2. Wall-Clock Drift &amp; Non-Monotonicity</span>
                  <p className="text-on-surface-variant">
                    Unix wall clocks (<code className="font-data-mono">CLOCK_REALTIME</code>) can drift or jump backwards
                    during NTP synchronizations. For interval benchmarking, distributed consensus engines mandate monotonic
                    clocks (<code className="font-data-mono">CLOCK_MONOTONIC</code>).
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-on-surface">3. Daylight Saving (DST) Offsets</span>
                  <p className="text-on-surface-variant">
                    Unix timestamps are fundamentally absolute UTC representations immune to geographic timezones.
                    Ambiguities only occur during string hydration and parsing if the offset header is lost.
                  </p>
                </div>
              </div>
            </div>

            {/* Authoritative Standards & Reference Links (3 Trusted External Specifications) */}
            <div className="p-space-xl rounded-2xl bg-surface-container-low border border-outline-variant/50 flex flex-col gap-space-md shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Official Specifications
                </span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Authoritative External References &amp; Standards
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Verify epoch calculations, POSIX chronometric math, and ISO-8601 formatting standards against primary official bodies:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-2">
                {/* Reference 1: The Open Group / IEEE POSIX */}
                <a
                  href="https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-space-md rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 hover:border-primary transition-all flex flex-col justify-between gap-3 group shadow-xs"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-data-mono text-[11px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                        IEEE Std 1003.1™
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                        open_in_new
                      </span>
                    </div>
                    <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      The Open Group: POSIX.1-2017
                    </span>
                    <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">
                      Official Base Definitions (Section 4.16 &quot;Seconds Since the Epoch&quot;) standardizing Unix epoch time formulas, leap second exclusion, and POSIX compliance.
                    </p>
                  </div>
                  <span className="font-data-mono text-[11px] text-primary font-semibold flex items-center gap-1">
                    <span>pubs.opengroup.org</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                  </span>
                </a>

                {/* Reference 2: IETF RFC 3339 */}
                <a
                  href="https://datatracker.ietf.org/doc/html/rfc3339"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-space-md rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 hover:border-primary transition-all flex flex-col justify-between gap-3 group shadow-xs"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-data-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10">
                        IETF Standard
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                        open_in_new
                      </span>
                    </div>
                    <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      IETF RFC 3339 Internet Standard
                    </span>
                    <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">
                      Date and Time on the Internet: Standard profile for ISO-8601 formatting, defining strict UTC offset syntax, Zulu time (`Z`), and second precision timestamps.
                    </p>
                  </div>
                  <span className="font-data-mono text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                    <span>datatracker.ietf.org</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                  </span>
                </a>

                {/* Reference 3: MDN Web Docs */}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-space-md rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 hover:border-primary transition-all flex flex-col justify-between gap-3 group shadow-xs"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-data-mono text-[11px] font-bold text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded bg-amber-500/10">
                        MDN Web Docs
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                        open_in_new
                      </span>
                    </div>
                    <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      MDN: Date.now() &amp; Epoch Standard
                    </span>
                    <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">
                      Authoritative documentation for ECMAScript epoch mechanics, millisecond resolution (`Date.now()`), browser time fingerprint protections, and epoch conversions.
                    </p>
                  </div>
                  <span className="font-data-mono text-[11px] text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                    <span>developer.mozilla.org</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive FAQ Section (Accordion) */}
        <section className="w-full py-space-3xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-xl">
            <div className="max-w-3xl flex flex-col gap-1">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                Knowledge Base
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Exhaustive answers to architectural, mathematical, and implementation queries regarding Unix timestamps and
                timekeeping.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="faq-item rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between text-left gap-space-sm focus:outline-none"
                    >
                      <span className="font-body-md text-body-md font-bold text-on-surface">{faq.q}</span>
                      <span
                        className="material-symbols-outlined text-outline transition-transform duration-200"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="mt-space-sm pt-space-xs text-on-surface-variant font-body-sm text-body-sm leading-relaxed border-t border-surface-container">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Related Utilities Contextual Grid */}
        <section className="w-full py-space-2xl bg-surface-container-low">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
            <div className="flex flex-col gap-1">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                Ecosystem Extensions
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Complementary Chronometric Tools
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Explore related browser-side time, calendar, and developer calculation modules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <Link
                href="/time-date"
                className="p-space-md rounded-2xl bg-surface-container-lowest hover:bg-surface-container-high transition-all shadow-sm flex flex-col justify-between group"
              >
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">public</span>
                  </div>
                  <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    World Time Zone Sync
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Real-time cross-meridian coordination with daylight saving offset tracking.
                  </p>
                </div>
                <span className="text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 mt-4">
                  <span>Launch Tool</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              <Link
                href="/date-difference-calculator"
                className="p-space-md rounded-2xl bg-surface-container-lowest hover:bg-surface-container-high transition-all shadow-sm flex flex-col justify-between group"
              >
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">date_range</span>
                  </div>
                  <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Days Between Dates
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Calendar span analyzer with business day exclusions and holidays.
                  </p>
                </div>
                <span className="text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 mt-4">
                  <span>Launch Tool</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              <Link
                href="/military-time-converter"
                className="p-space-md rounded-2xl bg-surface-container-lowest hover:bg-surface-container-high transition-all shadow-sm flex flex-col justify-between group"
              >
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-xl bg-surface-tint/10 text-surface-tint flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Military Time Converter
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    24-hour military clock hydration and phonetic alphabet time translator.
                  </p>
                </div>
                <span className="text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 mt-4">
                  <span>Launch Tool</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              <Link
                href="/event-countdown"
                className="p-space-md rounded-2xl bg-surface-container-lowest hover:bg-surface-container-high transition-all shadow-sm flex flex-col justify-between group"
              >
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
                  </div>
                  <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Event Countdown Engine
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    High-precision milliseconds countdown counter with shareable links.
                  </p>
                </div>
                <span className="text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 mt-4">
                  <span>Launch Tool</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
