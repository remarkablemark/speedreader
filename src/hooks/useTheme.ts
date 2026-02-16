import { useCallback, useEffect, useState } from 'react';
import type { Theme, ThemeState } from 'src/types/theme';
import {
  getHighContrastMode,
  getSystemTheme,
  loadThemePreference,
  saveThemePreference,
} from 'src/utils/theme';

const DEFAULT_PREFERENCE: Theme = 'system';

const resolveEffectiveTheme = (
  systemTheme: 'light' | 'dark' | 'no-preference',
): 'light' | 'dark' => {
  return systemTheme === 'dark' ? 'dark' : 'light';
};

const ROOT = document.documentElement;

export const useTheme = () => {
  const [themeState, setThemeState] = useState<ThemeState>(() => {
    const stored = loadThemePreference();
    const systemTheme = getSystemTheme();
    const highContrast = getHighContrastMode();

    const preference = stored ?? DEFAULT_PREFERENCE;
    const effectiveTheme =
      highContrast || preference === 'system'
        ? resolveEffectiveTheme(systemTheme)
        : preference;

    return {
      effectiveTheme,
      userPreference: preference,
      systemPreference: systemTheme,
      highContrastMode: highContrast,
    };
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      setThemeState((prev) => {
        if (prev.userPreference !== 'system') return prev;

        /* v8 ignore next -- @preserve */
        const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
        const effectiveTheme = prev.highContrastMode ? 'light' : newSystemTheme;

        return {
          ...prev,
          systemPreference: newSystemTheme,
          effectiveTheme,
        };
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');

    const handleChange = () => {
      setThemeState((prev) => {
        const highContrast = mediaQuery.matches;
        const effectiveTheme =
          /* v8 ignore next -- @preserve */
          highContrast || prev.userPreference === 'system'
            ? resolveEffectiveTheme(prev.systemPreference)
            : prev.userPreference;

        return {
          ...prev,
          highContrastMode: highContrast,
          effectiveTheme,
        };
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (themeState.effectiveTheme === 'dark') {
      ROOT.classList.add('dark');
    } else {
      ROOT.classList.remove('dark');
    }
  }, [themeState.effectiveTheme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const cycleMap: Record<Theme, Theme> = {
        light: 'dark',
        dark: 'system',
        system: 'light',
      };
      const newPreference = cycleMap[prev.userPreference];

      saveThemePreference(newPreference);

      const effectiveTheme =
        prev.highContrastMode || newPreference === 'system'
          ? resolveEffectiveTheme(prev.systemPreference)
          : newPreference;

      return {
        ...prev,
        effectiveTheme,
        userPreference: newPreference,
      };
    });
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setThemeState((prev) => {
      saveThemePreference(theme);

      const effectiveTheme =
        prev.highContrastMode || theme === 'system'
          ? resolveEffectiveTheme(prev.systemPreference)
          : theme;

      return {
        ...prev,
        effectiveTheme,
        userPreference: theme,
      };
    });
  }, []);

  return {
    theme: themeState.effectiveTheme,
    preference: themeState.userPreference,
    followingSystem: themeState.userPreference === 'system',
    toggleTheme,
    setTheme,
    highContrastMode: themeState.highContrastMode,
  };
};
