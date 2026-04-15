import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    /* ignore */
  }
  return 'dark';
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const [systemPref, setSystemPref] = useState<'light' | 'dark'>(getSystemTheme);

  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setSystemPref(mq.matches ? 'dark' : 'light');
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [mode]);

  const resolvedTheme: 'light' | 'dark' = mode === 'system' ? systemPref : mode;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const setMode = useCallback((next: ThemeMode | ((prev: ThemeMode) => ThemeMode)) => {
    setModeState((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      try {
        localStorage.setItem(STORAGE_KEY, resolved);
      } catch {
        /* ignore */
      }
      return resolved;
    });
  }, []);

  return { mode, resolvedTheme, setMode };
}
