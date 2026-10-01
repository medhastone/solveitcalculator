'use client';

export const THEME_STORAGE_KEY = 'solveit_theme';

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {}
  return getSystemTheme();
}

export function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const isDark = theme === 'dark';
  
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.setAttribute('data-theme', 'dark');
    if (document.body) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
    if (document.body) {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('solveit-theme-change', { detail: theme }));
  }
}

export function toggleTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'dark';
  const current = getCurrentTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
