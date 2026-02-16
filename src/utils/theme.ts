import type { Theme } from 'src/types/theme';

const THEME_STORAGE_KEY = 'speedreader.theme';

export const getSystemTheme = (): 'light' | 'dark' | 'no-preference' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const getHighContrastMode = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

export const saveThemePreference = (theme: Theme): boolean => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
};

export const loadThemePreference = (): Theme | null => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) return null;

    return validateThemePreference(stored) ? stored : null;
  } catch {
    return null;
  }
};

export const validateThemePreference = (data: unknown): data is Theme => {
  return typeof data === 'string' && ['light', 'dark', 'system'].includes(data);
};
