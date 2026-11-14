'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

const A11Y_STORAGE_KEY = 'solveit_a11y_prefs';
const THEME_STORAGE_KEY = 'solveit_theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
  /** Size variant for responsive placement in header, mobile bar, or drawer */
  size?: 'sm' | 'md' | 'lg';
  /** Optional flag to show the Light / Dark / System mode label or compact selector */
  showSystemOption?: boolean;
  className?: string;
}

interface Particle {
  id: number;
  tx: string;
  ty: string;
  size: number;
  delay: string;
  color: string;
}

const SUN_PARTICLES: Omit<Particle, 'id'>[] = [
  { tx: '-22px', ty: '-16px', size: 4, delay: '0ms', color: '#FBBF24' },
  { tx: '22px', ty: '-15px', size: 3.5, delay: '25ms', color: '#F59E0B' },
  { tx: '26px', ty: '2px', size: 4, delay: '40ms', color: '#FDE68A' },
  { tx: '19px', ty: '18px', size: 3, delay: '15ms', color: '#FB923C' },
  { tx: '-18px', ty: '17px', size: 3.5, delay: '35ms', color: '#FBBF24' },
  { tx: '-26px', ty: '1px', size: 3, delay: '50ms', color: '#FDE047' },
  { tx: '0px', ty: '-22px', size: 3.5, delay: '10ms', color: '#F59E0B' },
  { tx: '2px', ty: '22px', size: 3, delay: '45ms', color: '#FBBF24' },
];

const MOON_PARTICLES: Omit<Particle, 'id'>[] = [
  { tx: '-22px', ty: '-15px', size: 3.5, delay: '0ms', color: '#38BDF8' },
  { tx: '23px', ty: '-16px', size: 4, delay: '20ms', color: '#60A5FA' },
  { tx: '26px', ty: '3px', size: 3, delay: '45ms', color: '#93C5FD' },
  { tx: '18px', ty: '18px', size: 3.5, delay: '15ms', color: '#38BDF8' },
  { tx: '-19px', ty: '17px', size: 4, delay: '30ms', color: '#818CF8' },
  { tx: '-25px', ty: '-1px', size: 3, delay: '50ms', color: '#BAE6FD' },
  { tx: '-2px', ty: '-22px', size: 3.5, delay: '10ms', color: '#60A5FA' },
  { tx: '3px', ty: '21px', size: 3, delay: '35ms', color: '#38BDF8' },
];

/**
 * Applies the resolved theme to <html>, updates browser color-scheme metadata,
 * and triggers a smooth website-wide transition when user-initiated.
 */
export function applyThemeToDocument(
  isDark: boolean,
  animateTransition = false
) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    root.getAttribute('data-a11y-reduce-motion') === 'true';

  if (animateTransition && !prefersReducedMotion) {
    root.classList.add('theme-transitioning');
    window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 620);
  }

  root.classList.toggle('dark', isDark);
  root.classList.toggle('light', !isDark);
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  root.style.colorScheme = isDark ? 'dark' : 'light';

  // Update <meta name="color-scheme"> and <meta name="theme-color">
  let colorSchemeMeta = document.querySelector(
    'meta[name="color-scheme"]'
  ) as HTMLMetaElement | null;
  if (!colorSchemeMeta) {
    colorSchemeMeta = document.createElement('meta');
    colorSchemeMeta.name = 'color-scheme';
    document.head.appendChild(colorSchemeMeta);
  }
  colorSchemeMeta.content = isDark ? 'dark' : 'light';

  let themeColorMeta = document.querySelector(
    'meta[name="theme-color"]'
  ) as HTMLMetaElement | null;
  if (!themeColorMeta) {
    themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    document.head.appendChild(themeColorMeta);
  }
  themeColorMeta.content = isDark ? '#090A0D' : '#F5F4F0';
}

export default function ThemeSwitcher({
  size = 'md',
  showSystemOption = false,
  className = '',
}: ThemeSwitcherProps) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isBursting, setIsBursting] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const burstTimeoutRef = useRef<number | null>(null);
  const particleIdRef = useRef<number>(0);

  // Resolve current theme from localStorage or system preference
  const syncThemeState = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedMode = window.localStorage.getItem(
        THEME_STORAGE_KEY
      ) as ThemeMode | null;
      const rawA11y = window.localStorage.getItem(A11Y_STORAGE_KEY);
      const parsedA11y = rawA11y ? JSON.parse(rawA11y) : null;

      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      let resolvedDark = false;
      let resolvedMode: ThemeMode = 'light';

      if (savedMode === 'dark' || savedMode === 'light') {
        resolvedMode = savedMode;
        resolvedDark = savedMode === 'dark';
      } else if (savedMode === 'system') {
        resolvedMode = 'system';
        resolvedDark = systemDark;
      } else if (
        parsedA11y &&
        (parsedA11y.displayMode === 'dark' ||
          parsedA11y.displayMode === 'default')
      ) {
        resolvedDark = parsedA11y.displayMode === 'dark';
        resolvedMode = resolvedDark ? 'dark' : 'light';
      } else {
        resolvedMode = 'system';
        resolvedDark = systemDark;
      }

      setIsDark(resolvedDark);
      setThemeMode(resolvedMode);
      applyThemeToDocument(resolvedDark, false);
    } catch {
      const domDark = document.documentElement.classList.contains('dark');
      setIsDark(domDark);
    }
  }, []);

  useEffect(() => {
    syncThemeState();

    const handleCustomThemeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        isDark?: boolean;
        mode?: ThemeMode;
      }>;
      if (
        customEvent.detail &&
        typeof customEvent.detail.isDark === 'boolean'
      ) {
        setIsDark(customEvent.detail.isDark);
        if (customEvent.detail.mode) {
          setThemeMode(customEvent.detail.mode);
        }
        applyThemeToDocument(customEvent.detail.isDark, false);
      } else {
        syncThemeState();
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
      const rawA11y = window.localStorage.getItem(A11Y_STORAGE_KEY);
      if (!savedMode && !rawA11y) {
        setIsDark(e.matches);
        setThemeMode('system');
        applyThemeToDocument(e.matches, true);
      } else if (savedMode === 'system') {
        setIsDark(e.matches);
        applyThemeToDocument(e.matches, true);
      }
    };

    window.addEventListener('solveit-theme-change', handleCustomThemeEvent);
    window.addEventListener('storage', syncThemeState);
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      window.removeEventListener(
        'solveit-theme-change',
        handleCustomThemeEvent
      );
      window.removeEventListener('storage', syncThemeState);
      mediaQuery.removeEventListener('change', handleSystemChange);
      if (burstTimeoutRef.current) {
        window.clearTimeout(burstTimeoutRef.current);
      }
    };
  }, [syncThemeState]);

  const triggerParticlesAndGlow = useCallback((nextDark: boolean) => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-a11y-reduce-motion') ===
        'true';

    if (prefersReducedMotion) return;

    const template = nextDark ? MOON_PARTICLES : SUN_PARTICLES;
    const baseId = ++particleIdRef.current * 100;
    const nextParticles: Particle[] = template.map((p, idx) => ({
      ...p,
      id: baseId + idx,
    }));

    setParticles(nextParticles);
    setIsBursting(true);

    if (burstTimeoutRef.current) {
      window.clearTimeout(burstTimeoutRef.current);
    }
    burstTimeoutRef.current = window.setTimeout(() => {
      setIsBursting(false);
      setParticles([]);
    }, 650);
  }, []);

  const commitThemeChange = useCallback(
    (nextDark: boolean, explicitMode?: ThemeMode) => {
      const nextMode: ThemeMode =
        explicitMode ?? (nextDark ? 'dark' : 'light');

      setIsDark(nextDark);
      setThemeMode(nextMode);
      triggerParticlesAndGlow(nextDark);
      applyThemeToDocument(nextDark, true);

      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
        const raw = window.localStorage.getItem(A11Y_STORAGE_KEY);
        const existing = raw ? JSON.parse(raw) : {};
        const updated = {
          textSize: existing.textSize || 'medium',
          reduceMotion: Boolean(existing.reduceMotion),
          displayMode: nextDark ? 'dark' : 'default',
        };
        window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage write errors
      }

      window.dispatchEvent(
        new CustomEvent('solveit-theme-change', {
          detail: { isDark: nextDark, mode: nextMode },
        })
      );
    },
    [triggerParticlesAndGlow]
  );

  const handleToggle = () => {
    commitThemeChange(!isDark);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight' && !isDark) {
      e.preventDefault();
      commitThemeChange(true);
    } else if (e.key === 'ArrowLeft' && isDark) {
      e.preventDefault();
      commitThemeChange(false);
    }
  };

  const handleSystemModeSelect = (mode: ThemeMode) => {
    if (mode === 'system') {
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      commitThemeChange(sysDark, 'system');
    } else {
      commitThemeChange(mode === 'dark', mode);
    }
  };

  const sizeClass =
    size === 'sm'
      ? 'neu-switch-sm'
      : size === 'lg'
      ? 'neu-switch-lg'
      : 'neu-switch-md';

  const displayClass = /\bhidden\b/.test(className) ? '' : 'inline-flex';

  return (
    <div className={`${displayClass} items-center gap-2.5 ${className}`.trim()}>
      <button
        type="button"
        role="switch"
        data-compact="true"
        aria-checked={isDark}
        aria-label={
          isDark
            ? 'Dark mode active. Switch to Light mode'
            : 'Light mode active. Switch to Dark mode'
        }
        title={
          isDark
            ? 'Dark Mode active — click for Light Mode'
            : 'Light Mode active — click for Dark Mode'
        }
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`neu-theme-switch compact-control ${sizeClass} ${
          isDark ? 'is-dark' : 'is-light'
        } ${isBursting ? 'is-bursting' : ''}`}
      >
        {/* Outer Ambient Illumination Halo */}
        <span className="neu-switch-ambient" aria-hidden="true" />

        {/* Recessed 3D Neumorphic Capsule Track */}
        <span className="neu-switch-track" aria-hidden="true">
          {/* Specular Top Rim Glass Highlight */}
          <span className="neu-switch-glass-rim" />

          {/* Subtle Track Background Etched Icons */}
          <span className="neu-track-icon neu-track-icon-sun">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M18.36 5.64l-1.41 1.41M7.05 16.95l-1.41 1.41"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className="neu-track-icon neu-track-icon-moon">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>

        {/* Sliding Rounded-Square 3D Neumorphic Button (Thumb) */}
        <span className="neu-switch-thumb" aria-hidden="true">
          {/* Dynamic Radial Glow Behind Active Icon */}
          <span className="neu-thumb-glow" />

          {/* Top Glass Bevel Highlight on Thumb */}
          <span className="neu-thumb-shine" />

          {/* Particle Burst Container Around Thumb */}
          <span className="neu-particle-container">
            {particles.map((p) => (
              <span
                key={p.id}
                className="neu-particle"
                style={
                  {
                    '--tx': p.tx,
                    '--ty': p.ty,
                    '--p-size': `${p.size}px`,
                    '--p-delay': p.delay,
                    '--p-color': p.color,
                  } as React.CSSProperties
                }
              />
            ))}
          </span>

          {/* Animated Sun Icon (Light Mode) */}
          <span className="neu-icon-wrapper neu-icon-sun">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <defs>
                <radialGradient id="neuSunCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="45%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#EA580C" />
                </radialGradient>
              </defs>
              {/* Warm Golden Sun Core */}
              <circle cx="12" cy="12" r="4.6" fill="url(#neuSunCore)" />
              {/* Crisp Surrounding Sun Rays */}
              <g
                stroke="#F59E0B"
                strokeWidth="2.1"
                strokeLinecap="round"
                className="neu-sun-rays"
              >
                <line x1="12" y1="2.2" x2="12" y2="4.4" />
                <line x1="12" y1="19.6" x2="12" y2="21.8" />
                <line x1="2.2" y1="12" x2="4.4" y2="12" />
                <line x1="19.6" y1="12" x2="21.8" y2="12" />
                <line x1="5.07" y1="5.07" x2="6.63" y2="6.63" />
                <line x1="17.37" y1="17.37" x2="18.93" y2="18.93" />
                <line x1="18.93" y1="5.07" x2="17.37" y2="6.63" />
                <line x1="6.63" y1="17.37" x2="5.07" y2="18.93" />
              </g>
            </svg>
          </span>

          {/* Animated Crescent Moon + Stars Icon (Dark Mode) */}
          <span className="neu-icon-wrapper neu-icon-moon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <defs>
                <linearGradient
                  id="neuMoonGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#E0F2FE" />
                  <stop offset="55%" stopColor="#7DD3FC" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
              {/* Luminous Crescent Moon */}
              <path
                d="M19.8 14.6A7.8 7.8 0 0 1 9.4 4.2a7.85 7.85 0 0 0-5.2 7.4A7.8 7.8 0 0 0 12 19.4a7.85 7.85 0 0 0 7.8-4.8Z"
                fill="url(#neuMoonGrad)"
                stroke="#BAE6FD"
                strokeWidth="0.6"
                strokeLinejoin="round"
              />
              {/* Sparkling Stars */}
              <path
                d="M17.5 4.2 L18.0 5.6 L19.4 6.1 L18.0 6.6 L17.5 8.0 L17.0 6.6 L15.6 6.1 L17.0 5.6 Z"
                fill="#E0F2FE"
                className="neu-moon-star-1"
              />
              <circle
                cx="14.2"
                cy="9.2"
                r="1.05"
                fill="#7DD3FC"
                className="neu-moon-star-2"
              />
            </svg>
          </span>
        </span>
      </button>

      {/* Optional Clean 3-Mode Pill (Light / Dark / System) for Drawer & Settings */}
      {showSystemOption && (
        <div
          role="group"
          aria-label="Theme preference mode"
          className="inline-flex items-center p-0.5 rounded-lg bg-[#EEF2F6] dark:bg-[#151922] border border-[#E2E8F0] dark:border-[#292C33] text-xs font-bold"
        >
          <button
            type="button"
            data-compact="true"
            onClick={() => handleSystemModeSelect('light')}
            className={`compact-control px-2 py-1 rounded-md transition-all cursor-pointer ${
              themeMode === 'light'
                ? 'bg-white text-[#152238] shadow-2xs'
                : 'text-[#64748B] hover:text-[#152238]'
            }`}
          >
            Light
          </button>
          <button
            type="button"
            data-compact="true"
            onClick={() => handleSystemModeSelect('dark')}
            className={`compact-control px-2 py-1 rounded-md transition-all cursor-pointer ${
              themeMode === 'dark'
                ? 'bg-[#2457D6] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#152238]'
            }`}
          >
            Dark
          </button>
          <button
            type="button"
            data-compact="true"
            onClick={() => handleSystemModeSelect('system')}
            className={`compact-control px-2 py-1 rounded-md transition-all cursor-pointer ${
              themeMode === 'system'
                ? 'bg-[#2457D6] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#152238]'
            }`}
          >
            Auto
          </button>
        </div>
      )}
    </div>
  );
}
