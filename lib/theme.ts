'use client';

export const THEME_STORAGE_KEY = 'solveit_theme';

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {}
  return getSystemTheme();
}

export function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('solveit-theme-change', { detail: theme }));
  }
}

export function toggleTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  const isDark = document.documentElement.classList.contains('dark');
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
